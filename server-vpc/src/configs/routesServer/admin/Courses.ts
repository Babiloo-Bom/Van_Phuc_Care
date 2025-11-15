import CourseController from '@controllers/api/admin/CourseController';
import { Router } from 'express';
import { optionalAuth } from '@middlewares/passport';

const router = Router();

// Course routes
router.get('/', CourseController.getAllCourses);
router.post('/', CourseController.createCourse);
router.get('/id/:id', CourseController.getCourseById);
// Optional auth for getCourseBySlug - allows public access but includes progress if authenticated
router.get('/:slug', optionalAuth, CourseController.getCourseBySlug);
router.put('/:slug/chapters', CourseController.updateCourseChapters);
router.put('/:id', CourseController.updateCourse);
router.delete('/:id', CourseController.deleteCourse);

// Seed sample courses (no auth required for seeding)
router.post('/seed', CourseController.seedCourses);

export default router;