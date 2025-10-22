import { Router } from 'express';
import ProductCollectionController from '@controllers/api/admin/ProductCollectionsController';

const router = Router();
router.get('/', ProductCollectionController.index);
router.get('/:collectionId', ProductCollectionController.show);
router.post('/', ProductCollectionController.create);
router.patch('/:collectionId', ProductCollectionController.update);
router.delete('/:collectionId', ProductCollectionController.delete);

export default router;
