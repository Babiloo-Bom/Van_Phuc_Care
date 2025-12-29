# 🔧 Sửa Lỗi Duplicate Upstream Nginx

## ❌ Lỗi:
```
nginx: [emerg] duplicate upstream "admin_backend" in /etc/nginx/sites-enabled/vanphuccare:8
```

## ✅ Cách Sửa (Chạy trên Server):

```bash
# Bước 1: Xóa tất cả file config cũ
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/*.conf

# Bước 2: Xóa file trong conf.d nếu có duplicate
sudo rm -f /etc/nginx/conf.d/default.conf

# Bước 3: Đảm bảo chỉ có file vanphuccare
sudo ln -sf /etc/nginx/sites-available/vanphuccare /etc/nginx/sites-enabled/vanphuccare

# Bước 4: Test config
sudo nginx -t

# Bước 5: Nếu OK, reload
sudo systemctl reload nginx
```

## Hoặc chạy script tự động:

```bash
cd /opt/vanphuccare
chmod +x fix-nginx-duplicate.sh
./fix-nginx-duplicate.sh
```

