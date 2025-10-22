import { Router } from 'express';
import AccessPermissionsController from '@controllers/api/admin/AccessPermissionsController';

const router = Router();
router.get('/', AccessPermissionsController.index);
router.post('/', AccessPermissionsController.create);
router.patch('/:id', AccessPermissionsController.update);
router.delete('/:id', AccessPermissionsController.delete);

export default router;
