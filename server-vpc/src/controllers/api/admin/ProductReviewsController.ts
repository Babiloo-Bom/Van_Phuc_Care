import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbProductReview from '@mongodb/product-reviews';

class ProductReviewController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      for (let i = 0; i < params.products.length; i++) {
        await MongoDbProductReview.model.create({
          customer: {
            _id: params._id || null,
            fullname: params.fullname,
          },
          content: params.content,
          status: 'verified',
          rate: params.rate,
          product: {
            _id: params.products[i]._id,
            name: params.products[i].name,
            thumbnail: params.products[i].thumbnail,
          },
        });
      }
      sendSuccess(res, { status: true });
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
            { 'customer.name': { $regex: searchKey, $options: 'i' } },
            { 'product.name': { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [reviews, total] = await Promise.all([
        MongoDbProductReview.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MongoDbProductReview.model.find(queryString).countDocuments(),
      ]);
      sendSuccess(res, { reviews, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const review = await MongoDbProductReview.model.findById(req.params.reviewId);
      sendSuccess(res, { review });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const review = await MongoDbProductReview.model.findById(req.params.reviewId);
      await review.update({
        ...req.body,
      });
      const result = await MongoDbProductReview.model.findById(req.params.reviewId);
      sendSuccess(res, { review: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const review = await MongoDbProductReview.model.findById(req.params.reviewId);
      await review.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ProductReviewController();
