# 🖥️ Server Deployment Commands - Copy & Paste Ready

## ✅ Code đã được push lên GitHub thành công!
**Commit:** `a398c63`
**Files:** 71 files changed, 7650+ insertions

---

## 📝 Bước Tiếp Theo: Deploy Trên Server

### 🔐 BƯỚC 1: SSH vào Server

```bash
ssh root@103.216.119.104
```

**Password:** (nhập password server của bạn)

---

### 📥 BƯỚC 2: Pull Code Mới

Copy và paste từng command sau:

```bash
# Navigate to project directory
cd /home/backend/Van_Phuc_Care

# Check current status
git status

# Pull latest code from GitHub
git pull origin main
```

**Nếu gặp lỗi conflict:**
```bash
# Save any local changes
git stash

# Pull code
git pull origin main

# Optional: Restore local changes
git stash pop
```

**Hoặc hard reset (MẤT local changes):**
```bash
git fetch origin
git reset --hard origin/main
git clean -fd
```

---

### ⚙️ BƯỚC 3: Setup Environment Variables

#### 3.1. Backend API Environment

```bash
cd /home/backend/Van_Phuc_Care/server-vpc

# Tạo/cập nhật .env file
cat > .env << 'EOF'
PORT=3000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin

# JWT
JWT_SECRET=van-phuc-care-super-secret-key-production-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
ADMIN_JWT_SECRET=admin-jwt-secret-production-2025
USER_JWT_SECRET=user-jwt-secret-production-2025

# Google OAuth (THAY ĐỔI GIÁ TRỊ NÀY!)
GOOGLE_CLIENT_SECRET=THAY_DOI_GIA_TRI_NAY

# Email (Optional)
MAILER_HOST=smtp.gmail.com
MAILER_PORT=587
EOF

echo "✅ Backend .env created"
```

#### 3.2. Admin Frontend Environment

```bash
cd /home/backend/Van_Phuc_Care/admin-vpc-v3

cat > .env << 'EOF'
# Google OAuth (THAY ĐỔI 2 GIÁ TRỊ NÀY!)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=THAY_DOI_CLIENT_ID_NAY.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=THAY_DOI_CLIENT_SECRET_NAY

# URLs
NUXT_PUBLIC_BASE_URL=http://103.216.119.104:3100
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/api/a

# JWT
JWT_SECRET=van-phuc-care-super-secret-key-production-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin
EOF

echo "✅ Admin .env created"
```

#### 3.3. CRM Frontend Environment

```bash
cd /home/backend/Van_Phuc_Care/crm-vpc-v3

cat > .env << 'EOF'
# Google OAuth (THAY ĐỔI 2 GIÁ TRỊ NÀY!)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=THAY_DOI_CLIENT_ID_NAY.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=THAY_DOI_CLIENT_SECRET_NAY

# URLs
NUXT_PUBLIC_BASE_URL=http://103.216.119.104:3101
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/api/a

# JWT
JWT_SECRET=van-phuc-care-super-secret-key-production-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin
EOF

echo "✅ CRM .env created"
```

#### 3.4. E-Learning Frontend Environment

```bash
cd /home/backend/Van_Phuc_Care/elerning-vpc-v3

cat > .env << 'EOF'
# Google OAuth (THAY ĐỔI 2 GIÁ TRỊ NÀY!)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=THAY_DOI_CLIENT_ID_NAY.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=THAY_DOI_CLIENT_SECRET_NAY

# URLs
NUXT_PUBLIC_BASE_URL=http://103.216.119.104:3102
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/api/a

# JWT
JWT_SECRET=van-phuc-care-super-secret-key-production-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# MongoDB
MONGODB_URI=mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin
EOF

echo "✅ E-Learning .env created"
```

---

### 🐳 BƯỚC 4: Restart Services với Docker Compose

```bash
cd /home/backend/Van_Phuc_Care

# Stop all services
docker compose down

# Start all services
docker compose up -d

# Wait for services to start
sleep 10

# Check status
docker compose ps
```

**Expected output:**
```
NAME            STATUS          PORTS
vpc-api         Up X seconds    0.0.0.0:3000->3000/tcp
vpc-admin       Up X seconds    0.0.0.0:3100->3100/tcp
vpc-crm         Up X seconds    0.0.0.0:3101->3101/tcp
vpc-elearning   Up X seconds    0.0.0.0:3102->3102/tcp
vpc-nginx       Up X seconds    0.0.0.0:80->80/tcp
vpc-mongodb     Up X seconds    27017/tcp
```

---

### 📋 BƯỚC 5: Check Logs

```bash
# Backend API logs
docker logs vpc-api --tail 100

# Admin logs
docker logs vpc-admin --tail 50

# CRM logs
docker logs vpc-crm --tail 50

# E-Learning logs
docker logs vpc-elearning --tail 50

# Follow logs real-time (Ctrl+C to stop)
docker logs -f vpc-api
```

