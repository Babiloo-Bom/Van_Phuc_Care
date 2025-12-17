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
      const { username, password, remindAccount } = req.body;
      
      console.log('🔍 Admin login request:', { 
        username, 
        hasPassword: !!password, 
        passwordType: typeof password,
        passwordLength: password?.length,
        remindAccount 
      });
      
      // Validate input
      if (!username || !password) {
        console.warn('⚠️ Missing username or password');
        return sendError(res, 400, 'Email và mật khẩu là bắt buộc');
      }
      
      // Ensure password is a string
      const passwordStr = String(password).trim();
      if (!passwordStr) {
        console.warn('⚠️ Password is empty after trim');
        return sendError(res, 400, 'Mật khẩu không được để trống');
      }
      
      let admin = null;
      // Check both status and isActive for admin login
      admin = await MongoDbAdmins.model.findOne({ 
        email: username, 
        status: MongoDbAdmins.STATUS_ENUM.ACTIVE,
        isActive: { $ne: false } // isActive should not be false (allow true or undefined)
      });
      
      if (!admin) {
        console.warn('⚠️ Admin not found or inactive:', username);
        return sendError(res, 404, BadAuthentication);
      }
      
      // Double check isActive field explicitly
      const adminIsActive = admin.get('isActive');
      if (adminIsActive === false) {
        console.warn('⚠️ Admin account is deactivated (isActive = false):', username);
        return sendError(res, 403, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
      }
      
      // Check if admin has password
      const storedPassword = admin.get('password');
      console.log('🔍 Stored password check:', { 
        hasStoredPassword: !!storedPassword,
        storedPasswordType: typeof storedPassword,
        storedPasswordLength: storedPassword?.length 
      });
      
      if (!storedPassword || typeof storedPassword !== 'string') {
        console.warn('⚠️ Admin has no password or password is not a string');
        return sendError(res, 404, BadAuthentication);
      }
      
      // Compare password
      const isPasswordValid = await bcrypt.compare(passwordStr, storedPassword);
      if (!isPasswordValid) {
        console.warn('⚠️ Password mismatch for:', username);
        return sendError(res, 404, BadAuthentication);
      }
      
      console.log('✅ Login successful for:', username);
      const accessToken = jwt.sign({ id: admin.get('_id') }, settings.jwt.adminSecret, { expiresIn: settings.jwt.ttl });
      const timestampNow = Date.now()
      const tokenExpireAt = new Date(timestampNow + settings.jwt.ttl)
      sendSuccess(res, { accessToken, tokenExpireAt });
    } catch (error: any) {
      console.error('❌ Admin login error:', error);
      console.error('❌ Error stack:', error.stack);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async signup (req: Request, res: Response) {
    try {
      const params = req.body;
      // Chỉ kiểm tra user đã được xác thực, bỏ qua user chưa xác thực
      const checkExisted = await MongoDbAdmins.model.findOne({ 
        email: params.email, 
        status: { $ne: MongoDbAdmins.STATUS_ENUM.PENDING_VERIFICATION } 
      });
      
      // Xóa tất cả user cũ với email này (cả verified và pending)
      const existingUsers = await MongoDbAdmins.model.find({ email: params.email });
      if (existingUsers.length > 0) {
        await MongoDbAdmins.model.deleteMany({ email: params.email });
      }
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
          status: MongoDbAdmins.STATUS_ENUM.PENDING_VERIFICATION, // Status đặc biệt cho user chưa xác thực
        });
        try {
          await MailerService.verifyAccountOTP(admin.get('email'), otp);
        } catch (emailError) {
        }
        sendSuccess(res, { status: true });
      } else {
        if (checkExisted) {
          return sendError(res, 400, 'Email đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.');
        } else {
          return sendError(res, 400, 'Vui lòng điền đầy đủ thông tin bắt buộc.');
        }
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
      
      const storedOtp = admin.get('verifyOtp');
      
      if (otp !== storedOtp) {
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
      
      if (!admin) {
        return sendError(res, 404, NoData);
      }
      
      // Check for registration OTP (verifyOtp field)
      if (admin.get('verifyOtp') === otp) {
          await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, {
          verified: true,
          verifyOtp: null, // Clear OTP after verification
        });
        return sendSuccess(res, { message: 'Email verified successfully', verified: true });
      }
      
      // Check for forgot password OTP (forgotPasswordToken field)
      if (admin.get('forgotPasswordToken') === otp && admin.get('forgotPasswordExpireAt')) {
        const token = randomString.generate(64);
        await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, {
          forgotPasswordToken: token,
          forgotPasswordExpireAt: null,
        });
        return sendSuccess(res, { token });
      }
      
      return sendError(res, 404, NoData);
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
