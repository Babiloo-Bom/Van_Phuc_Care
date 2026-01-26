# 🏥 Van Phuc Care - Hệ thống Quản lý Chăm sóc Sức khỏe

> **Hệ thống quản lý toàn diện cho dịch vụ chăm sóc sức khỏe, bao gồm quản lý khách hàng, đăng ký khóa học, sổ sức khỏe điện tử, và hỗ trợ thanh toán trực tuyến.**

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Cấu trúc dự án](#cấu-trúc-dự-án)
5. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
6. [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
7. [Tài liệu liên quan](#tài-liệu-liên-quan)
8. [Hỗ trợ](#hỗ-trợ)

---

## 🎯 Tổng quan

Van Phuc Care là một hệ thống quản lý chăm sóc sức khỏe toàn diện, được xây dựng với kiến trúc microservices, bao gồm:

- **Admin Portal**: Quản lý hệ thống, khóa học, dịch vụ, khách hàng
- **CRM Portal**: Quản lý khách hàng, sổ sức khỏe, lịch tiêm chủng
- **E-Learning Portal**: Hệ thống học trực tuyến với thanh toán tích hợp
- **Backend API**: RESTful API server cung cấp các dịch vụ backend

### Tính năng chính

- ✅ Quản lý khách hàng và thông tin sức khỏe
- ✅ Sổ sức khỏe điện tử (E-Health Book)
- ✅ Lịch tiêm chủng và nhắc nhở
- ✅ Hệ thống đăng ký khóa học trực tuyến
- ✅ Thanh toán trực tuyến (VNPay, SePay)
- ✅ Quản lý hỗ trợ khách hàng (Support Tickets)
- ✅ Upload và quản lý file (MinIO, Cloudflare R2)
- ✅ Xác thực OAuth (Google)
- ✅ Phân quyền người dùng (Admin, Manager, Worker)
- ✅ Google Tag Manager (GTM) integration
- ✅ Analytics và Event Tracking
- ✅ SEO optimization

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                   │
│                    (Port 80/443)                         │
└────────────────────┬────────────────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌──────▼──────┐   ┌─────▼──────┐
│ Admin  │    │    CRM      │   │ E-Learning │
│ Portal │    │   Portal    │   │   Portal   │
│ :3100   │    │   :3101   │   │   :3102    │
└───┬────┘    └──────┬──────┘   └─────┬──────┘
    │                │                │
    └────────────────┼────────────────┘
                     │
            ┌────────▼────────┐
            │   Backend API   │
            │     :3000       │
            └────────┬────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌──────▼──────┐   ┌─────▼──────┐
│MongoDB │    │    MinIO     │   │ Cloudflare│
│ :27017 │    │   :9000      │   │     R2    │
└────────┘    └──────────────┘   └───────────┘
```

### Các thành phần

1. **Frontend Applications** (Nuxt 3)
   - `admin-vpc-v3`: Admin Portal
   - `crm-vpc-v3`: CRM Portal
   - `elerning-vpc-v3`: E-Learning Portal

2. **Backend Services**
   - `server-vpc`: Node.js/Express API Server

3. **Infrastructure**
   - `mongodb`: Database (MongoDB 7)
   - `minio`: Object Storage (S3-compatible)
   - `nginx`: Reverse Proxy (optional)

---

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: Nuxt 3 (Vue 3)
- **UI Library**: Ant Design Vue 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB 7 (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: MinIO (S3-compatible), Cloudflare R2
- **Language**: TypeScript

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions (optional)

### Third-party Services
- **Payment**: VNPay, SePay
- **Email**: SMTP (Nodemailer)
- **OAuth**: Google OAuth 2.0
- **Video Storage**: Cloudflare R2/CDN
- **Analytics**: Google Tag Manager (GTM)
- **Queue System**: Redis (Bull queue)

---

## 📁 Cấu trúc dự án

```
Van_Phuc_Care/
├── admin-vpc-v3/          # Admin Portal (Nuxt 3)
│   ├── pages/             # Routes/pages
│   ├── composables/       # Composables (API, utils)
│   ├── layouts/           # Layout components
│   ├── middleware/        # Route middleware
│   └── stores/            # Pinia stores
│
├── crm-vpc-v3/            # CRM Portal (Nuxt 3)
│   ├── pages/             # Routes/pages
│   ├── composables/       # Composables
│   └── stores/            # Pinia stores
│
├── elerning-vpc-v3/       # E-Learning Portal (Nuxt 3)
│   ├── pages/             # Routes/pages
│   ├── composables/       # Composables
│   └── stores/            # Pinia stores
│
├── server-vpc/            # Backend API Server
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── mongodb/       # Mongoose models
│   │   ├── middlewares/   # Express middlewares
│   │   ├── services/      # Business logic
│   │   └── configs/       # Configuration files
│   └── scripts/           # Seed/migration scripts
│
├── nginx/                 # Nginx configuration
│   ├── nginx.conf
│   └── conf.d/
│
├── docker-compose.yml     # Docker Compose (Development)
├── docker-compose.prod.yml # Docker Compose (Production)
├── deploy.sh              # Deployment script
├── README.md              # This file
├── MIGRATION_NOTE.md      # Database migration notes
└── DEPLOYMENT_GUIDE.md   # Deployment guide
```

---

## 💻 Yêu cầu hệ thống

### Development
- **Node.js**: >= 18.x
- **npm**: >= 18.x hoặc **pnpm**: >= 8.x
- **Docker**: >= 20.x
- **Docker Compose**: >= 2.x
- **Git**: >= 2.x

### Production
- **Server**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB+)
- **Disk**: Tối thiểu 20GB (khuyến nghị 50GB+)
- **Network**: Ports 3000, 3100, 3101, 3102, 27017, 9000, 9001

---

## 🚀 Cài đặt và chạy dự án

> 💡 **Quick Start**: Xem [docs/QUICK_START.md](./docs/QUICK_START.md) để bắt đầu nhanh trong 5 phút!

### 1. Clone repository

```bash
git clone <repository-url>
cd Van_Phuc_Care
```

### 2. Cấu hình môi trường

Tạo file `.env` cho từng service hoặc sử dụng `production.env` ở root:

```bash
# Xem ENV_TEMPLATE.md để biết chi tiết các biến môi trường cần thiết
cp ENV_TEMPLATE.md .env.example
```

**Các biến môi trường quan trọng:**
- `MONGODB_URI`: Connection string MongoDB
- `JWT_SECRET`, `JWT_ADMIN_SECRET`, `JWT_USER_SECRET`: JWT secrets
- `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`: MinIO credentials
- `SMTP_*`: SMTP configuration
- `SEPAY_*`, `VNP_*`: Payment gateway configs
- `CLOUDFLARE_R2_*`: Cloudflare R2 configs
- `NUXT_PUBLIC_GTM_ID`: Google Tag Manager ID (cho E-Learning Portal)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: Redis configuration

### 3. Chạy với Docker Compose (Khuyến nghị)

#### Development

```bash
docker compose up -d --build
```

#### Production

```bash
# Sử dụng production.env
docker compose -f docker-compose.prod.yml --env-file production.env up -d --build
```

Hoặc sử dụng script deploy:

```bash
chmod +x deploy.sh
./deploy.sh production
```

### 4. Chạy từng service riêng lẻ (Development)

#### Backend API

```bash
cd server-vpc
npm install
npm run watch
```

#### Frontend Applications

```bash
# Admin Portal
cd admin-vpc-v3
npm install
npm run dev

# CRM Portal
cd crm-vpc-v3
npm install
npm run dev

# E-Learning Portal
cd elerning-vpc-v3
npm install
npm run dev
```

### 5. Truy cập ứng dụng

Sau khi khởi động, truy cập:

- **Admin Portal**: http://localhost:3100
- **CRM Portal**: http://localhost:3101
- **E-Learning Portal**: http://localhost:3102
- **Backend API**: http://localhost:3000
- **MinIO Console**: http://localhost:9001

### 6. Tạo tài khoản Admin đầu tiên

```bash
# Trong container API
docker compose exec api node scripts/create-admin-user.js

# Hoặc local
cd server-vpc
node scripts/create-admin-user.js
```

**Thông tin mặc định:**
- Email: `admin@gmail.com`
- Password: `123456`
- Username: `admin`
- Role: `admin`

⚠️ **Lưu ý**: Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

---

## 📚 Tài liệu liên quan

> 📖 **Xem [docs/README.md](./docs/README.md) để có danh sách đầy đủ tất cả tài liệu**

### 📖 Tài liệu hệ thống
- [docs/README.md](./docs/README.md) - **Documentation Index** - Tổng hợp tất cả tài liệu
- [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) - Tổng quan hệ thống
- [docs/QUICK_START.md](./docs/QUICK_START.md) - Hướng dẫn bắt đầu nhanh (5 phút)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Hướng dẫn deploy chi tiết
- [MIGRATION_NOTE.md](./MIGRATION_NOTE.md) - Ghi chú về database migration
- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Template biến môi trường
- [VAN_PHUC_CARE_API_DOCUMENTATION.md](./VAN_PHUC_CARE_API_DOCUMENTATION.md) - Tài liệu API đầy đủ (Backend)

### 🏗️ Backend API
- [server-vpc/README.md](./server-vpc/README.md) - Backend API documentation
- [server-vpc/docs/sb-schema.md](./server-vpc/docs/sb-schema.md) - Database schema
- [server-vpc/docs/api-endpoint.md](./server-vpc/docs/api-endpoint.md) - API endpoints
- [server-vpc/docs/TICKET_API.md](./server-vpc/docs/TICKET_API.md) - Ticket API

### 🎨 Frontend Portals

#### Admin Portal
- [admin-vpc-v3/README.md](./admin-vpc-v3/README.md) - Admin Portal documentation

#### CRM Portal
- [crm-vpc-v3/README.md](./crm-vpc-v3/README.md) - CRM Portal documentation
- [crm-vpc-v3/CRM_API_LIST.md](./crm-vpc-v3/CRM_API_LIST.md) - CRM API list
- [crm-vpc-v3/CRM_API_REVIEW.md](./crm-vpc-v3/CRM_API_REVIEW.md) - CRM API review

#### E-Learning Portal
- [elerning-vpc-v3/README.md](./elerning-vpc-v3/README.md) - E-Learning Portal documentation
- [elerning-vpc-v3/docs/INDEX.md](./elerning-vpc-v3/docs/INDEX.md) - Documentation index
- [elerning-vpc-v3/docs/API_DOCUMENTATION.md](./elerning-vpc-v3/docs/API_DOCUMENTATION.md) - API documentation
- [elerning-vpc-v3/docs/GTM_SETUP.md](./elerning-vpc-v3/docs/GTM_SETUP.md) - Google Tag Manager setup
- [elerning-vpc-v3/docs/SEO_CONFIGURATION.md](./elerning-vpc-v3/docs/SEO_CONFIGURATION.md) - SEO configuration
- [elerning-vpc-v3/docs/PAYMENT_SYSTEM.md](./elerning-vpc-v3/docs/PAYMENT_SYSTEM.md) - Payment system
- [elerning-vpc-v3/docs/CART_SYSTEM.md](./elerning-vpc-v3/docs/CART_SYSTEM.md) - Cart system
- [elerning-vpc-v3/docs/PROJECT_STRUCTURE.md](./elerning-vpc-v3/docs/PROJECT_STRUCTURE.md) - Project structure

### 🔧 Utilities & Scripts
- [scripts/REDIS_FIX_GUIDE.md](./scripts/REDIS_FIX_GUIDE.md) - Redis troubleshooting
- [scripts/CLEANUP_GUIDE.md](./scripts/CLEANUP_GUIDE.md) - Cleanup scripts guide

---

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB

```bash
# Kiểm tra container MongoDB
docker compose ps mongodb

# Xem logs
docker compose logs mongodb

# Kiểm tra connection string trong .env
echo $MONGODB_URI
```

### Lỗi kết nối MinIO

```bash
# Kiểm tra MinIO container
docker compose ps minio

# Truy cập MinIO Console: http://localhost:9001
# Default credentials: minioadmin / minioadmin
```

### Frontend không kết nối được API

- Kiểm tra `NUXT_PUBLIC_API_HOST` và `NUXT_PUBLIC_API_BASE` trong `.env`
- Kiểm tra CORS settings trong backend
- Kiểm tra network trong Docker Compose

### GTM không load (E-Learning Portal)

- Kiểm tra `NUXT_PUBLIC_GTM_ID` đã được set chưa
- Kiểm tra console có lỗi không
- Xem [elerning-vpc-v3/docs/GTM_SETUP.md](./elerning-vpc-v3/docs/GTM_SETUP.md) để debug

### Port đã được sử dụng

```bash
# Tìm process đang dùng port
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Hoặc đổi port trong docker-compose.yml
```

---

## 📊 Analytics & Tracking

### Google Tag Manager (GTM)

E-Learning Portal đã được tích hợp Google Tag Manager để tracking:

- **Setup**: Xem [elerning-vpc-v3/docs/GTM_SETUP.md](./elerning-vpc-v3/docs/GTM_SETUP.md)
- **Events Tracking**: Course views, purchases, video plays, etc.
- **Composable**: `useGtmTracking()` trong E-Learning Portal

**Cấu hình:**
```env
NUXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

### Event Tracking

Các events được track tự động:
- Page views
- Course views
- Purchases
- Add to cart
- Video plays
- User actions

---

## 🧪 Testing

### API Testing

```bash
# Sử dụng Postman collection
# File: Van_Phuc_Care_API.postman_collection.json
```

### Health Check

```bash
# API Health
curl http://localhost:3000/api/health

# Frontend Health (nếu có endpoint)
curl http://localhost:3100/api/_health
```

---

## 📝 Changelog

### Version 1.1.0 (2025-01-26)
- ✅ Google Tag Manager (GTM) integration cho E-Learning Portal
- ✅ API Documentation đầy đủ cho E-Learning Portal
- ✅ Cải thiện tài liệu và documentation structure
- ✅ Event tracking system với GTM
- ✅ SEO optimization improvements

### Version 1.0.0 (2025)
- ✅ Initial release
- ✅ Admin Portal với quản lý khóa học, dịch vụ, khách hàng
- ✅ CRM Portal với sổ sức khỏe, lịch tiêm chủng
- ✅ E-Learning Portal với thanh toán tích hợp
- ✅ Support Tickets system
- ✅ File upload (MinIO, Cloudflare R2)
- ✅ OAuth authentication (Google)
- ✅ Video processing với HLS conversion
- ✅ Redis queue system cho background jobs

---

## 👥 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

## 📄 License

Proprietary - All rights reserved

---

## 🆘 Hỗ trợ

- **Email**: support@vanphuccare.com
- **Documentation**: Xem các file `.md` trong thư mục `docs/`
- **Issues**: Tạo issue trên repository

---

**© 2025 Van Phuc Care - All Rights Reserved**

