import CourseController from '@controllers/api/admin/CourseController';
import { Router } from 'express';

const router = Router();

// Course routes
router.get('/', CourseController.getAllCourses);
router.post('/', CourseController.createCourse);
router.get('/id/:id', CourseController.getCourseById);
router.get('/:slug', CourseController.getCourseBySlug);
router.put('/:slug/chapters', CourseController.updateCourseChapters);
router.put('/:id', CourseController.updateCourse);
router.delete('/:id', CourseController.deleteCourse);

// Seed sample courses (no auth required for seeding)
router.post('/seed', CourseController.seedCourses);

export default router;