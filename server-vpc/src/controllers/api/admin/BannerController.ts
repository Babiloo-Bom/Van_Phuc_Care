import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbBanners from '@mongodb/banners';

class BannerController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      
      // Check if banner already exists for this page
      const existingBanner = await MongoDbBanners.model.findOne({ page: params.page });
      
      if (existingBanner) {
        // Update existing banner
        await existingBanner.update({
          title: params.title,
          image: params.image,
          url: params.url || '',
          status: params.status || 'active',
        });
        const updatedBanner = await MongoDbBanners.model.findById(existingBanner._id);
        sendSuccess(res, { banner: updatedBanner });
      } else {
        // Create new banner
        const banner = await MongoDbBanners.model.create({
          page: params.page,
          title: params.title,
          image: params.image,
          url: params.url || '',
          status: params.status || 'active',
        });
        sendSuccess(res, { banner });
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '100');
      const offset = (page - 1) * limit;
      const queryString: any = {};
      
      // Filter by page if provided
      if (req.query.pageType) {
        queryString.page = req.query.pageType;
      }
      
      // Filter by status if provided
      if (req.query.status) {
        queryString.status = req.query.status;
      }
      
      const banners = await MongoDbBanners.model
        .find(queryString)
        .skip(offset)
        .limit(limit)
        .sort({ order: 1, createdAt: -1 });
      const total = await MongoDbBanners.model.find(queryString).countDocuments();
      sendSuccess(res, { banners, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const banner = await MongoDbBanners.model.findById(req.params.bannerId);
      if (!banner) {
        return sendError(res, 404, 'Banner not found');
      }
      sendSuccess(res, { banner });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const banner = await MongoDbBanners.model.findById(req.params.bannerId);
      if (!banner) {
        return sendError(res, 404, 'Banner not found');
      }
      const params = req.body;
      await banner.update({
        page: params?.page !== undefined ? params.page : banner.get('page'),
        title: params?.title !== undefined ? params.title : banner.get('title'),
        image: params?.image !== undefined ? params.image : banner.get('image'),
        url: params?.url !== undefined ? params.url : banner.get('url'),
        order: params?.order !== undefined ? params.order : banner.get('order'),
        status: params?.status !== undefined ? params.status : banner.get('status'),
      });
      const record = await MongoDbBanners.model.findById(req.params.bannerId);
      sendSuccess(res, { banner: record });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const banner = await MongoDbBanners.model.findById(req.params.bannerId);
      if (!banner) {
        return sendError(res, 404, 'Banner not found');
      }
      await banner.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new BannerController();

