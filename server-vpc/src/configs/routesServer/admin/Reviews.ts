import ReviewController from '../../../controllers/api/admin/ReviewController';
import { Router } from 'express';

const router = Router();

// Review routes
router.get('/course/:courseId', ReviewController.getReviewsByCourse);
router.post('/', ReviewController.createReview);
router.put('/:reviewId', ReviewController.updateReview);
router.delete('/:reviewId', ReviewController.deleteReview);

// Seed sample reviews (no auth required for seeding)
router.post('/seed', ReviewController.seedReviews);

export default router;
