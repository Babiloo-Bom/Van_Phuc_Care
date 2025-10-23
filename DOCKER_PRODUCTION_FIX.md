# 🚀 VAN PHUC CARE - PRODUCTION DEPLOYMENT FIX

## 📝 CÁC FILE CẦN THAY ĐỔI

### 1. Fix Backend MongoDB Connection (QUAN TRỌNG!)

**File: `server-vpc/src/initializers/mongoConnection.ts`**

```typescript
import mongoose from 'mongoose';

class MongoDB {
  private uri: string;

  constructor () {
    // Đọc MONGODB_URI từ environment variable
    // Fallback về MongoDB Atlas nếu không có env var (để backward compatibility)
    this.uri = process.env.MONGODB_URI || 'mongodb+srv://minhpham2615:6enDryMjUbIB6jRg@vanphucdev.o40sa.mongodb.net/?retryWrites=true&w=majority&appName=VanphucDev';
    console.log('MongoDB URI:', this.uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Log URI with masked password
    this.connect();
  }

  public async connect (): Promise<void> {
    try {
      // Cấu hình strictQuery
      mongoose.set('strictQuery', false);

      // Kết nối tới MongoDB
      await mongoose.connect(this.uri, { dbName: 'vanphuccare' });

      console.log('\x1b[32mMongoDB database connection successfully\x1b[0m');

      // Bật chế độ debug để log query
      mongoose.set('debug', true);
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
    }
  }
}

// Export instance để sử dụng trong các nơi khác
export default new MongoDB();
```

**Thay đổi chính:**
- Dòng 7-10: Đọc `process.env.MONGODB_URI` thay vì hardcode
- Dòng 10: Log URI với password được mask

---

### 2. Cập nhật docker-compose.yml

**File: `docker-compose.yml`**

**Thay đổi 1: API Service - MongoDB URI default value (Line 23)**
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - MONGODB_URI=${MONGODB_URI:-mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin}
  - JWT_SECRET=${JWT_SECRET:-your_jwt_secret_here}
```

**Thay đổi 2: MongoDB Service - Root password default (Line 54)**
```yaml
environment:
  - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME:-admin}
  - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD:-vanphuccare2025}
  - MONGO_INITDB_DATABASE=vanphuccare
```

**Thay đổi 3: Port mappings**
```yaml
# CRM Portal (Line 121)
ports:
  - "3101:3000"  # Đổi từ 3101:3001

# E-Learning Portal (Line 157)
ports:
  - "3102:3000"  # Đổi từ 3102:3002
```

**Thay đổi 4: Health checks**
```yaml
# CRM Health check (Line 134)
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]

# E-Learning Health check (Line 170)
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
```

---

### 3. Cập nhật Nginx Configuration

**File: `nginx/conf.d/default.conf`**

**Thay đổi upstream definitions (Lines 11-16)**
```nginx
upstream crm_backend {
    server crm:3000 max_fails=3 fail_timeout=30s;  # Đổi từ crm:3001
}

upstream elearning_backend {
    server elearning:3000 max_fails=3 fail_timeout=30s;  # Đổi từ elearning:3002
}
```

---

### 4. Tạo file .env

**File: `.env` (tạo mới ở root directory)**

```env
# ============================================
# Van Phuc Care - Environment Variables
# Docker Compose Configuration
# ============================================

# ============================================
# MongoDB Configuration
# ============================================
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=vanphuccare2025
MONGODB_URI=mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin

# ============================================
# JWT Secret for Backend API
# ============================================
JWT_SECRET=vanphuccare_jwt_secret_key_2025_production

# ============================================
# TinyMCE API Key (for rich text editor)
# ============================================
TINYMCE_KEY=g10x6c0ppoj4l6brqkg2j8l5lza4w6vmdu6k80o2g8ilbkju

# ============================================
# Application URLs (Production)
# ============================================
ADMIN_URL=http://localhost:3100
CRM_URL=http://localhost:3101
ELEARNING_URL=http://localhost:3102
API_URL=http://localhost:3000

# ============================================
# Node Environment
# ============================================
NODE_ENV=production
```

---

## 🔧 CÁC LỆNH THỰC HIỆN

### ⚠️ QUAN TRỌNG: Backup trước khi thực hiện!

```bash
# Backup database (nếu có data quan trọng)
docker compose exec mongodb mongodump --out /tmp/backup
docker cp vpc-mongodb:/tmp/backup ./mongodb-backup-$(date +%Y%m%d)

# Hoặc backup toàn bộ volume
docker run --rm -v vpc-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-data-backup.tar.gz /data
```

---

## 📦 DEPLOYMENT TRÊN SERVER

### Option A: Fresh Install (Server mới hoặc reset hoàn toàn)

```bash
# 1. Clone hoặc pull code mới
cd /path/to/Van_Phuc_Care
git pull origin main  # hoặc branch của bạn

