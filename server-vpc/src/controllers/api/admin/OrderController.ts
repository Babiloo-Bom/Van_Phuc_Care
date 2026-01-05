import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import MongoDbUsers from '@mongodb/users';

// Order schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  customerInfo: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false,
      default: ''
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      default: ''
    }
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
    price: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: null
    },
    value: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      default: null
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['vnpay', 'momo', 'qr', 'bank_transfer', 'bypass']
  },
  paymentStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'failed', 'cancelled']
  },
  transactionId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded']
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create model if it doesn't exist
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

class OrderController {
  /**
   * Create new order
   */
  public static async createOrder(req: Request, res: Response) {
    try {
      const {
        userId,
        customerInfo,
        items,
        subtotal,
        discount,
        totalAmount,
        paymentMethod,
        notes
      } = req.body;

      // Validate required fields
      if (!userId || !customerInfo || !items || !totalAmount || !paymentMethod) {
        return sendError(res, 400, 'Missing required fields');
      }

      // Generate unique order ID
      const orderId = `VPC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create order
      const order = await Order.create({
        orderId,
        userId,
        customerInfo,
        items,
        subtotal,
        discount: {
          type: discount?.type || 'percentage',
          value: discount?.value || 0,
          amount: discount?.amount || 0,
          couponCode: discount?.couponCode || null
        },
        totalAmount,
        paymentMethod,
        notes
      });

      sendSuccess(res, {
        message: 'Order created successfully',
        order
      });
    } catch (error: any) {
      console.error('❌ Create order error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get order by ID
   */
  public static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);

      if (!order) {
        return sendError(res, 404, 'Order not found');
      }

      sendSuccess(res, { order });
    } catch (error: any) {
      console.error('❌ Get order by ID error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get order by order ID
   */
  public static async getOrderByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await Order.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, 'Order not found');
      }

      sendSuccess(res, { order });
    } catch (error: any) {
      console.error('❌ Get order by order ID error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get user's orders
   */
  public static async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const query: any = { userId };

      if (status) {
        query.status = status;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(query);

      sendSuccess(res, {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error: any) {
      console.error('❌ Get user orders error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update order status
   */
  public static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, paymentStatus, transactionId, notes } = req.body;

      const updateData: any = {};

      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      if (transactionId) updateData.transactionId = transactionId;
      if (notes) updateData.notes = notes;

      const order = await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!order) {
        return sendError(res, 404, 'Order not found');
      }

      sendSuccess(res, {
        message: 'Order status updated successfully',
        order
      });
    } catch (error: any) {
      console.error('❌ Update order status error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Process payment
   */
  public static async processPayment(req: Request, res: Response) {
    try {
      const { orderId, paymentMethod, paymentData } = req.body;

      if (!orderId || !paymentMethod) {
        return sendError(res, 400, 'Order ID and payment method are required');
      }

      const order = await Order.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, 'Order not found');
      }

      // Simulate payment processing based on method
      let paymentResult: any = {};

      switch (paymentMethod) {
        case 'bypass':
          paymentResult = {
            success: true,
            transactionId: `BYPASS_${Date.now()}`,
            message: 'Payment bypassed for demo purposes'
          };
          break;

        case 'vnpay':
          // TODO: Integrate VNPay API
          paymentResult = {
            success: true,
            transactionId: `VNPAY_${Date.now()}`,
            message: 'VNPay payment processed successfully'
          };
          break;

        case 'momo':
          // TODO: Integrate MoMo API
          paymentResult = {
            success: true,
            transactionId: `MOMO_${Date.now()}`,
            message: 'MoMo payment processed successfully'
          };
          break;

        case 'qr':
          // TODO: Generate QR code
          paymentResult = {
            success: true,
            transactionId: `QR_${Date.now()}`,
            message: 'QR payment processed successfully'
          };
          break;

        case 'bank_transfer':
          // TODO: Generate bank transfer info
          paymentResult = {
            success: true,
            transactionId: `BANK_${Date.now()}`,
            message: 'Bank transfer processed successfully'
          };
          break;

        default:
          return sendError(res, 400, 'Invalid payment method');
      }

      if (paymentResult.success) {
        // Update order status
        order.paymentStatus = 'completed';
        order.status = 'completed';
        order.transactionId = paymentResult.transactionId;
        await order.save();

        // TODO: Add courses to user's purchased courses
        // TODO: Send confirmation email
        // TODO: Clear user's cart

        console.log(`✅ Payment processed for order ${orderId}: ${paymentResult.transactionId}`);
      }

      sendSuccess(res, {
        message: 'Payment processed successfully',
        paymentResult,
        order
      });
    } catch (error: any) {
      console.error('❌ Process payment error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get all orders (admin)
   */
  public static async getAllOrders(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

      const query: any = {};

      if (status) query.status = status;
      if (paymentStatus) query.paymentStatus = paymentStatus;
      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'customerInfo.fullName': { $regex: search, $options: 'i' } },
          { 'customerInfo.email': { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Order.countDocuments(query);

      // Standardized pagination response format
      sendSuccess(res, {
        data: orders,
        pagination: {
          page: Number(page),
          pageSize: Number(limit),
          total
        }
      });
    } catch (error: any) {
      console.error('❌ Get all orders error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get order statistics
   */
  public static async getOrderStats(req: Request, res: Response) {
    try {
      const totalOrders = await Order.countDocuments();
      const completedOrders = await Order.countDocuments({ status: 'completed' });
      // Đếm cả pending và processing để khớp với logic frontend
      const pendingOrders = await Order.countDocuments({ 
        $or: [
          { status: 'pending' },
          { status: 'processing' }
        ]
      });
      const totalRevenue = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

      sendSuccess(res, {
        stats: {
          totalOrders,
          completedOrders,
          pendingOrders,
          totalRevenue: revenue,
          completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(2) : 0
        }
      });
    } catch (error: any) {
      console.error('❌ Get order stats error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Create order with bypass payment (for testing)
   * This will create an order from cart and automatically complete payment
   */
  public static async createBypassOrder(req: Request, res: Response) {
    try {
      const { userId, customerInfo } = req.body;

      if (!userId) {
        return sendError(res, 400, 'User ID is required');
      }

      // Get cart schema (same as CartController)
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

      // Handle guest user - use consistent ID
      const actualUserId = userId === 'guest' ? 'guest_user' : userId;

      // Get user's cart
      const cart = await Cart.findOne({ userId: actualUserId });
      
      if (!cart || !cart.items || cart.items.length === 0) {
        return sendError(res, 400, 'Cart is empty');
      }

      // Calculate order details from cart
      const items = cart.items.map((item: any) => ({
        courseId: item.courseId,
        course: item.course,
        price: item.course?.price || item.course?.price || 0
      }));

      const subtotal = cart.items.reduce((sum: number, item: any) => {
        return sum + (item.course?.price || item.course?.price || 0);
      }, 0);

      const discount = cart.coupon ? {
        type: cart.coupon.type || 'percentage',
        value: cart.coupon.value || 0,
        amount: cart.coupon.discountAmount || 0,
        couponCode: cart.coupon.code || null
      } : {
        type: 'percentage',
        value: 0,
        amount: 0,
        couponCode: null
      };

      const totalAmount = subtotal - (discount.amount || 0);

      // Get user info for customerInfo if not provided
      let finalCustomerInfo = customerInfo;
      if (!finalCustomerInfo) {
        const user: any = await MongoDbUsers.model.findById(actualUserId);
        if (user) {
          finalCustomerInfo = {
            fullName: user.fullname || user.name || 'Guest User',
            phone: user.phoneNumber || '',
            email: user.email || '',
            address: user.address || ''
          };
        } else {
          finalCustomerInfo = {
            fullName: 'Guest User',
            phone: '',
            email: '',
            address: ''
          };
        }
      }

      // Generate unique order ID
      const orderId = `VPC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create order with bypass payment
      const order = await Order.create({
        orderId,
        userId: actualUserId,
        customerInfo: finalCustomerInfo,
        items,
        subtotal,
        discount,
        totalAmount,
        paymentMethod: 'bypass',
        paymentStatus: 'completed',
        transactionId: `BYPASS_${Date.now()}`,
        status: 'completed',
        notes: 'Bypass payment for testing purposes'
      });

      // Add courses to user's courseRegister
      if (actualUserId !== 'guest_user') {
        try {
          const user: any = await MongoDbUsers.model.findById(actualUserId);
          if (user) {
            // Initialize courseRegister if not exists
            if (!user.courseRegister) {
              user.courseRegister = [];
            }

            // Get course IDs from order
            const courseIds = items.map((item: any) => {
              const id = item.courseId?.toString() || item.course?._id?.toString();
              return id;
            }).filter(Boolean);

            // Add new courses (avoid duplicates)
            const newCourses = courseIds.filter((id: string) => !user.courseRegister.includes(id));
            if (newCourses.length > 0) {
              user.courseRegister = [...user.courseRegister, ...newCourses];
              await user.save();
              console.log(`✅ Added ${newCourses.length} courses to user ${actualUserId}`);
            }
          }
        } catch (error: any) {
          console.error('❌ Error updating user courseRegister:', error);
          // Don't fail the order creation if this fails
        }
      }

      // Clear cart after successful order
      try {
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        cart.coupon = undefined;
        await cart.save();
        console.log(`✅ Cart cleared for user ${actualUserId}`);
      } catch (error: any) {
        console.error('❌ Error clearing cart:', error);
        // Don't fail the order creation if this fails
      }

      sendSuccess(res, {
        message: 'Order created and payment completed successfully (bypass)',
        order
      });
    } catch (error: any) {
      console.error('❌ Create bypass order error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Manual activation - Kích hoạt thủ công
   * Dùng khi User chuyển khoản lỗi hoặc đóng tiền mặt
   */
  public static async manualActivation(req: Request, res: Response) {
    try {
      const { userEmail, courseIds, notes } = req.body;

      if (!userEmail) {
        return sendError(res, 400, 'User email is required');
      }

      if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        return sendError(res, 400, 'At least one course ID is required');
      }

      // Find user by email
      const user: any = await MongoDbUsers.model.findOne({ email: userEmail });
      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      const userId = user._id.toString();

      // Get courses
      const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({}));
      const courses = await Course.find({ _id: { $in: courseIds } });

      if (courses.length !== courseIds.length) {
        return sendError(res, 400, 'Some courses not found');
      }

      // Prepare order items
      const items = courses.map((course: any) => ({
        courseId: course._id,
        course: {
          _id: course._id,
          title: course.title || course.name,
          name: course.name || course.title,
          price: course.price || 0,
          thumbnail: course.thumbnail
        },
        price: course.price || 0
      }));

      const subtotal = items.reduce((sum: number, item: any) => sum + item.price, 0);
      const discount: {
        type: string;
        value: number;
        amount: number;
        couponCode: string | null;
      } = {
        type: 'percentage',
        value: 0,
        amount: 0,
        couponCode: null
      };
      const totalAmount = subtotal;

      // Get customer info
      const customerInfo = {
        fullName: user.fullname || user.name || 'N/A',
        phone: user.phoneNumber || user.phone || '',
        email: user.email || '',
        address: user.address || ''
      };

      // Generate unique order ID
      const orderId = `VPC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create order with bypass payment
      const order = await Order.create({
        orderId,
        userId,
        customerInfo,
        items,
        subtotal,
        discount,
        totalAmount,
        paymentMethod: 'bypass',
        paymentStatus: 'completed',
        transactionId: `MANUAL_${Date.now()}`,
        status: 'completed',
        notes: notes || 'Kích hoạt thủ công - User chuyển khoản lỗi hoặc đóng tiền mặt'
      });

      // Add courses to user's courseRegister
      try {
        // Initialize courseRegister if not exists
        if (!user.courseRegister) {
          user.courseRegister = [];
        }

        // Get course IDs from order
        const courseIdsToAdd = items.map((item: any) => {
          const id = item.courseId?.toString() || item.course?._id?.toString();
          return id;
        }).filter(Boolean);

        // Add new courses (avoid duplicates)
        const newCourses = courseIdsToAdd.filter((id: string) => !user.courseRegister.includes(id));
        if (newCourses.length > 0) {
          user.courseRegister = [...user.courseRegister, ...newCourses];
          await user.save();
          console.log(`✅ Added ${newCourses.length} courses to user ${userId} via manual activation`);
        }
      } catch (error: any) {
        console.error('❌ Error updating user courseRegister:', error);
        // Don't fail the order creation if this fails
      }

      sendSuccess(res, {
        message: 'Kích hoạt thủ công thành công',
        order
      });
    } catch (error: any) {
      console.error('❌ Manual activation error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default OrderController;