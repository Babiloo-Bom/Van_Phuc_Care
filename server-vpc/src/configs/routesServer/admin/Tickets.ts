import { Router } from 'express';
import TicketController from '@controllers/api/admin/TicketController';

const router = Router();

// Statistics endpoint must come before /:id to avoid conflicts
router.get('/statistics', TicketController.statistics);

// CRUD operations
router.get('/', TicketController.index);
router.get('/:id', TicketController.show);
router.post('/', TicketController.create);
router.patch('/:id', TicketController.update);
router.delete('/:id', TicketController.destroy);

// Bulk operations
router.post('/bulk-delete', TicketController.bulkDelete);

export default router;
