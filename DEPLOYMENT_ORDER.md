# 📋 Thứ tự Triển khai - Van Phuc Care

> **Hướng dẫn thứ tự đúng để triển khai không bị lỗi**

---

## ⚠️ QUAN TRỌNG: Thứ tự Triển khai

**TL;DR**: Làm redirect domain cũ **SAU KHI** code mới đã được deploy và domain mới đã hoạt động.

---

## 🔄 Thứ tự Đúng (Recommended)

### Phase 1: Chuẩn bị Code (Local)

1. ✅ **Cập nhật code với domain mới** (trên máy local)
   - Chạy script `update-domains.sh` hoặc cập nhật thủ công
   - Test code trên local
   - Commit và push code

2. ✅ **Cấu hình DNS cho domain mới** (vanphuccare.vn)
   - Thêm A records cho domain mới
   - Đợi DNS propagate (5 phút - 2 giờ)

### Phase 2: Deploy Code Mới (Server)

3. ✅ **Deploy code mới lên server**
   - Clone/pull code mới
   - Cấu hình environment variables với domain mới
   - Deploy với Docker Compose
   - Test domain mới hoạt động

4. ✅ **Cài SSL certificate cho domain mới**
   - Certbot cho admin.vanphuccare.vn
   - Certbot cho crm.vanphuccare.vn
   - Certbot cho edu.vanphuccare.vn

5. ✅ **Kiểm tra domain mới hoạt động hoàn toàn**
   - Test tất cả chức năng
   - Test đăng nhập/đăng xuất
   - Test thanh toán
   - Test email

### Phase 3: Xử lý Domain Cũ (Sau khi domain mới hoạt động)

6. ✅ **Cấu hình redirect từ domain cũ** (CHỈ SAU KHI domain mới đã hoạt động)
   - Giữ DNS records ở domain cũ (trỏ về cùng server)
   - Cài SSL certificate cho domain cũ
   - Cấu hình redirect trong Nginx (đã có sẵn trong config)
   - Test redirect hoạt động

---

## ❌ Thứ tự SAI (Tránh)

### ❌ KHÔNG làm redirect domain cũ TRƯỚC khi deploy code mới

**Lý do:**
- Domain cũ redirect → domain mới
- Nhưng domain mới chưa có code mới → Lỗi 404 hoặc code cũ
- User truy cập domain cũ → redirect → domain mới → lỗi
- Trải nghiệm người dùng kém

### ❌ KHÔNG deploy code mới TRƯỚC khi DNS propagate

**Lý do:**
- Code mới dùng domain mới
- Nhưng DNS chưa propagate → domain mới không resolve
- Không thể cài SSL certificate
- Không thể test

---

## 📝 Checklist Chi tiết

### ✅ Bước 1: Chuẩn bị (Local)

- [ ] Cập nhật code với domain mới
- [ ] Test code trên local
- [ ] Commit code: `git commit -m "Update domains: vanphuccare.com → vanphuccare.vn"`
- [ ] Push code: `git push origin production`

### ✅ Bước 2: Cấu hình DNS (DNS Provider)

