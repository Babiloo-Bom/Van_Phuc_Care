export interface PaymentMethodConfig {
  id: string
  name: string
  description: string
  icon: string
  color: string
  enabled: boolean
  apiKey?: string
  merchantId?: string
  secretKey?: string
  webhookUrl?: string
  redirectUrl?: string
  qrCodeUrl?: string
  bankInfo?: {
    bankName: string
    accountNumber: string
    accountHolder: string
    branch?: string
  }
  fees?: {
    fixed?: number
    percentage?: number
  }
  limits?: {
    min?: number
    max?: number
  }
  features?: string[]
}

export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: 'vnpay',
    name: 'Thanh toán qua VNPay',
    description: 'Thanh toán nhanh chóng và an toàn',
    icon: '/images/payment/vnpay-logo.png',
    color: '#E31837',
    enabled: true,
    // Các key sẽ được thêm vào đây
    apiKey: process.env.VNPAY_API_KEY || '',
    merchantId: process.env.VNPAY_MERCHANT_ID || '',
    secretKey: process.env.VNPAY_SECRET_KEY || '',
    webhookUrl: process.env.VNPAY_WEBHOOK_URL || '',
    redirectUrl: process.env.VNPAY_REDIRECT_URL || '',
    fees: {
      percentage: 0.5, // 0.5% phí
    },
    limits: {
      min: 10000, // 10,000 VND
      max: 50000000, // 50,000,000 VND
    },
    features: ['instant', 'secure', 'refund'],
  },
  {
    id: 'momo',
    name: 'Thanh toán qua MoMo',
    description: 'Ví điện tử phổ biến tại Việt Nam',
    icon: '/images/payment/momo-logo.png',
    color: '#D82D8B',
    enabled: true,
    // Các key sẽ được thêm vào đây
    apiKey: process.env.MOMO_API_KEY || '',
    merchantId: process.env.MOMO_MERCHANT_ID || '',
    secretKey: process.env.MOMO_SECRET_KEY || '',
    webhookUrl: process.env.MOMO_WEBHOOK_URL || '',
    redirectUrl: process.env.MOMO_REDIRECT_URL || '',
    fees: {
      percentage: 0.3, // 0.3% phí
    },
    limits: {
      min: 1000, // 1,000 VND
      max: 20000000, // 20,000,000 VND
    },
    features: ['instant', 'mobile', 'qr'],
  },
  {
    id: 'qr',
    name: 'Thanh toán QR Code',
    description: 'Quét mã QR để thanh toán nhanh chóng',
    icon: '/images/payment/qr-logo.png',
    color: '#00C851',
    enabled: true,
    // Các key sẽ được thêm vào đây
    qrCodeUrl: process.env.QR_CODE_URL || '',
    webhookUrl: process.env.QR_WEBHOOK_URL || '',
    redirectUrl: process.env.QR_REDIRECT_URL || '',
    fees: {
      fixed: 0, // Miễn phí
    },
    limits: {
      min: 1000, // 1,000 VND
      max: 10000000, // 10,000,000 VND
    },
    features: ['instant', 'qr', 'mobile'],
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp qua ngân hàng',
    icon: '/images/payment/bank-logo.png',
    color: '#1976D2',
    enabled: true,
    // Thông tin ngân hàng
    bankInfo: {
      bankName: process.env.BANK_NAME || 'Vietcombank',
      accountNumber: process.env.BANK_ACCOUNT || '',
      accountHolder: process.env.BANK_HOLDER || '',
      branch: process.env.BANK_BRANCH || '',
    },
    webhookUrl: process.env.BANK_WEBHOOK_URL || '',
    fees: {
      fixed: 0, // Miễn phí
    },
    limits: {
      min: 10000, // 10,000 VND
      max: 100000000, // 100,000,000 VND
    },
    features: ['manual', 'secure', 'low_fee'],
  },
  {
    id: 'bypass',
    name: 'Bypass thanh toán (Demo)',
    description: 'Bỏ qua thanh toán để test giao diện',
    icon: '/images/payment/bypass-logo.png',
    color: '#8B5CF6',
    enabled: true,
    fees: {
      fixed: 0, // Miễn phí
    },
    limits: {
      min: 0,
      max: Infinity,
    },
    features: ['demo', 'instant', 'free'],
  },
];

// Helper functions
export const getPaymentMethod = (id: string): PaymentMethodConfig | undefined => {
  return paymentMethods.find(method => method.id === id);
};

export const getEnabledPaymentMethods = (): PaymentMethodConfig[] => {
  return paymentMethods.filter(method => method.enabled);
};

export const isPaymentMethodEnabled = (id: string): boolean => {
  const method = getPaymentMethod(id);
  return method ? method.enabled : false;
};

export const getPaymentMethodFees = (id: string, amount: number): number => {
  const method = getPaymentMethod(id);
  if (!method || !method.fees) return 0;
  
  const { fixed = 0, percentage = 0 } = method.fees;
  return fixed + (amount * percentage / 100);
};

export const validatePaymentAmount = (id: string, amount: number): { valid: boolean; message?: string } => {
  const method = getPaymentMethod(id);
  if (!method || !method.limits) return { valid: true };
  
  const { min = 0, max = Infinity } = method.limits;
  
  if (amount < min) {
    return { 
      valid: false, 
      message: `Số tiền tối thiểu là ${min.toLocaleString('vi-VN')} VND`, 
    };
  }
  
  if (amount > max) {
    return { 
      valid: false, 
      message: `Số tiền tối đa là ${max.toLocaleString('vi-VN')} VND`, 
    };
  }
  
  return { valid: true };
};
