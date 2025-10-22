import { Router } from 'express';
import ServicesController from '@controllers/api/admin/ServiceController';

const router = Router();
router.get('/', ServicesController.index);
router.get('/:id', ServicesController.show);
router.post('/', ServicesController.create);
router.post('/bulk-delete', ServicesController.delete);
router.patch('/:id', ServicesController.update);

export default router;
