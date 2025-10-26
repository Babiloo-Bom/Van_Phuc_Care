# 💳 Hệ Thống Thanh Toán Linh Hoạt

## 🎯 Tổng Quan

Hệ thống thanh toán được thiết kế để dễ dàng thêm key và cấu hình cho các phương thức thanh toán mới. Chỉ cần thêm key vào file cấu hình và hệ thống sẽ tự động xử lý.

## 📁 Cấu Trúc Files

```
elerning-vpc-v3/
├── configs/
│   └── paymentMethods.ts          # Cấu hình các phương thức thanh toán
├── components/
│   └── payment/
│       └── PaymentMethodSelector.vue  # Component chọn phương thức
├── composables/
│   └── usePayment.ts              # Logic xử lý thanh toán
└── docs/
    └── PAYMENT_SYSTEM.md          # Tài liệu này
```

## 🔧 Cấu Hình

### 1. Thêm Key Mới

Chỉ cần thêm key vào file `configs/paymentMethods.ts`:

```typescript
{
  id: 'vnpay',
  name: 'Thanh toán qua VNPay',
  // ... other config
  apiKey: process.env.VNPAY_API_KEY || '',
  merchantId: process.env.VNPAY_MERCHANT_ID || '',
  secretKey: process.env.VNPAY_SECRET_KEY || '',
  // ... other keys
}
```

### 2. Environment Variables

Thêm vào file `.env`:

```env
# VNPay
VNPAY_API_KEY=your_vnpay_api_key
VNPAY_MERCHANT_ID=your_vnpay_merchant_id
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/vnpay
VNPAY_REDIRECT_URL=https://yourdomain.com/checkout/success

# MoMo
MOMO_API_KEY=your_momo_api_key
MOMO_MERCHANT_ID=your_momo_merchant_id
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_WEBHOOK_URL=https://yourdomain.com/api/webhooks/momo
MOMO_REDIRECT_URL=https://yourdomain.com/checkout/success
```

## 🚀 Sử Dụng

### 1. Trong Component

```vue
<template>
  <PaymentMethodSelector
    v-model="selectedMethod"
    :amount="totalAmount"
    @method-selected="onPaymentMethodSelected"
  />
</template>

<script setup>
import { usePayment } from '~/composables/usePayment'

const { 
  selectedMethod, 
  amount, 
  fees, 
  totalAmount, 
  processPayment 
} = usePayment()

const onPaymentMethodSelected = (method) => {
  console.log('Selected method:', method)
}

const handlePayment = async () => {
  const result = await processPayment(orderData)
  if (result.success) {
    // Payment successful
  }
}
</script>
```

### 2. Trong Composable

```typescript
const { 
  selectedMethod,     // Phương thức được chọn
  amount,            // Số tiền
  fees,              // Phí thanh toán
  totalAmount,       // Tổng tiền (amount + fees)
  processPayment,    // Xử lý thanh toán
  selectMethod,      // Chọn phương thức
  setAmount          // Set số tiền
} = usePayment()
```

## 🔌 Thêm Phương Thức Mới

### 1. Thêm vào Config

```typescript
{
  id: 'new_payment',
  name: 'Phương thức mới',
  description: 'Mô tả phương thức',
  icon: '/images/payment/new-logo.png',
  color: '#FF6B6B',
  enabled: true,
  apiKey: process.env.NEW_PAYMENT_API_KEY || '',
  // ... other config
}
```

### 2. Thêm Logic Xử Lý

Trong `composables/usePayment.ts`:

```typescript
const processNewPayment = async (paymentData: any) => {
  // TODO: Implement new payment integration
  console.log('Processing new payment:', paymentData)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    paymentUrl: 'https://new-payment-gateway.com',
    transactionId: `NEW_${Date.now()}`,
    method: 'new_payment'
  }
}
```

### 3. Thêm vào Switch Case

```typescript
switch (method.id) {
  case 'vnpay':
    result = await processVNPayPayment(paymentData)
    break
  case 'momo':
    result = await processMoMoPayment(paymentData)
    break
  case 'new_payment':  // ← Thêm case mới
    result = await processNewPayment(paymentData)
    break
  // ... other cases
}
```

## 🎨 Customization

### 1. Thay Đổi Giao Diện

Chỉnh sửa `components/payment/PaymentMethodSelector.vue`:

```vue
<template>
  <!-- Customize UI here -->
</template>
```

### 2. Thay Đổi Logic

Chỉnh sửa `composables/usePayment.ts`:

```typescript
// Customize payment logic here
```

### 3. Thay Đổi Cấu Hình

Chỉnh sửa `configs/paymentMethods.ts`:

```typescript
// Customize payment methods here
```

## 🔒 Bảo Mật

1. **Environment Variables**: Luôn sử dụng env variables cho sensitive data
2. **Validation**: Validate tất cả input trước khi xử lý
3. **Webhook Security**: Implement proper webhook verification
4. **Error Handling**: Handle errors gracefully

## 📊 Monitoring

1. **Logging**: Log tất cả payment attempts
2. **Analytics**: Track payment success/failure rates
3. **Alerts**: Set up alerts for payment failures
4. **Audit Trail**: Keep audit trail for all transactions

## 🧪 Testing

### 1. Unit Tests

```typescript
// Test payment methods
describe('Payment Methods', () => {
  it('should validate payment amount', () => {
    const result = validatePaymentAmount('vnpay', 100000)
    expect(result.valid).toBe(true)
  })
})
```

### 2. Integration Tests

```typescript
// Test payment flow
describe('Payment Flow', () => {
  it('should process VNPay payment', async () => {
    const result = await processVNPayPayment(mockPaymentData)
    expect(result.success).toBe(true)
  })
})
```

## 📈 Performance

1. **Lazy Loading**: Load payment methods on demand
2. **Caching**: Cache payment configurations
3. **Optimization**: Optimize API calls
4. **Monitoring**: Monitor performance metrics

## 🚀 Deployment

1. **Environment Setup**: Set up production environment variables
2. **SSL**: Ensure SSL for all payment endpoints
3. **Monitoring**: Set up production monitoring
4. **Backup**: Regular backup of payment data

## 📞 Support

Nếu cần hỗ trợ, vui lòng liên hệ:
- Email: support@vanphuccare.com
- Phone: +84 123 456 789
- Documentation: [Link to docs]

---

**Lưu ý**: Hệ thống này được thiết kế để dễ dàng mở rộng và bảo trì. Chỉ cần thêm key và cấu hình, hệ thống sẽ tự động xử lý phần còn lại! 🎉
