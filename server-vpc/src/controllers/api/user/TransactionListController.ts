import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import MongoDbTransaction from '@mongodb/transactions';

class TransactionListController {
  // Lấy transaction của user, bổ sung tên khóa học từ đơn hàng (orderId)
  public async list(req: Request, res: Response) {
      try {
        const userId = req.currentUser?._id;
        if (!userId) {
          return sendError(res, 401, "Unauthorized");
        }
        const userIdStr = String(userId);
        const transactions = await MongoDbTransaction.model
          .find({ userId: userIdStr })
          .sort({ createdAt: -1 })
          .lean();

        const orderIds = [...new Set((transactions as any[]).map((t: any) => t.orderId).filter(Boolean))];
        let orderMap: Record<string, any> = {};
        if (orderIds.length > 0) {
          try {
            const Order = mongoose.models.Order;
            if (Order) {
              const orders = await Order.find({ orderId: { $in: orderIds }, userId: userIdStr })
                .select('orderId items')
                .lean();
              (orders as any[]).forEach((o: any) => {
                orderMap[o.orderId] = o;
              });
            }
          } catch (_) {}
        }

        const enriched = (transactions as any[]).map((t: any) => {
          const order = t.orderId ? orderMap[t.orderId] : null;
          const courseNames = order?.items?.length
            ? (order.items as any[]).map((i: any) => i.course?.title || i.course?.name || 'Khóa học').filter(Boolean)
            : [];
          return { ...t, courseNames };
        });

        sendSuccess(res, { transactions: enriched });
      } catch (error: any) {
        sendError(res, 500, error.message, error);
      }
  }
}

export default new TransactionListController();
