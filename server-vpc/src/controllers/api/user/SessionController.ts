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
      const { email, password, username } = req.body;
      
      // First check if user exists (regardless of status)
      const userAnyStatus = await MongoDbUsers.model.findOne({ email: email || username });
      if (!userAnyStatus) {
        return sendError(res, 404, BadAuthentication);
      }
      
      // Check if user is active
      if (userAnyStatus.get('status') !== MongoDbUsers.STATUS_ENUM.ACTIVE) {
        return sendError(res, 404, BadAuthentication);
      }
      
      // Check password
      const storedPassword = userAnyStatus.get('password');
      if (!storedPassword) {
        return sendError(res, 404, BadAuthentication);
      }
      
      const isPasswordValid = await bcrypt.compare(password, storedPassword);
      
      if (!isPasswordValid) {
        return sendError(res, 404, BadAuthentication);
      }
      
      const accessToken = jwt.sign({ id: userAnyStatus.get('_id') }, settings.jwt.userSecret, { expiresIn: settings.jwt.ttl });
      const timestampNow = Date.now()
      const tokenExpireAt = new Date(timestampNow + settings.jwt.ttl)
      sendSuccess(res, { accessToken, tokenExpireAt: tokenExpireAt, id: userAnyStatus.get('_id') as string });
    } catch (error: any) {
      console.error('❌ Login error:', error);
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
      const { email } = req.body;
      // Kiểm tra trùng email
      const existedEmail = await MongoDbUsers.model.findOne({ email });
      if (existedEmail) {
        return sendError(res, 400, AccountExists);
      }
      const params = req.parameters.permit(MongoDbUsers.CREATABLE_PARAMETERS).value();
      const salt = bcrypt.genSaltSync();
      const passwordEncode = bcrypt.hashSync(params.password, salt);
      const user = await MongoDbUsers.model.create({
        ...params,
        password: passwordEncode,
        status: MongoDbUsers.STATUS_ENUM.INACTIVE,
      });
      // Generate OTP and send verification email
      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      await user.update({ verifyOtp: otp });
      // Get source from request body to determine which site the user registered from
      const source = req.body.source || "elearning";
      MailerService.verifyAccountOTP(user.get("email"), otp, source);
      user.set("verifyOtp", null);
      sendSuccess(res, { user });
    } catch (error: any) {
      console.log("register", error)
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
      const accessToken = jwt.sign({ id: user.get('_id') }, settings.jwt.userSecret, { expiresIn: settings.jwt.ttl });
      const timestampNow = Date.now()
      const tokenExpireAt = new Date(timestampNow + settings.jwt.ttl)
      sendSuccess(res, { 
        accessToken, 
        tokenExpireAt: tokenExpireAt, 
        id: user.get('_id') as string,
        username: user.get('email'),
        fullname: user.get('fullname'),
        email: user.get('email'),
       });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async sendBackOtp (req: Request, res: Response) {
    try {
      const { email, source } = req.body;
      const user = await MongoDbUsers.model.findOne({ email, status: MongoDbUsers.STATUS_ENUM.PENDING });
      if (!user) {
        return sendError(res, 404, NoData);
      }
      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      await user.update({ verifyOtp: otp });
      MailerService.verifyAccountOTP(user.get('email'), otp, source || 'elearning');
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
      if (!email) return sendError(res, 400, invalidParameter);

      const user = await MongoDbUsers.model.findOne({ email });
      // For security, do not reveal whether the email exists; still return success
      if (!user) {
        return sendSuccess(res, {});
      }

      const otp = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
      const expireAt = dayjs().add(settings.forgotPasswordTokenExpiresIn || 1, 'day');
      await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, {
        forgotPasswordToken: otp,
        forgotPasswordExpireAt: expireAt,
      });

      // Determine base frontend URL per-site (same approach as registration email)
      const source = (req.body.source || 'elearning').toString();
      let baseUrl: string;
      if (source === 'crm') {
        baseUrl = process.env.BASE_URL_CRM || process.env.FRONTEND_URL || 'http://crm.vanphuccare.com';
      } else if (source === 'admin') {
        baseUrl = process.env.BASE_URL_ADMIN || process.env.FRONTEND_URL || 'http://admin.vanphuccare.com';
      } else {
        baseUrl = process.env.BASE_URL_ELEARNING || process.env.FRONTEND_URL || 'http://elearning.vanphuccare.com';
      }
      baseUrl = baseUrl.replace(/\/$/, '');
      const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

      try {
        await MailerService.sendForgotPasswordLink(email, resetLink);
      } catch (mailErr) {
        // log but don't fail
        console.warn('Failed to send reset link email:', mailErr);
      }

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
      // Check if token expired
      const expireAt = user.get('forgotPasswordExpireAt');
      if (!expireAt || dayjs().isAfter(dayjs(expireAt))) {
        return sendError(res, 400, InvalidOtp);
      }
      if (!newPassword || newPassword !== confirmPassword) { return sendError(res, 400, invalidParameter); }
      const salt = bcrypt.genSaltSync();
      const newPasswordEncode = bcrypt.hashSync(newPassword, salt);
      await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, { password: newPasswordEncode, status: 'active', forgotPasswordToken: null, forgotPasswordExpireAt: null });
      sendSuccess(res, { });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  public async logout (req: Request, res: Response) {
    try {
      // In a stateless JWT system, logout is handled client-side by removing the token
      // This endpoint exists for consistency and future session management if needed
      sendSuccess(res, { message: 'Logout successful' });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new SessionController();
