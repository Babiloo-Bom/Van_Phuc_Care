import { Router } from 'express';
import CouponController from '@controllers/api/admin/CouponController';

const router = Router();

// Get all coupons
router.get('/', CouponController.getAllCoupons);

// Get coupon by ID
router.get('/:id', CouponController.getCouponById);

// Create new coupon
router.post('/', CouponController.createCoupon);

// Update coupon
router.put('/:id', CouponController.updateCoupon);

// Delete coupon
router.delete('/:id', CouponController.deleteCoupon);

// Validate coupon code
router.post('/validate', CouponController.validateCoupon);

// Apply coupon to cart
router.post('/apply', CouponController.applyCoupon);

// Remove coupon from cart
router.delete('/cart/:userId', CouponController.removeCoupon);

// Seed sample coupons
router.post('/seed', CouponController.seedCoupons);

export default router;
