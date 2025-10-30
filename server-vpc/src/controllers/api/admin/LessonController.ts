import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import LessonsModel from '@mongodb/lessons';
import CourseModulesModel from '@mongodb/course-modules';
import QuizzesModel from '@mongodb/quizzes';
import MinioService from '@services/minio';

class LessonController {

  public static async getLessonById(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;

      const lesson = await LessonsModel.model.findById(lessonId)
        .populate('courseModule')
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
      const { courseModuleId, title, description, content, type, isPreview } = req.body;
      
      const courseModule = await CourseModulesModel.model.findById(courseModuleId).populate('courseId');
      if (!courseModule) {
        return sendError(res, 404, 'Course module không tồn tại');
      }

      const courseModuleData = courseModule as any;

      let quizId = null;
      if (req.body.quizData) {
        const quizDataJson = typeof req.body.quizData === 'string' ? JSON.parse(req.body.quizData) : req.body.quizData;
        
        const newQuiz = await QuizzesModel.create({
          courseId: courseModuleData.courseId.toString(),
          chapterIndex: courseModuleData.index,
          lessonIndex: 0,
          title: quizDataJson.title || 'Quiz',
          description: quizDataJson.description || '',
          questions: quizDataJson.questions || [],
          passingScore: quizDataJson.passingScore || 80,
          timeLimit: quizDataJson.timeLimit || 0,
          attempts: quizDataJson.attempts || 3,
          status: 'active'
        });

        quizId = newQuiz._id;
      }

      const parsedDocuments = req.body.documents ? JSON.parse(req.body.documents) : [];
      const parsedVideos = req.body.videos ? JSON.parse(req.body.videos) : [];

      const lessonData: any = {
        courseModuleId,
        title,
        description: description || '',
        content: content || '',
        type: type || 'video',
        isPreview: isPreview === 'true' || isPreview === true,
        documents: [],
        videos: [],
      };

      if (quizId) {
        lessonData.quizId = quizId;
      }

      const nextLessonIndex = await LessonsModel.model.countDocuments({ courseModuleId });
      const lesson = await LessonsModel.model.create(lessonData);

      if (quizId) {
        await QuizzesModel.findByIdAndUpdate(quizId, { lessonIndex: nextLessonIndex });
      }

      const files = req.files as Express.Multer.File[];
      const uploadedDocuments: any[] = [];
      const uploadedVideos: any[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          const folderType = file.fieldname.includes('document') ? 'documents' : 'videos';
          
          const fileUrl = await MinioService.uploadFile(
            file.buffer,
            file.originalname,
            file.mimetype,
            `lessons/${lesson._id}/${folderType}`
          );

          if (folderType === 'documents') {
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
            const videoMeta = parsedVideos.find((v: any, idx: number) => 
              parseInt(file.fieldname.replace('video-', '')) === idx
            );

            uploadedVideos.push({
              title: videoMeta?.title || file.originalname,
              videoUrl: fileUrl,
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
          
          const fileUrl = await MinioService.uploadFile(
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
          const moduleId = req.body.courseModuleId || lessonData.courseModuleId;
          const moduleDoc: any = await CourseModulesModel.model.findById(moduleId);
          if (!moduleDoc) {
            return sendError(res, 404, 'Course module không tồn tại');
          }

          const currentIndex = await LessonsModel.model.countDocuments({ courseModuleId: moduleId });

          const newQuiz = await QuizzesModel.create({
            courseId: moduleDoc.courseId.toString(),
            chapterIndex: moduleDoc.index,
            lessonIndex: currentIndex,
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
            await MinioService.deleteFile(doc.fileUrl.replace(`/${process.env.MINIO_BUCKET_NAME}/`, ''));
          } catch (err) {
            console.error('Error deleting document from MinIO:', err);
          }
        }
      }

      if (lessonData.videos && lessonData.videos.length > 0) {
        for (const video of lessonData.videos) {
          try {
            await MinioService.deleteFile(video.videoUrl.replace(`/${process.env.MINIO_BUCKET_NAME}/`, ''));
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

