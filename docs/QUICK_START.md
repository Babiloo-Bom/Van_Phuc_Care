# 🚀 Quick Start Guide

> **Hướng dẫn nhanh để bắt đầu với hệ thống Van Phuc Care**

---

## ⚡ Quick Setup (5 phút)

### 1. Prerequisites

```bash
# Kiểm tra versions
node --version  # >= 18.x
npm --version   # >= 9.x
docker --version # >= 20.x
docker compose version # >= 2.x
```

### 2. Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd Van_Phuc_Care

# Copy environment template
cp env.docker.example .env

# Edit .env với các giá trị của bạn
# (MongoDB URI, JWT secrets, etc.)
```

### 3. Start với Docker Compose

```bash
# Start tất cả services
docker compose up -d --build

# Kiểm tra status
docker compose ps

# Xem logs
docker compose logs -f
```

### 4. Truy cập Applications

- **Admin Portal**: http://localhost:3100
- **CRM Portal**: http://localhost:3101
- **E-Learning Portal**: http://localhost:3102
- **Backend API**: http://localhost:3000
- **MinIO Console**: http://localhost:9001

### 5. Tạo Admin User

```bash
# Trong container
docker compose exec api node scripts/create-admin-user.js

# Hoặc local
cd server-vpc
node scripts/create-admin-user.js
```

**Default credentials:**
- Email: `admin@gmail.com`
- Password: `123456`

⚠️ **Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!**

---

## 🛠️ Development Setup

### Option 1: Docker Compose (Recommended)

```bash
# Start infrastructure only
docker compose up -d mongodb minio redis

# Run backend locally
cd server-vpc
npm install
npm run watch

# Run frontend locally (choose one)
cd ../admin-vpc-v3
npm install
npm run dev
```

### Option 2: Full Local

```bash
# 1. Start MongoDB, MinIO, Redis locally
# (hoặc dùng Docker cho infrastructure)

# 2. Backend
cd server-vpc
npm install
npm run watch

# 3. Frontend (mỗi portal riêng)
cd admin-vpc-v3
npm install
npm run dev
```

---

## 📝 Environment Variables

### Backend (.env trong server-vpc hoặc root)

```env
# Database
MONGODB_URI=mongodb://admin:password@localhost:27017/vanphuccare?authSource=admin

# JWT
JWT_SECRET=your_jwt_secret
JWT_ADMIN_SECRET=your_admin_secret
JWT_USER_SECRET=your_user_secret

# MinIO
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_ENDPOINT=localhost
MINIO_PORT=9000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Payment
SEPAY_API_TOKEN=your_sepay_token
VNP_TMNCODE=your_vnpay_code
VNP_HASHSECRET=your_vnpay_secret

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Frontend (.env trong mỗi portal)

```env
# API
NUXT_PUBLIC_API_HOST=http://localhost:3000
NUXT_PUBLIC_API_BASE=/api/u
NUXT_API_HOST_INTERNAL=http://localhost:3000

# Google OAuth
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GTM (E-Learning only)
NUXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

---

## 🧪 Testing

### Health Checks

```bash
# API Health
curl http://localhost:3000/api/health

# Frontend Health
curl http://localhost:3100/api/_health
```

### API Testing

Sử dụng Postman collection hoặc curl:

```bash
# Login
curl -X POST http://localhost:3000/api/u/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@gmail.com","password":"123456"}'

# Get courses (với token)
curl http://localhost:3000/api/a/courses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Port đã được sử dụng

```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Kill process hoặc đổi port trong docker-compose.yml
```

### MongoDB không kết nối được

```bash
# Kiểm tra container
docker compose ps mongodb

# Xem logs
docker compose logs mongodb

# Test connection
docker compose exec mongodb mongosh
```

### Frontend không kết nối API

1. Kiểm tra `NUXT_PUBLIC_API_HOST` trong `.env`
2. Kiểm tra CORS settings trong backend
3. Kiểm tra network tab trong DevTools

---

## 📚 Next Steps

1. **Đọc tài liệu**: [README.md](../README.md)
2. **Xem API docs**: [elerning-vpc-v3/docs/API_DOCUMENTATION.md](../elerning-vpc-v3/docs/API_DOCUMENTATION.md)
3. **Deployment**: [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
4. **System Overview**: [docs/SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)

---

## 🆘 Need Help?

- **Documentation**: Xem các file `.md` trong project
- **Issues**: Tạo issue trên repository
- **Email**: support@vanphuccare.com

---

**Last Updated**: 2025-01-26

