import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbTransaction from '@mongodb/transactions';
import { NoData } from '@libs/errors';

class TransactionController {
  public async seedTransactions(req: Request, res: Response) {
    try {
      const transactions = req.body.transactions;
      if (!Array.isArray(transactions)) {
        return sendError(res, 400, 'Invalid transactions data');
      }
      const result = await MongoDbTransaction.model.insertMany(transactions);
      sendSuccess(res, { inserted: result.length });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new TransactionController();
