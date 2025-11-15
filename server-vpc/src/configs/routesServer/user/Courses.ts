import { Router } from 'express';
import CourseController from '@controllers/api/user/CourseController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// New routes for purchased courses (require authentication)
router.get('/my-courses', userPassport.authenticate('jwt', { session: false }), CourseController.getMyCourses);
router.get('/my-courses/:slug', userPassport.authenticate('jwt', { session: false }), CourseController.getMyCourseBySlug);

export default router;
