import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbUsers from '@mongodb/users';
import bcrypt from 'bcryptjs';
import { BadAuthentication, InvalidOtp, invalidParameter, InvalidPassword, NoData, AccountExists } from '@libs/errors';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import { Document } from 'mongoose';
import MailerService from '@services/mailer';
import dayjs from 'dayjs';

class SessionController {
  public async create (req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await MongoDbUsers.model.findOne({ email: email, status: MongoDbUsers.STATUS_ENUM.ACTIVE });
      if (!user || !await bcrypt.compare(password, user.get('password'))) {
        return sendError(res, 404, BadAuthentication);
      }
      const accessToken = jwt.sign({ id: user.get('_id') }, settings.jwt.userSecret, { expiresIn: settings.jwt.ttl });
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async getCurrentUser (req: Request, res: Response) {
    try {
      const user = req.currentUser;
      sendSuccess(res, { user });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async register (req: Request, res: Response) {
    try {
      const _user = await MongoDbUsers.model.findOne({ email: req.params.email });
      if (_user) {
        sendError(res, 400, AccountExists);
      } else {
        const params = req.parameters.permit(MongoDbUsers.CREATABLE_PARAMETERS).value();
        const salt = bcrypt.genSaltSync();
        const passwordEncode = bcrypt.hashSync(params.password, salt);
        const user = await MongoDbUsers.model.create({
          ...params,
          password: passwordEncode,
          status: MongoDbUsers.STATUS_ENUM.INACTIVE,
        });
        const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
        await user.update({ verifyOtp: otp });
        MailerService.verifyAccountOTP(user.get('email'), otp);
        user.set('verifyOtp', null);
        sendSuccess(res, { user });
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async verifyEmail (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const user = await MongoDbUsers.model.findOne({ email });
      if (!user) {
        return sendError(res, 404, NoData);
      }
      if (otp !== user.get('verifyOtp')) {
        return sendError(res, 400, InvalidOtp);
      }
      await user.update({ status: MongoDbUsers.STATUS_ENUM.ACTIVE, verifyOtp: null });
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async sendBackOtp (req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await MongoDbUsers.model.findOne({ email, status: MongoDbUsers.STATUS_ENUM.PENDING });
      if (!user) {
        return sendError(res, 404, NoData);
      }
      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      await user.update({ verifyOtp: otp });
      MailerService.verifyAccountOTP(user.get('email'), otp);
      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const user: Document = req.currentUser;
      const params = req.parameters.permit(MongoDbUsers.UPDATABLE_PARAMETERS).value();
      await user.update(params);
      const record = await MongoDbUsers.model.findOne({ _id: user.get('_id') });
      sendSuccess(res, { user: record });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async changePassword (req: Request, res: Response) {
    try {
      const user: Document = req.currentUser;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const checkOldPassword = await bcrypt.compare(oldPassword, user.get('password'));
      if (!checkOldPassword) { return sendError(res, 400, InvalidPassword); }
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
      await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode });
      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async forgotPassword (req:Request, res: Response) {
    try {
      const email = req.body.email;
      const user = await MongoDbUsers.model.findOne({ email });
      if (!user) return sendError(res, 404, NoData);
      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
      await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, {
        forgotPasswordToken: otp,
        forgotPasswordExpireAt: expireAt,
      });
      MailerService.sendForgotPasswordOTP(email, otp);
      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async verifyOtp (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const user = await MongoDbUsers.model.findOne({ email });
      if (!user || !user.get('verifyOtp') === otp) return sendError(res, 404, NoData);
      await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, {
        isVerify: true,
        status: 'active',
      });
      const _user = await MongoDbUsers.model.findOne({ email });
      sendSuccess(res, { user: _user });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async resetPassword (req:Request, res:Response) {
    try {
      const { newPassword, confirmPassword, email, token } = req.body;
      const user = await MongoDbUsers.model.findOne({ email });
      if (!user || !(user.get('forgotPasswordToken') === token) || !user.get('forgotPasswordToken')) return sendError(res, 404, NoData);
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
      await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode, status: 'active' });
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new SessionController();
