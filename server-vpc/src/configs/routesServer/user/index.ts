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
import ProcessingRouter from './Processings';
import GoogleAuthRouter from './GoogleAuth';

const router = Router();

router.use('/cart', CartRouter);
router.use('/categories', CategoryRouter);
router.use('/faqs', FaqRouter);
router.use('/feedbacks', FeedbackRouter);
router.use('/orders', OrdersRouter);
router.use('/products', ProductsRouter);
router.use('/sessions', SessionRouter);
router.use('/users', UserRouter);
router.use('/courses', CourseRouter);
router.use('/tickets', TicketRouter);
router.use('/progress', ProcessingRouter);
router.use('/auth/google', GoogleAuthRouter);
export default router;
