import ReviewController from '../../../controllers/api/admin/ReviewController';
import { Router } from 'express';

const router = Router();

// Review routes
router.get('/course/:courseId', ReviewController.getReviewsByCourse);
router.post('/', ReviewController.createReview);

// Seed sample reviews (no auth required for seeding)
router.post('/seed', ReviewController.seedReviews);

export default router;
