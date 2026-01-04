import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import LessonsModel from '@mongodb/lessons';
import ChaptersModel from '@mongodb/chapters';
import QuizzesModel from '@mongodb/quizzes';
import MinioService from '@services/minio';
import CloudflareService from '@services/cloudflare';
import HlsConverter from '@services/HlsConverter';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

class LessonController {

  public static async getLessonById(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;

      const lesson = await LessonsModel.model.findById(lessonId)
        .populate('chapter')
        .populate('quiz');

      if (!lesson) {
        return sendError(res, 404, 'Lesson không tồn tại');
      }

      sendSuccess(res, { lesson });
    } catch (error: any) {
      console.error('Get lesson error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async createLesson(req: Request, res: Response) {
    try {
      const { chapterId, title, description, content, type, isPreview } = req.body;
      
      const chapter = await ChaptersModel.model.findById(chapterId).populate('courseId');
      if (!chapter) {
        return sendError(res, 404, 'Chapter không tồn tại');
      }

      const chapterData = chapter as any;

      const parsedDocuments = req.body.documents ? JSON.parse(req.body.documents) : [];
      const parsedVideos = req.body.videos ? JSON.parse(req.body.videos) : [];

      const lessonData: any = {
        chapterId,
        title,
        description: description || '',
        content: content || '',
        type: type || 'video',
        isPreview: isPreview === 'true' || isPreview === true,
        documents: [],
        videos: [],
      };

      const lesson = await LessonsModel.model.create(lessonData);

      // Create quiz if exists, using chapterId and lessonId
      if (req.body.quizData) {
        const quizDataJson = typeof req.body.quizData === 'string' ? JSON.parse(req.body.quizData) : req.body.quizData;
        
        const newQuiz = await QuizzesModel.create({
          courseId: chapterData.courseId.toString(),
          chapterId: chapterId.toString(),
          lessonId: lesson._id.toString(),
          title: quizDataJson.title || 'Quiz',
          description: quizDataJson.description || '',
          questions: quizDataJson.questions || [],
          passingScore: quizDataJson.passingScore || 80,
          timeLimit: quizDataJson.timeLimit || 0,
          attempts: quizDataJson.attempts || 3,
          status: 'active'
        });

        // Update lesson with quizId
        await LessonsModel.model.findByIdAndUpdate(lesson._id, {
          quizId: newQuiz._id
        });
      }
      const files = req.files as Express.Multer.File[];
      const uploadedDocuments: any[] = [];
      const uploadedVideos: any[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const folderType = file.fieldname.includes('document') ? 'documents' : 'videos';
          
          if (folderType === 'documents') {
            const fileUrl = await CloudflareService.uploadFile(
              file.buffer,
              file.originalname,
              file.mimetype,
              `lessons/${lesson._id}/${folderType}`
            );

            const docMeta = parsedDocuments.find((d: any, idx: number) => 
              parseInt(file.fieldname.replace('document-', '')) === idx
            );

            uploadedDocuments.push({
              title: docMeta?.title || file.originalname,
              fileUrl,
              fileName: file.originalname,
              fileSize: file.size,
              fileType: file.mimetype,
              index: uploadedDocuments.length,
            });
          } else {
            // Video: Convert MP4 to HLS for better security
            const videoMeta = parsedVideos.find((v: any, idx: number) => 
              parseInt(file.fieldname.replace('video-', '')) === idx
            );

            let videoUrl: string;
            const tempHlsDir = path.join(os.tmpdir(), 'hls-lessons', `${lesson._id}_${Date.now()}`);

            try {
              // Check if FFmpeg is available and file is video
              const hasFFmpeg = await HlsConverter.checkFFmpeg();
              if (hasFFmpeg && file.mimetype.startsWith('video/')) {
                // Convert MP4 to HLS
                console.log(`🔄 Converting video to HLS for lesson ${lesson._id}...`);
                const { playlistPath, segmentPaths } = await HlsConverter.convertBufferToHls(
                  file.buffer,
                  tempHlsDir
                );

                // Upload HLS playlist
                const playlistBuffer = fs.readFileSync(playlistPath);
                const playlistName = file.originalname.replace(/\.(mp4|mov|avi|mkv)$/i, '.m3u8');
                const hlsFolder = `lessons/${lesson._id}/videos/hls`;
                const playlistObjectName = await CloudflareService.uploadFile(
                  playlistBuffer,
                  playlistName,
                  'application/vnd.apple.mpegurl',
                  hlsFolder
                );
                videoUrl = CloudflareService.getPublicUrl(playlistObjectName);

                // Upload HLS segments
                for (const segmentPath of segmentPaths) {
                  const segmentBuffer = fs.readFileSync(segmentPath);
                  const segmentFileName = path.basename(segmentPath);
                  await CloudflareService.uploadFile(
                    segmentBuffer,
                    segmentFileName,
                    'video/mp2t',
                    hlsFolder
                  );
                }

                // Cleanup temp files
                if (fs.existsSync(tempHlsDir)) {
                  fs.rmSync(tempHlsDir, { recursive: true, force: true });
                }

                console.log(`✅ HLS conversion complete for lesson ${lesson._id}`);
              } else {
                // Fallback: upload MP4 directly
                videoUrl = CloudflareService.getPublicUrl(
                  await CloudflareService.uploadFile(
                    file.buffer,
                    file.originalname,
                    file.mimetype,
                    `lessons/${lesson._id}/${folderType}`
                  )
                );
              }
            } catch (error: any) {
              // Cleanup temp files on error
              if (fs.existsSync(tempHlsDir)) {
                fs.rmSync(tempHlsDir, { recursive: true, force: true });
              }
              console.error('❌ HLS conversion error, falling back to MP4:', error);
              // Fallback: upload MP4 directly
              videoUrl = CloudflareService.getPublicUrl(
                await CloudflareService.uploadFile(
                  file.buffer,
                  file.originalname,
                  file.mimetype,
                  `lessons/${lesson._id}/${folderType}`
                )
              );
            }

            uploadedVideos.push({
              title: videoMeta?.title || file.originalname,
              videoUrl: videoUrl,
              thumbnail: videoMeta?.thumbnail || '',
              duration: videoMeta?.duration || 0,
              fileSize: file.size,
              quality: videoMeta?.quality || '720',
              index: uploadedVideos.length,
            });
          }
        }
      }

      (lesson as any).documents = uploadedDocuments;
      (lesson as any).videos = uploadedVideos;
      await lesson.save();

      sendSuccess(res, { 
        lesson, 
        message: 'Lesson được tạo thành công với files' 
      });
    } catch (error: any) {
      console.error('Create lesson error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async updateLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      
      const lesson = await LessonsModel.model.findById(lessonId);
      if (!lesson) {
        return sendError(res, 404, 'Lesson không tồn tại');
      }

      const lessonData = lesson as any;

      const newDocumentsMeta = req.body.newDocuments ? JSON.parse(req.body.newDocuments) : [];
      const newVideosMeta = req.body.newVideos ? JSON.parse(req.body.newVideos) : [];

      const files = req.files as Express.Multer.File[];
      let existingDocuments = [...(lessonData.documents || [])];
      let existingVideos = [...(lessonData.videos || [])];

      if (files && files.length > 0) {
        for (const file of files) {
          const folderType = file.fieldname.includes('document') ? 'documents' : 'videos';
          
          const fileUrl = await CloudflareService.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype,
            `lessons/${lesson._id}/${folderType}`
          );

          if (folderType === 'documents') {
            const docMeta = newDocumentsMeta.find((d: any, idx: number) => 
              parseInt(file.fieldname.replace('document-', '')) === idx
            );

            existingDocuments.push({
              title: docMeta?.title || file.originalname,
              fileUrl,
              fileName: file.originalname,
              fileSize: file.size,
              fileType: file.mimetype,
              index: existingDocuments.length,
            });
          } else {
            const videoMeta = newVideosMeta.find((v: any, idx: number) => 
              parseInt(file.fieldname.replace('video-', '')) === idx
            );

            existingVideos.push({
              title: videoMeta?.title || file.originalname,
              videoUrl: fileUrl,
              thumbnail: videoMeta?.thumbnail || '',
              duration: videoMeta?.duration || 0,
              fileSize: file.size,
              quality: videoMeta?.quality || '720',
              index: existingVideos.length,
            });
          }
        }
      }

      if (req.body.quizData) {
        const quizDataJson = typeof req.body.quizData === 'string' ? JSON.parse(req.body.quizData) : req.body.quizData;

        if (lessonData.quizId) {
          await QuizzesModel.findByIdAndUpdate(lessonData.quizId, {
            title: quizDataJson.title || undefined,
            description: quizDataJson.description || undefined,
            questions: Array.isArray(quizDataJson.questions) ? quizDataJson.questions : undefined,
            passingScore: quizDataJson.passingScore ?? undefined,
            timeLimit: quizDataJson.timeLimit ?? undefined,
            attempts: quizDataJson.attempts ?? undefined,
          }, { new: true });
        } else {
          const chapterId = req.body.chapterId || lessonData.chapterId;
          const chapterDoc: any = await ChaptersModel.model.findById(chapterId);
          if (!chapterDoc) {
            return sendError(res, 404, 'Chapter không tồn tại');
          }

          const newQuiz = await QuizzesModel.create({
            courseId: chapterDoc.courseId.toString(),
            chapterId: chapterId.toString(),
            lessonId: lessonId.toString(),
            title: quizDataJson.title || 'Quiz',
            description: quizDataJson.description || '',
            questions: quizDataJson.questions || [],
            passingScore: quizDataJson.passingScore || 80,
            timeLimit: quizDataJson.timeLimit || 0,
            attempts: quizDataJson.attempts || 3,
            status: 'active'
          });

          (lessonData as any).quizId = newQuiz._id;
          existingDocuments = [...existingDocuments]; // no-op to keep vars used
        }
      }

      const updateData: any = {};
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.content !== undefined) updateData.content = req.body.content;
      if (req.body.type) updateData.type = req.body.type;
      if (req.body.isPreview !== undefined) updateData.isPreview = req.body.isPreview;
      if (lessonData.quizId && !updateData.quizId) updateData.quizId = lessonData.quizId;

      updateData.documents = existingDocuments;
      updateData.videos = existingVideos;

      const updatedLesson = await LessonsModel.model.findByIdAndUpdate(
        lessonId,
        updateData,
        { new: true }
      );

      if (!updatedLesson) {
        return sendError(res, 404, 'Lesson không tồn tại');
      }

      sendSuccess(res, { lesson: updatedLesson, message: 'Lesson được cập nhật thành công' });
    } catch (error: any) {
      console.error(' Update lesson error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async deleteLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;

      const lesson = await LessonsModel.model.findById(lessonId);
      if (!lesson) {
        return sendError(res, 404, 'Lesson không tồn tại');
      }

      const lessonData = lesson as any;
      if (lessonData.documents && lessonData.documents.length > 0) {
        for (const doc of lessonData.documents) {
          try {
            await CloudflareService.deleteFile(doc.fileUrl.replace(`/${process.env.MINIO_BUCKET_NAME}/`, ''));
          } catch (err) {
            console.error('Error deleting document from MinIO:', err);
          }
        }
      }

      if (lessonData.videos && lessonData.videos.length > 0) {
        for (const video of lessonData.videos) {
          try {
            await CloudflareService.deleteFile(video.videoUrl.replace(`/${process.env.MINIO_BUCKET_NAME}/`, ''));
          } catch (err) {
            console.error('Error deleting video from MinIO:', err);
          }
        }
      }

      await LessonsModel.model.findByIdAndDelete(lessonId);

      sendSuccess(res, { message: 'Lesson đã được xóa' });
    } catch (error: any) {
      console.error(' Delete lesson error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

}

export default LessonController;

