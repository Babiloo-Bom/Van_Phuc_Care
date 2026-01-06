import { Router } from 'express';
import ProgressController from '@controllers/api/admin/ProgressController';
import { adminPassport } from '@middlewares/passport';

const router = Router();

// Progress tracking routes
router.get('/', adminPassport.authenticate('jwt', { session: false }), ProgressController.getUserProgress);
router.post('/', adminPassport.authenticate('jwt', { session: false }), ProgressController.saveProgress);
router.post('/lesson-completed', adminPassport.authenticate('jwt', { session: false }), ProgressController.markLessonCompleted);
router.get('/course/:courseId', adminPassport.authenticate('jwt', { session: false }), ProgressController.getCourseProgress);
router.delete('/course/:courseId', adminPassport.authenticate('jwt', { session: false }), ProgressController.resetProgress);

// Get course completion rate statistics
router.get('/completion-rate', adminPassport.authenticate('jwt', { session: false }), ProgressController.getCompletionRate);

export default router;
