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
   * Helper: Tự động tạo coupon khi hoàn thành khóa học (chỉ tạo 1 lần duy nhất)
   * Được gọi tự động từ ProgressController/QuizController khi set completedAt
   * 
   * @param userId - User ID
   * @param courseId - Course ID
   * @param completedAt - Ngày hoàn thành khóa học
   * @returns Coupon object hoặc null nếu đã tồn tại hoặc lỗi
   */
  public static async createCompletionCouponIfNeeded(
    userId: string,
    courseId: string,
    completedAt: Date
  ): Promise<any> {
    try {
      // Kiểm tra xem đã có coupon cho khóa học này chưa
      const applicableCourses = [new mongoose.Types.ObjectId(courseId)];
      const existingCoupon = await Coupon.findOne({
        createdBy: String(userId),
        description: { $regex: /completion/i },
        applicableCourses: { $in: applicableCourses },
      });

      // Nếu đã có coupon, không tạo mới (đảm bảo chỉ tạo 1 lần)
      if (existingCoupon) {
        console.log(`[createCompletionCouponIfNeeded] Coupon already exists for userId=${userId}, courseId=${courseId}`);
        return existingCoupon;
      }

      // Sinh mã ngẫu nhiên và bảo đảm unique
      let randomCode = '';
      for (let i = 0; i < 5; i++) {
        randomCode = `CP${Date.now().toString(36).toUpperCase()}${Math.random()
          .toString(36)
          .slice(-4)
          .toUpperCase()}`;
        const exists = await Coupon.findOne({ code: randomCode });
        if (!exists) break;
        if (i === 4) {
          randomCode = `CP${Date.now()}`;
        }
      }

      // Tính validFrom và validTo dựa trên ngày hoàn thành khóa học (completedAt)
      // validFrom = ngày hoàn thành khóa học (chỉ lấy ngày, bỏ giờ)
      // validTo = ngày hoàn thành khóa học + 7 ngày (chỉ lấy ngày, bỏ giờ)
      // Đảm bảo tính toán đúng: 24/12 + 7 ngày = 31/12
      const completedAtDate = new Date(completedAt);
      // Reset về 00:00:00 để tính toán chính xác theo ngày
      completedAtDate.setHours(0, 0, 0, 0);
      
      const validFrom = new Date(completedAtDate);
      const validTo = new Date(completedAtDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Log để debug
      console.log(`[createCompletionCouponIfNeeded] Date calculation:`);
      console.log(`  completedAt (input): ${completedAt}`);
      console.log(`  completedAtDate (normalized): ${completedAtDate.toISOString()}`);
      console.log(`  validFrom: ${validFrom.toISOString()}`);
      console.log(`  validTo: ${validTo.toISOString()}`);
      console.log(`  validTo (formatted): ${validTo.toLocaleDateString('en-GB')}`);

      const coupon = await Coupon.create({
        code: randomCode,
        name: 'Giảm 10% khóa học tiếp theo',
        description: 'Completion gift coupon',
        type: 'percentage',
        value: 10, // Giảm 10%
        minOrderAmount: 0, // Không yêu cầu tối thiểu
        maxDiscountAmount: null, // Không giới hạn số tiền giảm
        usageLimit: 1, // Dùng 1 lần
        usedCount: 0,
        validFrom, // Ngày hoàn thành khóa học
        validTo, // Ngày hoàn thành + 7 ngày
        isActive: true,
        applicableCourses,
        createdBy: String(userId)
      });

      console.log(`[createCompletionCouponIfNeeded] Created coupon ${randomCode} for userId=${userId}, courseId=${courseId}`);
      return coupon;
    } catch (error: any) {
      console.error(`[createCompletionCouponIfNeeded] Error:`, error);
      return null;
    }
  }

  /**
   * API endpoint: Lấy coupon quà tặng khi hoàn thành khóa học (không tạo mới nếu đã có)
   * POST /api/u/coupons/completion
   * body: { courseId?: string }
   * 
   * Lưu ý:
   * - Coupon được tự động tạo khi hoàn thành khóa học (trong ProgressController/QuizController)
   * - API này chỉ để lấy coupon đã có, không tạo mới
   * - Ngày HSD = Ngày hoàn thành khóa học (completedAt) + 7 ngày
   * - Coupon chỉ được sử dụng 1 lần
   * - Coupon có thời hạn áp dụng là 7 ngày tính từ ngày hoàn thành khóa học
   * - Coupon có giá trị giảm 10% trên giá trị đơn hàng
   */
  public static async createCompletionCoupon(req: Request, res: Response) {
    try {
      const user = req.user as any;
      if (!user || !user._id) {
        return sendError(res, 401, 'Unauthorized');
      }

      const courseId = req.body?.courseId as string | undefined;
      
      // Lấy ngày hoàn thành khóa học từ CourseProgress
      let completedAt: Date | null = null;
      if (courseId) {
        const CourseProgress = mongoose.model("CourseProgress");
        const courseProgressRecord = await CourseProgress.findOne({
          userId: String(user._id),
          courseId: courseId.toString(),
        });
        completedAt = courseProgressRecord?.completedAt || null;
        
        // Kiểm tra khóa học đã hoàn thành chưa
        if (!completedAt) {
          return sendError(res, 400, 'Khóa học chưa hoàn thành. Coupon chỉ được tạo khi hoàn thành khóa học.');
        }
      } else {
        // Nếu không có courseId, không thể xác định ngày hoàn thành
        return sendError(res, 400, 'courseId is required to determine completion date');
      }

      // Chỉ lấy coupon đã có, không tạo mới
      // Coupon được tự động tạo khi hoàn thành khóa học (trong ProgressController/QuizController)
      const applicableCourses = courseId ? [new mongoose.Types.ObjectId(courseId)] : [];
      const existingCoupon = await Coupon.findOne({
        createdBy: String(user._id),
        description: { $regex: /completion/i },
        applicableCourses: { $in: applicableCourses },
      });

      // Nếu đã có coupon, trả về coupon hiện có
      if (existingCoupon) {
        return sendSuccess(res, { coupon: existingCoupon });
      }

      // Nếu chưa có coupon, có thể khóa học chưa hoàn thành hoặc coupon chưa được tạo tự động
      // Trong trường hợp này, thử tạo coupon (fallback - chỉ khi thực sự cần)
      // Nhưng ưu tiên là coupon được tạo tự động khi hoàn thành
      const coupon = await UserCouponController.createCompletionCouponIfNeeded(
        String(user._id),
        courseId!,
        completedAt
      );

      if (coupon) {
        return sendSuccess(res, { coupon });
      }

      return sendError(res, 404, 'Coupon chưa được tạo. Vui lòng đảm bảo khóa học đã hoàn thành.');
    } catch (error: any) {
      return sendError(res, 500, error.message, error as Error);
    }
  }

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

      const courseObjectId = courseId ? new mongoose.Types.ObjectId(courseId) : null;
      const now = new Date();

      // Chỉ trả coupon completion do user này được tạo khi hoàn thành (tránh các mã global như SAVE50K)
      // Tìm coupon completion cho khóa học này (ưu tiên coupon còn hiệu lực)
      let coupon = await Coupon.findOne({
        createdBy: String(user._id),
        description: { $regex: /completion/i },
        isActive: true,
        validFrom: { $lte: now },
        validTo: { $gte: now },
        $or: [
          { applicableCourses: { $in: courseObjectId ? [courseObjectId] : [] } },
          { applicableCourses: { $exists: false } },
          { applicableCourses: { $size: 0 } },
        ],
      }).sort({ createdAt: -1 });

      // Nếu không tìm thấy coupon còn hiệu lực, tìm coupon đã hết hạn (để vẫn hiển thị)
      if (!coupon && courseObjectId) {
        coupon = await Coupon.findOne({
          createdBy: String(user._id),
          description: { $regex: /completion/i },
          applicableCourses: { $in: [courseObjectId] },
        }).sort({ createdAt: -1 });
      }

      // Nếu coupon hết lượt sử dụng, coi như không còn hiệu lực
      if (coupon && coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return sendSuccess(res, { message: 'mã giảm giá của bạn', coupon: null });
      }
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

