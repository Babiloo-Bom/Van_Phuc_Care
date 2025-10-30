import { Router } from 'express';
import LessonController from '@controllers/api/admin/LessonController';
import multer from 'multer';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

// Lesson routes - CRUD
router.get('/:lessonId', LessonController.getLessonById);
router.post('/', upload.any(), LessonController.createLesson); 
router.put('/:lessonId', upload.any(), LessonController.updateLesson); 
router.delete('/:lessonId', LessonController.deleteLesson);

export default router;

