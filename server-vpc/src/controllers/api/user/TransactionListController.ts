import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbTransaction from '@mongodb/transactions';

class TransactionListController {
  // Lấy transaction của user
  public async list(req: Request, res: Response) {
      try {
        // Lấy userId từ token (middleware xác thực JWT phải gán user vào req.user)
        const userId = req.currentUser?._id;
        if (!userId) {
          return sendError(res, 401, "Unauthorized");
        }
        const transactions = await MongoDbTransaction.model.find({ userId }).lean();
        sendSuccess(res, { transactions });
      } catch (error: any) {
        sendError(res, 500, error.message, error);
      }
  }
}

export default new TransactionListController();
