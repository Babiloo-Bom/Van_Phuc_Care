# 🐳 DOCKER GUIDE - VAN PHUC CARE

> **Setup & Deploy Full Stack trong 10 phút**

---

## 📋 MỤC LỤC

1. [Quick Start](#-quick-start) - 5 phút
2. [Production Deployment](#-production-deployment) - Chi tiết
3. [Commands](#-commands) - Thường dùng
4. [Troubleshooting](#-troubleshooting) - Fix lỗi
5. [Security](#-security) - Best practices

---

## ⚡ QUICK START

### Yêu Cầu

```bash
docker --version          # Cần 20.10+
docker compose version    # Cần 2.0+
```

**Chưa có Docker?** https://www.docker.com/products/docker-desktop/

### 4 Bước Setup (5 phút)

**1. Copy Environment (10s)**
```bash
cp env.docker.example .env
cp server-vpc/.env.example server-vpc/.env
```

**2. Config (1 phút) - BẮT BUỘC!**
```bash
nano .env
```
Đổi:
```env
MONGO_ROOT_PASSWORD=your_secure_password
JWT_SECRET=your_random_32_char_string
TINYMCE_KEY=your_tinymce_key
```

```bash
nano server-vpc/.env
```
Đổi:
```env
MONGODB_URI=mongodb://admin:your_password@mongodb:27017/vanphuccare?authSource=admin
JWT_SECRET=same_as_above  # PHẢI GIỐNG .env
```

**⚠️ Tạo JWT Secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

**3. Build & Start (3-5 phút)**
```bash
make build
make up
```

**4. Verify (5s)**
```bash
make status
make health
```

### Access Applications

- **Admin**: http://localhost:3100
- **CRM**: http://localhost:3101
- **E-Learning**: http://localhost:3102
- **API**: http://localhost:3000

✅ **Thành công nếu thấy:** `✅ API healthy` cho tất cả services

---

## 🚀 PRODUCTION DEPLOYMENT

### Kiến Trúc

```
Internet → Nginx (80/443)
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
  Admin   CRM   E-Learning
  (3100) (3101)  (3102)
    │       │       │
    └───────┼───────┘
            ▼
        Backend API (3000)
            ▼
       MongoDB (27017)
```

### Yêu Cầu Server

- **RAM**: 4GB+ (Recommended: 8GB)
- **CPU**: 2+ cores
- **Disk**: 20GB+
- **OS**: Ubuntu 20.04+, CentOS 7+

### Deploy Steps

**1. Cài Docker (Ubuntu/Debian)**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**2. Clone Project**
```bash
cd /opt
git clone <your-repo>
cd Van_Phuc_Care
```

**3. Setup Environment**
```bash
cp env.docker.example .env
cp server-vpc/.env.example server-vpc/.env
nano .env  # Đổi passwords!
nano server-vpc/.env  # Đổi passwords!
```

**4. Build & Deploy**
```bash
sudo docker compose build
sudo docker compose up -d
```

**5. Verify**
```bash
sudo docker compose ps
sudo docker compose logs -f
curl http://localhost:3100  # Test Admin
```

### Setup SSL/HTTPS

**1. Install Certbot**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**2. Get Certificates**
```bash
sudo certbot --nginx -d admin.vanphuccare.com
sudo certbot --nginx -d crm.vanphuccare.com
sudo certbot --nginx -d learning.vanphuccare.com
```

**3. Auto-renewal**
```bash
sudo crontab -e
# Add: 0 0 * * 0 certbot renew --quiet
```

### Setup Domain DNS

```
A  admin.vanphuccare.com    → YOUR_SERVER_IP
A  crm.vanphuccare.com      → YOUR_SERVER_IP
A  learning.vanphuccare.com → YOUR_SERVER_IP
```

---

## 💻 COMMANDS

### Cơ Bản

```bash
make build         # Build images
make up            # Start services
make down          # Stop services
make restart       # Restart all
make status        # Check status
make logs          # View logs
make health        # Health check
```

### Logs & Debug

```bash
make logs              # Tất cả logs
make api-logs          # Backend logs
make logs-admin        # Admin logs
make logs-crm          # CRM logs
make logs-elearning    # E-Learning logs

# Shell access
make api-shell         # Backend shell
make shell-admin       # Admin shell
make db-shell          # MongoDB shell
```

### Database

```bash
make db-backup         # Backup MongoDB
make db-restore        # Restore MongoDB
make db-stats          # DB statistics
```

### Development

```bash
make dev-up            # Start dev mode (hot reload)
make dev-down          # Stop dev mode
make dev-logs          # Dev logs
```

### Maintenance

```bash
make clean             # Clean Docker cache
make prune             # Remove unused images
make rebuild           # Rebuild from scratch
make stats             # Resource usage
```

**Xem tất cả:** `make help` (40+ commands)

---

## 🐛 TROUBLESHOOTING

### Services không start

```bash
make logs              # Xem lỗi
make api-logs          # Xem API logs
docker compose ps      # Check status
```

### Port conflicts

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Hoặc đổi port trong docker-compose.yml
```

### Build lỗi

```bash
docker builder prune -a -f
make rebuild
```

### Connection errors

```bash
# Test MongoDB
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Test API
curl http://localhost:3000/api/health

# Check network
docker network inspect van-phuc-care-network
```

### Out of disk space

```bash
df -h
docker system df
docker system prune -a -f    # Clean all
docker volume prune -f        # Clean volumes (⚠️ DATA LOSS!)
```

### Reset tất cả

```bash
make down
docker compose down -v        # ⚠️ MẤT DATA!
make build
make up
```

---

## 🔐 SECURITY

### Environment Variables

- ❌ **KHÔNG COMMIT `.env`** vào git
- ✅ Dùng passwords mạnh (16+ chars)
- ✅ JWT_SECRET min 32 chars
- ✅ Đổi default passwords trước production

### Firewall

```bash
sudo ufw allow 80/tcp         # HTTP
sudo ufw allow 443/tcp        # HTTPS
sudo ufw deny 3000:3102/tcp   # Block direct access
sudo ufw enable
```

### SSL Certificate

- ✅ Use Let's Encrypt (free)
- ✅ Auto-renewal với cron
- ✅ Redirect HTTP → HTTPS

### Docker Security

- ✅ Non-root users (đã config)
- ✅ Specific image versions (không dùng `latest`)
- ✅ Scan images: `docker scan vpc-admin:latest`

---

## 📊 MONITORING

### Health Checks

```bash
make health
make status
curl http://localhost:3000/api/health
```

### Resource Usage

```bash
make stats             # Container stats
docker system df       # Disk usage
docker ps              # Running containers
```

### Logs

```bash
# Real-time logs
make logs

# Last 100 lines
docker compose logs --tail=100

# Since 30 minutes
docker compose logs --since 30m api

# Follow specific service
docker compose logs -f admin
```

---

## 🔄 UPDATE & ROLLBACK

### Update Application

```bash
git pull
docker compose up -d --build
# Hoặc: make deploy
```

### Zero-downtime Update

```bash
docker compose up -d --no-deps --build admin
docker compose up -d --no-deps --build crm
docker compose up -d --no-deps --build elearning
```

### Rollback

```bash
docker compose down
git checkout <previous-commit>
docker compose up -d --build
```

---

## 📝 ENVIRONMENT VARIABLES

### Minimum (.env)

```env
MONGO_ROOT_PASSWORD=your_password
JWT_SECRET=your_secret_32_chars
TINYMCE_KEY=your_key
```

### Backend (server-vpc/.env)

```env
MONGODB_URI=mongodb://admin:your_password@mongodb:27017/vanphuccare?authSource=admin
JWT_SECRET=same_as_above
NODE_ENV=production
```

### Optional (Email)

```env
MAIL_USER=email@gmail.com
MAIL_PASSWORD=app_password
```

**Full config:** `env.docker.example` và `server-vpc/.env.example`

---

## ✅ PRODUCTION CHECKLIST

Trước khi deploy:

- [ ] Đổi `MONGO_ROOT_PASSWORD`
- [ ] Generate strong `JWT_SECRET` (32+ chars)
- [ ] Config email settings
- [ ] Setup SSL certificates
- [ ] Configure domain DNS
- [ ] Setup firewall
- [ ] Test backup/restore
- [ ] Setup monitoring
- [ ] Document procedures
- [ ] Train team

---

## 🎓 DEVELOPMENT MODE

**Hot reload cho development:**

```bash
make dev-up            # Start
make dev-logs          # Logs
make dev-down          # Stop
```

**Features:**
- ✅ Hot reload tự động
- ✅ Code sync real-time
- ✅ Separate database
- ✅ Debug dễ hơn

---

## 📈 OPTIMIZATION

### Nginx Caching

```nginx
location ~* \.(css|js|jpg|png)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Enable HTTP/2

```nginx
listen 443 ssl http2;
```

### Image Optimization

- Resize images trước upload
- Use WebP format
- Enable lazy loading

---

## 🆘 HELP & SUPPORT

### Common Issues

| Issue | Solution |
|-------|----------|
| Port conflicts | Đổi ports trong `docker-compose.yml` |
| Build errors | Run `make rebuild` |
| Connection errors | Check `.env` files |
| Memory issues | Tăng Docker memory limit |
| Disk full | Run `docker system prune -a -f` |

### Documentation

- `make help` - All commands
- `env.docker.example` - Environment template
- `server-vpc/.env.example` - Backend template

### Check Status

```bash
make status            # Service status
make health            # Health check
make logs              # View logs
make stats             # Resource usage
```

---

## 🎯 ARCHITECTURE

**6 Services:**

| Service | Port | Size | Memory |
|---------|------|------|--------|
| Backend API | 3000 | 180MB | ~150MB |
| MongoDB | 27017 | - | ~300MB |
| Admin | 3100 | 250MB | ~120MB |
| CRM | 3101 | 250MB | ~120MB |
| E-Learning | 3102 | 250MB | ~120MB |
| Nginx | 80/443 | 50MB | ~10MB |

**Total:** ~930MB images, ~820MB RAM

**Optimization:** 85% smaller (5.2GB saved)

---

## 🎉 SUCCESS

**Nếu thấy:**

```
make health
🏥 Checking health status...
✅ API healthy
✅ Admin healthy
✅ CRM healthy
✅ E-Learning healthy
```

**🎊 Chúc mừng! Hệ thống chạy thành công!**

### Next Steps

1. ✅ Test all features
2. ✅ Configure monitoring
3. ✅ Setup backups
4. ✅ Train team
5. ✅ Go live!

---

## 📚 QUICK REFERENCE

### Most Used Commands

```bash
# Daily use
make up                # Start
make down              # Stop
make restart           # Restart
make logs              # Logs
make status            # Status

# Debugging
make api-logs          # API logs
make shell-admin       # Admin shell
make db-shell          # MongoDB shell

# Maintenance
make db-backup         # Backup
make clean             # Cleanup
make rebuild           # Rebuild
```

### URLs

```
Admin:      http://localhost:3100
CRM:        http://localhost:3101
E-Learning: http://localhost:3102
API:        http://localhost:3000
```

### Files

```
.env                    # Docker environment
server-vpc/.env         # Backend environment
docker-compose.yml      # Production
docker-compose.dev.yml  # Development
Makefile               # Commands
```

---

**© 2025 Van Phuc Care. Docker Setup Complete!** 🚀🐳

**Need more details?** Run `make help` for 40+ commands

