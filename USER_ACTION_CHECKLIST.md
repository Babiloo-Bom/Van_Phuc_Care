# ✅ User Action Checklist - Google OAuth Setup

## 📋 Bạn Cần Làm Gì Tiếp Theo?

### ✅ ĐÃ HOÀN THÀNH (Tự động)
- [x] Install packages (mongoose, jsonwebtoken) cho cả 3 projects
- [x] Tạo types, composables, components
- [x] Tạo server API routes & services
- [x] Cập nhật nuxt.config.ts
- [x] Viết documentation đầy đủ

---

### 🔲 CẦN BẠN LÀM (Manual Steps)

## Step 1: Setup Google Cloud Console ⏰ 5-10 phút

### 1.1. Truy cập Google Cloud Console
🔗 https://console.cloud.google.com/apis/credentials

### 1.2. Tạo hoặc chọn Project
- Click "Select a project" ở góc trên
- Chọn project hiện có HOẶC tạo mới ("New Project")

### 1.3. Enable Google+ API
- Vào "APIs & Services" > "Library"
- Tìm "Google+ API"
- Click "Enable"

### 1.4. Tạo OAuth 2.0 Client ID
- Vào "Credentials" tab
- Click "CREATE CREDENTIALS" > "OAuth client ID"
- Application type: **Web application**
- Name: `Van Phuc Care OAuth`

### 1.5. Thêm Authorized Redirect URIs

**Development (Local):**
```
http://localhost:3100/auth/google/callback
http://localhost:3101/auth/google/callback
http://localhost:3102/auth/google/callback
```

**Testing (Server IP):**
```
http://103.216.119.104:3100/auth/google/callback
http://103.216.119.104:3101/auth/google/callback
http://103.216.119.104:3102/auth/google/callback
```

**Production (Nếu có domain):**
```
https://admin.vanphuccare.com/auth/google/callback
https://crm.vanphuccare.com/auth/google/callback
https://elearning.vanphuccare.com/auth/google/callback
```

### 1.6. Copy Credentials
- Click "CREATE"
- Copy **Client ID** (dạng: xxx.apps.googleusercontent.com)
- Copy **Client Secret**
- Click "OK"

---

## Step 2: Cấu Hình Environment Variables ⏰ 3-5 phút

### 2.1. Admin Project
Tạo/cập nhật `admin-vpc-v3/.env`:

```env
# Paste Client ID từ Google Console
NUXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com

# Paste Client Secret từ Google Console
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# Base URL cho OAuth callback
NUXT_PUBLIC_BASE_URL=http://localhost:3100

# JWT Configuration
JWT_SECRET=van-phuc-care-super-secret-key-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# MongoDB Connection
MONGODB_URI=mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin

# Backend API
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/api/a
```

### 2.2. CRM Project
Tạo/cập nhật `crm-vpc-v3/.env`:

```env
NUXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NUXT_PUBLIC_BASE_URL=http://localhost:3101
JWT_SECRET=van-phuc-care-super-secret-key-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
MONGODB_URI=mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/api/a
```

### 2.3. E-Learning Project
Tạo/cập nhật `elerning-vpc-v3/.env`:

```env
NUXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NUXT_PUBLIC_BASE_URL=http://localhost:3102
JWT_SECRET=van-phuc-care-super-secret-key-2025
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
MONGODB_URI=mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin
NUXT_PUBLIC_API_HOST=http://103.216.119.104:3000
NUXT_PUBLIC_API_BASE=http://103.216.119.104:3000/api/a
```

---

## Step 3: Start & Test Projects ⏰ 10-15 phút

### 3.1. Start Admin Project (Terminal 1)
```bash
cd admin-vpc-v3
npm run dev
```

Mở browser: `http://localhost:3100/login`

### 3.2. Start CRM Project (Terminal 2)
```bash
cd crm-vpc-v3
npm run dev
```

Mở browser: `http://localhost:3101/login`

### 3.3. Start E-Learning Project (Terminal 3)
```bash
cd elerning-vpc-v3
npm run dev
```

Mở browser: `http://localhost:3102/login`

---

## Step 4: Test Google Login Flow

### Test Checklist - Admin (Port 3100)
- [ ] Mở `http://localhost:3100/login`
- [ ] Button "Đăng nhập với Google" hiển thị
- [ ] Button KHÔNG bị disabled
- [ ] Click button
- [ ] Redirect đến Google OAuth page
- [ ] Chọn tài khoản Google
- [ ] Cấp quyền (lần đầu)
- [ ] Redirect về `http://localhost:3100/`
- [ ] Mở DevTools > Application > LocalStorage
- [ ] Kiểm tra có `accessToken` và `user`
- [ ] Tên user hiển thị đúng trên UI

