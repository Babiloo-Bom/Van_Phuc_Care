import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbUsers from '@mongodb/users';
import { NoData } from '@libs/errors';
import bcrypt from 'bcryptjs';

class UserController {
  public async index (req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string || '1');
      const limit = parseInt(req.query.limit as string || '12');
      const offset = (page - 1) * limit;
      const { gender, phoneNumber, email, fullname } = req.query;
      const queryString: any = {};
      if (gender) {
        queryString.gender = gender;
      }
      if (phoneNumber) {
        queryString.phoneNumber = { $regex: phoneNumber };
      }
      if (email) {
        queryString.email = { $regex: email };
      }
      if (fullname) {
        queryString.fullname = { $regex: fullname };
      }
      const users = await MongoDbUsers.model.find(queryString).skip(offset).limit(limit).sort({ createdAt: -1 });
      const total = await MongoDbUsers.model.find(queryString).countDocuments();
      sendSuccess(res, { users, pagination: { total, page, limit } });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

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

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(MongoDbUsers.CREATABLE_PARAMETERS).value();
      const salt = bcrypt.genSaltSync();
      const passwordEncode = bcrypt.hashSync(params.password, salt);
      const user = await MongoDbUsers.model.create({
        ...params,
        password: passwordEncode,
      });
      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const user = await MongoDbUsers.model.findById(req.params.userId);
      if (!user) {
        return sendError(res, 404, NoData);
      }
      const params = req.parameters.permit(MongoDbUsers.ADMIN_UPDATABLE_PARAMETERS).value();
      if (params.password && !(await bcrypt.compare(params.password, user.get('password')))) {
        const salt = bcrypt.genSaltSync();
        const passwordEncode = bcrypt.hashSync(params.password, salt);
        params.password = passwordEncode;
      }
      await user.update(params);
      const record = await MongoDbUsers.model.findOne({ _id: user.get('_id') });
      sendSuccess(res, { user: record });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const user = await MongoDbUsers.model.findById(req.params.userId);
      if (!user) {
        return sendError(res, 404, NoData);
      }
      await user.delete();
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new UserController();
