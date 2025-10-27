import { Router } from 'express';
import QuizController from '@controllers/api/admin/QuizController';
import { adminPassport } from '@middlewares/passport';

const router = Router();

// Quiz routes
router.get('/course/:courseId/chapter/:chapterIndex/lesson/:lessonIndex', QuizController.getQuiz);
router.post('/', QuizController.createQuiz);
router.post('/submit', adminPassport.authenticate('jwt', { session: false }), QuizController.submitQuizAttempt);
router.get('/attempts/course/:courseId', adminPassport.authenticate('jwt', { session: false }), QuizController.getUserQuizAttempts);

// Seed sample quizzes (no auth required for seeding)
router.post('/seed', QuizController.seedQuizzes);

export default router;
