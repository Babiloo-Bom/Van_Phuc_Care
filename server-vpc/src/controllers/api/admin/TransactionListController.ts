import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbTransaction from '@mongodb/transactions';

class TransactionListController {
  // Lấy toàn bộ transaction cho admin
  public async list(req: Request, res: Response) {
    try {
      const transactions = await MongoDbTransaction.model.find({}).lean();
      sendSuccess(res, { transactions });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new TransactionListController();
