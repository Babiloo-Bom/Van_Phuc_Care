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
        // Update existing banner using findByIdAndUpdate
        const updatedBanner = await MongoDbBanners.model.findByIdAndUpdate(
          existingBanner._id,
          {
            title: params.title,
            image: params.image,
            url: params.url || '',
            status: params.status || 'active',
          },
          { new: true }
        );
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
      const updatedBanner = await MongoDbBanners.model.findByIdAndUpdate(
        req.params.bannerId,
        {
          page: params?.page !== undefined ? params.page : (banner as any).page,
          title: params?.title !== undefined ? params.title : (banner as any).title,
          image: params?.image !== undefined ? params.image : (banner as any).image,
          url: params?.url !== undefined ? params.url : (banner as any).url,
          order: params?.order !== undefined ? params.order : (banner as any).order,
          status: params?.status !== undefined ? params.status : (banner as any).status,
        },
        { new: true }
      );
      sendSuccess(res, { banner: updatedBanner });
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
      await MongoDbBanners.model.findByIdAndDelete(req.params.bannerId);
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new BannerController();

