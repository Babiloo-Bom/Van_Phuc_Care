import { Router } from 'express';
import TicketController from '@controllers/api/user/TicketController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// User ticket routes - all routes require authentication
router.get('/', userPassport.authenticate('jwt', { session: false }), TicketController.index);
router.get('/:id', userPassport.authenticate('jwt', { session: false }), TicketController.show);
router.post('/', userPassport.authenticate('jwt', { session: false }), TicketController.create);
router.patch('/:id', userPassport.authenticate('jwt', { session: false }), TicketController.update);
router.delete('/:id', userPassport.authenticate('jwt', { session: false }), TicketController.destroy);

export default router;
