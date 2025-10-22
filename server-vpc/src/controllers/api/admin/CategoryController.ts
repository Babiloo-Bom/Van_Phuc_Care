import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbCategory from '@mongodb/categories';
import SlugGeneration from '@libs/slugGeneration';

class NewsCategoryController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const category = await MongoDbCategory.model.create({
        thumbnail: params.thumbnail,
        title: params.title,
        type: params.type || MongoDbCategory.TYPE_ENUM.BLOG,
        slug: params.slug || SlugGeneration.execute(params.title),
      });
      sendSuccess(res, { category });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { page = 1, limit = 12, type, searchKey, status, from, to } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      let query: any = {};
      if (searchKey) {
        query.$or = [
          { slug: { $regex: searchKey, $options: 'i' } },
          { title: { $regex: searchKey, $options: 'i' } },
        ];
      }
      if (status) {
        query.status = status;
      }
      if (from && to) {
        query.createdAt = {
          $gte: from,
          $lte: to,
        };
      }
      if (type) query = Object.assign(query, { type });
      const [categories, total] = await Promise.all([
        MongoDbCategory.model.find(query)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(parseInt(limit as string)),
        MongoDbCategory.model.countDocuments(query),
      ]);
      sendSuccess(res, { categories, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const category = await MongoDbCategory.model.findById(req.params.categoryId);
      sendSuccess(res, { category });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const category = await MongoDbCategory.model.findById(req.params.categoryId);
      const params = req.body;
      await category.update(params);
      const result = await MongoDbCategory.model.findById(req.params.categoryId);
      sendSuccess(res, { category: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const category = await MongoDbCategory.model.findById(req.params.categoryId);
      await category.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new NewsCategoryController();
