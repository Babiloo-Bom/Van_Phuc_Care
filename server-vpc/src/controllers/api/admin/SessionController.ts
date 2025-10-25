import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import MongoDbAdmins from '@mongodb/admins';
import bcrypt from 'bcryptjs';
import { BadAuthentication, InvalidOtp, invalidParameter, InvalidPassword, NoData } from '@libs/errors';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import { Document } from 'mongoose';
import MailerService from '@services/mailer';
import dayjs from 'dayjs';
import randomString from 'randomstring';

class SessionController {
  public static async login (req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      let admin = null;
      admin = await MongoDbAdmins.model.findOne({ email: username, status: MongoDbAdmins.STATUS_ENUM.ACTIVE });
      if (!admin || !await bcrypt.compare(password, admin.get('password'))) {
        return sendError(res, 404, BadAuthentication);
      }
      const accessToken = jwt.sign({ id: admin.get('_id') }, settings.jwt.adminSecret, { expiresIn: settings.jwt.ttl });
      sendSuccess(res, { accessToken, tokenExpireAt: settings.jwt.ttl });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async signup (req: Request, res: Response) {
    try {
      const params = req.body;
      const checkExisted = await MongoDbAdmins.model.findOne({ email: params.email });
      if (!checkExisted && params.email && params.fullname && params.password) {
        const salt = bcrypt.genSaltSync();
        const passwordEncode = bcrypt.hashSync(params.password, salt);
        const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
        const admin = await MongoDbAdmins.model.create({
          ...params,
          email: params.email,
          fullname: params.fullname,
          verified: false,
          password: passwordEncode,
          verifyOtp: otp,
        });
        MailerService.verifyAccountOTP(admin.get('email'), otp);
        sendSuccess(res, { status: true });
      } else {
        sendError(res, 404, BadAuthentication);
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async verifyEmail (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const admin: any = await MongoDbAdmins.model.findOne({ email });
      if (!admin) {
        return sendError(res, 404, NoData);
      }
      if (otp !== admin.get('verifyOtp')) {
        return sendError(res, 400, InvalidOtp);
      }
      await admin.update({ status: MongoDbAdmins.STATUS_ENUM.ACTIVE, verified: true });
      sendSuccess(res, { status: true });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async sendBackOtp (req: Request, res: Response) {
    try {
      const { email } = req.body;
      const admin = await MongoDbAdmins.model.findOne({ email });
      if (!admin) {
        return sendError(res, 404, NoData);
      }
      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      await admin.update({ verifyOtp: otp });
      MailerService.verifyAccountOTP(admin.get('email'), otp);
      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async getCurrentAdmin (req: Request, res: Response) {
    try {
      const admin = req.currentAdmin;
      sendSuccess(res, { admin });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async update (req: Request, res: Response) {
    try {
      const admin: Document = req.currentAdmin;
      const params = req.body;
      await admin.update({
        fullname: params.fullname || req.currentAdmin.fullname,
        firstName: params.firstName || req.currentAdmin.firsName,
        lastName: params.lastName || req.currentAdmin.lastName,
        address: params.address || req.currentAdmin.address,
        avatar: params.avatar || req.currentAdmin.avatar,
        gender: params.gender || req.currentAdmin.gender,
      });
      const record = await MongoDbAdmins.model.findOne({ _id: admin.get('_id') });
      sendSuccess(res, { admin: record });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async changePassword (req: Request, res: Response) {
    try {
      const admin: Document = req.currentAdmin;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const checkOldPassword = await bcrypt.compare(oldPassword, admin.get('password'));
      if (!checkOldPassword) { return sendError(res, 400, InvalidPassword); }
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
      await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, { password: newPasswordEncode });
      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async forgotPassword (req:Request, res: Response) {
    try {
      const email = req.body.email;
      const admin = await MongoDbAdmins.model.findOne({ email });
      if (!admin) return sendError(res, 404, NoData);
      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
      await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, {
        forgotPasswordToken: otp,
        forgotPasswordExpireAt: expireAt,
      });
      MailerService.sendForgotPasswordOTP(email, otp);
      sendSuccess(res, {});
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async verifyOtp (req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      const admin = await MongoDbAdmins.model.findOne({ email });
      if (!admin || !(admin.get('forgotPasswordToken') === otp) || !admin.get('forgotPasswordExpireAt')) return sendError(res, 404, NoData);
      const token = randomString.generate(64);
      await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: null,
      });
      sendSuccess(res, { token });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async resetPassword (req:Request, res:Response) {
    try {
      const { newPassword, confirmPassword, email, token } = req.body;
      const admin = await MongoDbAdmins.model.findOne({ email });
      if (!admin || !(admin.get('forgotPasswordToken') === token) || !admin.get('forgotPasswordToken')) return sendError(res, 404, NoData);
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
      await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, { password: newPasswordEncode });
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default SessionController;