- [ ] Đăng nhập DNS provider của `vanphuccare.vn`
- [ ] Thêm A record: `@` → IP server
- [ ] Thêm A record: `admin` → IP server
- [ ] Thêm A record: `crm` → IP server
- [ ] Thêm A record: `edu` → IP server
- [ ] Đợi DNS propagate (kiểm tra bằng `dig` hoặc https://dnschecker.org/)

### ✅ Bước 3: Deploy Code Mới (Server)

- [ ] SSH vào server
- [ ] Clone/pull code mới
- [ ] Cập nhật `production.env` với domain mới
- [ ] **Copy Nginx config KHÔNG có redirect** (dùng khi deploy lần đầu):
    ```bash
    sudo cp /opt/vanphuccare/nginx/conf.d/default.conf.no-redirect /etc/nginx/sites-available/vanphuccare
    sudo ln -sf /etc/nginx/sites-available/vanphuccare /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```
- [ ] Deploy: `docker compose -f docker-compose.prod.yml --env-file production.env up -d --build`
- [ ] Kiểm tra containers đang chạy
- [ ] Test domain mới: `curl http://admin.vanphuccare.vn` (chưa có SSL)

### ✅ Bước 4: Cài SSL cho Domain Mới

- [ ] Cài SSL: `sudo certbot --nginx -d admin.vanphuccare.vn -d crm.vanphuccare.vn -d edu.vanphuccare.vn`
- [ ] Test SSL: `openssl s_client -connect admin.vanphuccare.vn:443`
- [ ] Test truy cập HTTPS từ browser

### ✅ Bước 5: Kiểm tra Domain Mới Hoạt động

- [ ] Truy cập https://admin.vanphuccare.vn → OK
- [ ] Truy cập https://crm.vanphuccare.vn → OK
- [ ] Truy cập https://edu.vanphuccare.vn → OK
- [ ] Test đăng nhập → OK
- [ ] Test các chức năng chính → OK

### ✅ Bước 6: Xử lý Domain Cũ (CHỈ SAU KHI domain mới hoạt động)

- [ ] Quyết định: Giữ lại (redirect) hay Xóa
- [ ] Nếu giữ lại:
  - [ ] Giữ DNS records ở domain cũ (trỏ về cùng IP server)
  - [ ] **Thay Nginx config**: Copy file `default.conf` (có redirect) thay cho `default.conf.no-redirect`
    ```bash
    sudo cp /opt/vanphuccare/nginx/conf.d/default.conf /etc/nginx/sites-available/vanphuccare
    sudo nginx -t
    ```
  - [ ] Cài SSL cho domain cũ: `sudo certbot --nginx -d admin.vanphuccare.com -d crm.vanphuccare.com -d elearning.vanphuccare.com -d vanphuccare.com`
  - [ ] Reload Nginx: `sudo systemctl reload nginx`
  - [ ] Test redirect: `curl -I http://admin.vanphuccare.com` → phải redirect về admin.vanphuccare.vn
- [ ] Nếu xóa:
  - [ ] Vào DNS provider của domain cũ
  - [ ] Xóa tất cả A records

---

## 🎯 Timeline Ước tính

| Bước | Thời gian | Ghi chú |
|------|-----------|---------|
| 1. Chuẩn bị code | 30 phút | Local |
| 2. Cấu hình DNS | 5 phút | + Đợi propagate: 5 phút - 2 giờ |
| 3. Deploy code mới | 30 phút | Server |
| 4. Cài SSL | 10 phút | Server |
| 5. Test domain mới | 30 phút | Server |
| 6. Xử lý domain cũ | 15 phút | Server (nếu redirect) |

**Tổng thời gian**: ~2-4 giờ (tùy DNS propagation)

---

## 🔍 Kiểm tra Sau Mỗi Bước

### Sau Bước 2 (DNS):
```bash
dig admin.vanphuccare.vn +short
# Phải trả về IP server
```

### Sau Bước 3 (Deploy):
```bash
curl http://admin.vanphuccare.vn
# Phải trả về HTML (có thể chưa có SSL)
```

### Sau Bước 4 (SSL):
```bash
curl https://admin.vanphuccare.vn
# Phải trả về HTML với SSL
```

### Sau Bước 5 (Test):
- Mở browser → https://admin.vanphuccare.vn
- Phải load được và hoạt động bình thường

### Sau Bước 6 (Redirect):
```bash
curl -I http://admin.vanphuccare.com
# Phải có header: Location: https://admin.vanphuccare.vn
```

---

## ⚠️ Lưu ý Quan trọng

1. **KHÔNG** làm redirect domain cũ trước khi domain mới hoạt động
2. **ĐỢI** DNS propagate trước khi deploy
3. **TEST** kỹ domain mới trước khi redirect domain cũ
4. **BACKUP** database và config trước khi deploy
5. **CÓ KẾ HOẠCH ROLLBACK** nếu có vấn đề

---

## 🆘 Rollback Plan

Nếu có vấn đề sau khi deploy:

1. **Rollback code**: 
   ```bash
   git checkout <previous-commit>
   docker compose -f docker-compose.prod.yml --env-file production.env up -d --build
   ```

2. **Rollback DNS**: 
   - Xóa DNS records của domain mới
   - Giữ nguyên domain cũ

3. **Rollback redirect**: 
   - Xóa redirect config trong Nginx
   - Restore Nginx config cũ

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. DNS propagation: https://dnschecker.org/
2. SSL certificate: https://www.ssllabs.com/ssltest/
3. Server logs: `docker compose logs`
4. Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

**Last Updated**: January 2025  
**Version**: 1.0.0

