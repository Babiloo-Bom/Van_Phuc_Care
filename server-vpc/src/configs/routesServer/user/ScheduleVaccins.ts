import { Router } from 'express';
import UserScheduleVaccinsController from '@controllers/api/user/UserScheduleVaccinsController';

const router = Router();

// GET /api/u/schedule-vaccins
router.get('/', UserScheduleVaccinsController.index);

// POST /api/u/schedule-vaccins/seed
router.post('/seed', UserScheduleVaccinsController.seed);

export default router;
