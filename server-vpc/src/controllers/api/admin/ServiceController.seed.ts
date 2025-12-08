import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbService from '@mongodb/services';
import { NoData } from '@libs/errors';

class ServiceControllerSeed {
  public async seedServices(req: Request, res: Response) {
    try {
      const services = req.body.services;
      if (!Array.isArray(services)) {
        return sendError(res, 400, "Invalid services data");
      }
      const result = await MongoDbService.model.insertMany(services);
      sendSuccess(res, { inserted: result.length });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async deleteAllServices(req: Request, res: Response) {
    try {
      const result = await MongoDbService.model.deleteMany({});
      sendSuccess(res, { deleted: result.deletedCount });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new ServiceControllerSeed();
