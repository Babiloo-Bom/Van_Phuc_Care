import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MongoDbServices from '@mongodb/services';

class ServiceController {
  /**
   * Get all active services (for users)
   * GET /api/u/services
   */
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search, category } = req.query;

      const query: any = {
        status: 'active', // Only show active services to users
      };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { descriptions: { $regex: search, $options: 'i' } },
        ];
      }

      if (category) {
        query.category = category;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [services, total] = await Promise.all([
        MongoDbServices.model
          .find(query)
          .select('title slug thumbnail shortDescriptions descriptions price duration status category')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        MongoDbServices.model.countDocuments(query),
      ]);

      return sendSuccess(res, {
        data: services,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error('Error fetching services:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Get user's registered services
   * GET /api/u/services/my-services
   */
  public async myServices(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      // TODO: Implement logic to get services that user has registered
      // For now, return empty array
      // You need to check ServiceRegistration collection or User's registered services

      return sendSuccess(res, {
        data: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          totalPages: 0,
        },
      });
    } catch (error: any) {
      console.error('Error fetching my services:', error);
      return sendError(res, 500, error.message);
    }
  }

  /**
   * Get service detail by slug or ID
   * GET /api/u/services/:id
   */
  public async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const service = await MongoDbServices.model
        .findOne({
          $or: [{ _id: id }, { slug: id }],
          status: 'active',
        })
        .lean();

      if (!service) {
        return sendError(res, 404, 'Service not found');
      }

      return sendSuccess(res, { data: service });
    } catch (error: any) {
      console.error('Error fetching service:', error);
      return sendError(res, 500, error.message);
    }
  }
}

export default new ServiceController();
