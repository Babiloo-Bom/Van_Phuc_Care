import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MongoDbCart from '@mongodb/carts';
import MongoDbProduct from '@mongodb/products';

class CartController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const cart = await MongoDbCart.model.create({
        ...params,
      });

      await MongoDbProduct.handleStock(params.products, 'buy');
      sendSuccess(res, { cart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { searchKey } = req.query;
      const queryString: any = {
      };
      if (searchKey) {
        Object.assign(queryString, {
          $or: [
            { '_id': { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [carts, total] = await Promise.all([
        MongoDbCart.model.find(queryString).select({
        }).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MongoDbCart.model.find(queryString).countDocuments(),
      ]);
      sendSuccess(res, { carts, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const cartId = req.params.cartId;
      const query: any = {
        _id: cartId,
      };
      const cart = await MongoDbCart.model.findOne(query);
      if (!cart) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { cart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const { cartId } = req.params;
      let updatedCart: any = null;
      updatedCart = await MongoDbCart.model.findByIdAndUpdate(
        cartId,
        {
          ...params,
        },
        { new: true },
      );
      if (!updatedCart) {
        return sendError(res, 404, NoData);
      }

      if (updatedCart.status === 'canceled') {
        await MongoDbProduct.handleStock(params.products, 'rollback');
      }
      sendSuccess(res, { cart: updatedCart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const cart = await MongoDbCart.model.findById(req.params.cartId);
      if (!cart) {
        return sendError(res, 404, NoData);
      }
      await cart.delete();
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CartController();
