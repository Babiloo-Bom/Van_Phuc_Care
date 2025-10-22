import { Router } from 'express';
import ProductController from '@controllers/api/admin/ProductController';

const router = Router();
router.get('/', ProductController.index);
router.get('/:productId', ProductController.show);
router.post('/', ProductController.create);
router.patch('/:productId', ProductController.update);
router.delete('/:productId', ProductController.delete);

export default router;
