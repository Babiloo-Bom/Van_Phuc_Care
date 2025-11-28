import { sendError, sendFailed, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Coupon schema (same as admin)
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null // null = unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses'
  }],
  applicableCategories: [{
    type: String
  }],
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create model if it doesn't exist
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

// Cart schema (same as admin CartController)
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  items: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'courses',
      required: true
    },
    course: {
      type: Object,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalPrice: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  coupon: {
    code: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number
    },
    discountAmount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

class UserCouponController {
  /**
   * Validate coupon code
   * POST /api/u/coupons/validate
   */
  public static async validateCoupon(req: Request, res: Response) {
    try {
      const user = req.user as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { code, cartItems } = req.body;
      
      if (!code) {
        return sendError(res, 400, 'Coupon code is required');
      }
      
      const coupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        isActive: true 
      });
      
      if (!coupon) {
        return sendFailed(res, 'Không tìm thấy mã giảm giá!');
      }
      
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return sendFailed(res, 'Mã giảm giá không hợp lệ!');
      }
      
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return sendFailed(res, 'Đã sử dụng hết số lần áp dụng mã giảm giá!');
      }
      
      const cartTotal = cartItems ? cartItems.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.price || 0);
      }, 0) : 0;
      
      if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
        return sendFailed(res, `Số tiền đơn hàng phải lớn hơn ${coupon.minOrderAmount.toLocaleString('vi-VN')} VND`);
      }
      
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (cartTotal * coupon.value) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.value;
      }
      
      discountAmount = Math.min(discountAmount, cartTotal);
      
      sendSuccess(res, {
        message: 'Mã giảm giá hợp lệ!',
        coupon: {
          id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          discountAmount: Math.round(discountAmount),
          finalAmount: Math.round(cartTotal - discountAmount)
        }
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
  /**
   * Get list of user's coupons
   * GET /api/u/coupons/valid
   */
  public static async getValidCoupons(req: Request, res: Response) {
    try {
      const user = req.user as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const courseId = req.query.courseId as string | undefined;

      const coupon = await Coupon.findOne({
        validFrom: { $lte: new Date() },
        validTo: { $gte: new Date() },
        isActive: true,
        applicableCourses: { $in: [ new mongoose.Types.ObjectId(courseId)] }
      });
      sendSuccess(res, {
        message: 'mã giảm giá của bạn',
        coupon
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Apply coupon to cart
   * POST /api/u/coupons/apply
   */
  public static async applyCoupon(req: Request, res: Response) {
    try {
      const user = req.user as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { couponCode } = req.body;
      
      if (!couponCode) {
        return sendError(res, 400, 'Coupon code is required');
      }
      
      const cart = await Cart.findOne({ userId: String(user._id) });
      
      if (!cart || !cart.items || cart.items.length === 0) {
        return sendError(res, 400, 'Cart is empty');
      }
      
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true 
      });
      
      if (!coupon) {
        return sendFailed(res, 'Không tìm thấy mã giảm giá!');
      }
      
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return sendFailed(res, 'Mã giảm giá không hợp lệ!');
      }
      
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return sendFailed(res, 'Đã sử dụng hết số lần áp dụng mã giảm giá!');
      }
      
      const cartTotal = cart.items.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.price || 0);
      }, 0);
      
      if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
        return sendFailed(res, `Số tiền đơn hàng phải lớn hơn ${coupon.minOrderAmount.toLocaleString('vi-VN')} VND`);
      }
      
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (cartTotal * coupon.value) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.value;
      }
      
      discountAmount = Math.min(discountAmount, cartTotal);
      
      cart.coupon = {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discountAmount: Math.round(discountAmount)
      };
      
      (cart as any).discountAmount = Math.round(discountAmount);
      
      cart.totalPrice = Math.round(cartTotal - discountAmount);
      
      await cart.save();
      
      const cartResponse = cart.toObject();
      cartResponse.discountAmount = Math.round(discountAmount);
      
      sendSuccess(res, {
        message: 'Áp dụng mã giảm giá thành công!',
        cart: cartResponse,
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(cartTotal - discountAmount)
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Remove coupon from cart
   * DELETE /api/u/coupons/cart
   */
  public static async removeCoupon(req: Request, res: Response) {
    try {
      const user = req.user as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }
      
      const cart = await Cart.findOne({ userId: String(user._id) });
      
      if (!cart) {
        return sendError(res, 404, 'Cart not found');
      }
      
      cart.coupon = undefined;
      
      (cart as any).discountAmount = 0;
      
      cart.totalPrice = cart.items.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.price || 0);
      }, 0);
      
      await cart.save();
      
      const cartResponse = cart.toObject();
      cartResponse.discountAmount = 0;
      
      sendSuccess(res, {
        message: 'Xóa mã giảm giá thành công!',
        cart: cartResponse
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default UserCouponController;

