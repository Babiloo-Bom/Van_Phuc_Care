# 🔐 Google OAuth Setup Guide

## 📋 **Tổng quan**
Hướng dẫn thiết lập Google OAuth 2.0 cho ứng dụng Van Phuc Care Admin Portal.

## 🚀 **Bước 1: Tạo Google Cloud Project**

### 1.1 Truy cập Google Cloud Console
- Đi tới: https://console.cloud.google.com/
- Đăng nhập bằng tài khoản Google

### 1.2 Tạo Project mới
```bash
# Tên project: van-phuc-care-admin
# Project ID: van-phuc-care-admin-2024
```

## 🔑 **Bước 2: Cấu hình OAuth 2.0**

### 2.1 Bật Google+ API
1. Vào **APIs & Services** > **Library**
2. Tìm kiếm "Google+ API"
3. Click **Enable**

### 2.2 Tạo OAuth 2.0 Credentials
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Chọn **Web application**

### 2.3 Cấu hình OAuth Client
```json
{
  "name": "Van Phuc Care Admin Portal",
  "authorized_redirect_uris": [
    "http://localhost:3100/auth/google/callback",
    "https://admin.vanphuccare.com/auth/google/callback"
  ],
  "authorized_javascript_origins": [
    "http://localhost:3100",
    "https://admin.vanphuccare.com"
  ]
}
```

## 🔧 **Bước 3: Cấu hình Environment Variables**

### 3.1 Tạo file `.env`
```bash
# Google OAuth Configuration
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NUXT_PUBLIC_BASE_URL=http://localhost:3100
```

### 3.2 Lấy thông tin từ Google Cloud Console
1. Vào **APIs & Services** > **Credentials**
2. Click vào OAuth 2.0 Client ID vừa tạo
3. Copy **Client ID** và **Client Secret**

## 🛠️ **Bước 4: Cấu hình Backend API**

### 4.1 Tạo Google OAuth API Routes
```typescript
// server/api/auth/google/token.post.ts
export default defineEventHandler(async (event) => {
  // Exchange authorization code for access token
})

// server/api/auth/google/profile.post.ts  
export default defineEventHandler(async (event) => {
  // Get user profile from Google
})

// server/api/auth/google/login.post.ts
export default defineEventHandler(async (event) => {
  // Complete Google login flow
})
```

### 4.2 Cấu hình Database
```typescript
// Thêm field provider vào user model
interface User {
  id: string
  email: string
  name: string
  provider: 'local' | 'google'
  googleId?: string
  avatar?: string
}
```

## 🧪 **Bước 5: Testing**

### 5.1 Test OAuth Flow
1. Start development server: `npm run dev`
2. Truy cập: `http://localhost:3100/login`
3. Click "Đăng nhập bằng Google"
4. Kiểm tra redirect flow

### 5.2 Debug OAuth Issues
```typescript
// Thêm debug logs
console.log('🔧 Google OAuth Config:', {
  clientId: config.public.googleClientId,
  redirectUri: config.public.baseUrl + '/auth/google/callback'
})
```

## 🔒 **Bước 6: Security Best Practices**

### 6.1 Environment Variables
- ✅ **Client ID**: Có thể public
- ❌ **Client Secret**: Chỉ server-side
- ✅ **Redirect URIs**: Whitelist chính xác

### 6.2 OAuth Scopes
```typescript
const GOOGLE_SCOPES = [
  'openid',    // Required for OpenID Connect
  'email',     // User email
  'profile'    // User profile info
]
```

### 6.3 State Parameter
```typescript
// Sử dụng state parameter để prevent CSRF
const state = btoa(JSON.stringify({
  redirect: '/dashboard',
  timestamp: Date.now()
}))
```

## 🚨 **Troubleshooting**

### Lỗi thường gặp:

#### 1. "redirect_uri_mismatch"
```bash
# Kiểm tra redirect URI trong Google Console
# Phải match chính xác với URL callback
```

#### 2. "invalid_client"
```bash
# Kiểm tra Client ID và Client Secret
# Đảm bảo environment variables được load đúng
```

#### 3. "access_denied"
```bash
# User từ chối authorization
# Kiểm tra OAuth consent screen
```

## 📚 **Tài liệu tham khảo**

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

## ✅ **Checklist**

- [ ] Google Cloud Project created
- [ ] OAuth 2.0 credentials configured
- [ ] Environment variables set
- [ ] Backend API routes created
- [ ] Frontend components integrated
- [ ] OAuth flow tested
- [ ] Security measures implemented

---

**🎉 Chúc mừng! Google OAuth đã được thiết lập thành công!**