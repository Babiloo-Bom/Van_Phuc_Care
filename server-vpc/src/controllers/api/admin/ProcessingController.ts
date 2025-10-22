import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbProcessing from '@mongodb/processings';
import { NoData } from '@libs/errors';

class ProcessingController {
  public async show (req: Request, res: Response) {
    try {
      if (!req.query.origin) {
        return sendError(res, 404, NoData);
      }
      const processing = await MongoDbProcessing.model.findOne({
        targetId: req.params.targetId,
        origin: req.currentAdmin.domain,
        accountId: req.currentAdmin._id.toString(),
      });
      if (!processing) {
        return sendSuccess(res, { processing: { percent: 0 } });
      }
      sendSuccess(res, { processing });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new ProcessingController();
