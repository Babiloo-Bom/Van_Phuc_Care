import { Router } from 'express';
import CourseController from '@controllers/api/user/CourseController';

const router = Router();

router.get('/', CourseController.index);
router.get('/:courseId', CourseController.show);

export default router;
