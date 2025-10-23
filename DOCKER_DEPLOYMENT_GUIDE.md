# 🐳 DOCKER DEPLOYMENT GUIDE - VAN PHUC CARE

> **Hướng dẫn đầy đủ deploy 3 Nuxt 3 applications với Docker**

---

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Cấu trúc files](#cấu-trúc-files)
4. [Deployment - Production](#deployment---production)
5. [Development với Docker](#development-với-docker)
6. [Nginx Reverse Proxy](#nginx-reverse-proxy)
7. [Monitoring & Logs](#monitoring--logs)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 TỔNG QUAN

### Kiến trúc

```
┌─────────────────────────────────────────┐
│           Nginx (Port 80/443)           │
│         Reverse Proxy & SSL             │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │               │
       ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Admin   │    │   CRM    │    │E-Learning│
│ (Port    │    │ (Port    │    │ (Port    │
│  3000)   │    │  3001)   │    │  3002)   │
└──────────┘    └──────────┘    └──────────┘
```

### 3 Applications

| App | Port | Domain | Container |
|-----|------|--------|-----------|
| **Admin Portal** | 3000 | admin.vanphuccare.com | vpc-admin |
| **CRM Portal** | 3001 | crm.vanphuccare.com | vpc-crm |
| **E-Learning** | 3002 | learning.vanphuccare.com | vpc-elearning |

---

## 💻 YÊU CẦU HỆ THỐNG

### Server Requirements

- **OS**: Ubuntu 20.04+, CentOS 7+, hoặc Debian 10+
- **RAM**: Minimum 4GB (Recommended: 8GB+)
- **CPU**: 2 cores (Recommended: 4+ cores)
- **Disk**: 20GB+ free space
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Cài đặt Docker

**Ubuntu/Debian:**
```bash
# Update packages
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
sudo docker --version
sudo docker compose version
```

**CentOS/RHEL:**
```bash
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
```

---

## 📁 CẤU TRÚC FILES

```
Van_Phuc_Care/
├── admin-vpc-v3/
│   ├── Dockerfile              ← Production build (multistage)
│   ├── Dockerfile.dev          ← Development build
│   ├── .dockerignore
│   └── ... (source code)
│
├── crm-vpc-v3/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .dockerignore
│   └── ... (source code)
│
├── elerning-vpc-v3/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .dockerignore
│   └── ... (source code)
│
├── nginx/
│   ├── nginx.conf              ← Main Nginx config
│   ├── conf.d/
│   │   └── default.conf        ← Site configs
│   └── ssl/                    ← SSL certificates (if using HTTPS)
│
├── docker-compose.yml          ← Production compose
├── docker-compose.dev.yml      ← Development compose
└── .env.example                ← Environment variables template
```

---

## 🚀 DEPLOYMENT - PRODUCTION

### Bước 1: Clone Repository

```bash
cd /opt
sudo git clone https://github.com/your-org/Van_Phuc_Care.git
cd Van_Phuc_Care
```

### Bước 2: Setup Environment Variables

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Update các giá trị trong `.env`:**
```env
TINYMCE_KEY=your_actual_tinymce_key
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NODE_ENV=production
```

### Bước 3: Build & Start Services

```bash
# Build images (first time or after code changes)
sudo docker compose build

# Start all services
sudo docker compose up -d

# Check status
sudo docker compose ps

# View logs
sudo docker compose logs -f
```

**Expected output:**
```
NAME              IMAGE                    STATUS
vpc-admin         vanphuccare-admin        Up 2 minutes (healthy)
vpc-crm           vanphuccare-crm          Up 2 minutes (healthy)
vpc-elearning     vanphuccare-elearning    Up 2 minutes (healthy)
vpc-nginx         nginx:alpine             Up 2 minutes
```

### Bước 4: Verify Deployment

```bash
# Test Admin Portal
curl http://localhost:3000

# Test CRM Portal
curl http://localhost:3001

# Test E-Learning Portal
curl http://localhost:3002

# Check health endpoints
curl http://localhost:3000/api/_health
curl http://localhost:3001/api/_health
curl http://localhost:3002/api/_health
```

### Bước 5: Setup Domain Names

**Update DNS records:**
```
A  admin.vanphuccare.com    → YOUR_SERVER_IP
A  crm.vanphuccare.com      → YOUR_SERVER_IP
A  learning.vanphuccare.com → YOUR_SERVER_IP
```

**Test domains:**
```bash
curl http://admin.vanphuccare.com
curl http://crm.vanphuccare.com
curl http://learning.vanphuccare.com
```

---

## 🛠️ DEVELOPMENT VỚI DOCKER

### Start Development Environment

```bash
# Start dev containers with hot reload
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f admin-dev

# Stop dev environment
docker compose -f docker-compose.dev.yml down
```

### Development URLs

- **Admin**: http://localhost:3000
- **CRM**: http://localhost:3001
- **E-Learning**: http://localhost:3002

### Features

✅ **Hot Reload** - Code changes tự động reload  
✅ **Volume Mounts** - Source code mount vào container  
✅ **Fast Rebuild** - Không cần rebuild image khi code thay đổi  

---

## 🔧 NGINX REVERSE PROXY

### Với Domain Names

Nginx sẽ route traffic dựa trên domain:

```
http://admin.vanphuccare.com     → admin:3000
http://crm.vanphuccare.com       → crm:3001
http://learning.vanphuccare.com  → elearning:3002
```

### Setup SSL/HTTPS

**1. Install Certbot:**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**2. Get SSL Certificates:**
```bash
sudo certbot --nginx -d admin.vanphuccare.com
sudo certbot --nginx -d crm.vanphuccare.com
sudo certbot --nginx -d learning.vanphuccare.com
```

**3. Auto-renewal:**
```bash
sudo crontab -e

# Add this line
0 0 * * 0 certbot renew --quiet
```

**4. Update nginx config để redirect HTTP → HTTPS:**
```nginx
server {
    listen 80;
    server_name admin.vanphuccare.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.vanphuccare.com;
    
    ssl_certificate /etc/letsencrypt/live/admin.vanphuccare.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.vanphuccare.com/privkey.pem;
    
    # ... rest of config
}
```

---

## 📊 MONITORING & LOGS

### View Logs

```bash
# All services
sudo docker compose logs -f

# Specific service
sudo docker compose logs -f admin

# Last 100 lines
sudo docker compose logs --tail=100 admin

# Filter by time
sudo docker compose logs --since 30m admin
```

### Check Resource Usage

```bash
# Container stats
sudo docker stats

# Disk usage
sudo docker system df

# Container inspect
sudo docker inspect vpc-admin
```

### Health Checks

Health checks run every 30 seconds:

```bash
# Check container health
sudo docker ps --filter health=healthy
sudo docker ps --filter health=unhealthy

# Manual health check
curl http://localhost:3000/api/_health
```

### Log Rotation

Logs tự động rotate với config:
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

**Manual cleanup:**
```bash
# Clean old logs
sudo docker system prune -f

# Remove unused images
sudo docker image prune -a -f

# Remove unused volumes
sudo docker volume prune -f
```

---

## 🚨 TROUBLESHOOTING

### Container không start

**Check logs:**
```bash
sudo docker compose logs admin
```

**Check container status:**
```bash
sudo docker ps -a
```

**Restart container:**
```bash
sudo docker compose restart admin
```

---

### Port already in use

**Find process using port:**
```bash
sudo lsof -i :3000
sudo netstat -tulpn | grep 3000
```

**Kill process:**
```bash
sudo kill -9 <PID>
```

**Or change port trong docker-compose.yml:**
```yaml
ports:
  - "3010:3000"  # Host:Container
```

---

### Build errors

**Clear cache và rebuild:**
```bash
# Clear Docker cache
sudo docker builder prune -a -f

# Rebuild without cache
sudo docker compose build --no-cache

# Start fresh
sudo docker compose down -v
sudo docker compose up -d --build
```

---

### Out of disk space

**Check disk usage:**
```bash
df -h
sudo docker system df
```

**Clean up:**
```bash
# Remove all stopped containers, unused images, networks
sudo docker system prune -a -f

# Remove volumes (careful!)
sudo docker volume prune -f

# Remove specific images
sudo docker image rm <image_id>
```

---

### Memory issues

**Increase Docker memory limit:**

Edit `/etc/docker/daemon.json`:
```json
{
  "default-ulimits": {
    "memlock": {
      "Hard": -1,
      "Name": "memlock",
      "Soft": -1
    }
  },
  "storage-driver": "overlay2"
}
```

**Restart Docker:**
```bash
sudo systemctl restart docker
```

---

### Network issues

**Check networks:**
```bash
sudo docker network ls
sudo docker network inspect van-phuc-care-network
```

**Recreate network:**
```bash
sudo docker compose down
sudo docker network prune -f
sudo docker compose up -d
```

---

## 📝 COMMANDS CHEAT SHEET

### Docker Compose

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart service
docker compose restart <service_name>

# View logs
docker compose logs -f <service_name>

# Rebuild image
docker compose build <service_name>

# Scale service
docker compose up -d --scale admin=3

# Execute command in container
docker compose exec admin sh
docker compose exec admin npm run build
```

### Docker

```bash
# List containers
docker ps
docker ps -a

# Stop container
docker stop <container_name>

# Remove container
docker rm <container_name>

# List images
docker images

# Remove image
docker rmi <image_name>

# Execute command
docker exec -it <container_name> sh

# Copy files
docker cp file.txt <container>:/app/
docker cp <container>:/app/file.txt ./
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Environment Variables

- ✅ Never commit `.env` file to git
- ✅ Use `.env.example` as template
- ✅ Store secrets in secure vault (AWS Secrets Manager, etc.)

### 2. Non-root User

Dockerfiles đã config để run as non-root user (`nuxtjs`):
```dockerfile
USER nuxtjs
```

### 3. Image Security

```bash
# Scan images for vulnerabilities
docker scan vpc-admin:latest

# Use specific versions, not `latest`
FROM node:20-alpine  # ✅ Good
FROM node:latest     # ❌ Bad
```

### 4. Network Security

- ✅ Use internal Docker networks
- ✅ Expose only necessary ports
- ✅ Use firewall rules

```bash
# Allow only specific ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000:3002/tcp
```

---

## 📈 PRODUCTION OPTIMIZATION

### 1. Enable Caching

Update nginx config:
```nginx
# Browser caching for static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Use CDN

Serve static assets từ CDN (Cloudflare, AWS CloudFront):
```env
NUXT_PUBLIC_CDN_URL=https://cdn.vanphuccare.com
```

### 3. Enable HTTP/2

```nginx
listen 443 ssl http2;
```

### 4. Optimize Images

```bash
# Install in Dockerfile
RUN apk add --no-cache imagemagick

# Compress images on upload
```

---

## 🔄 UPDATE & ROLLBACK

### Update Application

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild images
docker compose build

# 3. Restart với zero-downtime
docker compose up -d --no-deps --build admin
docker compose up -d --no-deps --build crm
docker compose up -d --no-deps --build elearning

# 4. Verify
docker compose ps
curl http://localhost:3000/api/_health
```

### Rollback

```bash
# 1. Stop current version
docker compose down

# 2. Checkout previous version
git checkout <previous_commit>

# 3. Rebuild
docker compose up -d --build

# Or use tagged images
docker tag vpc-admin:latest vpc-admin:backup
docker compose up -d
```

---

## 📞 HỖ TRỢ

### Liên hệ

- **Email**: devops@vanphuccare.com
- **Slack**: #devops channel

### Tài liệu tham khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nuxt 3 Deployment](https://nuxt.com/docs/getting-started/deployment)

---

**© 2025 Van Phuc Care. All rights reserved.**

