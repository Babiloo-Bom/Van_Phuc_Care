import dotenv from 'dotenv';

dotenv.config();

export default {
  esmsConfig: {
    ApiKey: process.env.ESMS_API_KEY,
    SecretKey: process.env.ESMS_SECRET_KEY,
    Brandname: "FNOTIFY",
    SmsType: "2",
    campaignid: "",
  },
  vnpayConfig: {
    vnp_TmnCode: process.env.VNP_TMNCODE || "VPCTEST1",
    vnp_HashSecret: process.env.VNP_HASHSECRET || "95M6E1P08UICHY6HS515HCXC9ORKNZRF",
    vnp_Url: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_ReturnUrl: process.env.VNP_RETURN_URL || "http://localhost:3102/vnpay-return",
    vnp_IpnUrl: process.env.IPN_URL || "http://localhost:3000/orders/vnpay/ipn",
  },
  sepayConfig: {
    apiToken: process.env.SEPAY_API_TOKEN || "GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK",
    qrApiUrl: process.env.SEPAY_QR_API_URL || "https://qr.sepay.vn/qr-mbbank.html",
    apiBaseUrl: process.env.SEPAY_API_BASE_URL || "https://api.sepay.vn",
    bankCode: "MB",
    accountNo: process.env.SEPAY_ACCOUNT_NO || "655123456888",
    accountName: process.env.SEPAY_ACCOUNT_NAME || "Công Ty TNHH Vạn Phúc Care",
    webhookUrl: process.env.SEPAY_WEBHOOK_URL || "http://localhost:3000/api/u/orders/payment/sepay-webhook",
  },
  mailerTransporter: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    // Port 465 uses implicit TLS (secure=true), port 587 uses STARTTLS (secure=false)
    secure: process.env.SMTP_SECURE === "true" || parseInt(process.env.SMTP_PORT || "587") === 465,
    // Only require TLS for non-secure connections (STARTTLS)
    ...(process.env.SMTP_SECURE !== "true" && parseInt(process.env.SMTP_PORT || "587") !== 465 && { requireTLS: true }),
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  },
};