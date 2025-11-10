import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

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
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
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
}

export default OrderController;