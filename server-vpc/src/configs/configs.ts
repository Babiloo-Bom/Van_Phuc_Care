import dotenv from 'dotenv';

dotenv.config();

export default {
  esmsConfig: {
    ApiKey: process.env.ESMS_API_KEY,
    SecretKey: process.env.ESMS_SECRET_KEY,
    Brandname: 'FNOTIFY',
    SmsType: '2',
    campaignid: '',
  },
  vnpayConfig: {
    vnp_TmnCode: process.env.VNP_TMNCODE || "VPCTEST1",
    vnp_HashSecret: process.env.VNP_HASHSECRET || "95M6E1P08UICHY6HS515HCXC9ORKNZRF",
    vnp_Url: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: process.env.VNP_RETURN_URL || "http://localhost:3102/vnpay-return",
    vnp_IpnUrl: process.env.IPN_URL || "http://localhost:3000/orders/vnpay/ipn",
  },
  mailerTransporter: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use STARTTLS for port 587
    requireTLS: true, // Require TLS
    auth: {
      user: process.env.SMTP_USER || 'lam.kd@seventh-pitch.com',
      pass: process.env.SMTP_PASS || 'hgfuzyrokxqgrwlk',
    },
  },
};