import { Router } from 'express';
import CartRouter from './Cart';
import FaqRouter from './Faqs';
import FeedbackRouter from './Feedbacks';
import CategoryRouter from './Category';
import ProductsRouter from './Products';
import OrdersRouter from './Order';
import SessionRouter from './Sessions';
import UserRouter from './Users';
import CourseRouter from './Courses';
import TicketRouter from './Tickets';
import ServiceRegistrationRouter from "./ServiceRegistration";
import TransactionListRouter from "./TransactionList";
import ServicesRouter from './Services';
import ProcessingRouter from './Processings';
import GoogleAuthRouter from './GoogleAuth';
import HealthBooksRouter from './HealthBooks';
import ScheduleVaccinsRouter from "./ScheduleVaccins";
import VaccinationRecordsRouter from "./VaccinationRecords";
import CouponsRouter from './Coupons';
import QuizzesRouter from './Quizzes';

const router = Router();

router.use("/cart", CartRouter);
router.use("/categories", CategoryRouter);
router.use("/faqs", FaqRouter);
router.use("/feedbacks", FeedbackRouter);
router.use("/order", OrdersRouter);
router.use("/products", ProductsRouter);
router.use("/sessions", SessionRouter);
router.use("/users", UserRouter);
router.use("/courses", CourseRouter);
router.use("/tickets", TicketRouter);
router.use("/services", ServicesRouter);
router.use("/service-registration", ServiceRegistrationRouter);
router.use("/transactions-list", TransactionListRouter);
router.use("/progress", ProcessingRouter);
router.use("/auth/google", GoogleAuthRouter);
router.use("/schedule-vaccins", ScheduleVaccinsRouter);
router.use('/healthbooks', HealthBooksRouter);
router.use('/vaccination-records', VaccinationRecordsRouter);
router.use('/coupons', CouponsRouter);
router.use('/quizzes', QuizzesRouter); // Quiz routes

export default router;
