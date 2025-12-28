# 🚀 Deployment Guide - Van Phuc Care

> **Hướng dẫn chi tiết để deploy hệ thống Van Phuc Care lên môi trường production**

---

## 📋 Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị môi trường](#chuẩn-bị-môi-trường)
3. [Cấu hình biến môi trường](#cấu-hình-biến-môi-trường)
4. [Deploy với Docker Compose](#deploy-với-docker-compose)
5. [Deploy từng bước thủ công](#deploy-từng-bước-thủ-công)
6. [Cấu hình Nginx](#cấu-hình-nginx)
7. [Cấu hình SSL/HTTPS](#cấu-hình-sslhttps)
8. [Monitoring & Logs](#monitoring--logs)
9. [Troubleshooting](#troubleshooting)
10. [Rollback](#rollback)

---

## 💻 Yêu cầu hệ thống

### Server Requirements

- **OS**: Ubuntu 20.04 LTS hoặc cao hơn (khuyến nghị)
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB+)
- **CPU**: Tối thiểu 2 cores (khuyến nghị 4+ cores)
- **Disk**: Tối thiểu 20GB (khuyến nghị 50GB+ SSD)
- **Network**: Ports 80, 443, 3000, 3100, 3101, 3102, 27017, 9000, 9001

### Software Requirements

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0
- **Git**: >= 2.0
- **Nginx**: >= 1.18 (nếu dùng reverse proxy)

---

## 🔧 Chuẩn bị môi trường

### 1. Cài đặt Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker compose version
```

### 2. Cài đặt Nginx (Optional)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3. Clone repository

```bash
# Clone repository
git clone <repository-url>
cd Van_Phuc_Care

# Checkout production branch (nếu có)
git checkout production
```

### 4. Tạo thư mục cần thiết

```bash
# Tạo thư mục cho volumes
sudo mkdir -p /data/vanphuccare/{mongodb,minio,backup}
sudo chown -R $USER:$USER /data/vanphuccare

# Tạo thư mục cho logs
sudo mkdir -p /var/log/vanphuccare
sudo chown -R $USER:$USER /var/log/vanphuccare
```

---

## ⚙️ Cấu hình biến môi trường

### 1. Tạo file `production.env`

```bash
cp env.production.template production.env
nano production.env
```

### 2. Cấu hình các biến quan trọng

```env
# ============================================
# MongoDB Configuration
# ============================================
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=<STRONG_PASSWORD>
MONGODB_URI=mongodb://admin:<STRONG_PASSWORD>@mongodb:27017/vanphuccare?authSource=admin

# ============================================
# JWT Secrets (Generate strong random strings)
# ============================================
JWT_SECRET=<GENERATE_RANDOM_STRING>
JWT_ADMIN_SECRET=<GENERATE_RANDOM_STRING>
JWT_USER_SECRET=<GENERATE_RANDOM_STRING>
JWT_TTL=7d

# ============================================
# MinIO Configuration
# ============================================
MINIO_ACCESS_KEY=<GENERATE_RANDOM_STRING>
MINIO_SECRET_KEY=<GENERATE_RANDOM_STRING>
MINIO_BUCKET_NAME=van-phuc-care
MINIO_PUBLIC_URL=http://<YOUR_DOMAIN_OR_IP>:9000

# ============================================
# SMTP Configuration
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<YOUR_EMAIL>
SMTP_PASS=<YOUR_APP_PASSWORD>
SMTP_FROM_NAME=Van Phuc Care
SMTP_FROM_EMAIL=<YOUR_EMAIL>

# ============================================
# Payment Gateway - SePay
# ============================================
SEPAY_SANDBOX=false
SEPAY_API_TOKEN=<YOUR_SEPAY_TOKEN>
SEPAY_ACCOUNT_NO=<YOUR_ACCOUNT_NO>
SEPAY_ACCOUNT_NAME=Công Ty TNHH Vạn Phúc Care
SEPAY_WEBHOOK_URL=https://elearning.vanphuccare.com/api/u/orders/payment/sepay-webhook

# ============================================
# Payment Gateway - VNPay
# ============================================
VNP_TMNCODE=<YOUR_VNPAY_TMNCODE>
VNP_HASHSECRET=<YOUR_VNPAY_HASHSECRET>
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=https://elearning.vanphuccare.com/vnpay-return
IPN_URL=https://elearning.vanphuccare.com/api/u/orders/payment/vnpay-ipn

# ============================================
# Cloudflare R2 (Video Storage)
# ============================================
CLOUDFLARE_R2_BUCKET_NAME=vanphuccare-video-edu
CLOUDFLARE_R2_PUBLIC_URL=https://pub-d52b327cd86048b0aff51ec33d95f7fe.r2.dev
CLOUDFLARE_R2_ACCOUNT_ID=<YOUR_ACCOUNT_ID>
CLOUDFLARE_R2_ACCESS_KEY_ID=<YOUR_ACCESS_KEY>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<YOUR_SECRET_KEY>

# ============================================
# Base URLs
# ============================================
BASE_URL_ELEARNING=https://elearning.vanphuccare.com
BASE_URL_CRM=https://crm.vanphuccare.com
BASE_URL_ADMIN=https://admin.vanphuccare.com

# ============================================
# Google OAuth
# ============================================
NUXT_PUBLIC_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>

# ============================================
# TinyMCE
# ============================================
TINYMCE_KEY=<YOUR_TINYMCE_KEY>

# ============================================
# GitHub Container Registry (nếu dùng)
# ============================================
GITHUB_USERNAME=<YOUR_GITHUB_USERNAME>
GITHUB_TOKEN=<YOUR_GITHUB_TOKEN>
```

### 3. Generate JWT Secrets

```bash
# Generate random strings cho JWT secrets
openssl rand -hex 32
# Chạy 3 lần để có 3 secrets khác nhau
```

### 4. Bảo mật file `.env`

```bash
# Set permissions
chmod 600 production.env

# Không commit vào git
echo "production.env" >> .gitignore
```

---

## 🐳 Deploy với Docker Compose

### 1. Sử dụng script deploy (Khuyến nghị)

```bash
# Make script executable
chmod +x deploy.sh

# Deploy production
./deploy.sh production
```

Script sẽ tự động:
- Load environment variables từ `production.env`
- Pull latest Docker images
- Stop old containers
- Start new containers
- Check service health

### 2. Deploy thủ công

```bash
# Pull latest images
docker compose -f docker-compose.prod.yml --env-file production.env pull

# Stop old containers
docker compose -f docker-compose.prod.yml --env-file production.env down

# Start new containers
docker compose -f docker-compose.prod.yml --env-file production.env up -d --build

# Check status
docker compose -f docker-compose.prod.yml --env-file production.env ps
```

### 3. Verify deployment

```bash
# Check all containers are running
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f admin
docker compose -f docker-compose.prod.yml logs -f crm
docker compose -f docker-compose.prod.yml logs -f elearning

# Health check
curl http://localhost:3000/api/health
curl http://localhost:3100
curl http://localhost:3101
curl http://localhost:3102
```

---

## 🔄 Deploy từng bước thủ công

### 1. Deploy Backend API

```bash
cd server-vpc

# Build image
docker build -t vanphuccare-api:latest -f Dockerfile .

# Hoặc pull từ registry
docker pull ghcr.io/babiloo-bom/vanphuccare-api:latest

# Run container
docker run -d \
  --name vpc-api \
  --network van-phuc-care-network \
  --env-file ../production.env \
  -p 3000:3000 \
  --restart unless-stopped \
  vanphuccare-api:latest
```

### 2. Deploy MongoDB

```bash
docker run -d \
  --name vpc-mongodb \
  --network van-phuc-care-network \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=<STRONG_PASSWORD> \
  -e MONGO_INITDB_DATABASE=vanphuccare \
  -v /data/vanphuccare/mongodb:/data/db \
  -v /data/vanphuccare/mongodb-config:/data/configdb \
  -p 27017:27017 \
  --restart unless-stopped \
  mongo:7-jammy
```

### 3. Deploy MinIO

```bash
docker run -d \
  --name vpc-minio \
  --network van-phuc-care-network \
  -e MINIO_ROOT_USER=<MINIO_ACCESS_KEY> \
  -e MINIO_ROOT_PASSWORD=<MINIO_SECRET_KEY> \
  -v /data/vanphuccare/minio:/data \
  -p 9000:9000 \
  -p 9001:9001 \
  --restart unless-stopped \
  minio/minio:latest server /data --console-address ":9001"
```

### 4. Deploy Frontend Applications

```bash
# Admin Portal
cd admin-vpc-v3
docker build -t vanphuccare-admin:latest -f Dockerfile .
docker run -d \
  --name vpc-admin \
  --network van-phuc-care-network \
  --env-file ../production.env \
  -p 3100:3000 \
  --restart unless-stopped \
  vanphuccare-admin:latest

# CRM Portal
cd ../crm-vpc-v3
docker build -t vanphuccare-crm:latest -f Dockerfile .
docker run -d \
  --name vpc-crm \
  --network van-phuc-care-network \
  --env-file ../production.env \
  -p 3101:3000 \
  --restart unless-stopped \
  vanphuccare-crm:latest

# E-Learning Portal
cd ../elerning-vpc-v3
docker build -t vanphuccare-elearning:latest -f Dockerfile .
docker run -d \
  --name vpc-elearning \
  --network van-phuc-care-network \
  --env-file ../production.env \
  -p 3102:3000 \
  --restart unless-stopped \
  vanphuccare-elearning:latest
```

---

## 🌐 Cấu hình Nginx

### 1. Tạo Nginx configuration

```bash
sudo nano /etc/nginx/sites-available/vanphuccare
```

### 2. Nginx config cho production

```nginx
# Upstream servers
upstream api_backend {
    server localhost:3000;
}

upstream admin_backend {
    server localhost:3100;
}

upstream crm_backend {
    server localhost:3101;
}

upstream elearning_backend {
    server localhost:3102;
}

# Admin Portal
server {
    listen 80;
    server_name admin.vanphuccare.com;

    location / {
        proxy_pass http://admin_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# CRM Portal
server {
    listen 80;
    server_name crm.vanphuccare.com;

    location / {
        proxy_pass http://crm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# E-Learning Portal
server {
    listen 80;
    server_name elearning.vanphuccare.com;

    location / {
        proxy_pass http://elearning_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API proxy
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable site

```bash
sudo ln -s /etc/nginx/sites-available/vanphuccare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Cấu hình SSL/HTTPS

### 1. Sử dụng Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d admin.vanphuccare.com -d crm.vanphuccare.com -d elearning.vanphuccare.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 2. Update Nginx config với SSL

Certbot sẽ tự động update config, hoặc bạn có thể thêm:

```nginx
server {
    listen 443 ssl http2;
    server_name admin.vanphuccare.com;

    ssl_certificate /etc/letsencrypt/live/admin.vanphuccare.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.vanphuccare.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name admin.vanphuccare.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring & Logs

### 1. View logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f admin

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### 2. Container status

```bash
# Check all containers
docker compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats

# Check specific container
docker inspect vpc-api
```

### 3. Health checks

```bash
# API health
curl http://localhost:3000/api/health

# Frontend health (nếu có)
curl http://localhost:3100/api/_health
```

### 4. Database monitoring

```bash
# Connect to MongoDB
docker compose exec mongodb mongosh \
  -u admin -p <PASSWORD> \
  --authenticationDatabase admin \
  vanphuccare

# Check collections
show collections

# Check stats
db.stats()
```

---

## 🔧 Troubleshooting

### Container không start

```bash
# Check logs
docker compose logs <service-name>

# Check container status
docker ps -a

# Restart container
docker compose restart <service-name>
```

### Database connection error

```bash
# Check MongoDB is running
docker compose ps mongodb

# Check connection string
echo $MONGODB_URI

# Test connection
docker compose exec api node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Port already in use

```bash
# Find process using port
sudo lsof -i :3000
sudo netstat -tulpn | grep :3000

# Kill process
sudo kill -9 <PID>
```

### Out of disk space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a

# Remove old images
docker image prune -a
```

### Frontend không load

```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 🔙 Rollback

### 1. Rollback với Docker images

```bash
# List available images
docker images | grep vanphuccare

# Stop current containers
docker compose -f docker-compose.prod.yml down

# Tag previous image
docker tag vanphuccare-api:previous vanphuccare-api:latest

# Start with previous image
docker compose -f docker-compose.prod.yml up -d
```

### 2. Rollback database

```bash
# Restore from backup
mongorestore \
  --uri="mongodb://admin:<PASSWORD>@localhost:27017/vanphuccare?authSource=admin" \
  /backup/vanphuccare-<BACKUP_DATE>
```

### 3. Rollback code

```bash
# Checkout previous commit
git checkout <previous-commit-hash>

# Rebuild and redeploy
docker compose -f docker-compose.prod.yml up -d --build
```

---

## ✅ Post-Deployment Checklist

- [ ] Tất cả containers đang chạy
- [ ] Health checks pass
- [ ] SSL certificates valid
- [ ] Admin user có thể đăng nhập
- [ ] API endpoints hoạt động
- [ ] File upload hoạt động (MinIO)
- [ ] Email sending hoạt động (SMTP)
- [ ] Payment gateways configured
- [ ] Database backup scheduled
- [ ] Monitoring setup
- [ ] Logs rotation configured

---

## 🔄 Update Deployment

### 1. Pull latest code

```bash
git pull origin production
```

### 2. Rebuild và redeploy

```bash
./deploy.sh production
```

Hoặc:

```bash
docker compose -f docker-compose.prod.yml --env-file production.env pull
docker compose -f docker-compose.prod.yml --env-file production.env up -d --build
```

### 3. Verify update

```bash
# Check new version
docker compose exec api node -e "console.log(require('./package.json').version'))"
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0

