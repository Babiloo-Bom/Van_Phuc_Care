import { Router } from 'express';
import SettingsController from '@controllers/api/admin/SettingsController';

const router = Router();

router.get('/', SettingsController.getAll);
router.get('/:key', SettingsController.getByKey);
router.put('/:key', SettingsController.setByKey);

export default router;
