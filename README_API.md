# 📘 VAN PHUC CARE - API DOCUMENTATION PACKAGE

## 📦 Nội dung giao hàng

Gói tài liệu API bao gồm **2 files chính**:

### 1. 📄 Tài liệu API (Markdown)
**File**: `VAN_PHUC_CARE_API_DOCUMENTATION.md`

**Nội dung đầy đủ**:
- ✅ **100+ API endpoints** với ví dụ chi tiết
- ✅ **Request & Response examples** đầy đủ
- ✅ **Authentication flow** (Login, Logout, Reset Password)
- ✅ **Quản lý khách hàng** (CRUD, Import, Bulk operations)
- ✅ **Sản phẩm & Dịch vụ** (Products, Categories)
- ✅ **Khóa học** (Courses management)
- ✅ **Sổ sức khỏe** (Health Books)
- ✅ **Lịch tiêm chủng** (Vaccination Schedules)
- ✅ **Đơn hàng & Giao dịch** (Transactions)
- ✅ **Nội dung** (FAQs, Feedbacks)
- ✅ **Upload Files** (Images, Videos)
- ✅ **Error Codes** và troubleshooting

**Cách sử dụng**:
- Đọc trực tiếp file Markdown
- Import vào Notion/Confluence
- Convert sang PDF nếu cần

---

### 2. 📮 Postman Collection
**Files**:
- `Van_Phuc_Care_API.postman_collection.json` - Collection chứa tất cả APIs
- `Van_Phuc_Care.postman_environment.json` - Environment variables

**Cách sử dụng**:

1. **Cài đặt Postman**: https://www.postman.com/downloads/

2. **Import Collection**:
   - Mở Postman
   - Click **Import** (góc trên bên trái)
   - Kéo thả 2 files JSON vào
   - Click **Import**

3. **Chọn Environment**:
   - Click dropdown ở góc trên bên phải (Environment)
   - Chọn "**Van Phuc Care - Local**"

4. **Test API**:
   - Mở folder "**Admin APIs → Authentication**"
   - Chọn "**Login Admin**"
   - Sử dụng tài khoản demo:
     ```json
     {
       "username": "admin001@gmail.com",
       "password": "admin001",
       "origin": "vanphuccare.gensi.vn"
     }
     ```
   - Click **Send**
   - Token sẽ tự động lưu để dùng cho requests khác

5. **Khám phá APIs**:
   - Browse qua các folders
   - Mỗi request có sẵn examples
   - Modify và test theo nhu cầu

---

## 🚀 QUICK START

### Bước 1: Đọc tài liệu
```
Mở file: VAN_PHUC_CARE_API_DOCUMENTATION.md
```

### Bước 2: Setup Postman
```
1. Import 2 files JSON vào Postman
2. Chọn environment "Van Phuc Care - Local"
3. Test endpoint Login Admin
```

### Bước 3: Bắt đầu tích hợp
```
1. Copy request examples từ tài liệu
2. Test trong Postman để verify
3. Implement vào code của bạn
```

---

## 📊 THỐNG KÊ

| Metric | Value |
|--------|-------|
| **Total Endpoints** | 100+ |
| **Modules** | 12 |
| **Request Examples** | 100+ |
| **Response Examples** | 100+ |
| **File Size** | ~150KB |

---

## 🔑 THÔNG TIN QUAN TRỌNG

### API Base URL
```
Production:  http://103.216.119.104:3000
Admin API:   http://103.216.119.104:3000/api/a/*
User API:    http://103.216.119.104:3000/api/u/*
```

### Tài khoản Demo
```
Email:    admin001@gmail.com
Password: admin001
Role:     Super Admin
```

### Authentication
```
Type:   JWT (JSON Web Token)
Header: Authorization: Bearer {token}
Login:  POST /api/a/sessions/login
```

**Authentication Flow:**
1. Login với email/password → nhận `accessToken`
2. Lấy thông tin user với token
3. Sử dụng token cho các API requests

### Response Format
```json
Success: { "status": true, "data": {...} }
Error:   { "status": false, "message": "..." }
```

---

## 📞 HỖ TRỢ

### Liên hệ kỹ thuật
- **Email**: support@vanphuccare.com
- **Phone**: 1900 xxxx

### Các vấn đề thường gặp

**Q: Token expired?**
A: Login lại để lấy token mới

**Q: 401 Unauthorized?**
A: Kiểm tra token trong header `Authorization: Bearer {token}`

**Q: 404 Not Found?**
A: Kiểm tra lại URL endpoint

**Q: Validation errors?**
A: Xem chi tiết trong response body `errors` array

---

## ✅ CHECKLIST TRƯỚC KHI BẮT ĐẦU

- [ ] Đã đọc file `VAN_PHUC_CARE_API_DOCUMENTATION.md`
- [ ] Đã cài đặt Postman
- [ ] Đã import 2 files JSON
- [ ] Đã test Login API thành công
- [ ] Đã hiểu Response Format
- [ ] Đã hiểu Authentication flow

---

## 📝 GHI CHÚ

### Rate Limiting
- Limit: 100 requests/minute
- Header: `X-RateLimit-Remaining`

### File Upload
- Max image size: 5MB
- Max video size: 100MB
- Supported formats: JPG, PNG, GIF, WebP, MP4, AVI, MOV

### Best Practices
1. ✅ Luôn check response status
2. ✅ Handle errors gracefully
3. ✅ Refresh token khi expired
4. ✅ Use environment variables
5. ✅ Log requests for debugging

---

## 🎓 TÀI LIỆU THAM KHẢO

### Postman Learning
- [Postman Documentation](https://learning.postman.com/)
- [REST API Best Practices](https://restfulapi.net/)

### JWT Authentication
- [JWT.io](https://jwt.io/)
- [Introduction to JWT](https://jwt.io/introduction)

---

## 📋 DANH SÁCH FILES

```
📦 API Documentation Package
│
├── 📄 README_API.md (this file)
├── 📄 VAN_PHUC_CARE_API_DOCUMENTATION.md  ⭐ MAIN
├── 📮 Van_Phuc_Care_API.postman_collection.json
└── 📮 Van_Phuc_Care.postman_environment.json
```

---

## ✨ ĐIỂM NỔI BẬT

✅ **Đầy đủ**: 100+ endpoints được document chi tiết  
✅ **Dễ hiểu**: Ví dụ Request/Response đầy đủ  
✅ **Thực tế**: Dựa trên code production thực tế  
✅ **Sẵn sàng**: Test ngay với Postman  
✅ **Cập nhật**: Version mới nhất October 2025  

---

**© 2025 Van Phuc Care. All rights reserved.**

---

**🎉 Chúc bạn tích hợp API thành công! 🎉**

