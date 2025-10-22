import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MonggoDbProduct from '@mongodb/products';

class ProductController {
  public async index (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { categoryId, searchKey } = req.query;
      const queryString: any = {
      };
      if (categoryId) {
        queryString.categoryId = categoryId;
      }
      if (searchKey) {
        queryString.name = { '$regex': searchKey };
      }
      const [products, total] = await Promise.all([
        MonggoDbProduct.model.find({ ...queryString, status: MonggoDbProduct.STATUS_ENUM.ACTIVE }).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MonggoDbProduct.model.find(queryString).countDocuments(),
      ]);
      sendSuccess(res, { products, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const product = await MonggoDbProduct.model.findOne({
        slug: req.params.productId,
      });
      if (!product) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { product });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async recommends (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '8');
      const offset = (page - 1) * limit;
      const queryString: any = {
      };
      const [products] = await Promise.all([
        MonggoDbProduct.model.find({ ...queryString, status: MonggoDbProduct.STATUS_ENUM.ACTIVE }).skip(offset).limit(limit).sort({ createdAt: -1 }),
      ]);
      sendSuccess(res, { products, pagination: { page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ProductController();
