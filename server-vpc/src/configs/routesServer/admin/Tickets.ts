import { Router } from 'express';
import multer from 'multer';
import TicketController from '@controllers/api/admin/TicketController';
import TicketCommentController from '@controllers/api/admin/TicketCommentController';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
});

const router = Router();

// Statistics endpoint must come before /:id to avoid conflicts
router.get('/statistics', TicketController.statistics);

// Get assignable admins
router.get('/assignable-admins', TicketController.getAssignableAdmins);

// Comments routes - must come before /:id routes to avoid conflicts
router.get('/:ticketId/comments', TicketCommentController.getComments);
router.post('/:ticketId/comments', upload.array('files', 5), TicketCommentController.addComment);
router.delete('/:ticketId/comments/:commentId', TicketCommentController.deleteComment);

// Assignment - must come before /:id routes
router.post('/:id/assign', TicketController.assignTicket);

// CRUD operations
router.get('/', TicketController.index);
router.get('/:id', TicketController.show);
router.post('/', TicketController.create);
router.patch('/:id', TicketController.update);
router.delete('/:id', TicketController.destroy);

// Bulk operations
router.post('/bulk-delete', TicketController.bulkDelete);

export default router;
