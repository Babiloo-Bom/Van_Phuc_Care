import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbTransaction from '@mongodb/transactions';
import { NoData } from '@libs/errors';

class TransactionController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const { searchKey, status, target } = req.query;
      const queryString: any = {
        origin: req.currentAdmin.domain,
      };
      if (req.currentAdmin.role !== 'manager') {
        Object.assign(queryString, {
          'customer.email': req.currentAdmin.email,
        });
      }
      if (target) {
        Object.assign(queryString, {
          target,
        });
      }
      if (status) {
        Object.assign(queryString, {
          'status': status,
        });
      }
      if (searchKey) {
        Object.assign(queryString, {
          $or: [
            { title: { $regex: searchKey, $options: 'i' } },
            { email: { $regex: searchKey, $options: 'i' } },
            { customer: { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [transactions, total] = await Promise.all([
        MongoDbTransaction.model.find(queryString)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .select({ origin: 0 })
          .lean(),
        MongoDbTransaction.model.countDocuments(queryString),
      ]);
      sendSuccess(res, { pagination: { total, page, limit }, transactions });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const transaction = await MongoDbTransaction.model.findOne({
        _id: req.params.id,
        origin: req.currentAdmin.domain,
        'customer.email': req.currentAdmin.email,
      });
      if (!transaction) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { transaction });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      if (req.currentAdmin.role !== 'manager') {
        return sendError(res, 404, NoData);
      }
      const transaction = await MongoDbTransaction.model.create({
        ...params,
        origin: req.currentAdmin.domain,
        status: 'active',
        createdBy: {
          _id: req.currentAdmin._id,
          fullname: req.currentAdmin.fullname,
        },
      });
      sendSuccess(res, { transaction });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const transaction = await MongoDbTransaction.model.findById(req.params.id);
      if (!transaction) {
        return sendError(res, 404, NoData);
      }
      await transaction.update({
        ...req.body,
        origin: req.currentAdmin.domain,
      });
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      if (req.currentAdmin.role === 'manager') {
        const transaction = await MongoDbTransaction.model.findById(req.params.id);
        if (!transaction) {
          return sendError(res, 404, NoData);
        }
        await transaction.delete();
      }
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new TransactionController();
