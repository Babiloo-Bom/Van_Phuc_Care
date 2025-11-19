import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import ServiceRegistrationModels from '@mongodb/service-registrations';

class ServiceRegistrationController {
  // Đăng ký dịch vụ
  public async register(req: Request, res: Response) {
    try {
      const { userId, serviceId } = req.body;
      if (!userId || !serviceId) {
        return sendError(res, 400, 'Missing userId or serviceId');
      }
      const registration = await ServiceRegistrationModels.model.create({ userId, serviceId });
      sendSuccess(res, { registration });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }

  // Lấy danh sách dịch vụ đã đăng ký của user
  public async listRegistered(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return sendError(res, 400, 'Missing userId');
      }
      const registrations = await ServiceRegistrationModels.model.find({ userId }).lean();
      sendSuccess(res, { registrations });
    } catch (error: any) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ServiceRegistrationController();
