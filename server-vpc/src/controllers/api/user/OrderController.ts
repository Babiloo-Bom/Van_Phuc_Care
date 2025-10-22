import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbOrder from '@mongodb/orders';
import { NoData } from '@libs/errors';

class OrderController {
  public async index (req: Request, res: Response) {
    try {
      if (req.query.origin) {
        const orders = await MongoDbOrder.model.find({ status: 'active' }).sort({ order: -1 });
        sendSuccess(res, { orders });
      } else {
        return sendError(res, 404, NoData);
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const order = await MongoDbOrder.model.findOne({ status: 'active', _id: req.params.orderId });
      sendSuccess(res, { order });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const order = await MongoDbOrder.model.findById(req.params.orderId);
      await order.update({
        ...order.toObject(),
        email: params.email,
        status: params.status,
        fullname: params.fullname,
        notes: params.notes,
        phone: params.phone,
        address: params.address,
      });
      const result = await MongoDbOrder.model.findById(req.params.orderId);
      sendSuccess(res, { order: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      sendSuccess(res, { order: {} });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new OrderController();
