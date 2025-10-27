import { Router } from 'express';
import DocumentController from '@controllers/api/admin/DocumentController';
import { adminPassport } from '@middlewares/passport';

const router = Router();

// Document routes
router.get('/course/:courseId/chapter/:chapterIndex/lesson/:lessonIndex', DocumentController.getDocuments);
router.post('/', DocumentController.createDocument);
router.get('/:documentId/download', DocumentController.downloadDocument);

// Seed sample documents (no auth required for seeding)
router.post('/seed', DocumentController.seedDocuments);

export default router;
