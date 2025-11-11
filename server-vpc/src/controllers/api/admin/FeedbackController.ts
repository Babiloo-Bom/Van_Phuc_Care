import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbFeedbacks from '@mongodb/feedbacks';
import { NoData } from '@libs/errors';

class BusinessAreasController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.body;
      params.createdBy = MongoDbFeedbacks.CREATED_BY.ADMIN;
      const feedback = await MongoDbFeedbacks.model.create({
        ...params,
        createdBy: MongoDbFeedbacks.CREATED_BY.ADMIN,
        email: null,
        phoneNumber: null,
      });
      sendSuccess(res, { feedback });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { createdBy } = req.query;
      const queryString: any = {
      };
      if (createdBy) {
        Object.assign(queryString, { createdBy: createdBy });
      }
      const feedbacks = await MongoDbFeedbacks.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 });
      const total = await MongoDbFeedbacks.model.find(queryString).countDocuments();
      // Standardized pagination response format
      sendSuccess(res, { 
        data: feedbacks, 
        pagination: { 
          page, 
          pageSize: limit, 
          total 
        } 
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const feedback = await MongoDbFeedbacks.model.findById(req.params.feedbackId);
      if (!feedback) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { feedback });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const feedback = await MongoDbFeedbacks.model.findOne({ _id: req.params.feedbackId, createdBy: MongoDbFeedbacks.CREATED_BY.ADMIN });
      const params = req.body;
      await feedback.update({
        ...params,
      });
      const record = await MongoDbFeedbacks.model.findById(req.params.feedbackId);
      sendSuccess(res, { record });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const feedback = await MongoDbFeedbacks.model.findById(req.params.feedbackId);
      await feedback.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new BusinessAreasController();