### Test Checklist - CRM (Port 3101)
- [ ] Lặp lại các bước trên cho `http://localhost:3101/login`
- [ ] Xác nhận Google auto-login (không cần chọn account lại)

### Test Checklist - E-Learning (Port 3102)
- [ ] Lặp lại các bước trên cho `http://localhost:3102/login`

---

## 🐛 Troubleshooting

### Vấn Đề 1: Button bị disabled
**Nguyên nhân:** `NUXT_PUBLIC_GOOGLE_CLIENT_ID` không được load

**Giải pháp:**
1. Check file `.env` có tồn tại?
2. Check Client ID có đúng format? (phải có `.apps.googleusercontent.com`)
3. Restart Nuxt dev server (`Ctrl+C` rồi `npm run dev`)
4. Check terminal console có error?

### Vấn Đề 2: Error "redirect_uri_mismatch"
**Nguyên nhân:** URI trong Google Console không khớp với app

**Giải pháp:**
1. Vào Google Console > Credentials
2. Click vào OAuth Client ID đã tạo
3. Kiểm tra "Authorized redirect URIs"
4. Đảm bảo có URI: `http://localhost:310X/auth/google/callback`
5. Save và thử lại

### Vấn Đề 3: 500 Internal Server Error sau callback
**Nguyên nhân:** `GOOGLE_CLIENT_SECRET` không đúng hoặc thiếu

**Giải pháp:**
1. Check file `.env` có `GOOGLE_CLIENT_SECRET`?
2. Copy lại từ Google Console
3. Restart Nuxt dev server

### Vấn Đề 4: "Failed to fetch" hoặc network error
**Nguyên nhân:** Backend API không chạy hoặc URL sai

**Giải pháp:**
1. Check `server-vpc` có đang chạy?
2. Test: `curl http://103.216.119.104:3000`
3. Nếu backend không chạy: App vẫn hoạt động với MockUserService

---

## 📊 Success Criteria

### ✅ Khi nào coi như thành công?

**Minimum (với MockUserService):**
- [ ] 3 projects đều start được (`npm run dev`)
- [ ] Button "Đăng nhập với Google" hiển thị
- [ ] Click button → redirect đến Google
- [ ] Sau khi grant permission → redirect về app
- [ ] User được lưu (xem console log "MockUserService")
- [ ] Token xuất hiện trong localStorage

**Optimal (với Backend API):**
- [ ] Tất cả như trên
- [ ] Console log hiện "✅ Step 3: User managed in database"
- [ ] User được lưu vào MongoDB
- [ ] Có thể query user từ database:
  ```bash
  docker exec -it vpc-api node -e "
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://admin:vanphuccare2025@mongodb:27017/vanphuccare?authSource=admin')
      .then(async () => {
        const users = await mongoose.connection.db.collection('users').find().toArray();
        console.log('Users:', users);
        process.exit(0);
      });
  "
  ```

---

## 📞 Cần Giúp Đỡ?

### Check Log Files
```bash
# Admin logs
cd admin-vpc-v3 && npm run dev

# Tìm error trong console output
# Thường có dạng: "❌" hoặc "Error:"
```

### Common Log Messages

**✅ Success:**
- `✅ Received authorization code from Google`
- `✅ Google login successful`
- `✅ Step 3: User managed in database`

**⚠️ Warning (OK to ignore):**
- `⚠️ Database service unavailable, falling back to MockUserService`
- Nghĩa là backend API không available, nhưng vẫn hoạt động bình thường

**❌ Error (Cần fix):**
- `❌ Google OAuth not configured`
- `❌ Token exchange failed`
- `❌ Failed to complete Google login`

---

## 🎯 Mục Tiêu

Sau khi hoàn thành checklist này:
- ✅ Bạn có thể đăng nhập bằng Google trên cả 3 projects
- ✅ User data được lưu trữ (MongoDB hoặc MockService)
- ✅ JWT tokens hoạt động đúng
- ✅ System sẵn sàng cho development tiếp theo

---

**Estimated Time:** 20-30 phút tổng cộng
**Difficulty:** ⭐⭐☆☆☆ (Easy-Medium)
**Prerequisites:** Tài khoản Google, Browser, Terminal

**Good luck! 🚀**

