# Hướng dẫn Test SePay Sandbox Mode

## 1. Bật Sandbox Mode

Sandbox mode sẽ tự động bật khi:
- `NODE_ENV=development` (mặc định trong dev)
- Hoặc set `SEPAY_SANDBOX=true` trong environment variables

### Cách 1: Dùng Environment Variable (Production)

Thêm vào `.env` hoặc `docker-compose.prod.yml`:
```bash
SEPAY_SANDBOX=true
```

### Cách 2: Development Mode (Tự động bật)

Khi chạy với `NODE_ENV=development`, sandbox sẽ tự động bật.

## 2. Kiểm tra Sandbox Mode đã bật

Sau khi start server, kiểm tra logs:
```
🧪 SePay SANDBOX MODE - Using test account for QR code generation
```

## 3. Test Flow Thanh Toán QR

### Bước 1: Tạo Order và QR Code

1. Vào trang giỏ hàng: `http://localhost:3102/cart`
2. Thêm khóa học vào giỏ
3. Click "Thanh toán bằng QR"
4. Kiểm tra logs server - sẽ thấy:
   ```
   🧪 SePay SANDBOX MODE - Using test account for QR code generation
   🧪 SePay SANDBOX QR Code created: {
     orderId: 'VPC...',
     amount: 2149,
     accountNo: '655123456888',
     accountName: 'Công Ty TNHH Vạn Phúc Care (TEST)',
     note: 'This is a TEST transaction - no real money will be transferred'
   }
   ```

### Bước 2: Test Webhook (Mock Payment)

Vì đây là sandbox, bạn cần **mock webhook** từ SePay để test flow hoàn chỉnh.

#### Cách 1: Dùng Postman/Insomnia

**POST** `http://localhost:3000/api/u/orders/payment/sepay-webhook`

**Headers:**
```
Authorization: Bearer GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "orderId": "VPC1765963957366249KK",
  "transactionId": "TEST_TXN_123456",
  "amount": 2149,
  "status": "success",
  "content": "Thanh toan khoa hoc: Test Course - VPC1765963957366249KK"
}
```

**Lưu ý:** 
- `orderId` phải là orderId thực tế bạn vừa tạo
- `amount` phải khớp với số tiền trong order (đã làm tròn)
- `content` phải chứa `orderId` để extract được

#### Cách 2: Dùng cURL

**Trên Linux/Mac:**
```bash
curl -X POST http://localhost:3000/api/u/orders/payment/sepay-webhook \
  -H "Authorization: Bearer GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "VPC1765963957366249KK",
    "transactionId": "TEST_TXN_123456",
    "amount": 2149,
    "status": "success",
    "content": "Thanh toan khoa hoc: Test Course - VPC1765963957366249KK"
  }'
```

**Trên Windows (PowerShell):**
```powershell
curl.exe -X POST http://localhost:3000/api/u/orders/payment/sepay-webhook `
  -H "Authorization: Bearer GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK" `
  -H "Content-Type: application/json" `
  -d "{\"orderId\": \"VPC1765963957366249KK\",\"transactionId\": \"TEST_TXN_123456\",\"amount\": 2149,\"status\": \"success\",\"content\": \"Thanh toan khoa hoc: Test Course - VPC1765963957366249KK\"}"
```

**Hoặc dùng file JSON (Khuyến nghị cho Windows):**

1. Tạo file `test-webhook.json`:
```json
{
  "orderId": "VPC1765963957366249KK",
  "transactionId": "TEST_TXN_123456",
  "amount": 2149,
  "status": "success",
  "content": "Thanh toan khoa hoc: Test Course - VPC1765963957366249KK"
}
```

2. Chạy curl:
```powershell
curl.exe -X POST http://localhost:3000/api/u/orders/payment/sepay-webhook `
  -H "Authorization: Bearer GL23FZNXPG7O2QVFMNTY8AWIX46WUIXSWTC4BYVALU5Q93CA05BHMFXLVJGFN6JK" `
  -H "Content-Type: application/json" `
  -d @test-webhook.json
```

### Bước 3: Kiểm tra Kết quả

Sau khi gửi webhook, kiểm tra logs:
```
🧪 SePay SANDBOX webhook received - TEST mode
🧪 SePay SANDBOX webhook verified - TEST mode
📥 SePay webhook payload: {...}
✅ QR payment confirmed for order VPC...
```

Kiểm tra frontend:
- Polling sẽ nhận `paid: true`
- Tự động redirect sang `/my-learning`
- Khóa học được kích hoạt

## 4. Test Fallback API Check

Nếu webhook không hoạt động, hệ thống sẽ tự động check SePay API:

1. Frontend polling gọi: `GET /api/u/orders/payment/qr/status/:orderId`
2. Backend tự động query SePay API để tìm transaction
3. Nếu tìm thấy → tự động cập nhật order

**Lưu ý:** Trong sandbox, SePay API có thể không trả về transaction thật, nên fallback này có thể không hoạt động. Tốt nhất là test webhook trực tiếp.

## 5. Debug Tips

### Kiểm tra Sandbox Mode

Thêm vào code để log:
```typescript
console.log('SePay Config:', {
  isSandbox: configs.sepayConfig.isSandbox,
  accountNo: configs.sepayConfig.isSandbox 
    ? configs.sepayConfig.sandboxAccountNo 
    : configs.sepayConfig.accountNo,
  apiToken: configs.sepayConfig.isSandbox 
    ? configs.sepayConfig.sandboxApiToken 
    : configs.sepayConfig.apiToken
});
```

### Kiểm tra Order Status

Query MongoDB:
```javascript
db.orders.findOne({ orderId: "VPC..." })
```

Kiểm tra:
- `paymentStatus`: phải là `"completed"` sau khi webhook thành công
- `status`: phải là `"completed"`
- `transactionId`: phải có giá trị từ webhook

## 6. Tắt Sandbox Mode (Production)

Khi deploy production, đảm bảo:
```bash
NODE_ENV=production
SEPAY_SANDBOX=false  # hoặc không set (mặc định false)
```

## 7. Troubleshooting

### Webhook không nhận được
- Kiểm tra URL webhook trên SePay dashboard
- Kiểm tra Authorization header có đúng token không
- Kiểm tra logs server có nhận request không

### Order không được cập nhật
- Kiểm tra `orderId` trong webhook có đúng không
- Kiểm tra `amount` có khớp không (đã làm tròn)
- Kiểm tra `status` phải là `"success"` hoặc `"completed"`

### QR Code không hiển thị
- Kiểm tra URL QR có hợp lệ không
- Kiểm tra `accountNo` có đúng không
- Kiểm tra `amount` đã được làm tròn chưa

