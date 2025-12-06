import { Router } from 'express';
import CourseController from '@controllers/api/user/CourseController';
import { userPassport, optionalAuth, optionalUserAuth } from '@middlewares/passport';

const router = Router();

// Routes for purchased courses (require authentication) - Must be before /:slug to avoid route conflict
router.get('/my-courses', userPassport.authenticate('jwt', { session: false }), CourseController.getMyCourses);
router.get('/my-courses/:slug', userPassport.authenticate('jwt', { session: false }), CourseController.getMyCourseBySlug);

// Public routes (no authentication required, but will check purchase status if user is logged in)
router.get('/', optionalUserAuth, CourseController.getAllCourses);
router.get('/:slug', optionalUserAuth, CourseController.getCourseBySlug);

export default router;
