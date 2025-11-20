import CourseController from '@controllers/api/admin/CourseController';
import TicketController from '@controllers/api/admin/TicketController';
import UserController from '@controllers/api/admin/UserController';
import { Router } from 'express';

const router = Router();

// Seed routes (no auth required)
router.post('/users', UserController.seedUsers);
router.post('/courses', CourseController.seedCourses);
router.post('/tickets', TicketController.seedTickets);

export default router;
