import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Coupon schema
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

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

class CouponController {
  /**
   * Get all coupons
   */
  public static async getAllCoupons(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
      
      const query: any = {};
      
      if (search) {
        query.$or = [
          { code: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (status === 'active') {
        query.isActive = true;
        query.validFrom = { $lte: new Date() };
        query.validTo = { $gte: new Date() };
      } else if (status === 'expired') {
        query.validTo = { $lt: new Date() };
      } else if (status === 'inactive') {
        query.isActive = false;
      }
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const coupons = await Coupon.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
      
      const total = await Coupon.countDocuments(query);
      
      sendSuccess(res, {
        coupons,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error: any) {
      console.error('❌ Get all coupons error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get coupon by ID
   */
  public static async getCouponById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const coupon = await Coupon.findById(id);
      
      if (!coupon) {
        return sendError(res, 404, 'Coupon not found');
      }
      
      sendSuccess(res, { coupon });
    } catch (error: any) {
      console.error('❌ Get coupon by ID error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Create new coupon
   */
  public static async createCoupon(req: Request, res: Response) {
    try {
      const couponData = req.body;
      
      // Validate required fields
      if (!couponData.code || !couponData.name || !couponData.type || !couponData.value) {
        return sendError(res, 400, 'Missing required fields');
      }
      
      // Check if coupon code already exists
      const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
      if (existingCoupon) {
        return sendError(res, 400, 'Coupon code already exists');
      }
      
      // Create coupon
      const coupon = await Coupon.create({
        ...couponData,
        code: couponData.code.toUpperCase()
      });
      
      sendSuccess(res, { 
        message: 'Coupon created successfully',
        coupon 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update coupon
   */
  public static async updateCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const coupon = await Coupon.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!coupon) {
        return sendError(res, 404, 'Coupon not found');
      }
      
      sendSuccess(res, { 
        message: 'Coupon updated successfully',
        coupon 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Delete coupon
   */
  public static async deleteCoupon(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const coupon = await Coupon.findByIdAndDelete(id);
      
      if (!coupon) {
        return sendError(res, 404, 'Coupon not found');
      }
      
      sendSuccess(res, { 
        message: 'Coupon deleted successfully' 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Validate coupon code
   */
  public static async validateCoupon(req: Request, res: Response) {
    try {
      const { code, cartItems, userId } = req.body;
      
      if (!code) {
        return sendError(res, 400, 'Coupon code is required');
      }
      
      // Find coupon
      const coupon = await Coupon.findOne({ 
        code: code.toUpperCase(),
        isActive: true 
      });
      
      if (!coupon) {
        return sendError(res, 404, 'Coupon not found or inactive');
      }
      
      // Check validity period
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return sendError(res, 400, 'Coupon is not valid at this time');
      }
      
      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return sendError(res, 400, 'Coupon usage limit exceeded');
      }
      
      // Calculate cart total
      const cartTotal = cartItems.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.price || 0);
      }, 0);
      
      // Check minimum order amount
      if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
        return sendError(res, 400, `Minimum order amount is ${coupon.minOrderAmount.toLocaleString('vi-VN')} VND`);
      }
      
      // Calculate discount amount
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (cartTotal * coupon.value) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.value;
      }
      
      // Ensure discount doesn't exceed cart total
      discountAmount = Math.min(discountAmount, cartTotal);
      
      sendSuccess(res, {
        message: 'Coupon is valid',
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
   * Apply coupon to cart
   */
  public static async applyCoupon(req: Request, res: Response) {
    try {
      const { userId, couponCode } = req.body;
      
      if (!userId || !couponCode) {
        return sendError(res, 400, 'User ID and coupon code are required');
      }
      
      // Get user's cart
      const Cart = mongoose.models.Cart || mongoose.model('Cart', new mongoose.Schema({}));
      const cart = await Cart.findOne({ userId });
      
      if (!cart || !cart.items || cart.items.length === 0) {
        return sendError(res, 400, 'Cart is empty');
      }
      
      // Validate coupon
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true 
      });
      
      if (!coupon) {
        return sendError(res, 404, 'Coupon not found or inactive');
      }
      
      // Check validity period
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return sendError(res, 400, 'Coupon is not valid at this time');
      }
      
      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return sendError(res, 400, 'Coupon usage limit exceeded');
      }
      
      // Calculate cart total
      const cartTotal = cart.items.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.price || 0);
      }, 0);
      
      // Check minimum order amount
      if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
        return sendError(res, 400, `Minimum order amount is ${coupon.minOrderAmount.toLocaleString('vi-VN')} VND`);
      }
      
      // Calculate discount amount
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (cartTotal * coupon.value) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
      } else {
        discountAmount = coupon.value;
      }
      
      // Ensure discount doesn't exceed cart total
      discountAmount = Math.min(discountAmount, cartTotal);
      
      // Update cart with coupon
      cart.coupon = {
        code: coupon.code,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        discountAmount: Math.round(discountAmount)
      };
      
      cart.totalPrice = Math.round(cartTotal - discountAmount);
      
      await cart.save();
      
      sendSuccess(res, {
        message: 'Coupon applied successfully',
        cart,
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(cartTotal - discountAmount)
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Remove coupon from cart
   */
  public static async removeCoupon(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      // Get user's cart
      const Cart = mongoose.models.Cart || mongoose.model('Cart', new mongoose.Schema({}));
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return sendError(res, 404, 'Cart not found');
      }
      
      // Remove coupon
      cart.coupon = undefined;
      
      // Recalculate total price
      cart.totalPrice = cart.items.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.price || 0);
      }, 0);
      
      await cart.save();
      
      sendSuccess(res, {
        message: 'Coupon removed successfully',
        cart
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Seed sample coupons
   */
  public static async seedCoupons(req: Request, res: Response) {
    try {
      const sampleCoupons = [
        {
          code: 'WELCOME10',
          name: 'Chào mừng khách hàng mới',
          description: 'Giảm 10% cho đơn hàng đầu tiên',
          type: 'percentage',
          value: 10,
          minOrderAmount: 100000,
          maxDiscountAmount: 50000,
          usageLimit: 1000,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          isActive: true,
          createdBy: 'admin'
        },
        {
          code: 'SAVE50K',
          name: 'Tiết kiệm 50K',
          description: 'Giảm 50,000 VND cho đơn hàng từ 500,000 VND',
          type: 'fixed',
          value: 50000,
          minOrderAmount: 500000,
          usageLimit: 500,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          isActive: true,
          createdBy: 'admin'
        },
        {
          code: 'STUDENT20',
          name: 'Ưu đãi sinh viên',
          description: 'Giảm 20% cho sinh viên',
          type: 'percentage',
          value: 20,
          minOrderAmount: 200000,
          maxDiscountAmount: 100000,
          usageLimit: 200,
          validFrom: new Date(),
          validTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          isActive: true,
          createdBy: 'admin'
        }
      ];

      // Clear existing coupons
      await Coupon.deleteMany({});

      // Insert sample coupons
      const coupons = await Coupon.insertMany(sampleCoupons);

      sendSuccess(res, { 
        message: `Đã thêm ${coupons.length} mã giảm giá mẫu`,
        coupons: coupons.map(coupon => ({
          id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value
        }))
      });
    } catch (error: any) {
      console.error('❌ Seed coupons error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default CouponController;
