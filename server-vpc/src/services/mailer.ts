import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import configs from '@configs/configs';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';
import settings from '@configs/settings';

class MailerService {
  public static async sendForgotPasswordOTP (email: string, otp: string) {
    const mailerOptions: Mail.Options = {
      to: email,
      subject: '[Hệ thống] Xác nhận quên mật khẩu',
    };
    const templateArgs: any = {
      expireTime: settings.otpTtl,
      otp,
    };
    await this.sendMail(mailerOptions, 'forgotPasswordMailer', templateArgs);
  }

  public static async sendForgotPasswordLink (email: string, resetLink: string) {
    const mailerOptions: Mail.Options = {
      to: email,
      subject: '[Van Phuc Care] Đặt lại mật khẩu',
    };
    const templateArgs: any = {
      resetLink,
      expireTime: '24 giờ',
    };
    await this.sendMail(mailerOptions, 'forgotPasswordLink', templateArgs);
  }

  public static async verifyAccountOTP (email: string, otp: string, source?: string) {
    const mailerOptions: Mail.Options = {
      to: email,
      subject: '[Hệ thống] Xác thực email',
    };
    
    // Determine base URL based on source - must be set in environment variables
    let baseUrl: string;
    if (source === 'crm') {
      baseUrl = process.env.BASE_URL_CRM || 'http://crm.vanphuccare.com';
    } else if (source === 'admin') {
      baseUrl = process.env.BASE_URL_ADMIN || 'http://admin.vanphuccare.com';
    } else {
      // default to elearning
      baseUrl = process.env.BASE_URL_ELEARNING || 'http://elearning.vanphuccare.com';
    }
    
    if (!baseUrl) {
      console.warn(`⚠️ BASE_URL for source "${source}" is not set in environment variables`);
    }
    
    const templateArgs: any = {
      expireTime: settings.otpTtl,
      otp,
      linkOtp: `${baseUrl}/verify-otp?otp=${otp}&email=${encodeURIComponent(email)}`
    };
    await this.sendMail(mailerOptions, 'verifyAccount', templateArgs);
  }

  private static async sendMail (args: Mail.Options, templateName: string, templateArgs: any = {}) {
    try {
      const transporter = nodemailer.createTransport(configs.mailerTransporter);
      
      // Verify connection configuration
      await transporter.verify();
      console.log('✅ SMTP connection verified');
      
      const templateSrc = path.join(__dirname, `../../views/mailer/${templateName}.hbs`);
      const template = handlebars.compile(fs.readFileSync(templateSrc, 'utf-8'));
      const html = template(templateArgs);
      args.html = html;

      const result = await transporter.sendMail(args);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }
}

export default MailerService;
