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
      
      if (!email) {
        return sendError(res, 400, invalidParameter);
      }

      const admin = await MongoDbAdmins.model.findOne({ 
        email: email.toLowerCase().trim(),
        status: MongoDbAdmins.STATUS_ENUM.ACTIVE 
      });
      
      if (!admin) {
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

      // Generate reset link (per-site): prefer request Origin, then ENV
      const origin = (req.get('origin') || req.headers['x-forwarded-host'] as string || '').toString()
      const baseFrontend = (origin ? (origin.startsWith('http') ? origin : `http://${origin}`) : process.env.FRONTEND_URL || '').replace(/\/$/, '')
      const resetBase = baseFrontend || process.env.FRONTEND_URL || ''
      const resetLink = `${resetBase}/reset-password?token=${resetToken}`;

      // Send reset link via email
      try {
        await MailerService.sendForgotPasswordLink(email, resetLink);
        sendSuccess(res, { message: 'Reset link sent successfully' });
      } catch (emailError) {
        // Still return success for security (don't reveal if email exists)
        sendSuccess(res, { message: 'Reset link sent successfully' });
      }
    } catch (error: any) {
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
        return sendError(res, 404, NoData);
      }

      // Check if token is not expired
      const expireAt = admin.get('forgotPasswordExpireAt');
      if (!expireAt || dayjs().isAfter(dayjs(expireAt))) {
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

      sendSuccess(res, { message: 'Password reset successfully' });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default PasswordController;
