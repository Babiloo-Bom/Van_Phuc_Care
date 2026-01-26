# 🎓 Van Phuc Care E-Learning Portal

> **Nền tảng học trực tuyến hàng đầu Việt Nam** - Hệ thống quản lý khóa học, thanh toán, và theo dõi tiến độ học tập

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Tính năng](#tính-năng)
3. [Công nghệ](#công-nghệ)
4. [Cài đặt](#cài-đặt)
5. [Cấu hình](#cấu-hình)
6. [Cấu trúc dự án](#cấu-trúc-dự-án)
7. [Tài liệu](#tài-liệu)
8. [Development](#development)
9. [Deployment](#deployment)

---

## 🎯 Tổng quan

Van Phuc Care E-Learning Portal là hệ thống học trực tuyến được xây dựng với **Nuxt 3**, cung cấp các tính năng:

- 📚 Quản lý khóa học và bài giảng
- 💳 Hệ thống thanh toán tích hợp (VNPay, SePay)
- 🛒 Giỏ hàng và mã giảm giá
- 📊 Theo dõi tiến độ học tập
- 🎥 Video streaming với HLS
- 📱 Responsive design
- 🔍 SEO optimization
- 📈 Google Tag Manager integration

---

## ✨ Tính năng

### Học tập
- ✅ Xem khóa học và bài giảng
- ✅ Video streaming với bảo mật
- ✅ Quiz và bài tập
- ✅ Theo dõi tiến độ
- ✅ Chứng chỉ hoàn thành

### Thanh toán
- ✅ VNPay integration
- ✅ SePay integration
- ✅ Giỏ hàng
- ✅ Mã giảm giá
- ✅ Lịch sử giao dịch

### Quản lý
- ✅ User authentication (Email, Google OAuth)
- ✅ Profile management
- ✅ Course enrollment
- ✅ Progress tracking

### Analytics & Tracking
- ✅ Google Tag Manager (GTM)
- ✅ Event tracking
- ✅ Page view tracking
- ✅ Conversion tracking

---

## 🛠️ Công nghệ

### Frontend
- **Framework**: Nuxt 3 (Vue 3)
- **Language**: TypeScript
- **UI Library**: Ant Design Vue 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Video**: HLS.js
- **Analytics**: Google Tag Manager

### Backend Integration
- RESTful API
- JWT Authentication
- File upload (MinIO, Cloudflare R2)

---

## 🚀 Cài đặt

### Yêu cầu
- Node.js >= 18.x
- npm >= 9.x hoặc pnpm >= 8.x

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd elerning-vpc-v3
```

### Bước 2: Cài đặt dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng pnpm
pnpm install

# Hoặc sử dụng yarn
yarn install
```

### Bước 3: Cấu hình environment variables

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:

```env
# API Configuration
NUXT_PUBLIC_API_HOST=http://localhost:3000
NUXT_PUBLIC_API_BASE=/api/u
NUXT_API_HOST_INTERNAL=http://localhost:3000

# Google OAuth
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Tag Manager
NUXT_PUBLIC_GTM_ID=GTM-XXXXXX

# App Configuration
NUXT_PUBLIC_APP_NAME=E-Learning Portal - Van Phuc Care
NUXT_PUBLIC_APP_URL=http://localhost:3102
NUXT_PUBLIC_BASE_URL=http://localhost:3102

# TinyMCE (Optional)
NUXT_PUBLIC_TINYMCE_KEY=your_tinymce_key
```

### Bước 4: Chạy development server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

Truy cập: http://localhost:3102

---

## ⚙️ Cấu hình

### Google Tag Manager

Xem chi tiết trong [GTM_SETUP.md](./docs/GTM_SETUP.md)

**Quick setup:**
1. Thêm `NUXT_PUBLIC_GTM_ID=GTM-XXXXXX` vào `.env`
2. GTM sẽ tự động load khi có GTM ID

### SEO Configuration

Xem chi tiết trong [SEO_CONFIGURATION.md](./docs/SEO_CONFIGURATION.md)

### Payment System

Xem chi tiết trong [PAYMENT_SYSTEM.md](./docs/PAYMENT_SYSTEM.md)

### Cart System

Xem chi tiết trong [CART_SYSTEM.md](./docs/CART_SYSTEM.md)

---

## 📁 Cấu trúc dự án

```
elerning-vpc-v3/
├── assets/              # Static assets (CSS, fonts, images)
│   ├── css/
│   └── fonts/
│
├── components/          # Vue components
│   ├── common/         # Common components
│   ├── courses/        # Course-related components
│   └── payment/        # Payment components
│
├── composables/         # Vue composables
│   ├── api/            # API composables
│   ├── useAuth.ts      # Authentication
│   ├── useCart.ts      # Cart management
│   ├── useGtmTracking.ts # GTM tracking
│   └── usePayment.ts   # Payment handling
│
├── configs/            # Configuration files
│   └── paymentMethods.ts
│
├── constants/          # Constants
│
├── docs/               # Documentation
│   ├── GTM_SETUP.md
│   ├── SEO_CONFIGURATION.md
│   ├── PAYMENT_SYSTEM.md
│   └── CART_SYSTEM.md
│
├── layouts/            # Layout components
│   └── default.vue
│
├── middleware/          # Route middleware
│   ├── auth.ts
│   └── guest.ts
│
├── pages/              # Pages/routes
│   ├── index.vue       # Home page
│   ├── courses/        # Course pages
│   ├── my-learning/    # Learning pages
│   └── checkout/       # Checkout pages
│
├── plugins/            # Nuxt plugins
│
├── public/             # Public static files
│   ├── images/
│   └── videos/
│
├── server/             # Server-side code
│   └── api/            # API routes
│
├── stores/              # Pinia stores
│   ├── auth.ts
│   ├── cart.ts
│   └── README.md
│
├── types/              # TypeScript types
│
├── utils/              # Utility functions
│
├── app.vue             # Root component
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

---

## 📚 Tài liệu

### Core Documentation
- [API Documentation](./docs/API_DOCUMENTATION.md) - Tài liệu đầy đủ về API endpoints
- [GTM Setup Guide](./docs/GTM_SETUP.md) - Hướng dẫn cài đặt và sử dụng Google Tag Manager
- [SEO Configuration](./docs/SEO_CONFIGURATION.md) - Cấu hình SEO và Schema.org
- [Payment System](./docs/PAYMENT_SYSTEM.md) - Hệ thống thanh toán
- [Cart System](./docs/CART_SYSTEM.md) - Hệ thống giỏ hàng
- [Stores Documentation](./stores/README.md) - Pinia stores guide

### API Documentation
- [API Documentation](./docs/API_DOCUMENTATION.md) - Tài liệu đầy đủ về tất cả API endpoints
- Base URL: `http://localhost:3000/api/u` (user) hoặc `/api/a` (admin)
- Authentication: JWT Bearer Token

---

## 💻 Development

### Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Linting
npm run lint            # Check for linting errors
npm run lint:fix        # Fix linting errors
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Standard configuration
- **Prettier**: Auto-format on save (recommended)

### Best Practices

1. **Components**: Sử dụng Composition API với `<script setup>`
2. **State Management**: Sử dụng Pinia stores cho global state
3. **API Calls**: Sử dụng composables trong `composables/api/`
4. **Type Safety**: Luôn định nghĩa types cho props và data
5. **Error Handling**: Luôn handle errors trong async operations

### Development Tools

- **Nuxt DevTools**: Enabled in development
- **Vue DevTools**: Install browser extension
- **TypeScript**: Full type checking

---

## 🚢 Deployment

### Production Build

```bash
# Build
npm run build

# Preview
npm run preview
```

### Environment Variables

Đảm bảo set các biến môi trường trong production:

```env
NODE_ENV=production
NUXT_PUBLIC_API_HOST=https://api.vanphuccare.vn
NUXT_PUBLIC_API_BASE=/api/u
NUXT_PUBLIC_GTM_ID=GTM-XXXXXX
NUXT_PUBLIC_APP_URL=https://edu.vanphuccare.vn
# ... other variables
```

### Docker Deployment

Xem `Dockerfile` và `Dockerfile.dev` trong root directory.

### Nginx Configuration

Cấu hình reverse proxy cho production:

```nginx
server {
    listen 80;
    server_name edu.vanphuccare.vn;

    location / {
        proxy_pass http://localhost:3102;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🧪 Testing

### Manual Testing

1. **Authentication**: Test login/logout với Email và Google OAuth
2. **Courses**: Test xem khóa học, đăng ký, học tập
3. **Payment**: Test thanh toán với VNPay và SePay
4. **Cart**: Test thêm/xóa items, apply coupon
5. **GTM**: Test events tracking trong GTM Preview Mode

### Browser Testing

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. GTM không load
- Kiểm tra `NUXT_PUBLIC_GTM_ID` đã được set chưa
- Kiểm tra console có lỗi không
- Xem [GTM_SETUP.md](./docs/GTM_SETUP.md) để debug

#### 2. API không kết nối được
- Kiểm tra `NUXT_PUBLIC_API_HOST` và `NUXT_PUBLIC_API_BASE`
- Kiểm tra CORS settings trong backend
- Kiểm tra network trong DevTools

#### 3. Video không play
- Kiểm tra video token có được generate không
- Kiểm tra HLS.js có load không
- Kiểm tra network requests

#### 4. Payment không hoạt động
- Kiểm tra payment gateway credentials
- Kiểm tra webhook URLs
- Xem [PAYMENT_SYSTEM.md](./docs/PAYMENT_SYSTEM.md)

---

## 📞 Support

- **Email**: support@vanphuccare.com
- **Documentation**: Xem các file trong `docs/`
- **Issues**: Tạo issue trên repository

---

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgments

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Ant Design Vue](https://antdv.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**© 2025 Van Phuc Care - All Rights Reserved**
