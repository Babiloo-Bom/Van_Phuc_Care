import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import MongoDbTransaction from '@mongodb/transactions';

class TransactionListController {
  // Lấy transaction của user, bổ sung tên khóa học và đồng bộ trạng thái từ Order (paymentStatus)
  public async list(req: Request, res: Response) {
      try {
        const userId = req.currentUser?._id;
        if (!userId) {
          return sendError(res, 401, "Unauthorized");
        }
        const userIdStr = String(userId);
        const page = Math.max(1, parseInt(String(req.query.page)) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit)) || 10));
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
          MongoDbTransaction.model
            .find({ userId: userIdStr })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          MongoDbTransaction.model.countDocuments({ userId: userIdStr }),
        ]);

        const orderIds = [...new Set((transactions as any[]).map((t: any) => t.orderId && String(t.orderId)).filter(Boolean))];
        let orderMap: Record<string, any> = {};
        if (orderIds.length > 0) {
          try {
            const Order = mongoose.models.Order;
            if (Order) {
              // Chỉ tìm theo orderId (orderIds đã lấy từ transaction của user này), tránh lệch kiểu userId
              const orders = await Order.find({ orderId: { $in: orderIds } })
                .select('orderId items paymentStatus')
                .lean();
              (orders as any[]).forEach((o: any) => {
                const id = o.orderId != null ? String(o.orderId) : '';
                if (id) orderMap[id] = o;
              });
            }
          } catch (_) {}
        }

        const enriched = (transactions as any[]).map((t: any) => {
          const tOrderId = t.orderId != null ? String(t.orderId) : '';
          const order = tOrderId ? orderMap[tOrderId] : null;
          const courseNames = order?.items?.length
            ? (order.items as any[]).map((i: any) => i.course?.title || i.course?.name || 'Khóa học').filter(Boolean)
            : [];
          // Đồng bộ trạng thái với admin: ưu tiên paymentStatus từ Order (admin cập nhật ở đây)
          let status = t.status;
          const payStatus = order?.paymentStatus != null ? String(order.paymentStatus) : '';
          if (payStatus === 'failed' || payStatus === 'cancelled') {
            status = 'denied';
          } else if (payStatus === 'completed') {
            status = 'success';
          }
          return { ...t, courseNames, status };
        });

        sendSuccess(res, { transactions: enriched, total });
      } catch (error: any) {
        sendError(res, 500, error.message, error);
      }
  }
}

export default new TransactionListController();
