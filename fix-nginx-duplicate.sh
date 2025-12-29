#!/bin/bash

# Fix duplicate upstream error in Nginx

echo "🔧 Đang sửa lỗi duplicate upstream..."

# Xóa tất cả file config cũ trong sites-enabled (trừ vanphuccare)
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/*.conf 2>/dev/null || true

# Xóa file config cũ trong conf.d nếu có
sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Đảm bảo chỉ có file vanphuccare
sudo ln -sf /etc/nginx/sites-available/vanphuccare /etc/nginx/sites-enabled/vanphuccare

# Test config
echo "🧪 Đang test Nginx config..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config OK!"
    echo "🔄 Reload Nginx..."
    sudo systemctl reload nginx
    echo "✅ Hoàn tất!"
else
    echo "❌ Vẫn còn lỗi. Kiểm tra lại."
    exit 1
fi

