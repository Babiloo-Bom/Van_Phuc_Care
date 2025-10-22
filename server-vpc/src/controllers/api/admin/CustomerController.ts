import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MonggoDbCustomer from '@mongodb/customers';
import MongoDbOrder from '@mongodb/orders';
import moment from 'moment';

class CustomerController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const customer = await MonggoDbCustomer.model.create({
        ...params,
        status: 'verified',
      });
      sendSuccess(res, { customer });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { from, to, categoryId, searchKey, status } = req.query;
      let queryString: any = {
      };
      if (from && to) {
        Object.assign(queryString, {
          'createdAt': {
            $gte: moment(from.toString()),
            $lte: moment(to.toString()),
          },
        });
      }
      if (categoryId) {
        Object.assign(queryString, {
          'categoryId': categoryId,
        });
      }
      if (status) {
        Object.assign(queryString, {
          'status': status,
        });
      }
      if (searchKey) {
        queryString = {
          ...queryString,
          $or: [
            { fullname: { $regex: searchKey, $options: 'i' } },
            { email: { $regex: searchKey, $options: 'i' } },
            { phone: { $regex: searchKey, $options: 'i' } },
          ],
        };
      }
      const [customers, total] = await Promise.all([
        MonggoDbCustomer.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MonggoDbCustomer.model.find(queryString).countDocuments(),
      ]);
      // Save the fetched data in the cache
      const responseData = { customers, pagination: { total, page, limit } };
      sendSuccess(res, responseData);
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const queryString: any = {
        _id: req.params.customerId,
      };
      const customer = await MonggoDbCustomer.model.findOne(queryString);
      const orders = await MongoDbOrder.model.find({ 'customer._id': req.params.customerId });
      sendSuccess(res, { customer: { ...customer, orders } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const { customerId } = req.params;
      let updatedCustomer = null;
      updatedCustomer = await MonggoDbCustomer.model.findByIdAndUpdate(
        customerId,
        {
          ...params,
        },
        { new: true },
      );
      sendSuccess(res, { customer: updatedCustomer });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const customer = await MonggoDbCustomer.model.findById(req.params.customerId);
      if (!customer) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CustomerController();
