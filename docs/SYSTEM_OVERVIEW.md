# 🏥 Van Phuc Care - System Overview

> **Tài liệu tổng quan về toàn bộ hệ thống Van Phuc Care**

---

## 📋 Mục lục

1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Kiến trúc](#kiến-trúc)
3. [Các thành phần](#các-thành-phần)
4. [Tính năng chính](#tính-năng-chính)
5. [Công nghệ](#công-nghệ)
6. [Tài liệu](#tài-liệu)
7. [Development Workflow](#development-workflow)

---

## 🎯 Tổng quan hệ thống

Van Phuc Care là hệ thống quản lý chăm sóc sức khỏe toàn diện, được xây dựng với kiến trúc **microservices**, bao gồm:

### 🎨 Frontend Portals (3 Applications)

1. **Admin Portal** (`admin-vpc-v3`)
   - Quản lý hệ thống
   - Quản lý khóa học, dịch vụ
   - Quản lý khách hàng
   - Dashboard và báo cáo
   - Port: `3100`

2. **CRM Portal** (`crm-vpc-v3`)
   - Quản lý khách hàng
   - Sổ sức khỏe điện tử
   - Lịch tiêm chủng
   - Support tickets
   - Port: `3101`

3. **E-Learning Portal** (`elerning-vpc-v3`)
   - Hệ thống học trực tuyến
   - Đăng ký khóa học
   - Thanh toán tích hợp
   - Video streaming
   - Google Tag Manager
   - Port: `3102`

### ⚙️ Backend Services

1. **API Server** (`server-vpc`)
   - RESTful API
   - Authentication & Authorization
   - Business logic
   - File processing
   - Video conversion
   - Payment integration
   - Port: `3000`

### 🗄️ Infrastructure

1. **MongoDB** - Database
   - Port: `27017`
   - Version: 7.x

2. **MinIO** - Object Storage (S3-compatible)
   - API Port: `9000`
   - Console Port: `9001`

3. **Redis** - Queue System
   - Port: `6379`
   - Dùng cho Bull queue (video processing)

4. **Nginx** - Reverse Proxy (Optional)
   - Ports: `80`, `443`

---

## 🏗️ Kiến trúc

### High-Level Architecture

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
│MongoDB │    │    MinIO     │   │   Redis    │
│ :27017 │    │   :9000      │   │   :6379    │
└────────┘    └──────────────┘   └────────────┘
```

### Data Flow

```
User Request
    ↓
Frontend Portal (Nuxt 3)
    ↓
API Client (useApiClient)
    ↓
Backend API (Express)
    ↓
MongoDB / MinIO / Redis
    ↓
Response
```

---

## 🎨 Các thành phần

### Frontend Stack

**Framework**: Nuxt 3 (Vue 3)
- **Language**: TypeScript
- **UI Library**: Ant Design Vue 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

**Features**:
- SSR/SPA mode
- File-based routing
- Auto-imports
- Composables
- Middleware
- Server API routes

### Backend Stack

**Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB 7 (Mongoose)
- **Authentication**: JWT
- **File Storage**: MinIO, Cloudflare R2
- **Queue**: Bull (Redis)

**Features**:
- RESTful API
- JWT authentication
- File upload/processing
- Video HLS conversion
- Payment webhooks
- Background jobs

### Infrastructure

**Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Database**: MongoDB 7
- **Object Storage**: MinIO
- **Queue**: Redis
- **CDN**: Cloudflare R2

---

## ✨ Tính năng chính

### 🔐 Authentication & Authorization

- **JWT Authentication**: Token-based auth
- **Google OAuth 2.0**: Social login
- **Role-based Access Control**: Admin, Manager, Worker, User
- **Session Management**: Auto-refresh tokens

### 📚 E-Learning Features

- **Course Management**: CRUD operations
- **Video Streaming**: HLS format với security
- **Progress Tracking**: Learning progress
- **Quizzes & Exercises**: Interactive learning
- **Certificates**: Completion certificates
- **Payment Integration**: VNPay, SePay

### 💳 Payment System

- **Multiple Gateways**: VNPay, SePay
- **Cart System**: Shopping cart
- **Coupons**: Discount codes
- **Webhooks**: Payment callbacks
- **Transaction History**: Full audit trail

### 📊 Analytics & Tracking

- **Google Tag Manager**: Event tracking
- **Page View Tracking**: Automatic
- **Conversion Tracking**: Purchase, enrollment
- **User Behavior**: Video plays, searches

### 📁 File Management

- **Upload System**: Multi-file upload
- **Storage**: MinIO (local) + Cloudflare R2 (production)
- **Video Processing**: HLS conversion
- **Image Optimization**: Auto-resize
- **CDN Integration**: Cloudflare R2

### 🏥 Healthcare Features (CRM)

- **Health Book**: Electronic health records
- **Vaccination Schedule**: Appointment management
- **Support Tickets**: Customer support
- **Patient Management**: Customer profiles

---

## 🛠️ Công nghệ

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Nuxt | 3.x / 4.x | Framework |
| Vue | 3.x | UI Framework |
| TypeScript | 5.x | Language |
| Ant Design Vue | 4.x | UI Components |
| Pinia | 3.x | State Management |
| Tailwind CSS | 3.x | Styling |
| HLS.js | 1.x | Video Streaming |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.x | Web Framework |
| TypeScript | 5.x | Language |
| MongoDB | 7.x | Database |
| Mongoose | 6.x | ODM |
| JWT | 9.x | Authentication |
| Bull | 3.x | Job Queue |
| MinIO | Latest | Object Storage |

### DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Reverse Proxy |
| Redis | Queue & Cache |
| Cloudflare R2 | CDN & Storage |

### Third-party Services

| Service | Purpose |
|---------|---------|
| VNPay | Payment Gateway |
| SePay | Payment Gateway |
| Google OAuth | Authentication |
| Google Tag Manager | Analytics |
| SMTP | Email Service |
| Cloudflare R2 | Video/CDN Storage |

---

## 📚 Tài liệu

### 📖 Tài liệu hệ thống

- [README.md](../README.md) - Tài liệu chính
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Hướng dẫn deploy
- [MIGRATION_NOTE.md](../MIGRATION_NOTE.md) - Database migration

### 🏗️ Backend Documentation

- [server-vpc/README.md](../server-vpc/README.md) - Backend API docs
- [server-vpc/docs/sb-schema.md](../server-vpc/docs/sb-schema.md) - Database schema
- [server-vpc/docs/api-endpoint.md](../server-vpc/docs/api-endpoint.md) - API endpoints

### 🎨 Frontend Documentation

#### Admin Portal
- [admin-vpc-v3/README.md](../admin-vpc-v3/README.md)

#### CRM Portal
- [crm-vpc-v3/README.md](../crm-vpc-v3/README.md)
- [crm-vpc-v3/CRM_API_LIST.md](../crm-vpc-v3/CRM_API_LIST.md)

#### E-Learning Portal
- [elerning-vpc-v3/README.md](../elerning-vpc-v3/README.md)
- [elerning-vpc-v3/docs/INDEX.md](../elerning-vpc-v3/docs/INDEX.md) - Documentation index
- [elerning-vpc-v3/docs/API_DOCUMENTATION.md](../elerning-vpc-v3/docs/API_DOCUMENTATION.md) - API docs
- [elerning-vpc-v3/docs/GTM_SETUP.md](../elerning-vpc-v3/docs/GTM_SETUP.md) - GTM setup
- [elerning-vpc-v3/docs/SEO_CONFIGURATION.md](../elerning-vpc-v3/docs/SEO_CONFIGURATION.md) - SEO
- [elerning-vpc-v3/docs/PAYMENT_SYSTEM.md](../elerning-vpc-v3/docs/PAYMENT_SYSTEM.md) - Payment
- [elerning-vpc-v3/docs/CART_SYSTEM.md](../elerning-vpc-v3/docs/CART_SYSTEM.md) - Cart
- [elerning-vpc-v3/docs/PROJECT_STRUCTURE.md](../elerning-vpc-v3/docs/PROJECT_STRUCTURE.md) - Structure

---

## 🔄 Development Workflow

### 1. Setup Development Environment

```bash
# Clone repository
git clone <repository-url>
cd Van_Phuc_Care

# Start infrastructure (MongoDB, MinIO, Redis)
docker compose up -d mongodb minio redis

# Setup backend
cd server-vpc
npm install
npm run watch

# Setup frontend (choose one portal)
cd ../admin-vpc-v3  # or crm-vpc-v3 or elerning-vpc-v3
npm install
npm run dev
```

### 2. Development Process

1. **Feature Development**
   - Create feature branch
   - Develop feature
   - Test locally
   - Commit changes

2. **API Development**
   - Add endpoints in `server-vpc/src/controllers/`
   - Update models in `server-vpc/src/mongodb/`
   - Test with Postman/curl

3. **Frontend Development**
   - Create components in `components/`
   - Add composables in `composables/`
   - Update pages in `pages/`
   - Test in browser

### 3. Testing

- **Manual Testing**: Test all features
- **API Testing**: Use Postman collection
- **Integration Testing**: Test full flows
- **Browser Testing**: Test on multiple browsers

### 4. Deployment

- **Development**: `docker compose up -d`
- **Production**: `docker compose -f docker-compose.prod.yml up -d`
- **Or use**: `./deploy.sh production`

---

## 🔐 Security

### Authentication

- JWT tokens với expiration
- Refresh token mechanism
- Secure password hashing (bcrypt)
- OAuth 2.0 for social login

### Data Protection

- HTTPS in production
- Environment variables for secrets
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection

### API Security

- CORS configuration
- Rate limiting
- Request validation
- Token verification
- Role-based access

---

## 📊 Monitoring & Analytics

### Application Monitoring

- **Logs**: Docker logs
- **Health Checks**: `/api/health` endpoints
- **Error Tracking**: Console logs + error handlers

### Analytics

- **Google Tag Manager**: Event tracking
- **User Behavior**: Page views, clicks, conversions
- **Performance**: Page load times, API response times

---

## 🚀 Performance Optimization

### Frontend

- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets
- Caching strategies

### Backend

- Database indexing
- Query optimization
- Caching (Redis)
- Background jobs for heavy tasks
- Connection pooling

### Infrastructure

- Load balancing (Nginx)
- CDN (Cloudflare R2)
- Database replication (future)
- Horizontal scaling (future)

---

## 🔄 CI/CD (Future)

- GitHub Actions
- Automated testing
- Docker image building
- Automated deployment
- Rollback mechanism

---

## 📞 Support & Maintenance

### Support Channels

- **Email**: support@vanphuccare.com
- **Documentation**: Xem các file `.md`
- **Issues**: GitHub issues

### Maintenance Tasks

- Regular backups (MongoDB, MinIO)
- Security updates
- Dependency updates
- Performance monitoring
- Error monitoring

---

## 📝 Changelog

### Version 1.1.0 (2025-01-26)
- ✅ Google Tag Manager integration
- ✅ API Documentation improvements
- ✅ Documentation structure updates
- ✅ Event tracking system

### Version 1.0.0 (2025)
- ✅ Initial release
- ✅ All portals functional
- ✅ Payment integration
- ✅ File upload system
- ✅ OAuth authentication

---

**Last Updated**: 2025-01-26

