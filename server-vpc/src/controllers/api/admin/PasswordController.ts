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

class PasswordController {
  /**
   * Forgot password - Send OTP to email
   * POST /api/a/passwords/forgot_password
   */
  public static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      console.log('🔍 Forgot password request for:', email);
      
      if (!email) {
        return sendError(res, 400, invalidParameter);
      }

      const admin = await MongoDbAdmins.model.findOne({ 
        email: email.toLowerCase().trim(),
        status: MongoDbAdmins.STATUS_ENUM.ACTIVE 
      });
      
      if (!admin) {
        console.log('❌ User not found or not active:', email);
        // Always return success for security (don't reveal if email exists)
        return sendSuccess(res, { message: 'Reset link sent successfully' });
      }

      // Generate reset token
      const resetToken = randomString.generate(64);
      const expireAt = dayjs().add(settings.forgotPasswordTokenExpiresIn || 1, 'day');
      
      // Save reset token to database
      await MongoDbAdmins.model.updateOne(
        { _id: admin.get('_id') }, 
        {
          forgotPasswordToken: resetToken,
          forgotPasswordExpireAt: expireAt,
        }
      );

      // Generate reset link
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3102'}/reset-password?token=${resetToken}`;

      // Send reset link via email
      try {
        await MailerService.sendForgotPasswordLink(email, resetLink);
        console.log('✅ Reset link sent successfully to:', email);
        sendSuccess(res, { message: 'Reset link sent successfully' });
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Still return success for security (don't reveal if email exists)
        sendSuccess(res, { message: 'Reset link sent successfully' });
      }
    } catch (error: any) {
      console.error('❌ Forgot password error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }


  /**
   * Reset password with token
   * POST /api/a/passwords/reset
   */
  public static async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      console.log('🔍 Reset password request with token:', token ? 'exists' : 'missing');
      
      if (!token || !password) {
        return sendError(res, 400, invalidParameter);
      }

      if (password.length < 6) {
        return sendError(res, 400, InvalidPassword);
      }

      const admin = await MongoDbAdmins.model.findOne({ 
        forgotPasswordToken: token,
        status: MongoDbAdmins.STATUS_ENUM.ACTIVE 
      });
      
      if (!admin) {
        console.log('❌ Invalid or expired token');
        return sendError(res, 404, NoData);
      }

      // Check if token is not expired
      const expireAt = admin.get('forgotPasswordExpireAt');
      if (!expireAt || dayjs().isAfter(dayjs(expireAt))) {
        console.log('❌ Token expired');
        return sendError(res, 400, InvalidOtp);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password and clear reset token
      await MongoDbAdmins.model.updateOne(
        { _id: admin.get('_id') }, 
        {
          password: hashedPassword,
          forgotPasswordToken: null,
          forgotPasswordExpireAt: null,
        }
      );

      console.log('✅ Password reset successfully for:', admin.get('email'));
      sendSuccess(res, { message: 'Password reset successfully' });
    } catch (error: any) {
      console.error('❌ Reset password error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default PasswordController;
