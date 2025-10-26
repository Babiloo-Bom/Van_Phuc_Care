import CartController from '@controllers/api/admin/CartController';
import { Router } from 'express';

const router = Router();

// Cart routes
router.get('/:userId', CartController.getCart);
router.post('/:userId/add', CartController.addToCart);
router.delete('/:userId/remove/:courseId', CartController.removeFromCart);
router.delete('/:userId/clear', CartController.clearCart);
router.delete('/:userId/force-clear', CartController.forceClearCart);

export default router;
