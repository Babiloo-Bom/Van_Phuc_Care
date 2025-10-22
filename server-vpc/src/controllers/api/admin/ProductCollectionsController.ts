import MongoDbProduct from '@mongodb/products';
import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbProductCollection from '@mongodb/product-collections';

class ProductCollectionController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const collection = await MongoDbProductCollection.model.create({
        thumbnail: params.thumbnail,
        name: params.name,
        slug: params.slug,
        content: params.content,
        products: params.products,
      });
      sendSuccess(res, { collection });
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
            { 'name': { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [collections, total] = await Promise.all([
        MongoDbProductCollection.model.find(queryString).select({
          name: 1,
          slug: 1,
          products: 1,
          status: 1,
          thumbnail: 1,
          createdAt: 1,
        }).skip(offset).limit(limit).sort({ createdAt: -1 }),
        MongoDbProductCollection.model.find(queryString).countDocuments(),
      ]);
      sendSuccess(res, { collections, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const collection: any = await MongoDbProductCollection.model.findById(req.params.collectionId);
      let products: any = [];
      if (collection.products?.length) {
        products = await MongoDbProduct.model.find({ '_id': { $in: collection.products } });
      }
      sendSuccess(res, { collection: { ...collection, products } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const collection = await MongoDbProductCollection.model.findById(req.params.collectionId);
      await collection.update({
        ...req.body,
      });
      const result = await MongoDbProductCollection.model.findById(req.params.collectionId);
      sendSuccess(res, { collection: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const collection: any = await MongoDbProductCollection.model
        .findByIdAndDelete(req.params.collectionId)
        ;
      const productIds = collection.products;
      await MongoDbProduct.model.updateMany(
        { _id: { $in: productIds } },
        { $pull: { category: req.params.collectionId } },
      );
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ProductCollectionController();
