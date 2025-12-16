import { Router } from 'express';
import UserCouponController from '@controllers/api/user/CouponController';
import { userPassport } from '@middlewares/passport';

const router = Router();

// Validate coupon code (requires authentication)
router.post('/validate', userPassport.authenticate('jwt', { session: false }), UserCouponController.validateCoupon);

// Create completion coupon (requires authentication)
router.post('/completion', userPassport.authenticate('jwt', { session: false }), UserCouponController.createCompletionCoupon);

// Apply coupon to cart (requires authentication)
router.post('/apply', userPassport.authenticate('jwt', { session: false }), UserCouponController.applyCoupon);

// Get list of user's coupons (requires authentication)
router.post('/valid', userPassport.authenticate('jwt', { session: false }), UserCouponController.getValidCoupons);

// Remove coupon from cart (requires authentication)
router.delete('/cart', userPassport.authenticate('jwt', { session: false }), UserCouponController.removeCoupon);

export default router;

