import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MongoDbServices from '@mongodb/services';
import MongoDbServiceRegistrations from '@mongodb/service-registrations';
class ServiceController {
  /**
   * Get all active services (for users)
   * GET /api/u/services
   */
  public async index(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search, category } = req.query;
      const userId = (req as any).user?.id || (req as any).user?._id;

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
          .select('title slug thumbnail shortDescriptions descriptions price duration status category link')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        MongoDbServices.model.countDocuments(query),
      ]);

      // If user is logged in, check which services they have registered
      let servicesWithRegistration = services;
      if (userId) {
        console.log('User ID for service check:', userId);
        const registrations = await MongoDbServiceRegistrations.model
          .find({ userId: userId.toString(), status: 'registered' })
          .select('serviceId')
          .lean();
        
        console.log('Registrations found:', registrations);
        const registeredServiceIds = new Set(registrations.map((r: any) => r.serviceId));
        console.log('Registered service IDs:', Array.from(registeredServiceIds));
        
        servicesWithRegistration = services.map((service: any) => {
          const serviceIdStr = service._id.toString();
          const isReg = registeredServiceIds.has(serviceIdStr);
          console.log(`Service ${service.title} (${serviceIdStr}): isRegistered = ${isReg}`);
          return {
            ...service,
            isRegistered: isReg,
          };
        });
      } else {
        console.log('No userId found, user not logged in');
        // Add isRegistered: false for all services when user is not logged in
        servicesWithRegistration = services.map((service: any) => ({
          ...service,
          isRegistered: false,
        }));
      }

      return sendSuccess(res, {
        data: servicesWithRegistration,
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

      const registrations: any[] = await MongoDbServiceRegistrations.model
        .find({ userId: userId.toString(), status: 'registered' })
        .select('serviceId createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await MongoDbServiceRegistrations.model.countDocuments({ 
        userId: userId.toString(), 
        status: 'registered' 
      });

      if (registrations.length === 0) {
        return sendSuccess(res, {
          data: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            totalPages: 0,
          },
        });
      }

      // Get service details for registered services
      const serviceIds = registrations.map((r: any) => r.serviceId);
      const services = await MongoDbServices.model
        .find({ 
          _id: { $in: serviceIds },
          status: 'active' 
        })
        .select('title slug thumbnail shortDescriptions descriptions price duration status category link')
        .lean();

      // Map services with registration info
      const servicesWithRegistration = services.map((service: any) => ({
        ...service,
        isRegistered: true,
        registeredAt: registrations.find((r: any) => r.serviceId === service._id.toString())?.createdAt,
      }));

      return sendSuccess(res, {
        data: servicesWithRegistration,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
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

  /**
   * Register for a service
   * POST /api/u/services/register
   */
  public async register(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { serviceId, customerName, customerPhone, customerEmail, address, notes } = req.body;

      if (!serviceId) {
        return sendError(res, 400, 'Service ID is required');
      }

      // Check if service exists and is active
      const service = await MongoDbServices.model.findOne({
        _id: serviceId,
        status: 'active',
      });

      if (!service) {
        return sendError(res, 404, 'Service not found or inactive');
      }

      // Check if user already registered for this service
      const existingRegistration = await MongoDbServiceRegistrations.model.findOne({
        userId: userId.toString(),
        serviceId: serviceId,
        status: 'registered',
      });

      if (existingRegistration) {
        return sendError(res, 400, 'Bạn đã đăng ký dịch vụ này rồi');
      }

      // Create registration
      const registration = await MongoDbServiceRegistrations.model.create({
        userId: userId.toString(),
        serviceId,
        customerName,
        customerPhone,
        customerEmail,
        address,
        notes,
        status: 'registered',
      });

      return sendSuccess(res, {
        message: 'Đăng ký dịch vụ thành công',
        data: registration,
      });
    } catch (error: any) {
      console.error('Error registering service:', error);
      return sendError(res, 500, error.message);
    }
  }
}

export default new ServiceController();
