import { Router } from 'express';
import HealthRecordController from '@controllers/api/admin/HealthRecordController';

const router = Router();

router.post('/records', HealthRecordController.create);
router.get('/records', HealthRecordController.index);

export default router;
