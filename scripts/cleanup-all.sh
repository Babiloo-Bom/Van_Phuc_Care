#!/bin/bash

# Script tổng hợp để cleanup toàn bộ dữ liệu test
# Sử dụng: bash scripts/cleanup-all.sh

set -e  # Exit on error

echo "🧹 Bắt đầu cleanup toàn bộ dữ liệu test..."
echo ""

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Cleanup MongoDB
echo -e "${GREEN}📊 Bước 1: Cleanup MongoDB...${NC}"
if docker exec -i vpc-mongodb mongosh < scripts/cleanup-database.js; then
    echo -e "${GREEN}✅ MongoDB cleanup thành công${NC}"
else
    echo -e "${RED}❌ MongoDB cleanup thất bại${NC}"
    exit 1
fi

echo ""

# 2. Cleanup R2/MinIO
echo -e "${GREEN}☁️  Bước 2: Cleanup R2/MinIO...${NC}"
echo -e "${YELLOW}⚠️  Vui lòng xóa thủ công qua MinIO Console hoặc sử dụng mc/aws-cli${NC}"
echo -e "${YELLOW}   Xem hướng dẫn trong scripts/CLEANUP_GUIDE.md${NC}"

echo ""

# 3. Cleanup Log Files
echo -e "${GREEN}📝 Bước 3: Cleanup Log Files...${NC}"

# Cleanup API logs
if docker exec -it vpc-api sh -c "rm -rf /app/logs/* /app/tmp/*" 2>/dev/null; then
    echo -e "${GREEN}✅ Đã xóa API logs${NC}"
else
    echo -e "${YELLOW}⚠️  Không thể xóa API logs (container có thể không chạy)${NC}"
fi

# Cleanup Nginx logs
if docker exec -it vpc-nginx sh -c "rm -rf /var/log/nginx/*.log" 2>/dev/null; then
    echo -e "${GREEN}✅ Đã xóa Nginx logs${NC}"
else
    echo -e "${YELLOW}⚠️  Không thể xóa Nginx logs (container có thể không chạy)${NC}"
fi

# Cleanup MongoDB logs
if docker exec -it vpc-mongodb sh -c "rm -rf /var/log/mongodb/*.log" 2>/dev/null; then
    echo -e "${GREEN}✅ Đã xóa MongoDB logs${NC}"
else
    echo -e "${YELLOW}⚠️  Không thể xóa MongoDB logs${NC}"
fi

# Cleanup MinIO logs
if docker exec -it vpc-minio sh -c "rm -rf /var/log/minio/*.log" 2>/dev/null; then
    echo -e "${GREEN}✅ Đã xóa MinIO logs${NC}"
else
    echo -e "${YELLOW}⚠️  Không thể xóa MinIO logs (container có thể không chạy)${NC}"
fi

echo ""

# 4. Kiểm tra kết quả
echo -e "${GREEN}🔍 Bước 4: Kiểm tra kết quả...${NC}"

# Kiểm tra MongoDB
echo -e "${YELLOW}Kiểm tra MongoDB...${NC}"
USER_COUNT=$(docker exec -i vpc-mongodb mongosh --quiet --eval "use('vanphuccare'); db.users.countDocuments({ email: 'admin@gmail.com' })" 2>/dev/null || echo "0")
COURSE_COUNT=$(docker exec -i vpc-mongodb mongosh --quiet --eval "use('vanphuccare'); db.courses.countDocuments()" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "1" ]; then
    echo -e "${GREEN}✅ Admin user còn tồn tại${NC}"
else
    echo -e "${RED}❌ Admin user không tồn tại hoặc có vấn đề!${NC}"
fi

if [ "$COURSE_COUNT" = "0" ]; then
    echo -e "${GREEN}✅ Đã xóa tất cả courses${NC}"
else
    echo -e "${YELLOW}⚠️  Vẫn còn $COURSE_COUNT courses${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Hoàn thành cleanup!${NC}"
echo ""
echo -e "${YELLOW}📋 Các bước tiếp theo:${NC}"
echo "   1. Xóa R2/MinIO thủ công (xem scripts/CLEANUP_GUIDE.md)"
echo "   2. Kiểm tra lại user admin có thể đăng nhập"
echo "   3. Test lại các chức năng cơ bản"

