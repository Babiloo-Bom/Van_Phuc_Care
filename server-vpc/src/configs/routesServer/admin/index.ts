import { Router } from 'express';
import { adminPassport } from '@middlewares/passport';
import SessionRouter from './Sessions';
import FaqRouter from './Faqs';
import FeedbackRouter from './Feedbacks';
import CategoryRouter from './Category';
import CoursesRouter from './Courses';
import ProductsRouter from './Products';
import ProductCollectionsRouter from './ProductCollections';
import ProductReviewsRouter from './ProductReviews';
import CustomersRouter from './Customers';
import OrdersRouter from './Orders';
import CartsRouter from './Carts';
import UsersRouter from './Users';
import AccessPermissionsRouter from './AccessPermissions';
import HealthBookRouter from './HealthBook';
import TransactionsRouter from './Transactions';
import ScheduleVaccinRouter from './ScheduleVaccins';

const router = Router();

router.use('/categories', adminPassport.authenticate('jwt', { session: false }), CategoryRouter);
router.use('/faqs', adminPassport.authenticate('jwt', { session: false }), FaqRouter);
router.use('/courses', adminPassport.authenticate('jwt', { session: false }), CoursesRouter);
router.use('/sessions', SessionRouter);
router.use('/feedbacks', adminPassport.authenticate('jwt', { session: false }), FeedbackRouter);
router.use('/products', adminPassport.authenticate('jwt', { session: false }), ProductsRouter);
router.use('/product-collections', adminPassport.authenticate('jwt', { session: false }), ProductCollectionsRouter);
router.use('/product-reviews', adminPassport.authenticate('jwt', { session: false }), ProductReviewsRouter);
router.use('/customers', adminPassport.authenticate('jwt', { session: false }), CustomersRouter);
router.use('/orders', adminPassport.authenticate('jwt', { session: false }), OrdersRouter);
router.use('/carts', adminPassport.authenticate('jwt', { session: false }), CartsRouter);
router.use('/users-management', adminPassport.authenticate('jwt', { session: false }), UsersRouter);
router.use('/access-permissions', adminPassport.authenticate('jwt', { session: false }), AccessPermissionsRouter);
router.use('/health-book', adminPassport.authenticate('jwt', { session: false }), HealthBookRouter);
router.use('/transactions', adminPassport.authenticate('jwt', { session: false }), TransactionsRouter);
router.use('/schedule-vaccin', adminPassport.authenticate('jwt', { session: false }), ScheduleVaccinRouter);

export default router;
