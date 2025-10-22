import { Router } from 'express';
import CartController from '@controllers/api/user/CartController';

const router = Router();

router.get('/', CartController.index);
router.get('/:cartId', CartController.show);
router.post('/change', CartController.change);
router.post('/', CartController.create);
router.patch('/:cartId', CartController.update);

export default router;
