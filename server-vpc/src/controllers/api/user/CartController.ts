import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbCart from '@mongodb/carts';
import { NoData } from '@libs/errors';

class CartController {
  public async index (req: Request, res: Response) {
    try {
      let cart = null;
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      cart = await MongoDbCart.model.findById(req.query._id).sort({ order: -1 }).select({});
      if (!cart) {
        cart = await MongoDbCart.model.create({
        });
      }
      sendSuccess(res, { cart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const cart = await MongoDbCart.model.findOne({ status: 'active', _id: req.params.cartId });
      if (!cart) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { cart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      let cart: {} | null = {};
      if (req.currentUser) {
        cart = await MongoDbCart.model.findOne({ 'user._id': req.currentUser._id });
      } else {
        cart = await MongoDbCart.model.create({
        });
      }
      sendSuccess(res, cart ? { cart } : {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const cart = await MongoDbCart.model.findOne({ status: 'active', _id: req.params.cartId });
      if (!cart) {
        return sendError(res, 404, NoData);
      }
      console.log(cart, params);
      await cart.update({
        customer: {
          fullname: params.fullname || cart.get('customer.fullname'),
          email: params.email || cart.get('customer.email'),
          phone: params.phone || cart.get('customer.phone'),
          address: params.address || cart.get('customer.address'),
          note: params.note || cart.get('customer.note'),
        },
        discount: params.discount || cart.get('discount'),
        payment: {
          method: params.method || cart.get('payment.method'),
        },
      });
      sendSuccess(res, { cart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async change (req: Request, res: Response) {
    try {
      const { type, origin } = req.query;
      const { cartId, product } = req.body;

      if (!origin) {
        return sendError(res, 404, NoData);
      }

      const cart = await MongoDbCart.model.findById(cartId);

      if (!cart) {
        return sendError(res, 404, NoData);
      }

      const cartObject: any = cart.toObject();
      const itemIndex = cartObject.items.findIndex((item: any) => item._id.toString() === product._id);

      if (type === 'increase') {
        if (itemIndex !== -1) {
          cartObject.items[itemIndex].number = cartObject.items[itemIndex].number ? (Number(cartObject.items[itemIndex].number) + 1) : 1;
        } else {
          cartObject.items.push({
            _id: product._id,
            name: product.name,
            discount: product.discount,
            typeDiscount: product.typeDiscount,
            thumbnail: product.thumbnail,
            number: product.number,
            price: product.price,
          });
        }
      } else if (type === 'decrease') {
        if (itemIndex === -1) {
          return sendError(res, 404, NoData);
        }

        if (Number(cartObject.items[itemIndex].number) <= 1) {
          cartObject.items.splice(itemIndex, 1);
        } else {
          cartObject.items[itemIndex].number = Number(cartObject.items[itemIndex].number) - 1;
        }
      } else if (type === 'remove') {
        if (itemIndex === -1) {
          return sendError(res, 404, NoData);
        }
        cartObject.items.splice(itemIndex, 1);
      }

      await cart.updateOne({ $set: { items: cartObject.items } });
      const updatedCart = await MongoDbCart.model.findById(cartId);
      sendSuccess(res, { cart: updatedCart });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CartController();
