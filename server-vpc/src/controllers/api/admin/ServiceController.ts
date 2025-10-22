import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbService from '@mongodb/services';
import MongoDbFeedbacks from '@mongodb/feedbacks';
import { NoData } from '@libs/errors';

class ServiceController {
  public async create (req: Request, res: Response) {
    try {
      if (req.currentAdmin.role === 'manager') {
        const admin = req.currentAdmin;
        const body = req.body;
        const checkExistSlug = await MongoDbService.model.findOne({ slug: body.slug });
        if (checkExistSlug) {
          return sendError(res, 401, 'Đường dẫn đã tồn tại');
        }
        const service = await MongoDbService.model.create({ ...body, origin: admin.domain });
        sendSuccess(res, { service });
      } else {
        sendError(res, 404, NoData);
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '20');
      const offset = (page - 1) * limit;
      const { searchKey } = req.query;
      const queryString: any = {
        origin: req.currentAdmin.domain,
      };
      if (searchKey) {
        Object.assign(queryString, {
          $or: [
            { title: { $regex: searchKey, $options: 'i' } },
          ],
        });
      }
      const [services, total] = await Promise.all([
        MongoDbService.model.find(queryString)
          .select({ updatedAt: 0, descriptions: 0, origin: 0, progress: 0, content: 0, implementer: 0 })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        MongoDbService.model.countDocuments(queryString),
      ]);
      sendSuccess(res, { pagination: { total, page, limit }, services });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const service = await MongoDbService.model.findOne({
        $or: [
          { target: req.params.id },
          { slug: req.params.id },
        ],
        origin: req.currentAdmin.domain,
      }).lean();
      if (!service) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { service });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const service: any = await MongoDbService.model.findById(req.params.id);
      if (!service) {
        return sendError(res, 404, NoData);
      }
      if (service.status === 'active' && req.params.status === 'inactive') {
        await MongoDbService.updateNumberReview(req.params.id, -1);
      } else if (service.status === 'inactive' && req.params.status === 'active') {
        await MongoDbService.updateNumberReview(req.params.id, 1);
      }
      await service.update({
        ...req.body,
        origin: req.currentAdmin.domain,
      });
      const result = await MongoDbService.model.findById(req.params.id);
      sendSuccess(res, { service: result });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      if (req.currentAdmin.role !== 'manager') {
        sendError(res, 400, NoData);
      }
      await MongoDbService.model.deleteMany({ _id: { $in: req.body.ids } });
      await MongoDbFeedbacks.model.deleteMany({ serviceId: { $in: req.body.ids } });
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ServiceController();
