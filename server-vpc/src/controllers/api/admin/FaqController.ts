import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbFaqs from '@mongodb/faqs';
import SlugGeneration from '@libs/slugGeneration';

class FaqController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const faqs = await MongoDbFaqs.model.create({
        title: params.title,
        content: params.content,
        slug: params.slug || SlugGeneration.execute(params.title),
      });
      sendSuccess(res, { faqs });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const queryString: any = {
      };
      const faqs = await MongoDbFaqs.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 });
      const total = await MongoDbFaqs.model.find(queryString).countDocuments();
      sendSuccess(res, { faqs, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const faq = await MongoDbFaqs.model.findById(req.params.faqId);
      sendSuccess(res, { faq });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const faq = await MongoDbFaqs.model.findById(req.params.faqId);
      const params = req.body;
      await faq.update({
        title: params?.title || faq.get('title'),
        content: params?.content || faq.get('content'),
        status: params?.status || faq.get('status'),
        slug: params.slug || faq.get('slug'),
      });
      const record = await MongoDbFaqs.model.findById(req.params.faqId);
      sendSuccess(res, { faq: record });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const faq = await MongoDbFaqs.model.findById(req.params.faqId);
      await faq.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new FaqController();
