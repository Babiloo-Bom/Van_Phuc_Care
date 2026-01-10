import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbBanners from '@mongodb/banners';

class BannerController {
  public async index (req: Request, res: Response) {
    try {
      const pageType = req.query.pageType as string; // 'all-courses' or 'my-courses'
      
      if (!pageType || !['all-courses', 'my-courses'].includes(pageType)) {
        return sendError(res, 400, 'pageType is required and must be "all-courses" or "my-courses"');
      }
      
      // Get only one banner for this page
      const banner = await MongoDbBanners.model
        .findOne({
          page: pageType,
          status: 'active',
        })
        .sort({ createdAt: -1 });
      
      sendSuccess(res, { banner: banner || null });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new BannerController();

