import { Router } from 'express';
import UserScheduleVaccinsController from '@controllers/api/user/UserScheduleVaccinsController';

const router = Router();

// GET /api/u/schedule-vaccins
router.get('/', UserScheduleVaccinsController.index);

// POST /api/seed/schedule-vaccins
router.post('/schedule-vaccins', UserScheduleVaccinsController.seed);

export default router;
