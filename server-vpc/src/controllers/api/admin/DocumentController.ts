import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbDocuments from '@mongodb/documents';

export default class DocumentController {
  /**
   * Get documents by course, chapter, and lesson
   */
  public static async getDocuments(req: Request, res: Response) {
    try {
      const { courseId, chapterIndex, lessonIndex } = req.params;
      
      const documents = await MongoDbDocuments.find({
        courseId,
        chapterIndex: parseInt(chapterIndex),
        lessonIndex: parseInt(lessonIndex),
        status: 'active'
      }).sort({ isRequired: -1, createdAt: 1 });

      sendSuccess(res, { documents });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Create new document
   */
  public static async createDocument(req: Request, res: Response) {
    try {
      const documentData = req.body;
      
      const document = new MongoDbDocuments(documentData);
      await document.save();

      sendSuccess(res, { document });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Download document
   */
  public static async downloadDocument(req: Request, res: Response) {
    try {
      const { documentId } = req.params;
      
      const document = await MongoDbDocuments.findById(documentId);
      if (!document) {
        return sendError(res, 404, 'Document not found');
      }

      // Increment download count
      await MongoDbDocuments.findByIdAndUpdate(documentId, {
        $inc: { downloadCount: 1 }
      });

      sendSuccess(res, { 
        document,
        downloadUrl: document.fileUrl,
        message: 'Document ready for download'
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Seed sample documents
   */
  public static async seedDocuments(req: Request, res: Response) {
    try {
      const sampleDocuments = [
        {
          courseId: '68fcdc39f681bccec39c8ef0', // Python course ID
          chapterIndex: 0,
          lessonIndex: 0,
          title: 'Tài liệu: Giới thiệu Python',
          description: 'Tài liệu tổng quan về Python và ứng dụng',
          fileUrl: '/documents/python-introduction.pdf',
          fileName: 'python-introduction.pdf',
          fileSize: 1024000, // 1MB
          fileType: 'pdf',
          isRequired: true,
          downloadCount: 0
        },
        {
          courseId: '68fcdc39f681bccec39c8ef0',
          chapterIndex: 0,
          lessonIndex: 0,
          title: 'Slide bài giảng: Python cơ bản',
          description: 'Slide trình bày các khái niệm cơ bản của Python',
          fileUrl: '/documents/python-basics-slides.pptx',
          fileName: 'python-basics-slides.pptx',
          fileSize: 2048000, // 2MB
          fileType: 'pptx',
          isRequired: false,
          downloadCount: 0
        },
        {
          courseId: '68fcdc39f681bccec39c8ef0',
          chapterIndex: 0,
          lessonIndex: 1,
          title: 'Bài tập: Biến và Kiểu dữ liệu',
          description: 'Bài tập thực hành về biến và kiểu dữ liệu trong Python',
          fileUrl: '/documents/python-variables-exercises.pdf',
          fileName: 'python-variables-exercises.pdf',
          fileSize: 512000, // 512KB
          fileType: 'pdf',
          isRequired: true,
          downloadCount: 0
        },
        {
          courseId: '68fcdc39f681bccec39c8ef0',
          chapterIndex: 0,
          lessonIndex: 1,
          title: 'Code mẫu: Ví dụ về biến',
          description: 'Các ví dụ code về cách sử dụng biến trong Python',
          fileUrl: '/documents/python-variables-examples.py',
          fileName: 'python-variables-examples.py',
          fileSize: 10240, // 10KB
          fileType: 'py',
          isRequired: false,
          downloadCount: 0
        },
        {
          courseId: '68fcdc39f681bccec39c8ef0',
          chapterIndex: 1,
          lessonIndex: 0,
          title: 'Tài liệu: Cấu trúc điều khiển',
          description: 'Tài liệu về if-else, for, while trong Python',
          fileUrl: '/documents/python-control-structures.pdf',
          fileName: 'python-control-structures.pdf',
          fileSize: 1536000, // 1.5MB
          fileType: 'pdf',
          isRequired: true,
          downloadCount: 0
        },
        {
          courseId: '68fcdc39f681bccec39c8ef0',
          chapterIndex: 1,
          lessonIndex: 0,
          title: 'Bài tập: Vòng lặp và điều kiện',
          description: 'Bài tập thực hành về vòng lặp và cấu trúc điều kiện',
          fileUrl: '/documents/python-loops-exercises.pdf',
          fileName: 'python-loops-exercises.pdf',
          fileSize: 768000, // 768KB
          fileType: 'pdf',
          isRequired: true,
          downloadCount: 0
        }
      ];

      // Clear existing documents for this course
      await MongoDbDocuments.deleteMany({ courseId: '68fcdc39f681bccec39c8ef0' });

      // Insert sample documents
      const documents = await MongoDbDocuments.insertMany(sampleDocuments);

      sendSuccess(res, { 
        message: `Created ${documents.length} sample documents`,
        documents 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
