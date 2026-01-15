import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import LessonsModel from '@mongodb/lessons';
import ChaptersModel from '@mongodb/chapters';
import QuizzesModel from '@mongodb/quizzes';
import MinioService from '@services/minio';
import CloudflareService from '@services/cloudflare';
import HlsConverter from '@services/HlsConverter';
import FileValidator from '@services/fileValidator';
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
            // Validate document file by magic bytes
            const validation = FileValidator.validateFileByMagicBytes(file.buffer, file.mimetype);
            if (!validation.isValid) {
              console.error(`⚠️ [Lesson Document Validation] File ${file.originalname} failed validation:`, validation.error);
              // Skip this file and continue with others
              continue;
            }

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

            // Validate video file by magic bytes
            if (!file.mimetype.startsWith('video/')) {
              console.error(`⚠️ [Lesson Video Validation] File ${file.originalname} is not a video file`);
              continue;
            }

            const validation = FileValidator.validateVideoFile(file.buffer, file.mimetype);
            if (!validation.isValid) {
              console.error(`⚠️ [Lesson Video Validation] File ${file.originalname} failed validation:`, validation.error);
              // Skip this file and continue with others
              continue;
            }

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
                  tempHlsDir,
                  file.originalname
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

      // Lưu videos cũ để so sánh và xóa folder HLS của videos bị xóa
      const oldVideos = [...(lessonData.videos || [])];

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

      // Xử lý videos được cập nhật từ request body (nếu có)
      if (req.body.videos) {
        const updatedVideos = typeof req.body.videos === 'string' ? JSON.parse(req.body.videos) : req.body.videos;
        existingVideos = updatedVideos;
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

      // Xóa folder HLS của videos bị xóa
      const hlsFoldersToDelete = new Set<string>();
      const existingVideoUrls = new Set(
        existingVideos
          .map((v: any) => v.hlsUrl || v.videoUrl)
          .filter((url: string) => url)
      );

      for (const oldVideo of oldVideos) {
        const oldVideoUrl = oldVideo.hlsUrl || oldVideo.videoUrl;
        // Nếu video cũ không còn trong danh sách mới, xóa folder HLS
        if (oldVideoUrl && !existingVideoUrls.has(oldVideoUrl)) {
          const hlsFolder = CloudflareService.extractHlsFolderFromUrl(oldVideoUrl);
          if (hlsFolder) {
            hlsFoldersToDelete.add(hlsFolder);
          }
        }
      }

      // Xóa toàn bộ folder HLS của videos bị xóa
      for (const hlsFolder of hlsFoldersToDelete) {
        try {
          await CloudflareService.deleteFilesByPrefix(hlsFolder);
          console.log(`✅ Deleted HLS folder for removed video: ${hlsFolder}`);
        } catch (err) {
          console.error(`Error deleting HLS folder ${hlsFolder}:`, err);
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

      // Bước 1: Xóa documents từ R2
      if (lessonData.documents && lessonData.documents.length > 0) {
        for (const doc of lessonData.documents) {
          try {
            if (doc.fileUrl) {
              // Extract object name from URL
              let objectName = doc.fileUrl;
              if (doc.fileUrl.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                objectName = doc.fileUrl.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
              } else if (doc.fileUrl.includes('/')) {
                const urlParts = doc.fileUrl.split('/');
                const coursesIndex = urlParts.findIndex((part: string) => part === 'courses' || part === 'lessons');
                if (coursesIndex !== -1) {
                  objectName = urlParts.slice(coursesIndex).join('/');
                }
              }
              if (objectName) {
                await CloudflareService.deleteFile(objectName);
              }
            }
          } catch (err) {
            console.error('Error deleting document from R2:', err);
          }
        }
      }

      // Bước 2: Xóa videos, folder HLS và thumbnails từ R2
      if (lessonData.videos && lessonData.videos.length > 0) {
        const hlsFoldersToDelete = new Set<string>();
        const thumbnailFoldersToDelete = new Set<string>();
        
        for (const video of lessonData.videos) {
          try {
            if (video.videoUrl || video.hlsUrl) {
              const videoUrl = video.hlsUrl || video.videoUrl;
              
              // Extract HLS folder path
              const hlsFolder = CloudflareService.extractHlsFolderFromUrl(videoUrl);
              if (hlsFolder) {
                hlsFoldersToDelete.add(hlsFolder);
                
                // Extract thumbnail folder from HLS folder
                // HLS folder: "courses/lessons/{timestamp}/hls"
                // Thumbnail folder: "courses/lessons/{timestamp}/thumbnails"
                const thumbnailFolder = hlsFolder.replace('/hls', '/thumbnails');
                thumbnailFoldersToDelete.add(thumbnailFolder);
              } else {
                // Fallback: try to delete single file
                let objectName = videoUrl;
                if (videoUrl.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                  objectName = videoUrl.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                  } else if (videoUrl.includes('/')) {
                    const urlParts = videoUrl.split('/');
                    const coursesIndex = urlParts.findIndex((part: string) => part === 'courses' || part === 'lessons');
                    if (coursesIndex !== -1) {
                      objectName = urlParts.slice(coursesIndex).join('/');
                    }
                  }
                if (objectName) {
                  await CloudflareService.deleteFile(objectName);
                }
              }
            }
            
            // Also try to extract thumbnail folder from thumbnail URL if exists
            if (video.thumbnail) {
              try {
                let thumbnailPath = video.thumbnail;
                if (thumbnailPath.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                  thumbnailPath = thumbnailPath.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                }
                
                // Extract folder path (remove filename)
                const lastSlash = thumbnailPath.lastIndexOf('/');
                if (lastSlash > 0) {
                  const thumbnailFolder = thumbnailPath.substring(0, lastSlash);
                  thumbnailFoldersToDelete.add(thumbnailFolder);
                }
              } catch (err) {
                console.warn('⚠️ [Delete Lesson] Error extracting thumbnail folder from URL:', err);
              }
            }
          } catch (err) {
            console.error('❌ [Delete Lesson] Error deleting video from R2:', err);
          }
        }

        // Xóa toàn bộ folder HLS
        for (const hlsFolder of hlsFoldersToDelete) {
          try {
            await CloudflareService.deleteFilesByPrefix(hlsFolder);
            console.log(`✅ [Delete Lesson] Deleted HLS folder: ${hlsFolder}`);
          } catch (err) {
            console.error(`❌ [Delete Lesson] Error deleting HLS folder ${hlsFolder}:`, err);
          }
        }
        
        // Xóa toàn bộ folder thumbnails
        for (const thumbnailFolder of thumbnailFoldersToDelete) {
          try {
            await CloudflareService.deleteFilesByPrefix(thumbnailFolder);
            console.log(`✅ [Delete Lesson] Deleted thumbnail folder: ${thumbnailFolder}`);
          } catch (err) {
            console.error(`❌ [Delete Lesson] Error deleting thumbnail folder ${thumbnailFolder}:`, err);
          }
        }
      }

      // Bước 3: Xóa lesson từ database
      await LessonsModel.model.findByIdAndDelete(lessonId);

      sendSuccess(res, { message: 'Lesson đã được xóa' });
    } catch (error: any) {
      console.error('❌ Delete lesson error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

}

export default LessonController;

