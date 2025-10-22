import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MongoDbOrder from '@mongodb/orders';
import MongoDbProduct from '@mongodb/products';
import NodeCache from 'node-cache';
// Create a new instance of node-cache
const cache = new NodeCache();

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const order = await MongoDbOrder.model.create({
        ...params,
      });

      await MongoDbProduct.handleStock(params.products, 'buy');
      sendSuccess(res, { order });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      await MongoDbOrder.model.updateMany({
        salesChannel: {
          name: 'website',
        },
      });
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { searchKey, customerId, status } = req.query;
      const queryString: any = {
      };
      if (customerId) {
        Object.assign(queryString, { 'customer._id': customerId });
      }
      if (status) {
        Object.assign(queryString, { status });
      }
      if (searchKey) {
        if (!isNaN(parseInt(searchKey.toString()))) {
          Object.assign(queryString, { code: parseInt(searchKey.toString()) });
        } else {
          const regex = { $regex: searchKey, $options: 'i' };
          Object.assign(queryString, { 'customer.email': regex });
        }
      }
      const [orders, total] = await Promise.all([
        MongoDbOrder.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MongoDbOrder.model.find(queryString).countDocuments(),
      ]);
      const responseData = { orders, pagination: { total, page, limit } };
      sendSuccess(res, responseData);
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const order = await MongoDbOrder.model.findById(orderId);
      if (!order) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { order });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const { orderId } = req.params;
      let updatedOrder: any = null;
      updatedOrder = await MongoDbOrder.model.findByIdAndUpdate(
        orderId,
        {
          ...params,
        },
        { new: true },
      );
      sendSuccess(res, { order: updatedOrder });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      // Clear the cache related to the specific order ID
      const cacheKey = `orders:${req.currentAdmin._id}_${JSON.stringify(req.query)}`;
      cache.del(cacheKey);
      const order = await MongoDbOrder.model.findById(orderId);
      if (!order) {
        return sendError(res, 404, NoData);
      }
      await order.delete();
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new OrderController();
