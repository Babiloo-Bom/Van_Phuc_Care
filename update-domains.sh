#!/bin/bash

# ============================================
# Script tự động cập nhật domain
# vanphuccare.com → vanphuccare.vn
# elearning.vanphuccare.com → edu.vanphuccare.vn
# ============================================

set -e

echo "🔄 Bắt đầu cập nhật domain..."

# Backup trước khi thay đổi
echo "📦 Đang backup files..."
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup các file quan trọng
cp docker-compose.prod.yml "$BACKUP_DIR/" 2>/dev/null || true
cp nginx/conf.d/default.conf "$BACKUP_DIR/" 2>/dev/null || true
cp production.env "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ Backup hoàn tất tại: $BACKUP_DIR"

# Tìm và thay thế trong các file
echo "🔍 Đang tìm và thay thế domain..."

# Thay thế vanphuccare.com → vanphuccare.vn
find . -type f \( -name "*.ts" -o -name "*.vue" -o -name "*.js" -o -name "*.txt" -o -name "*.yml" -o -name "*.yaml" -o -name "*.env" -o -name "*.conf" \) \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  ! -path "./backup-*/*" \
  -exec sed -i.bak 's/vanphuccare\.com/vanphuccare.vn/g' {} \;

# Thay thế elearning.vanphuccare.com → edu.vanphuccare.vn
find . -type f \( -name "*.ts" -o -name "*.vue" -o -name "*.js" -o -name "*.txt" -o -name "*.yml" -o -name "*.yaml" -o -name "*.env" -o -name "*.conf" \) \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  ! -path "./backup-*/*" \
  -exec sed -i.bak 's/elearning\.vanphuccare\.com/edu.vanphuccare.vn/g' {} \;

# Xóa các file backup .bak
find . -name "*.bak" -delete

echo "✅ Đã cập nhật domain trong tất cả files"
echo ""
echo "📝 Các thay đổi:"
echo "  - vanphuccare.com → vanphuccare.vn"
echo "  - elearning.vanphuccare.com → edu.vanphuccare.vn"
echo ""
echo "⚠️  Lưu ý:"
echo "  1. Kiểm tra lại các file đã được cập nhật"
echo "  2. Cập nhật DNS records trỏ về server"
echo "  3. Cài đặt SSL certificates mới cho domain mới"
echo "  4. Cập nhật Google OAuth redirect URIs"
echo "  5. Cập nhật VNPay và SePay webhook URLs"
echo ""
echo "✅ Hoàn tất!"

