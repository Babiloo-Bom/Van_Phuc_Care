import { Router } from 'express';
import TicketController from '@controllers/api/user/TicketController';

const router = Router();

// User ticket routes
router.get('/', TicketController.index);
router.get('/:id', TicketController.show);
router.post('/', TicketController.create);
router.patch('/:id', TicketController.update);
router.delete('/:id', TicketController.destroy);

export default router;
