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
import CartRouter from './Cart';
import ReviewsRouter from './Reviews';
import UsersRouter from './Users';
import AdminsRouter from './Admins';
import GoogleAuthRouter from './GoogleAuth';
import AccessPermissionsRouter from './AccessPermissions';
import HealthBookRouter from './HealthBook';
import TransactionsRouter from './Transactions';
import ScheduleVaccinRouter from './ScheduleVaccins';
import CouponsRouter from './Coupons';
import SeedRouter from './Seed';
import ProgressRouter from './Progress';
import QuizzesRouter from './Quizzes';
import DocumentsRouter from './Documents';
import UpdateVideoRouter from './UpdateVideo';
import LessonsRouter from './Lessons';
import PasswordsRouter from './Passwords';

const router = Router();

router.use('/categories', adminPassport.authenticate('jwt', { session: false }), CategoryRouter);
router.use('/faqs', adminPassport.authenticate('jwt', { session: false }), FaqRouter);
router.use('/courses', CoursesRouter);
router.use('/sessions', SessionRouter);
router.use('/passwords', PasswordsRouter);
router.use('/auth/google', GoogleAuthRouter);
router.use('/feedbacks', adminPassport.authenticate('jwt', { session: false }), FeedbackRouter);
router.use('/products', adminPassport.authenticate('jwt', { session: false }), ProductsRouter);
router.use('/product-collections', adminPassport.authenticate('jwt', { session: false }), ProductCollectionsRouter);
router.use('/product-reviews', adminPassport.authenticate('jwt', { session: false }), ProductReviewsRouter);
router.use('/customers', adminPassport.authenticate('jwt', { session: false }), CustomersRouter);
router.use('/orders', adminPassport.authenticate('jwt', { session: false }), OrdersRouter);
router.use('/cart', CartRouter); // Public cart routes
router.use('/reviews', ReviewsRouter); // Public reviews routes
router.use('/users-management', adminPassport.authenticate('jwt', { session: false }), UsersRouter);
router.use('/admins', AdminsRouter);
router.use('/access-permissions', adminPassport.authenticate('jwt', { session: false }), AccessPermissionsRouter);
router.use('/health-book', adminPassport.authenticate('jwt', { session: false }), HealthBookRouter);
router.use('/transactions', adminPassport.authenticate('jwt', { session: false }), TransactionsRouter);
router.use('/schedule-vaccin', adminPassport.authenticate('jwt', { session: false }), ScheduleVaccinRouter);
router.use('/coupons', CouponsRouter); // Public coupon routes
router.use('/orders', OrdersRouter); // Public order routes
router.use('/progress', ProgressRouter); // Progress tracking routes
router.use('/quizzes', QuizzesRouter); // Quiz routes
router.use('/documents', DocumentsRouter); // Document routes
router.use('/update-video', UpdateVideoRouter); // Update video routes
router.use('/lessons', LessonsRouter); // Lesson routes

// Seed routes (no auth required)
router.use('/seed', SeedRouter);

export default router;
