# 🧹 Hướng Dẫn Cleanup Dữ Liệu Test

Tài liệu này hướng dẫn cách xóa toàn bộ dữ liệu test, giữ lại chỉ user admin có email `admin@gmail.com`.

## 📋 Mục Lục

1. [Xóa Dữ Liệu MongoDB](#1-xóa-dữ-liệu-mongodb)
2. [Xóa Dữ Liệu R2/MinIO](#2-xóa-dữ-liệu-r2minio)
3. [Xóa Log Files](#3-xóa-log-files)
4. [Xóa Code/Log Thừa](#4-xóa-codelog-thừa)
5. [Kiểm Tra Sau Cleanup](#5-kiểm-tra-sau-cleanup)

---

## 1. Xóa Dữ Liệu MongoDB

### Cách 1: Sử dụng Script (Khuyến nghị)

```bash
# Chạy script cleanup database
docker exec -i vpc-mongodb mongosh < scripts/cleanup-database.js
```

### Cách 2: Chạy thủ công trong MongoDB Shell

```bash
# Kết nối vào MongoDB container
docker exec -it vpc-mongodb mongosh

# Chuyển sang database vanphuccare
use vanphuccare

# Copy và paste toàn bộ nội dung file scripts/cleanup-database.js
```

### Cách 3: Sử dụng MongoDB Compass hoặc Studio 3T

1. Kết nối tới MongoDB
2. Chọn database `vanphuccare`
3. Xóa các collections theo danh sách trong script
4. **QUAN TRỌNG**: Giữ lại user có email `admin@gmail.com` trong collections `users` và `admins`

### Collections sẽ bị xóa:

- ✅ `users` (trừ admin@gmail.com)
- ✅ `admins` (trừ admin@gmail.com)
- ✅ `courses`
- ✅ `chapters`
- ✅ `lessons`
- ✅ `quizzes`
- ✅ `quizattempts`
- ✅ `orders`
- ✅ `transactions`
- ✅ `carts`
- ✅ `ratings`
- ✅ `coursereviews`
- ✅ `customers`
- ✅ `tickets`
- ✅ `ticketcomments`
- ✅ `serviceregistrations`
- ✅ `healthbooks`
- ✅ `healthrecords`
- ✅ `vaccinationrecords`
- ✅ `schedulevaccins`
- ✅ `products`
- ✅ `productreviews`
- ✅ `productcollections`
- ✅ `processings`
- ✅ `documents`
- ✅ `medias`
- ✅ `banners`
- ✅ `faqs`
- ✅ `feedbacks`
- ✅ `news`
- ✅ `categories`
- ✅ `modules`
- ✅ `services`
- ✅ `exercises`
- ✅ `accesspermissions`

---

## 2. Xóa Dữ Liệu R2/MinIO

### Cách 1: Sử dụng MinIO Console UI (Dễ nhất)

1. Truy cập MinIO Console:
   - Local: `http://localhost:9001`
   - Production: `https://files.vanphuccare.vn` (nếu có)

2. Đăng nhập với credentials:
   - Access Key: `MINIO_ACCESS_KEY` từ `.env`
   - Secret Key: `MINIO_SECRET_KEY` từ `.env`

3. Chọn bucket `van-phuc-care` (hoặc bucket name từ config)

4. Chọn tất cả objects và xóa

### Cách 2: Sử dụng MinIO Client (mc)

```bash
# Cài đặt MinIO Client (nếu chưa có)
# https://min.io/docs/minio/linux/reference/minio-mc.html

# Cấu hình alias
mc alias set myminio http://localhost:9000 minioadmin minioadmin

# Xóa tất cả objects trong bucket
mc rm --recursive --force myminio/van-phuc-care/

# HOẶC xóa toàn bộ bucket và tạo lại
mc rb --force myminio/van-phuc-care
mc mb myminio/van-phuc-care
```

### Cách 3: Sử dụng AWS CLI (cho Cloudflare R2)

```bash
# Cấu hình AWS CLI với R2 credentials
aws configure --profile r2

# List tất cả objects
aws s3 ls s3://van-phuc-care --recursive --profile r2

# Xóa tất cả objects
aws s3 rm s3://van-phuc-care --recursive --profile r2
```

### Cách 4: Sử dụng Script Node.js

```bash
# Cài đặt dependencies (nếu chưa có)
cd server-vpc
npm install @aws-sdk/client-s3

# Chạy script
node scripts/cleanup-r2.js
```

**Lưu ý**: Đảm bảo đã set các environment variables:
- `R2_ENDPOINT` hoặc `MINIO_ENDPOINT`
- `R2_ACCESS_KEY_ID` hoặc `MINIO_ACCESS_KEY`
- `R2_SECRET_ACCESS_KEY` hoặc `MINIO_SECRET_KEY`
- `R2_BUCKET_NAME` hoặc `MINIO_BUCKET_NAME`

---

## 3. Xóa Log Files

### 3.1. Xóa Log Files trong Docker Containers

```bash
# Xóa log files trong API container
docker exec -it vpc-api sh -c "rm -rf /app/logs/* /app/tmp/*"

# Xóa log files trong Nginx container
docker exec -it vpc-nginx sh -c "rm -rf /var/log/nginx/*.log"

# Xóa log files trong MongoDB container
docker exec -it vpc-mongodb sh -c "rm -rf /var/log/mongodb/*.log"

# Xóa log files trong MinIO container
docker exec -it vpc-minio sh -c "rm -rf /var/log/minio/*.log"
```

### 3.2. Xóa Docker Logs

```bash
# Xóa tất cả Docker logs
docker-compose down
docker system prune -a --volumes

# HOẶC xóa logs của từng service
docker-compose logs --no-log-prefix api > /dev/null 2>&1
docker-compose logs --no-log-prefix nginx > /dev/null 2>&1
```

### 3.3. Xóa Log Files trên Server (nếu có)

```bash
# SSH vào server
ssh user@your-server

# Xóa log files
sudo rm -rf /var/log/vanphuccare/*
sudo rm -rf /tmp/vanphuccare/*
sudo rm -rf /var/tmp/vanphuccare/*
```

---

## 4. Xóa Code/Log Thừa

### 4.1. Xóa Console.log đã được thực hiện

✅ Đã xóa toàn bộ `console.log`, `console.error`, `console.warn` trong:
- `elerning-vpc-v3`
- `crm-vpc-v3`
- `admin-vpc-v3`

### 4.2. Xóa Temporary Files

```bash
# Xóa node_modules và rebuild (nếu cần)
cd elerning-vpc-v3 && rm -rf node_modules .nuxt
cd ../crm-vpc-v3 && rm -rf node_modules .nuxt
cd ../admin-vpc-v3 && rm -rf node_modules .nuxt
cd ../server-vpc && rm -rf node_modules dist

# Xóa Docker build cache
docker system prune -a --volumes
```

### 4.3. Xóa Test Files (nếu có)

```bash
# Tìm và xóa test files
find . -name "*.test.*" -type f -delete
find . -name "*.spec.*" -type f -delete
find . -name "__tests__" -type d -exec rm -rf {} +
```

### 4.4. Xóa Unused Dependencies

```bash
# Kiểm tra unused dependencies
cd server-vpc && npm-check-unused
cd ../elerning-vpc-v3 && npm-check-unused
cd ../crm-vpc-v3 && npm-check-unused
cd ../admin-vpc-v3 && npm-check-unused
```

---

## 5. Kiểm Tra Sau Cleanup

### 5.1. Kiểm Tra MongoDB

```bash
# Kết nối vào MongoDB
docker exec -it vpc-mongodb mongosh

# Kiểm tra số lượng documents
use vanphuccare
db.users.countDocuments()  // Nên = 1 (chỉ admin@gmail.com)
db.admins.countDocuments() // Nên = 1 (chỉ admin@gmail.com)
db.courses.countDocuments() // Nên = 0
db.orders.countDocuments() // Nên = 0
```

### 5.2. Kiểm Tra R2/MinIO

```bash
# Sử dụng MinIO Client
mc ls myminio/van-phuc-care/

# HOẶC sử dụng AWS CLI
aws s3 ls s3://van-phuc-care --recursive --profile r2
```

### 5.3. Kiểm Tra Log Files

```bash
# Kiểm tra log files
docker exec -it vpc-api ls -lah /app/logs/
docker exec -it vpc-nginx ls -lah /var/log/nginx/
```

### 5.4. Kiểm Tra User Admin

```bash
# Kết nối vào MongoDB
docker exec -it vpc-mongodb mongosh

# Kiểm tra admin user
use vanphuccare
db.users.findOne({ email: 'admin@gmail.com' })
db.admins.findOne({ email: 'admin@gmail.com' })
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Backup trước khi xóa**: Đảm bảo đã backup dữ liệu nếu cần thiết
2. **Kiểm tra kỹ**: Đảm bảo user `admin@gmail.com` không bị xóa
3. **Test lại**: Sau khi cleanup, test lại các chức năng cơ bản
4. **Production**: Nếu đang ở production, thực hiện vào giờ thấp điểm

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
- MongoDB connection: `docker logs vpc-mongodb`
- MinIO connection: `docker logs vpc-minio`
- API logs: `docker logs vpc-api`

