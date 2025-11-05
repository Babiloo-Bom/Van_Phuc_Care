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
      console.log('🔐 Login request:', { username, hasPassword: !!password });
      
      let admin = null;
      admin = await MongoDbAdmins.model.findOne({ email: username, status: MongoDbAdmins.STATUS_ENUM.ACTIVE });
      console.log('🔍 Found admin:', admin ? `Yes (${admin.get('email')})` : 'No');
      
      if (!admin || !await bcrypt.compare(password, admin.get('password'))) {
        console.log('❌ Login failed:', !admin ? 'User not found or not active' : 'Password mismatch');
        return sendError(res, 404, BadAuthentication);
      }
      
      const accessToken = jwt.sign({ id: admin.get('_id') }, settings.jwt.adminSecret, { expiresIn: settings.jwt.ttl });
      const timestampNow = Date.now()
      const tokenExpireAt = new Date(timestampNow + settings.jwt.ttl)
      console.log('✅ Login successful for:', username);
      sendSuccess(res, { accessToken, tokenExpireAt });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  public static async signup (req: Request, res: Response) {
    try {
      const params = req.body;
      console.log('📝 Signup request:', { email: params.email, fullname: params.fullname, hasPassword: !!params.password });
      // Chỉ kiểm tra user đã được xác thực, bỏ qua user chưa xác thực
      const checkExisted = await MongoDbAdmins.model.findOne({ 
        email: params.email, 
        status: { $ne: MongoDbAdmins.STATUS_ENUM.PENDING_VERIFICATION } 
      });
      
      // Xóa tất cả user cũ với email này (cả verified và pending)
      const existingUsers = await MongoDbAdmins.model.find({ email: params.email });
      if (existingUsers.length > 0) {
        console.log('🔄 Found existing users, deleting all:', existingUsers.length, 'users for email:', params.email);
        await MongoDbAdmins.model.deleteMany({ email: params.email });
      }
      console.log('🔍 Check existed:', checkExisted ? 'User exists' : 'New user');
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
          console.log('✅ Email OTP sent successfully to:', admin.get('email'));
        } catch (emailError) {
          console.log('⚠️ Email sending failed, but user created successfully');
          console.log('📧 OTP Code (for manual verification):', otp);
          console.log('Email error:', emailError);
        }
        console.log('✅ Signup success:', admin.get('email'));
        sendSuccess(res, { status: true });
      } else {
        if (checkExisted) {
          console.log('❌ Signup failed - user already exists:', params.email);
          return sendError(res, 400, 'Email đã được sử dụng. Vui lòng sử dụng email khác hoặc đăng nhập.');
        } else {
          console.log('❌ Signup failed - validation:', { 
            checkExisted: !!checkExisted, 
            email: !!params.email, 
            fullname: !!params.fullname, 
            password: !!params.password 
          });
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
      console.log('🔍 Verify email request:', { email, otp });
      
      const admin: any = await MongoDbAdmins.model.findOne({ email });
      if (!admin) {
        console.log('❌ User not found:', email);
        return sendError(res, 404, NoData);
      }
      
      const storedOtp = admin.get('verifyOtp');
      console.log('🔍 Stored OTP:', storedOtp, 'Received OTP:', otp);
      
      if (otp !== storedOtp) {
        console.log('❌ OTP mismatch');
        return sendError(res, 400, InvalidOtp);
      }
      
      await admin.update({ status: MongoDbAdmins.STATUS_ENUM.ACTIVE, verified: true });
      console.log('✅ Email verification successful for:', admin.get('email'));
      sendSuccess(res, { status: true });
    } catch (error: any) {
      console.log('❌ Verify email error:', error);
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
      console.log('🔍 Verifying OTP for:', email, 'OTP:', otp);
      const admin = await MongoDbAdmins.model.findOne({ email });
      
      if (!admin) {
        console.log('❌ User not found');
        return sendError(res, 404, NoData);
      }
      
      // Check for registration OTP (verifyOtp field)
      if (admin.get('verifyOtp') === otp) {
        console.log('✅ Registration OTP verified');
        await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, {
          verified: true,
          verifyOtp: null, // Clear OTP after verification
        });
        return sendSuccess(res, { message: 'Email verified successfully', verified: true });
      }
      
      // Check for forgot password OTP (forgotPasswordToken field)
      if (admin.get('forgotPasswordToken') === otp && admin.get('forgotPasswordExpireAt')) {
        console.log('✅ Forgot password OTP verified');
        const token = randomString.generate(64);
        await MongoDbAdmins.model.updateOne({ _id: admin.get('_id') }, {
          forgotPasswordToken: token,
          forgotPasswordExpireAt: null,
        });
        return sendSuccess(res, { token });
      }
      
      console.log('❌ Invalid OTP');
      return sendError(res, 404, NoData);
    } catch (error: any) {
      console.log('❌ Verify OTP error:', error);
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