# 2. Stop và xóa containers cũ (WARNING: XÓA DATA!)
docker compose down -v

# 3. Rebuild tất cả images
docker compose build

# 4. Start services
docker compose up -d

# 5. Đợi 10 giây để services khởi động
sleep 10

# 6. Check status
docker compose ps

# 7. View logs
docker compose logs api --tail 50
```

---

### Option B: Update Without Data Loss (Server đang chạy, có data)

```bash
# 1. Stop services (GIỮ volumes)
docker compose down

# 2. Backup data trước khi rebuild
docker run --rm -v vpc-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup-$(date +%Y%m%d).tar.gz /data

# 3. Pull code mới
git pull origin main

# 4. Rebuild ONLY backend API (vì có thay đổi code)
docker compose build api

# 5. Start services
docker compose up -d

# 6. Verify logs
docker compose logs api --tail 50 | grep -i "mongodb"
```

---

## ✅ VERIFICATION COMMANDS

### 1. Check all services status
```bash
docker compose ps
```

**Expected output:**
```
NAME            STATUS                   PORTS
vpc-admin       Up (healthy)            0.0.0.0:3100->3000/tcp
vpc-api         Up (healthy)            0.0.0.0:3000->3000/tcp
vpc-crm         Up (healthy)            0.0.0.0:3101->3000/tcp
vpc-elearning   Up (healthy)            0.0.0.0:3102->3000/tcp
vpc-mongodb     Up (healthy)            0.0.0.0:27017->27017/tcp
vpc-nginx       Up                      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

---

### 2. Check MongoDB connection in API logs
```bash
docker compose logs api | grep -i "mongodb"
```

**Expected output:**
```
MongoDB URI: mongodb://admin:****@mongodb:27017/vanphuccare?authSource=admin
MongoDB database connection successfully
```

**❌ Nếu thấy:**
```
MongoDB connection error: Could not connect to MongoDB Atlas
```
→ Backend chưa rebuild hoặc env var chưa load.

---

### 3. Test HTTP endpoints
```bash
# Test API
curl -I http://localhost:3000

# Test Admin Portal
curl -I http://localhost:3100

# Test CRM Portal
curl -I http://localhost:3101

# Test E-Learning Portal
curl -I http://localhost:3102
```

**Expected:** Tất cả trả về `HTTP/1.1 200 OK`

---

### 4. Check MongoDB authentication
```bash
# Inside MongoDB container
docker compose exec mongodb mongosh -u admin -p vanphuccare2025 --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

**Expected output:**
```json
{ ok: 1 }
```

---

### 5. Verify environment variables
```bash
# Check API container env vars
docker compose exec api printenv | grep MONGODB_URI

# Check MongoDB container env vars
docker compose exec mongodb printenv | grep MONGO
```

---

## 🐛 TROUBLESHOOTING

### Issue 1: MongoDB connection failed

**Error:**
```
MongoDB connection error: Could not connect to any servers
```

**Solution:**
```bash
# 1. Check MongoDB is running
docker compose ps mongodb

# 2. Check MongoDB logs
docker compose logs mongodb --tail 50

# 3. Test connection from API container
docker compose exec api sh -c "nc -zv mongodb 27017"

# 4. Restart MongoDB
docker compose restart mongodb

# 5. Wait and check API logs
sleep 10
docker compose logs api --tail 20
```

---

### Issue 2: API still connects to MongoDB Atlas

**Error:**
```
MongoDB URI: mongodb+srv://...@vanphucdev.o40sa.mongodb.net/...
```

**Solution:**
```bash
# Backend code chưa được rebuild!

# 1. Stop all services
docker compose down

# 2. Remove old API image
docker rmi van_phuc_care-api

# 3. Rebuild API
docker compose build api --no-cache

# 4. Start services
docker compose up -d

# 5. Verify logs
docker compose logs api | grep "MongoDB URI"
```

---

### Issue 3: Frontend apps show empty response

**Error:** Browser shows `ERR_EMPTY_RESPONSE` hoặc white screen

**Solution:**
```bash
# Check port mappings
docker compose ps

# Expected:
# vpc-crm         0.0.0.0:3101->3000/tcp  (NOT 3001!)
# vpc-elearning   0.0.0.0:3102->3000/tcp  (NOT 3002!)

# If wrong, fix docker-compose.yml and restart
docker compose down
docker compose up -d
```

---

### Issue 4: Permission denied in backend

**Error:**
```
EACCES: permission denied, mkdir '/app/tmp'
```

**Solution:**
```bash
# Rebuild backend with fixed permissions
docker compose build api --no-cache
docker compose up -d
```

---

## 🔐 SECURITY NOTES (CHO PRODUCTION)

### ⚠️ BẮT BUỘC thay đổi trước khi deploy production:

```env
# .env file - THAY ĐỔI CÁC GIÁ TRỊ NÀY!

