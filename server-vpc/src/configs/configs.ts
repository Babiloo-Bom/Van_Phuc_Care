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
    // Sandbox/Test mode: Chỉ bật khi SEPAY_SANDBOX=true HOẶC NODE_ENV=development (và không có SEPAY_SANDBOX=false)
    // Production: Set NODE_ENV=production và SEPAY_SANDBOX=false (hoặc không set) để dùng SePay thật
    isSandbox:
      process.env.SEPAY_SANDBOX === "true" ||
      (process.env.NODE_ENV === "development" && process.env.SEPAY_SANDBOX !== "false"),
    // API Token - có thể dùng token test nếu SePay cung cấp
    apiToken: process.env.SEPAY_API_TOKEN || "GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK",
    // Sandbox API Token (nếu SePay có token riêng cho sandbox)
    sandboxApiToken:
      process.env.SEPAY_SANDBOX_API_TOKEN ||
      process.env.SEPAY_API_TOKEN ||
      "GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK",
    qrApiUrl: process.env.SEPAY_QR_API_URL || "https://qr.sepay.vn/qr-mbbank.html",
    qrImgApiUrl: process.env.SEPAY_QR_IMG_API_URL || "https://qr.sepay.vn/img",
    // API Base URL - có thể có sandbox endpoint riêng
    apiBaseUrl: process.env.SEPAY_API_BASE_URL || "https://my.sepay.vn",
    sandboxApiBaseUrl:
      process.env.SEPAY_SANDBOX_API_BASE_URL || process.env.SEPAY_API_BASE_URL || "https://my.sepay.vn",
    bankCode: "MB",
    // Production account
    accountNo: process.env.SEPAY_ACCOUNT_NO || "655123456888",
    accountName: process.env.SEPAY_ACCOUNT_NAME || "Công Ty TNHH Vạn Phúc Care",
    // Sandbox/Test account (dùng để test, không thực sự nhận tiền)
    sandboxAccountNo: process.env.SEPAY_SANDBOX_ACCOUNT_NO || process.env.SEPAY_ACCOUNT_NO || "655123456888",
    sandboxAccountName:
      process.env.SEPAY_SANDBOX_ACCOUNT_NAME || process.env.SEPAY_ACCOUNT_NAME || "Công Ty TNHH Vạn Phúc Care (TEST)",
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