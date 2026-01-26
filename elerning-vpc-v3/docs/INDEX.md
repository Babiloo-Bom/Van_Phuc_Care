# 📚 E-Learning Portal Documentation Index

> **Tài liệu tổng hợp cho dự án Van Phuc Care E-Learning Portal**

---

## 📖 Tài Liệu Chính

### 🏠 [README.md](../README.md)
Tài liệu tổng quan về dự án, bao gồm:
- Tổng quan dự án
- Tính năng
- Cài đặt và cấu hình
- Development guide
- Deployment guide

---

## 📋 Tài Liệu Chuyên Sâu

### 📐 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
Chi tiết về cấu trúc dự án:
- Cấu trúc thư mục
- Tổ chức code
- Data flow
- Code conventions
- Best practices

### 📊 [GTM_SETUP.md](./GTM_SETUP.md)
Hướng dẫn Google Tag Manager:
- Cài đặt GTM
- Cấu hình
- Event tracking
- Sử dụng composable
- Troubleshooting

### 🔍 [SEO_CONFIGURATION.md](./SEO_CONFIGURATION.md)
Cấu hình SEO:
- Meta tags
- Schema.org markup
- Sitemap & Robots
- SEO optimization
- Monitoring

### 🔍 [SEARCH_CONSOLE_VERIFICATION.md](./SEARCH_CONSOLE_VERIFICATION.md)
Google Search Console verification:
- HTML Tag verification
- HTML File verification
- DNS verification
- Troubleshooting
- Submit sitemap

### 💳 [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md)
Hệ thống thanh toán:
- Cấu hình payment methods
- VNPay integration
- SePay integration
- Webhook handling
- Testing

### 🛒 [CART_SYSTEM.md](./CART_SYSTEM.md)
Hệ thống giỏ hàng:
- Kiến trúc
- API endpoints
- State management
- Best practices
- Troubleshooting

### 📡 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
Tài liệu API đầy đủ:
- Authentication
- Tất cả endpoints
- Request/Response formats
- Error handling
- Examples

---

## 🗄️ Stores Documentation

### 📦 [stores/README.md](../stores/README.md)
Pinia stores guide:
- Available stores
- Usage examples
- Best practices
- Creating new stores

---

## 🚀 Quick Start Guides

### 1. Cài Đặt Dự Án

```bash
# Clone repository
git clone <repository-url>
cd elerning-vpc-v3

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your config

# Run development server
npm run dev
```

### 2. Cấu Hình GTM

1. Lấy GTM ID từ [Google Tag Manager](https://tagmanager.google.com/)
2. Thêm vào `.env`: `NUXT_PUBLIC_GTM_ID=GTM-XXXXXX`
3. Xem chi tiết trong [GTM_SETUP.md](./GTM_SETUP.md)

### 3. Cấu Hình Payment

1. Thêm payment gateway credentials vào `.env`
2. Cấu hình trong `configs/paymentMethods.ts`
3. Xem chi tiết trong [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md)

---

## 🔧 Development

### Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint code
npm run lint:fix   # Fix linting errors
```

### Code Structure

- **Components**: `components/`
- **Composables**: `composables/`
- **Pages**: `pages/`
- **Stores**: `stores/`
- **Types**: `types/`

Xem chi tiết trong [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 📊 Analytics & Tracking

### Google Tag Manager

- Setup: [GTM_SETUP.md](./GTM_SETUP.md)
- Composable: `useGtmTracking()`
- Events: Course views, purchases, video plays, etc.

## 📡 API Integration

### API Documentation

- Complete guide: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Authentication: JWT Bearer Token
- Base URL: `/api/a` (admin) và `/api/u` (user)
- Examples: Login, Courses, Orders, etc.

### SEO

- Configuration: [SEO_CONFIGURATION.md](./SEO_CONFIGURATION.md)
- Schema.org markup
- Meta tags
- Sitemap

---

## 💳 Payment & Cart

### Payment System

- Setup: [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md)
- Supported: VNPay, SePay
- Webhook handling

### Cart System

- Setup: [CART_SYSTEM.md](./CART_SYSTEM.md)
- State management: Pinia
- API integration

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Authentication (Email, Google OAuth)
- [ ] Course browsing and enrollment
- [ ] Video playback
- [ ] Payment flow
- [ ] Cart operations
- [ ] GTM events tracking
- [ ] SEO meta tags
- [ ] Responsive design

### Browser Testing

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

## 🐛 Troubleshooting

### Common Issues

1. **GTM không load**: Xem [GTM_SETUP.md - Troubleshooting](./GTM_SETUP.md#troubleshooting)
2. **API không kết nối**: Kiểm tra `NUXT_PUBLIC_API_HOST` và CORS
3. **Payment không hoạt động**: Xem [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md)
4. **Cart issues**: Xem [CART_SYSTEM.md - Troubleshooting](./CART_SYSTEM.md#troubleshooting)

---

## 📞 Support

- **Email**: support@vanphuccare.com
- **Documentation**: Xem các file trong `docs/`
- **Issues**: Tạo issue trên repository

---

## 🔄 Changelog

### 2025-01-26
- ✅ Added GTM integration
- ✅ Updated documentation structure
- ✅ Created PROJECT_STRUCTURE.md
- ✅ Updated README.md
- ✅ Created documentation index

---

## 📝 Contributing

Khi thêm tính năng mới:

1. Update documentation tương ứng
2. Update this index nếu cần
3. Follow code conventions
4. Add examples nếu có

---

**Last Updated**: 2025-01-26

