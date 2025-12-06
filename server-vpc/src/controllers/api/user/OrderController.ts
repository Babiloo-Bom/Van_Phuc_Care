import { sendError, sendSuccess } from "@libs/response";
import { Request, Response } from "express";
import { NoData } from "@libs/errors";
import mongoose from "mongoose";
import ModelTransaction from '@mongodb/transactions';
import moment from 'moment';
import crypto from 'crypto';
import qs from 'qs';
import configs from "@configs/configs";
import { sortObj } from "@libs/common";


const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    customerInfo: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: false,
        default: "",
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        default: "",
      },
    },
    items: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "courses",
          required: true,
        },
        course: {
          type: Object,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
        default: null,
      },
      value: {
        type: Number,
        default: 0,
      },
      amount: {
        type: Number,
        default: 0,
      },
      couponCode: {
        type: String,
        default: null,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["vnpay", "momo", "qr", "bank_transfer", "bypass"],
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed", "cancelled"],
    },
    transactionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "completed", "cancelled", "refunded"],
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create model if it doesn't exist
const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

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

// Create Cart model if it doesn't exist
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

class OrderController {
  public async create(req: Request, res: Response) {
    try {
      const {
        userId,
        customerInfo,
        items,
        subtotal,
        discount,
        totalAmount,
        paymentMethod,
        notes,
      } = req.body;

      // Validate required fields
      if (
        !userId ||
        !customerInfo ||
        !items ||
        !totalAmount ||
        !paymentMethod
      ) {
        if (!userId) {
          return sendError(res, 400, "User ID is required");
        }
        if (!customerInfo) {
          return sendError(res, 400, "Customer info is required");
        }
        if (!items) {
          return sendError(res, 400, "Items are required");
        }
        if (!totalAmount) {
          return sendError(res, 400, "Total amount is required");
        }
        if (!paymentMethod) {
          return sendError(res, 400, "Payment method is required");
        }
      }

      // Generate unique order ID
      const orderId = `VPC${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;

      // Create order
      const order = await OrderModel.create({
        orderId,
        userId,
        customerInfo,
        items,
        subtotal,
        discount: {
          type: discount?.type || "percentage",
          value: discount?.value || 0,
          amount: discount?.amount || 0,
          couponCode: discount?.couponCode || null,
        },
        totalAmount,
        paymentMethod,
        notes,
      });

      sendSuccess(res, {
        message: "Order created successfully",
        order,
      });
    } catch (error: any) {
      console.error("❌ Create order error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Process payment
   */
  public async processPayment(req: Request, res: Response) {
    try {
      const { orderId, paymentMethod, paymentData } = req.body;

      if (!orderId || !paymentMethod) {
        return sendError(res, 400, "Order ID and payment method are required");
      }

      const order = await OrderModel.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, "Order not found");
      }

      // Simulate payment processing based on method
      let paymentResult: any = {};

      switch (paymentMethod) {
        case "bypass":
          paymentResult = {
            success: true,
            transactionId: `BYPASS_${Date.now()}`,
            message: "Payment bypassed for demo purposes",
          };
          break;

        case "vnpay":
          // TODO: Integrate VNPay API
          paymentResult = {
            success: true,
            transactionId: `VNPAY_${Date.now()}`,
            message: "VNPay payment processed successfully",
          };
          break;

        case "momo":
          // TODO: Integrate MoMo API
          paymentResult = {
            success: true,
            transactionId: `MOMO_${Date.now()}`,
            message: "MoMo payment processed successfully",
          };
          break;

        case "qr":
          // TODO: Generate QR code
          paymentResult = {
            success: true,
            transactionId: `QR_${Date.now()}`,
            message: "QR payment processed successfully",
          };
          break;

        case "bank_transfer":
          // TODO: Generate bank transfer info
          paymentResult = {
            success: true,
            transactionId: `BANK_${Date.now()}`,
            message: "Bank transfer processed successfully",
          };
          break;

        default:
          return sendError(res, 400, "Invalid payment method");
      }

      if (paymentResult.success) {
        // Update order status
        order.paymentStatus = "completed";
        order.status = "completed";
        order.transactionId = paymentResult.transactionId;
        await order.save();

        // Add courses to user's courseRegister
        if (order.userId && order.userId !== 'guest_user') {
          try {
            const MongoDbUsers = (await import("@mongodb/users")).default;
            const user: any = await MongoDbUsers.model.findById(order.userId.toString());
            
            if (user) {
              // Initialize courseRegister if not exists
              if (!user.courseRegister) {
                user.courseRegister = [];
              }

              // Get course IDs from order items
              const courseIds = order.items.map((item: any) => {
                const id = item.courseId?.toString() || item.course?._id?.toString();
                return id;
              }).filter(Boolean);

              // Add new courses (avoid duplicates)
              const newCourses = courseIds.filter((id: string) => !user.courseRegister.includes(id));
              if (newCourses.length > 0) {
                user.courseRegister = [...user.courseRegister, ...newCourses];
                await user.save();
                console.log(`✅ Added ${newCourses.length} courses to user ${order.userId} courseRegister`);
              }
            }
          } catch (error: any) {
            console.error('❌ Error updating user courseRegister:', error);
            // Don't fail the payment processing if this fails
          }
        }

        // Clear user's cart after successful payment
        if (order.userId && order.userId !== 'guest_user') {
          try {
            const cart = await Cart.findOne({ userId: order.userId.toString() });
            
            if (cart) {
              cart.items = [];
              cart.totalItems = 0;
              cart.totalPrice = 0;
              cart.coupon = undefined;
              await cart.save();
              console.log(`✅ Cart cleared for user ${order.userId}`);
            }
          } catch (error: any) {
            console.error('❌ Error clearing cart:', error);
            // Don't fail the payment processing if this fails
          }
        }

        // TODO: Send confirmation email

        console.log(
          `✅ Payment processed for order ${orderId}: ${paymentResult.transactionId}`
        );
      }

      sendSuccess(res, {
        message: "Payment processed successfully",
        paymentResult,
        order,
      });
    } catch (error: any) {
      console.error("❌ Process payment error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /** 
   * Process payment vnpay
   */
  public async processPaymentVnpay(req: Request, res: Response) {
    try {
      const { orderId, paymentData } = req.body;

      if (!orderId) {
        return sendError(res, 400, "Order ID and payment method are required");
      }

      const order = await OrderModel.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, "Order not found");
      }

      // Simulate payment processing based on method
      const transaction: any = await ModelTransaction.model.create({
        userId: order.userId,
        origin: "web",
        type: "payment",
        title: `Thanh toán đơn hàng ${order.orderId}`,
        total: paymentData.totalAmount,
        fee: 0,
        retryCount: 0,
        status: ModelTransaction.STATUS_ENUM.PENDING,
        paymentMethod: "vnpay",
        orderId: order.orderId,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000)
      });

      await order.update({
        ...order.toObject(),
        paymentMethod: 'vnpay',
        paymentStatus: 'pending',
        transactionId: transaction._id.toString(),
        status: 'processing'
      });

      const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const createDate = moment(new Date()).utcOffset(7).format('YYYYMMDDHHmmss');
      const expiredAt = moment(new Date(transaction.get('expiredAt'))).utcOffset(7).format('YYYYMMDDHHmmss');
      let params:any = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: configs.vnpayConfig.vnp_TmnCode,
        vnp_Amount: transaction.get('total') * 100,
        vnp_CurrCode: "VND",
        vnp_TxnRef: transaction._id.toString(),
        vnp_OrderInfo: `Thanh toan transaction ${transaction._id}, order ${order.orderId}. So tien ${transaction.total}d`,
        vnp_OrderType: "190000",
        vnp_Locale: "vn",
        vnp_ReturnUrl: configs.vnpayConfig.vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expiredAt
      };
      params = sortObj(params)
      const signData = qs.stringify(params, { encode: false });
      console.log(configs.vnpayConfig);
      console.log(params);

      const hmac = crypto.createHmac("sha512", configs.vnpayConfig.vnp_HashSecret);
      const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      params.vnp_SecureHash = secureHash;

      const paymentUrl = `${configs.vnpayConfig.vnp_Url}?${qs.stringify(params, { encode: false })}`;
      await this.clearCartUser(order);
      sendSuccess(res, {
        message: "Create Payment successfully",
        paymentUrl,
      });
    } catch (error: any) {
      console.error("❌ Process payment error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async paymentVnpayIpn(req: Request, res: Response) {
    const params = req.query;

    const secureHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const signData = qs.stringify(sortObj(params), { encode: false });
    const signed = crypto.createHmac("sha512", configs.vnpayConfig.vnp_HashSecret)
      .update(signData, "utf-8")
      .digest("hex");

    // Sai chữ ký → từ chối
    if (secureHash !== signed) {
      return res.json({ RspCode: "97", Message: "Invalid signature" });
    }

    const transactionId = params.vnp_TxnRef;
    const responseCode = params.vnp_ResponseCode;

    const transaction = await ModelTransaction.model.findById(transactionId);
    if (!transaction) {
      return res.json({ RspCode: "01", Message: "Transaction not found" });
    }

    // Nếu đã xử lý trước đó → OK
    if (transaction.get('status') === "success") {
      return res.json({ RspCode: "00", Message: "Already confirmed" });
    }

    if (responseCode === "00") {
      // Thành công
      await ModelTransaction.model.findByIdAndUpdate(transactionId, {
        status: "success",
        paidAt: new Date(),
        referenceId: params.vnp_TransactionNo,
        metadata: params,
      });

      const order = await OrderModel.findOneAndUpdate({ orderId: transaction.get('orderId') }, {
        paymentStatus: 'completed',
        status: 'completed'
      });
      
      await this.updateCourseForUser(order);

      return res.json({ RspCode: "00", Message: "Success" });
    }

    // Thất bại
    await ModelTransaction.model.findByIdAndUpdate(transactionId, {
      status: "failed",
      errorCode: responseCode,
    });

    return res.json({ RspCode: "00", Message: "Failed" });
  }

  /**
   * Get order by order ID
   */
  public async getOrderByOrderId(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, "Order not found");
      }

      sendSuccess(res, { order });
    } catch (error: any) {
      console.error("❌ Get order by order ID error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index(req: Request, res: Response) {
    try {
      if (req.query.origin) {
        const orders = await OrderModel.find({ status: "active" }).sort({
          order: -1,
        });
        sendSuccess(res, { orders });
      } else {
        return sendError(res, 404, NoData);
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show(req: Request, res: Response) {
    try {
      const order = await OrderModel.findOne({
        status: "active",
        _id: req.params.orderId,
      });
      sendSuccess(res, { order });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const params = req.body;
      const order = await OrderModel.findById(req.params.orderId);
      await order.update({
        ...order.toObject(),
        email: params.email,
        status: params.status,
        fullname: params.fullname,
        notes: params.notes,
        phone: params.phone,
        address: params.address,
      });
      const result = await OrderModel.findById(req.params.orderId);
      sendSuccess(res, { order: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  private async updateCourseForUser(order: any) {
    if (order.userId && order.userId !== 'guest_user') {
      try {
        const MongoDbUsers = (await import("@mongodb/users")).default;
        const user: any = await MongoDbUsers.model.findById(order.userId.toString());
        
        if (user) {
          // Initialize courseRegister if not exists
          if (!user.courseRegister) {
            user.courseRegister = [];
          }

          // Get course IDs from order items
          const courseIds = order.items.map((item: any) => {
            const id = item.courseId?.toString() || item.course?._id?.toString();
            return id;
          }).filter(Boolean);

          // Add new courses (avoid duplicates)
          const newCourses = courseIds.filter((id: string) => !user.courseRegister.includes(id));
          if (newCourses.length > 0) {
            user.courseRegister = [...user.courseRegister, ...newCourses];
            await user.save();
            console.log(`✅ Added ${newCourses.length} courses to user ${order.userId} courseRegister`);
          }
        }
      } catch (error: any) {
        console.error('❌ Error updating user courseRegister:', error);
        // Don't fail the payment processing if this fails
      }
    }
  }
  private async clearCartUser(order: any) {
    if (order.userId && order.userId !== 'guest_user') {
      try {
        const cart = await Cart.findOne({ userId: order.userId.toString() });
        
        if (cart) {
          cart.items = [];
          cart.totalItems = 0;
          cart.totalPrice = 0;
          cart.coupon = undefined;
          await cart.save();
          console.log(`✅ Cart cleared for user ${order.userId}`);
        }
      } catch (error: any) {
        console.error('❌ Error clearing cart:', error);
        // Don't fail the payment processing if this fails
      }
    }
  }
}
export default new OrderController();
