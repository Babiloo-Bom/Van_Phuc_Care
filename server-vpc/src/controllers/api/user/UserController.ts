import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbUsers from '@mongodb/users';
import { NoData } from '@libs/errors';

class UserController {
  public async show (req: Request, res: Response) {
    try {
      const user = await MongoDbUsers.model.findById(req.params.userId);
      if (!user) {
        return sendError(res, 404, NoData);
      }
      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new UserController();
