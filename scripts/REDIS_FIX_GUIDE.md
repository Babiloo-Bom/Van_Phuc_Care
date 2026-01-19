# Hướng dẫn sửa lỗi Redis Database Corruption

## Vấn đề
Redis container đang crash liên tục với lỗi:
```
Wrong signature trying to load DB from file
Fatal error loading the DB, check server logs. Exiting.
```

## Nguyên nhân
File database của Redis (`dump.rdb` hoặc `appendonly.aof`) bị corrupt hoặc có format không đúng.

## Giải pháp

### Cách 1: Sử dụng script tự động (Khuyến nghị)

1. **Upload script lên server:**
   ```bash
   # Copy file scripts/fix-redis-simple.sh lên server
   ```

2. **Chạy script:**
   ```bash
   chmod +x fix-redis-simple.sh
   sudo ./fix-redis-simple.sh
   ```

### Cách 2: Sửa thủ công

1. **Dừng Redis container:**
   ```bash
   docker stop vpc-redis
   ```

2. **Xóa file database bị corrupt:**
   
   **Option A: Xóa từ trong container (nếu container vẫn chạy được)**
   ```bash
   docker exec vpc-redis sh -c "rm -f /data/dump.rdb /data/appendonly.aof"
   ```
   
   **Option B: Xóa từ Docker volume:**
   ```bash
   # Tìm đường dẫn volume
   docker volume inspect vpc-redis-data
   
   # Xóa file (thay /var/lib/docker/volumes/... bằng đường dẫn thực tế)
   sudo rm -f /var/lib/docker/volumes/vpc-redis-data/_data/dump.rdb
   sudo rm -f /var/lib/docker/volumes/vpc-redis-data/_data/appendonly.aof
   ```
   
   **Option C: Xóa toàn bộ volume (mất hết dữ liệu Redis):**
   ```bash
   docker stop vpc-redis
   docker rm vpc-redis
   docker volume rm vpc-redis-data
   # Sau đó restart lại với docker-compose
   docker-compose up -d redis
   ```

3. **Khởi động lại Redis:**
   ```bash
   docker start vpc-redis
   ```

4. **Kiểm tra Redis đã chạy:**
   ```bash
   docker exec vpc-redis redis-cli ping
   # Nếu trả về "PONG" thì Redis đã chạy thành công
   ```

### Cách 3: Sửa bằng docker-compose

1. **Dừng Redis:**
   ```bash
   docker-compose stop redis
   ```

2. **Xóa volume Redis:**
   ```bash
   docker volume rm vpc-redis-data
   ```

3. **Khởi động lại:**
   ```bash
   docker-compose up -d redis
   ```

## Kiểm tra sau khi sửa

```bash
# Kiểm tra Redis đang chạy
docker ps | grep redis

# Kiểm tra logs
docker logs vpc-redis --tail 50

# Test Redis connection
docker exec vpc-redis redis-cli ping

# Xem thông tin Redis
docker exec vpc-redis redis-cli INFO server
```

## Lưu ý

⚠️ **Quan trọng:** 
- Xóa file database sẽ **mất toàn bộ dữ liệu** trong Redis (cache, sessions, queues, etc.)
- Điều này thường không ảnh hưởng nghiêm trọng vì Redis thường chỉ dùng để cache
- Nếu có dữ liệu quan trọng trong Redis, hãy backup trước khi xóa

## Phòng tránh lỗi này trong tương lai

1. **Cấu hình Redis persistence đúng cách:**
   - Sử dụng `appendonly yes` với `appendfsync everysec` (cân bằng giữa performance và durability)
   - Hoặc `save` directives phù hợp cho RDB snapshots

2. **Monitor Redis health:**
   ```bash
   # Thêm vào cron để check Redis
   */5 * * * * docker exec vpc-redis redis-cli ping || docker restart vpc-redis
   ```

3. **Backup Redis định kỳ:**
   ```bash
   # Backup Redis data
   docker exec vpc-redis redis-cli BGSAVE
   # Copy file dump.rdb từ volume
   ```

## Nếu vẫn còn lỗi

Nếu sau khi xóa file database mà Redis vẫn crash:

1. **Kiểm tra memory:**
   ```bash
   free -h
   # Nếu memory thấp, có thể cần tăng swap hoặc giảm Redis maxmemory
   ```

2. **Kiểm tra disk space:**
   ```bash
   df -h
   ```

3. **Xem logs chi tiết:**
   ```bash
   docker logs vpc-redis --tail 100
   ```

4. **Thử rebuild Redis container:**
   ```bash
   docker-compose stop redis
   docker-compose rm -f redis
   docker-compose up -d redis
   ```

