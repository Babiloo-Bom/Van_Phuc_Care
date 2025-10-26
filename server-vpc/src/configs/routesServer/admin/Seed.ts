import CourseController from '@controllers/api/admin/CourseController';
import { Router } from 'express';

const router = Router();

// Seed routes (no auth required)
router.post('/courses', CourseController.seedCourses);

export default router;
