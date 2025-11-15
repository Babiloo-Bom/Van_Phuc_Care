import { Router } from 'express';
import DashboardController from '@controllers/api/admin/DashboardController';

const router = Router();

router.get('/summary', DashboardController.summary);

export default router;