---

### ✅ BƯỚC 6: Verify Deployment

#### 6.1. Test Backend API

```bash
# Test root endpoint
curl http://103.216.119.104:3000

# Test login endpoint
curl -X POST http://103.216.119.104:3000/api/a/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin001@gmail.com","password":"admin001"}'
```

#### 6.2. Test Frontend (từ browser trên máy local của bạn)

Mở browser và truy cập:
- **Admin:** http://103.216.119.104:3100
- **CRM:** http://103.216.119.104:3101
- **E-Learning:** http://103.216.119.104:3102

**Kiểm tra:**
- [ ] Login page hiển thị
- [ ] Button "Đăng nhập với Google" có xuất hiện
- [ ] Không có error trong browser console (F12)

---

## 🔧 ALTERNATIVE: Rebuild Images (nếu có vấn đề)

Nếu services không start hoặc có lỗi, rebuild từng image:

```bash
cd /home/backend/Van_Phuc_Care

# Stop services
docker compose down

# Rebuild images sequentially (tránh out of memory)
echo "🔨 Building API..."
docker compose build api

echo "🔨 Building Admin..."
docker compose build admin

echo "🔨 Building CRM..."
docker compose build crm

echo "🔨 Building E-Learning..."
docker compose build elearning

echo "🔨 Building Nginx..."
docker compose build nginx

# Start services
docker compose up -d

# Check status
docker compose ps
```

---

## 🐛 Troubleshooting Commands

### Issue: Container exits immediately

```bash
# Check why container exited
docker logs vpc-admin --tail 100
docker logs vpc-crm --tail 100
docker logs vpc-elearning --tail 100

# Common issues:
# - Missing .env file
# - Wrong Node version
# - Port already in use
```

### Issue: Port already in use

```bash
# Check what's using the port
netstat -tulpn | grep :3100

# Kill the process
kill -9 <PID>

# Restart service
docker compose up -d admin
```

### Issue: MongoDB connection failed

```bash
# Check MongoDB is running
docker ps | grep mongodb

# Check MongoDB logs
docker logs vpc-mongodb --tail 50

# Restart MongoDB
docker compose restart mongodb
sleep 5
docker compose restart api
```

### Issue: Out of memory during build

```bash
# Build one at a time
docker compose build api
sleep 2
docker compose build admin
sleep 2
docker compose build crm
sleep 2
docker compose build elearning

# Then start
docker compose up -d
```

---

## 📊 Quick Status Check

Run này để xem tổng quan:

```bash
cd /home/backend/Van_Phuc_Care

echo "=== Git Status ==="
git log -1 --oneline

echo ""
echo "=== Docker Status ==="
docker compose ps

echo ""
echo "=== API Health ==="
curl -s http://localhost:3000 || echo "API not responding"

echo ""
echo "=== Disk Usage ==="
df -h | grep -E '(Filesystem|/dev/)'

echo ""
echo "=== Memory Usage ==="
free -h
```

---

## ✨ Post-Deployment Tasks

### 1. Setup Google Cloud Console OAuth

**Nếu chưa setup:**
1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Tạo OAuth 2.0 Client ID
3. Thêm Authorized redirect URIs:
   ```
   http://103.216.119.104:3100/auth/google/callback
   http://103.216.119.104:3101/auth/google/callback
   http://103.216.119.104:3102/auth/google/callback
   ```
4. Copy Client ID & Client Secret
5. Update `.env` files trên server với giá trị thật
6. Restart services: `docker compose restart admin crm elearning`

### 2. Test Google Login

1. Mở browser: http://103.216.119.104:3100/login
2. Click "Đăng nhập với Google"
3. Nếu button bị disabled → Check `.env` có `NUXT_PUBLIC_GOOGLE_CLIENT_ID`
4. Nếu redirect mismatch → Check Google Console redirect URIs

---

## 🎯 Success Checklist

- [ ] Code pulled từ GitHub thành công
- [ ] `.env` files created cho tất cả projects
- [ ] Docker Compose services running
- [ ] Backend API responding (curl test ✅)
- [ ] Admin frontend accessible (browser ✅)
- [ ] CRM frontend accessible (browser ✅)
- [ ] E-Learning frontend accessible (browser ✅)
- [ ] No critical errors in logs
- [ ] MongoDB connection working
- [ ] (Optional) Google OAuth configured
- [ ] (Optional) Google Login working

---

## 💾 Backup Commands (Optional)

Trước khi deploy, backup nếu cần:

```bash
# Backup current deployment
cd /home/backend/Van_Phuc_Care
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  .

# List backups
ls -lh backup-*.tar.gz
```

---

**Ready to deploy! 🚀**

Bắt đầu từ SSH command ở trên và làm theo từng bước!

