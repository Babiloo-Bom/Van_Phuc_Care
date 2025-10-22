import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MongoDbProduct from '@mongodb/products';
import MongoDbProductCollection from '@mongodb/product-collections';
import MongoDbProductReview from '@mongodb/product-reviews';
class ProductController {
  public async create (req: Request, res: Response) {
    try {
      const { body } = req;
      const product = await MongoDbProduct.model.create({
        ...body,
      });

      await MongoDbProductCollection.model.findByIdAndUpdate(
        body.category.id,
        { $push: { products: product._id.toString() } },
      );
      sendSuccess(res, { product });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
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
        Object.assign(queryString, {
          $or: [
            { name: { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [products, total] = await Promise.all([
        MongoDbProduct.model.find(queryString).select({
          name: 1,
          price: 1,
          quantityInStock: 1,
          quantitySelled: 1,
          status: 1,
          thumbnail: 1,
          createdAt: 1,
        }).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MongoDbProduct.model.find(queryString).countDocuments(),
      ]);
      const responseData = { products, pagination: { total, page, limit } };
      sendSuccess(res, responseData);
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      const queryString: any = {
        _id: productId,
      };
      const product = await MongoDbProduct.model.findOne(queryString);
      sendSuccess(res, { product });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.body;
      const product: any = await MongoDbProduct.model.findByIdAndUpdate(
        req.params.productId,
        {
          $set: {
            ...params,
          },
        },
        { new: true },
      );

      if (!product) {
        return sendError(res, 404, NoData);
      }

      const categoryUpdates = params.category.map(async (category: any) => {
        await MongoDbProductCollection.model.findByIdAndUpdate(
          category._id,
          {
            $addToSet: { products: req.params.productId },
          },
          { upsert: true },
        );
      });

      const categoryRemovals = params.categoryRemove.map(async (category: any) => {
        await MongoDbProductCollection.model.updateOne(
          { _id: category },
          {
            $pull: { products: req.params.productId },
          },
        );
      });

      await Promise.all([...categoryUpdates, ...categoryRemovals]);

      sendSuccess(res, { product });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const product = await MongoDbProduct.model.findById(productId).lean<{ _id: any; category: any[] }>();

      if (!product) {
        return sendError(res, 404, NoData);
      }

      const categoryIds = product.category.map(({ _id }: any) => _id);

      await Promise.all([
        MongoDbProductCollection.model.updateMany(
          { _id: { $in: categoryIds } },
          { $pullAll: { products: [productId] } },
        ),
        MongoDbProduct.model.deleteOne({ _id: productId }),
        MongoDbProductReview.model.deleteMany({ 'product._id': productId }),
      ]);

      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ProductController();
