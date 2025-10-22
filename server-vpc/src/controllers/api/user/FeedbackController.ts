import MongoDbService from '@mongodb/services';
import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbFeedbackReview from '@mongodb/feedbacks';

class FeedbackController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      const feedback = await MongoDbFeedbackReview.model.create({
        ...params,
        avatar: params.avatar ? params.avatar : null,
        position: params.position ? params.position : null,
        createdBy: 'customer',
        status: 'inactive',
      });
      if (params.serviceId) {
        await MongoDbService.updateNumberReview(params.serviceId, 1);
      }
      sendSuccess(res, { feedback });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const limit = req.query.limit;
      const { serviceId, id, courseId } = req.query;
      const queryString: any = {
        status: 'active',
      };
      if (serviceId) {
        Object.assign(queryString, { serviceId });
      }
      if (id) {
        Object.assign(queryString, { 'product._id': id });
      }
      if (courseId) {
        Object.assign(queryString, { courseId });
      }
      const feedbacks = await MongoDbFeedbackReview.model.find(queryString).select({
        createdAt: 0,
        _id: 0,
      }).limit(Number(limit) || 20).sort({ createdAt: -1 });
      sendSuccess(res, { feedbacks });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const queryString: any = {
        status: 'verified',
        'product._id': req.query.id,
      };
      const feedbacks = await MongoDbFeedbackReview.model.find(queryString).select({
        avatar: 1,
        content: 1,
        fullname: 1,
        position: 1,
        _id: 0,
      }).sort({ createdAt: -1 });
      sendSuccess(res, { feedbacks });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new FeedbackController();
