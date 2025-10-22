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

const router = Router();

router.use('/cart', CartRouter);
router.use('/categories', CategoryRouter);
router.use('/faqs', FaqRouter);
router.use('/feedbacks', FeedbackRouter);
router.use('/order', OrdersRouter);
router.use('/products', ProductsRouter);
router.use('/sessions', SessionRouter);
router.use('/users', UserRouter);
router.use('/courses', CourseRouter);
export default router;
