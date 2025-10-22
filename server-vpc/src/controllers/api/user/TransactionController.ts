import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import ModelTransaction from '@mongodb/transactions';
import MongoDbAdmins from '@mongodb/admins';
import MongoDbAccessPermission from '@mongodb/access-permissions';
import { NoData } from '@libs/errors';

class TransactionController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      if (!params.origin) {
        return sendError(res, 404, NoData);
      }
      const isExistedAccount: any = await MongoDbAdmins.model.findById(params.customer?.id);
      if (!isExistedAccount) {
        return sendError(res, 404, NoData);
      }
      const transaction: any = await ModelTransaction.model.create({
        ...params,
        title: params.title,
        items: params.items,
        customer: params.customer,
        total: params.total,
        status: ModelTransaction.STATUS_ENUM.PENDING,
        paymentConfirmation: params.paymentConfirmation,
        registerId: params.registerId,
        origin: params.origin,
      });
      await MongoDbAccessPermission.model.create({
        origin: params.origin,
        request: {
          id: isExistedAccount._id,
          email: isExistedAccount.email,
        },
        access: transaction.items,
        transaction: {
          id: transaction._id,
          title: transaction.title,
        },
      });
      sendSuccess(res, { status: true });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new TransactionController();
