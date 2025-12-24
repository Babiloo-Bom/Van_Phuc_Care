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
import SePayService from "@services/sepay";


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

// Simple in-memory cache to reduce repeated SePay lookup pressure (short TTL)
const sepayCheckCache: Map<string, { found: boolean; transaction?: any; amount?: number; expiresAt: number }> = new Map();

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

      // Create order - làm tròn tất cả số tiền để không có số thập phân
      const order = await OrderModel.create({
        orderId,
        userId,
        customerInfo,
        items,
        subtotal: Math.round(subtotal || 0),
        discount: {
          type: discount?.type || "percentage",
          value: discount?.value || 0,
          amount: Math.round(discount?.amount || 0),
          couponCode: discount?.couponCode || null,
        },
        totalAmount: Math.round(totalAmount || 0), // Làm tròn totalAmount
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
          // QR code payment - chỉ tạo QR, chưa thanh toán
          // Thanh toán sẽ được xác nhận qua webhook
          paymentResult = {
            success: true,
            transactionId: `QR_${Date.now()}`,
            message: "QR code generated successfully. Please scan and pay.",
            requiresPayment: true, // Đánh dấu cần thanh toán
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

      // Làm tròn số tiền để không có số thập phân (tương tự SePay)
      const roundedTotalAmount = Math.round(paymentData.totalAmount || order.totalAmount || 0);
      
      // Simulate payment processing based on method
      const transaction: any = await ModelTransaction.model.create({
        userId: order.userId,
        origin: "web",
        type: "payment",
        title: `Thanh toán đơn hàng ${order.orderId}`,
        total: roundedTotalAmount,
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
      
      // Làm tròn số tiền trước khi nhân 100 (VNPay yêu cầu amount tính bằng xu)
      const roundedAmount = Math.round(transaction.get('total') || 0);
      
      let params:any = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: configs.vnpayConfig.vnp_TmnCode,
        vnp_Amount: roundedAmount * 100,
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

      const hmac = crypto.createHmac("sha512", configs.vnpayConfig.vnp_HashSecret);
      const secureHash = hmac.update(signData, "utf-8").digest("hex");
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
    console.log("🔔 ----------------VNPay IPN received:", req.query);
    try {
      const rawParams: any = { ...(req.query || {}) };

      // Keep original secure hash for metadata but don't include it in signing payload
      const secureHash = rawParams.vnp_SecureHash;
      const secureHashType = rawParams.vnp_SecureHashType;

      // Clone params for signing and remove secure hash fields
      const paramsForSign = { ...rawParams };
      delete paramsForSign.vnp_SecureHash;
      delete paramsForSign.vnp_SecureHashType;

      const signData = qs.stringify(sortObj(paramsForSign), { encode: false });
      const signed = crypto.createHmac("sha512", configs.vnpayConfig.vnp_HashSecret)
        .update(signData, "utf-8")
        .digest("hex");

      // Sai chữ ký → từ chối (97)
      if (!secureHash || secureHash !== signed) {
        return res.json({ RspCode: "97", Message: "Invalid Checksum" });
      }

      const transactionId = String(rawParams.vnp_TxnRef || "");
      const responseCode = String(rawParams.vnp_ResponseCode || "");

      // Parse amount robustly (strip non-digits)
      const rawAmountStr = String(rawParams.vnp_Amount || "").replace(/[^0-9]/g, "");
      const vnpAmount = rawAmountStr ? parseInt(rawAmountStr, 10) : 0;

      // Try to find transaction - handle invalid ObjectId
      let transaction;
      try {
        transaction = await ModelTransaction.model.findById(transactionId);
      } catch (err) {
        // Invalid ObjectId format
        return res.json({ RspCode: "01", Message: "Order Not Found" });
      }

      if (!transaction) {
        // Order not found (01)
        return res.json({ RspCode: "01", Message: "Order Not Found" });
      }

      // Validate amount (VNPay sends amount in VND * 100)
      // MUST check amount BEFORE checking transaction status
      const expectedAmount = Math.round(transaction.get('total') || 0) * 100;

      // If vnpAmount is present and doesn't match expected, return 04
      if (vnpAmount && expectedAmount !== vnpAmount) {
        return res.json({ RspCode: "04", Message: "Invalid amount" });
      }

      // Nếu đã xử lý trước đó → trả mã 02 (order already confirmed)
      if (transaction.get('status') === "success" || transaction.get('status') === "completed") {
        return res.json({ RspCode: "02", Message: "Order already confirmed" });
      }

      if (responseCode === "00") {
        // Thành công
        await ModelTransaction.model.findByIdAndUpdate(transactionId, {
          status: "success",
          paidAt: new Date(),
          referenceId: rawParams.vnp_TransactionNo || null,
          metadata: { ...rawParams, vnp_SecureHash: secureHash, vnp_SecureHashType: secureHashType },
        });

        const order = await OrderModel.findOneAndUpdate({ orderId: transaction.get('orderId') }, {
          paymentStatus: 'completed',
          status: 'completed'
        });

        await this.updateCourseForUser(order);

        // Acknowledge receipt to VNPay
        return res.json({ RspCode: "00", Message: "Confirm Success" });
      }

      // Thất bại (transaction not successful) - mark failed and still acknowledge receipt
      await ModelTransaction.model.findByIdAndUpdate(transactionId, {
        status: "failed",
        errorCode: responseCode,
      });

      return res.json({ RspCode: "00", Message: "Confirm Success" });
    } catch (error: any) {
      console.error("❌ paymentVnpayIpn error:", error);
      // Avoid returning 5xx to VNPay test runner; return a JSON error code 99
      return res.json({ RspCode: "99", Message: `Exception: ${error?.message || 'Unknown error'}` });
    }
  }
  public async paymentVnpayVerify(req: Request, res: Response) {
    try {
      const params = req.body;

      const secureHash = params.vnp_SecureHash;
      delete params.vnp_SecureHash;
      delete params.vnp_SecureHashType;

      const signData = qs.stringify(sortObj(params), { encode: false });
      const signed = crypto.createHmac("sha512", configs.vnpayConfig.vnp_HashSecret)
        .update(signData, "utf-8")
        .digest("hex");

      // Sai chữ ký → từ chối
      if (secureHash !== signed) {
        return sendError(res, 400, 'Invalid signature');
      }

      const transactionId = params.vnp_TxnRef;
      const responseCode = params.vnp_ResponseCode;

      const transaction = await ModelTransaction.model.findById(transactionId);
      if (!transaction) {
        return sendError(res, 404, 'Transaction not found');
      }

      // Nếu đã xử lý thành công trước đó (bởi IPN) → trả về success
      if (transaction.get('status') === "success") {
        return sendSuccess(res, { success: true }, 'Payment already confirmed');
      }

      // Nếu đã failed trước đó → trả về lỗi
      if (transaction.get('status') === "failed") {
        return sendError(res, 400, 'Payment failed');
      }

      // Strict-IPN-only: Do NOT update DB here. Return a pending response so client waits for IPN.
      if (responseCode === "00") {
        // Payment gateway indicates success but we only accept IPN as source of truth.
        console.log(`ℹ️ VNPay Verify received success for transaction ${transactionId} but will not update DB; waiting for IPN.`);
        return sendSuccess(res, { success: false }, 'Payment pending, confirmation will be handled by IPN');
      }

      // Non-success response from gateway — do not modify DB here under Strict-IPN-only policy.
      return sendError(res, 400, 'Payment not successful (handled via IPN)');
    } catch (error: any) {
      console.error("❌ paymentVnpayVerify error:", error);
      return sendError(res, 500, error.message, error as Error);
    }
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

  /**
   * Tạo QR code cho thanh toán đơn hàng
   */
  public async createQRCode(req: Request, res: Response) {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return sendError(res, 400, "Order ID is required");
      }

      const order = await OrderModel.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, "Order not found");
      }

      // Kiểm tra nếu đơn hàng đã thanh toán
      if (order.paymentStatus === 'completed') {
        return sendError(res, 400, "Order already paid");
      }

      // Tạo mô tả thanh toán
      const courseNames = order.items.map((item: any) => item.course?.title || 'Khóa học').join(', ');
      const description = `Thanh toan khoa hoc: ${courseNames}`;

      // Làm tròn số tiền trước khi tạo QR code (đảm bảo không có số thập phân)
      const roundedAmount = Math.round(order.totalAmount);

      // Tạo QR code với SePay
      const qrData = await SePayService.createQRCode(
        roundedAmount,
        order.orderId,
        description
      );

      // Cập nhật order với thông tin QR code
      order.paymentMethod = 'qr';
      order.paymentStatus = 'pending';
      await order.save();

      sendSuccess(res, {
        message: "QR code created successfully",
        qrData: {
          qrCode: qrData.qrCode,
          qrData: qrData.qrData,
          accountNo: qrData.accountNo,
          accountName: qrData.accountName,
          bankCode: qrData.bankCode,
          amount: qrData.amount,
          content: qrData.content,
          orderId: order.orderId
        }
      });
    } catch (error: any) {
      console.error("❌ Create QR code error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Webhook từ SePay để xác nhận thanh toán
   */
  public async sepayWebhook(req: Request, res: Response) {
    try {
      console.log("🔔 SePay webhook received:", req.body);
      // Log sandbox mode
      if (configs.sepayConfig.isSandbox) {
        console.log('🧪 SePay SANDBOX webhook received - TEST mode');
      }

      // Lấy Bearer Token từ header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.error('❌ SePay webhook: Missing authorization header');
        return sendError(res, 401, "Missing authorization header");
      }
      console.log('authHeader:', authHeader)
      // Xác thực token
      const isValid = SePayService.verifyWebhook(authHeader);
      if (!isValid) {
        console.error('❌ SePay webhook: Invalid webhook token');
        return sendError(res, 401, "Invalid webhook token");
      }

      // Xử lý webhook
      const webhookResult = await SePayService.handleWebhook(req.body);

      console.log('ℹ️ SePay webhook processed result:', webhookResult);

      if (!webhookResult.success || !webhookResult.orderId) {
        console.error('❌ SePay webhook: Invalid webhook data', {
          success: webhookResult.success,
          orderId: webhookResult.orderId,
          status: webhookResult.status
        });
        return sendError(res, 400, "Invalid webhook data");
      }

      // Tìm order
      const order = await OrderModel.findOne({ orderId: webhookResult.orderId });

      if (!order) {
        console.error(`❌ SePay webhook: Order not found: ${webhookResult.orderId}`);
        return sendError(res, 404, "Order not found");
      }

      // Kiểm tra nếu đã thanh toán rồi
      if (order.paymentStatus === 'completed') {
        console.log(`ℹ️ SePay webhook: Order already paid: ${webhookResult.orderId}`);
        return sendSuccess(res, {
          message: "Order already paid",
          order
        });
      }

      // So sánh số tiền với tolerance (cho phép sai lệch ±1 VND hoặc làm tròn)
      const orderAmount = Math.round(order.totalAmount);
      const paymentAmount = webhookResult.amount ? Math.round(webhookResult.amount) : null;
      
      if (paymentAmount !== null) {
        const amountDiff = Math.abs(orderAmount - paymentAmount);
        // Cho phép sai lệch tối đa 1 VND (do làm tròn của ngân hàng)
        if (amountDiff > 1) {
          console.warn(`⚠️ SePay webhook: Amount mismatch for order ${webhookResult.orderId}`, {
            orderAmount,
            paymentAmount,
            diff: amountDiff
          });
          // Vẫn chấp nhận thanh toán nếu sai lệch nhỏ (≤ 1 VND)
          // Nếu sai lệch lớn hơn, có thể là giao dịch sai
          if (amountDiff > 10) {
            return sendError(res, 400, `Amount mismatch: expected ${orderAmount}, got ${paymentAmount}`);
          }
        }
      }

      // Cập nhật trạng thái thanh toán
      order.paymentStatus = 'completed';
      order.status = 'completed';
      if (webhookResult.transactionId) {
        order.transactionId = webhookResult.transactionId;
      }
      await order.save();

      // Cập nhật courseRegister cho user
      await this.updateCourseForUser(order);

      // Xóa giỏ hàng
      await this.clearCartUser(order);

      // Clear any recent SePay cache for this order so subsequent checks see new status
      try {
        sepayCheckCache.delete(webhookResult.orderId);
      } catch (e) {
        // ignore
      }

      console.log(`✅ QR payment confirmed for order ${webhookResult.orderId}`, {
        orderAmount,
        paymentAmount,
        transactionId: webhookResult.transactionId
      });

      sendSuccess(res, {
        message: "Payment confirmed successfully",
        order
      });
    } catch (error: any) {
      console.error("❌ SePay webhook error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán QR code
   * Nếu order vẫn pending, tự động kiểm tra với SePay API (fallback khi webhook không hoạt động)
   */
  public async checkQRPaymentStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return sendError(res, 400, "Order ID is required");
      }

      const order = await OrderModel.findOne({ orderId });

      if (!order) {
        return sendError(res, 404, "Order not found");
      }

      // Nếu đã thanh toán, trả về thông tin
      if (order.paymentStatus === 'completed') {
        return sendSuccess(res, {
          message: "Payment completed",
          order,
          paid: true
        });
      }

      // Nếu chưa thanh toán, kiểm tra với SePay API (fallback)
      // Chỉ kiểm tra nếu order được tạo trong 24h gần đây để tránh spam API
      const orderAge = Date.now() - new Date(order.createdAt).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (orderAge < maxAge && order.paymentMethod === 'qr') {
        try {
          console.log(`🔍 Checking SePay API for order ${orderId} (fallback check)`);

          // Check short-lived cache first
          const cacheEntry = sepayCheckCache.get(orderId);
          if (cacheEntry && cacheEntry.expiresAt > Date.now()) {
            console.log(`ℹ️ Using cached SePay result for order ${orderId}`, { cached: cacheEntry });
            if (cacheEntry.found) {
              // Update order as paid using cached info
              order.paymentStatus = 'completed';
              order.status = 'completed';
              if (cacheEntry.transaction?.id || cacheEntry.transaction?.transactionId) {
                order.transactionId = cacheEntry.transaction.id || cacheEntry.transaction.transactionId;
              }
              await order.save();
              await this.updateCourseForUser(order);
              await this.clearCartUser(order);

              return sendSuccess(res, {
                message: "Payment completed (verified via cached SePay result)",
                order,
                paid: true
              });
            } else {
              // Cached negative result -> continue as pending
              return sendSuccess(res, {
                message: "Payment pending",
                order,
                paid: false
              });
            }
          }

          const transactionResult = await SePayService.findTransactionByOrderId(
            orderId,
            order.totalAmount
          );
          console.log('🔍 SePay API transaction result:', transactionResult);
          if (transactionResult.found && transactionResult.transaction) {
            // cache the positive result for 30s to avoid repeated SePay requests
            sepayCheckCache.set(orderId, {
              found: true,
              transaction: transactionResult.transaction,
              amount: transactionResult.amount,
              expiresAt: Date.now() + 30 * 1000
            });

            // Tìm thấy giao dịch thành công từ SePay API
            console.log(`✅ Found payment from SePay API for order ${orderId}, updating order status`);

            // Cập nhật trạng thái thanh toán (giống như webhook)
            order.paymentStatus = 'completed';
            order.status = 'completed';
            if (transactionResult.transaction.id || transactionResult.transaction.transactionId) {
              order.transactionId = transactionResult.transaction.id || transactionResult.transaction.transactionId;
            }
            await order.save();

            // Cập nhật courseRegister cho user
            await this.updateCourseForUser(order);

            // Xóa giỏ hàng
            await this.clearCartUser(order);

            return sendSuccess(res, {
              message: "Payment completed (verified via SePay API)",
              order,
              paid: true
            });
          }
        } catch (apiError: any) {
          // Nếu lỗi khi gọi SePay API, không fail request, chỉ log
          console.warn(`⚠️ SePay API check failed for order ${orderId}:`, apiError.message);
        }
      }

      // Chưa thanh toán hoặc không tìm thấy giao dịch
      sendSuccess(res, {
        message: "Payment pending",
        order,
        paid: false
      });
    } catch (error: any) {
      console.error("❌ Check QR payment status error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new OrderController();
