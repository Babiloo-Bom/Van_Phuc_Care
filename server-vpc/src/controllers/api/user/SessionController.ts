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
      
      // Convert TTL to proper format for jwt.sign
      const jwtTtl = settings.jwt.ttl;
      let ttlString: string;
      if (typeof jwtTtl === 'string') {
        ttlString = jwtTtl;
      } else if (typeof jwtTtl === 'number') {
        const days = Math.floor(jwtTtl / (1000 * 60 * 60 * 24));
        ttlString = `${days}d`;
      } else {
        ttlString = '7d';
      }
      
      // Calculate tokenExpireAt
      let ttlMs: number;
      if (typeof jwtTtl === 'number') {
        ttlMs = jwtTtl;
      } else if (typeof jwtTtl === 'string') {
        const ttlStr: string = jwtTtl;
        const match = ttlStr.match(/^(\d+)([dhms])$/);
        if (match) {
          const value = parseInt(match[1]);
          const unit = match[2];
          const multipliers: Record<string, number> = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000
          };
          ttlMs = value * (multipliers[unit] || 86400000);
        } else {
          ttlMs = 7 * 24 * 60 * 60 * 1000;
        }
      } else {
        ttlMs = 7 * 24 * 60 * 60 * 1000;
      }
      
      const accessToken = jwt.sign({ id: userAnyStatus.get('_id') }, settings.jwt.userSecret, { expiresIn: ttlString });
      const timestampNow = Date.now();
      const tokenExpireAt = new Date(timestampNow + ttlMs);
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
      // Check if email already exists
      const _user = await MongoDbUsers.model.findOne({ email: req.body.email });
      if (_user) {
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
      await user.updateOne({ verifyOtp: otp });
      
      // Get source from request body to determine which site the user registered from
      const source = req.body.source || 'elearning';
      
      try {
        await MailerService.verifyAccountOTP(user.get('email'), otp, source, user.get('fullname'));
        console.log('✅ Verification email sent to:', user.get('email'));
      } catch (mailErr) {
        console.error('❌ Failed to send verification email:', mailErr);
        // Continue with registration even if email fails
      }
      
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
      
      // Convert TTL to proper format for jwt.sign
      const jwtTtl = settings.jwt.ttl;
      let ttlString: string;
      if (typeof jwtTtl === 'string') {
        ttlString = jwtTtl;
      } else if (typeof jwtTtl === 'number') {
        const days = Math.floor(jwtTtl / (1000 * 60 * 60 * 24));
        ttlString = `${days}d`;
      } else {
        ttlString = '7d';
      }
      
      // Calculate tokenExpireAt
      let ttlMs: number;
      if (typeof jwtTtl === 'number') {
        ttlMs = jwtTtl;
      } else if (typeof jwtTtl === 'string') {
        const ttlStr: string = jwtTtl;
        const match = ttlStr.match(/^(\d+)([dhms])$/);
        if (match) {
          const value = parseInt(match[1]);
          const unit = match[2];
          const multipliers: Record<string, number> = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000
          };
          ttlMs = value * (multipliers[unit] || 86400000);
        } else {
          ttlMs = 7 * 24 * 60 * 60 * 1000;
        }
      } else {
        ttlMs = 7 * 24 * 60 * 60 * 1000;
      }
      
      const accessToken = jwt.sign({ id: user.get('_id') }, settings.jwt.userSecret, { expiresIn: ttlString });
      const timestampNow = Date.now();
      const tokenExpireAt = new Date(timestampNow + ttlMs);
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
        baseUrl = process.env.BASE_URL_CRM || process.env.FRONTEND_URL || 'https://my.vanphuccare.vn';
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
      
      if (!user) {
        return sendError(res, 404, NoData);
      }
      
      // Check for forgot password OTP (forgotPasswordToken field)
      const storedForgotPasswordToken = user.get('forgotPasswordToken');
      if (storedForgotPasswordToken && storedForgotPasswordToken === otp) {
        // Check if token expired
        const expireAt = user.get('forgotPasswordExpireAt');
        if (expireAt && dayjs().isAfter(dayjs(expireAt))) {
          return sendError(res, 400, InvalidOtp);
        }
        // OTP is valid for password reset - don't clear it yet, let resetPassword handle that
        return sendSuccess(res, { user, verified: true, type: 'forgot_password' });
      }
      
      // Check for registration OTP (verifyOtp field)
      const storedVerifyOtp = user.get('verifyOtp');
      if (storedVerifyOtp && storedVerifyOtp === otp) {
        await MongoDbUsers.model.updateOne({ _id: user.get('_id') }, {
          isVerify: true,
          status: 'active',
          verifyOtp: null, // Clear OTP after verification
        });
        const _user = await MongoDbUsers.model.findOne({ email });
        return sendSuccess(res, { user: _user, verified: true, type: 'registration' });
      }
      
      // OTP doesn't match any stored OTP
      return sendError(res, 400, InvalidOtp);
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
