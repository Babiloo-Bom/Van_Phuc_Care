import { Router } from 'express';
import OrderController from '@controllers/api/admin/OrderController';

const router = Router();
router.get('/', OrderController.index);
router.get('/:orderId', OrderController.show);
router.post('/', OrderController.create);
router.patch('/:orderId', OrderController.update);
router.delete('/:orderId', OrderController.delete);

export default router;
