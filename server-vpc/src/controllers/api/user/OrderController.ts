import { sendError, sendSuccess } from "@libs/response";
import { Request, Response } from "express";
import { NoData } from "@libs/errors";
import mongoose from "mongoose";

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

        // TODO: Add courses to user's purchased courses
        // TODO: Send confirmation email
        // TODO: Clear user's cart

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
}
export default new OrderController();
