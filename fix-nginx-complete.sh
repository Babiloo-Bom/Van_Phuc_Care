#!/bin/bash

# Fix duplicate upstream error - Complete solution

echo "🔍 Đang kiểm tra các file config..."

# Kiểm tra file trong conf.d có upstream không
echo "📁 Files trong /etc/nginx/conf.d/:"
ls -la /etc/nginx/conf.d/ 2>/dev/null || echo "Không có file"

# Kiểm tra file trong sites-enabled
echo "📁 Files trong /etc/nginx/sites-enabled/:"
ls -la /etc/nginx/sites-enabled/

# Kiểm tra file trong sites-available
echo "📁 Files trong /etc/nginx/sites-available/:"
ls -la /etc/nginx/sites-available/

# Tìm tất cả file có upstream admin_backend
echo "🔍 Tìm file có upstream admin_backend:"
grep -r "upstream admin_backend" /etc/nginx/ 2>/dev/null || echo "Không tìm thấy"

echo ""
echo "🔧 Đang sửa..."

# Xóa TẤT CẢ file trong conf.d (trừ nginx.conf)
sudo rm -f /etc/nginx/conf.d/*.conf

# Xóa TẤT CẢ file trong sites-enabled
sudo rm -f /etc/nginx/sites-enabled/*

# Xóa file default nếu có
sudo rm -f /etc/nginx/sites-enabled/default

# Copy file mới vào sites-available
sudo cp /opt/vanphuccare/nginx/conf.d/default.conf.no-redirect /etc/nginx/sites-available/vanphuccare

# Tạo symlink
sudo ln -sf /etc/nginx/sites-available/vanphuccare /etc/nginx/sites-enabled/vanphuccare

# Test
echo "🧪 Test Nginx config..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ OK! Reloading..."
    sudo systemctl reload nginx
    echo "✅ Hoàn tất!"
else
    echo "❌ Vẫn còn lỗi. Kiểm tra lại file config."
    echo "📝 Xem nội dung file:"
    head -30 /etc/nginx/sites-available/vanphuccare
fi

