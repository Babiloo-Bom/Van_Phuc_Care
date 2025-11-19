import CourseController from '@controllers/api/admin/CourseController';
import TicketController from '@controllers/api/admin/TicketController';
import UserController from '@controllers/api/admin/UserController';
import { Router } from 'express';

const router = Router();

// Seed routes (no auth required)
router.post('/users', UserController.seedUsers);
router.post('/courses', CourseController.seedCourses);

import ServiceControllerSeed from "@controllers/api/admin/ServiceController.seed";
import TransactionController from "@controllers/api/admin/TransactionController";

router.post("/tickets", TicketController.seedTickets);
router.post("/services", ServiceControllerSeed.seedServices);
router.post("/transactions", TransactionController.seedTransactions);

export default router;
