import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbFaqs from '@mongodb/faqs';

class FaqController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const queryString: any = {
        status: 'active',
      };
      const faqs = await MongoDbFaqs.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 }).select({
        _id: 0,
        title: 1,
        content: 1,
      });
      sendSuccess(res, { faqs });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new FaqController();