# 1. MongoDB password (dùng password generator)
MONGO_ROOT_PASSWORD=YOUR_STRONG_PASSWORD_HERE_MIN_32_CHARS

# 2. JWT Secret (random string dài)
JWT_SECRET=YOUR_RANDOM_JWT_SECRET_MIN_64_CHARS

# 3. Update MongoDB URI
MONGODB_URI=mongodb://admin:YOUR_STRONG_PASSWORD@mongodb:27017/vanphuccare?authSource=admin
```

### Generate strong passwords:
```bash
# Linux/Mac
openssl rand -base64 32

# Or use online generator: https://passwordsgenerator.net/
```

---

## 📊 MONITORING COMMANDS

### Real-time logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f mongodb

# Last 100 lines
docker compose logs --tail 100

# With timestamps
docker compose logs -f --timestamps
```

### Resource usage
```bash
# CPU, Memory usage
docker stats

# Disk usage
docker system df

# Container sizes
docker compose ps --size
```

### Health checks
```bash
# Check health status
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"

# Inspect health check details
docker inspect vpc-api | grep -A 20 Health
```

---

## 🔄 RESTART STRATEGIES

### Restart specific service
```bash
# Restart without losing data
docker compose restart api

# Rebuild and restart
docker compose up -d --build api
```

### Full restart
```bash
# Keep data
docker compose restart

# With rebuild
docker compose down
docker compose up -d --build
```

### Clean restart (DELETE DATA!)
```bash
# WARNING: This will delete all data!
docker compose down -v
docker compose up -d --build
```

---

## 📦 BACKUP & RESTORE

### Backup MongoDB
```bash
# Create backup
docker compose exec mongodb mongodump -u admin -p vanphuccare2025 --authenticationDatabase admin --out /tmp/backup

# Copy to host
docker cp vpc-mongodb:/tmp/backup ./mongodb-backup-$(date +%Y%m%d)

# Or backup entire volume
docker run --rm -v vpc-mongodb-data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

### Restore MongoDB
```bash
# Copy backup to container
docker cp ./mongodb-backup vpc-mongodb:/tmp/restore

# Restore
docker compose exec mongodb mongorestore -u admin -p vanphuccare2025 --authenticationDatabase admin /tmp/restore
```

---

## 🎯 QUICK REFERENCE

### Start services
```bash
docker compose up -d
```

### Stop services
```bash
docker compose down
```

### Rebuild after code changes
```bash
docker compose build api
docker compose up -d
```

### View logs
```bash
docker compose logs -f api
```

### Check status
```bash
docker compose ps
```

### Restart service
```bash
docker compose restart api
```

### Access MongoDB shell
```bash
docker compose exec mongodb mongosh -u admin -p vanphuccare2025 --authenticationDatabase admin
```

### Access API container shell
```bash
docker compose exec api sh
```

---

## ✅ SUCCESS INDICATORS

### 1. API logs show:
```
MongoDB URI: mongodb://admin:****@mongodb:27017/vanphuccare?authSource=admin
Server is running on port 3000
MongoDB database connection successfully
```

### 2. All services healthy:
```bash
$ docker compose ps
NAME            STATUS
vpc-admin       Up (healthy)
vpc-api         Up (healthy)
vpc-crm         Up (healthy)
vpc-elearning   Up (healthy)
vpc-mongodb     Up (healthy)
vpc-nginx       Up
```

### 3. HTTP endpoints respond:
```bash
$ curl -I http://localhost:3000
HTTP/1.1 200 OK

$ curl -I http://localhost:3100
HTTP/1.1 200 OK

$ curl -I http://localhost:3101
HTTP/1.1 200 OK

$ curl -I http://localhost:3102
HTTP/1.1 200 OK
```

---

## 🆘 NEED HELP?

### Check logs first:
```bash
# API logs
docker compose logs api --tail 100

# MongoDB logs
docker compose logs mongodb --tail 100

# All logs with errors
docker compose logs | grep -i error
```

### Get service details:
```bash
# Inspect API container
docker inspect vpc-api

# Check environment variables
docker compose exec api printenv

# Check network
docker network inspect van-phuc-care-network
```

---

## 📞 SUPPORT COMMANDS

```bash
# Export all logs for support
docker compose logs > docker-logs-$(date +%Y%m%d-%H%M%S).txt

# Export configuration
docker compose config > docker-config-$(date +%Y%m%d).yml

# System information
docker version
docker compose version
docker info
```

---

**Ngày cập nhật:** $(date +%Y-%m-%d)
**Version:** 1.0.0

