import { Router } from 'express';
import QuizController from '@controllers/api/admin/QuizController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// Quiz routes
router.post('/submit', userPassport.authenticate('jwt', { session: false }), QuizController.submitQuizAttempt);
export default router;
