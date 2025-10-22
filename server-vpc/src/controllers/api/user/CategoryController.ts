import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbCategory from '@mongodb/categories';
import { NoData } from '@libs/errors';

class NewsCategoryController {
  public async index (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const { type } = req.query;
      let queryString = {
        status: 'active',
      };
      if (type) queryString = Object.assign(queryString, { type });
      const categories = await MongoDbCategory.model.find(queryString).sort({ createdAt: -1 }).select({
        type: 0,
        _id: 0,
        status: 0,
      });
      sendSuccess(res, { categories });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const category = await MongoDbCategory.model.findById(req.params.newsCategoryId);
      if (!category) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { category });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new NewsCategoryController();
