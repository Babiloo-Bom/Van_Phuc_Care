import { Router } from 'express';
import CartController from '@controllers/api/admin/CartController';

const router = Router();
router.get('/', CartController.index);
router.get('/:cartId', CartController.show);
router.post('/', CartController.create);
router.patch('/:cartId', CartController.update);
router.delete('/:cartId', CartController.delete);

export default router;
