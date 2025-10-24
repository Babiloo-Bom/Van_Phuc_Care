# 📘 VAN PHUC CARE - API DOCUMENTATION

> **Tài liệu API đầy đủ cho hệ thống Van Phuc Care Healthcare Management**

**Version**: 1.0.0  
**Last Updated**: October 23, 2025  
**Base URL**: `http://103.216.119.104:3000`

---

## 📋 MỤC LỤC

1. [Giới thiệu](#giới-thiệu)
2. [Authentication](#authentication)
3. [Tài khoản & Phân quyền](#tài-khoản--phân-quyền)
4. [Khách hàng (Customers)](#khách-hàng-customers)
5. [Sản phẩm & Dịch vụ](#sản-phẩm--dịch-vụ)
6. [Khóa học (Courses)](#khóa-học-courses)
7. [Sổ sức khỏe](#sổ-sức-khỏe)
8. [Lịch tiêm chủng](#lịch-tiêm-chủng)
9. [Đơn hàng & Giao dịch](#đơn-hàng--giao-dịch)
10. [Nội dung](#nội-dung)
11. [Upload File](#upload-file)
12. [Error Codes](#error-codes)

---

## 🎯 GIỚI THIỆU

### Thông tin chung

- **API Type**: RESTful API
- **Authentication**: JWT (JSON Web Token)
- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8

### Base URLs

| Môi trường | URL |
|------------|-----|
| Production | `http://103.216.119.104:3000` |
| Admin API | `http://103.216.119.104:3000/api/a/*` |
| User API | `http://103.216.119.104:3000/api/u/*` |
| Public API | `http://103.216.119.104:3000/api/*` |

**Lưu ý**: Tất cả endpoints đều có prefix `/api`. Ví dụ: `/api/a/sessions/login`

### Response Format

**Success Response:**
```json
{
  "status": true,
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "status": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

### Pagination Format

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

---

## 🔐 AUTHENTICATION

### 1. Login Admin

**POST** `/api/a/sessions/login`

Đăng nhập quản trị viên và nhận JWT token.

**Request:**
```json
{
  "username": "admin001@gmail.com",
  "password": "admin001",
  "remindAccount": false,
  "origin": "vanphuccare.gensi.vn"
}
```

**Lưu ý**: 
- `username` có thể là email hoặc số điện thoại
- `remindAccount`: true để lưu thông tin đăng nhập
- `origin`: domain của ứng dụng

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenExpireAt": "2025-10-31T00:00:00.000Z"
  }
}
```

**Sau khi login**, sử dụng token để lấy thông tin admin:
```
GET /api/a/sessions/current_admin
Authorization: Bearer {accessToken}
```

**Sử dụng Token:**

Sau khi login, thêm token vào header của các request tiếp theo:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. Get Current Admin

**GET** `/api/a/sessions/current_admin`

Lấy thông tin admin đang đăng nhập.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "fullname": "Nguyễn Văn A",
      "email": "admin@vanphuccare.com",
      "phone": "0987654321",
      "avatar": "https://...",
      "role": "admin",
      "permissions": [],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 3. Update Profile

**PATCH** `/api/a/sessions`

Cập nhật thông tin cá nhân admin.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "fullname": "Nguyễn Văn B",
  "phone": "0987654321",
  "avatar": "https://...",
  "address": "123 Đường ABC, Hà Nội"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "admin": {
      // Updated admin info
    }
  }
}
```

---

### 4. Change Password

**PATCH** `/api/a/sessions/change_password`

Đổi mật khẩu.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "oldPassword": "old_password_123",
  "newPassword": "new_password_456"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

### 5. Forgot Password

**POST** `/api/a/passwords/forgot_password`

Yêu cầu reset mật khẩu (gửi OTP qua email).

**Request:**
```json
{
  "email": "admin@vanphuccare.com"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "message": "OTP sent to email"
  }
}
```

---

### 6. Verify OTP

**POST** `/api/a/passwords/verify_otp`

Xác thực mã OTP.

**Request:**
```json
{
  "email": "admin@vanphuccare.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "token": "reset_token_abc123"
  }
}
```

---

### 7. Reset Password

**POST** `/api/a/passwords?email={email}&token={token}`

Reset mật khẩu với token từ OTP.

**Query Parameters:**
- `email`: Email của user
- `token`: Token nhận được sau verify OTP

**Request:**
```json
{
  "newPassword": "new_password_789"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

## 👥 KHÁCH HÀNG (CUSTOMERS)

### 1. Danh sách khách hàng

**GET** `/api/a/customers`

**Query Parameters:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items/trang (default: 10)
- `searchKey` (optional): Tìm kiếm theo tên, email, số điện thoại

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "customers": [
      {
        "_id": "cust001",
        "email": "customer@example.com",
        "firstname": "Nguyễn",
        "lastname": "Văn A",
        "phone": "0123456789",
        "address": "123 Đường ABC",
        "city": "Hà Nội",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### 2. Chi tiết khách hàng

**GET** `/api/a/customers/:customerId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "customer": {
      "_id": "cust001",
      "email": "customer@example.com",
      "firstname": "Nguyễn",
      "lastname": "Văn A",
      "phone": "0123456789",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "dob": "1990-01-01",
      "gender": "male",
      "status": "active",
      "totalOrders": 10,
      "totalSpent": 5000000,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 3. Tạo khách hàng mới

**POST** `/api/a/customers`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "email": "newcustomer@example.com",
  "firstname": "Trần",
  "lastname": "Thị B",
  "phone": "0987654321",
  "address": "456 Đường XYZ",
  "city": "Hồ Chí Minh",
  "dob": "1995-05-15",
  "gender": "female"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "customer": {
      "_id": "cust002",
      "email": "newcustomer@example.com",
      // ... full customer data
    }
  }
}
```

---

### 4. Cập nhật khách hàng

**PATCH** `/api/a/customers/:customerId`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "phone": "0999888777",
  "address": "789 Đường Mới",
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "customer": {
      // Updated customer data
    }
  }
}
```

---

### 5. Xóa khách hàng

**DELETE** `/api/a/customers/:customerId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "message": "Customer deleted successfully"
  }
}
```

---

### 6. Xóa nhiều khách hàng

**POST** `/api/a/customers/deleteMany`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "ids": ["cust001", "cust002", "cust003"]
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "deleted": 3
  }
}
```

---

### 7. Import khách hàng

**POST** `/api/a/customers/import`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:**
```
Form data:
- file: Excel/CSV file
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "imported": 95,
    "failed": 5,
    "errors": [
      {
        "row": 10,
        "error": "Invalid email format"
      }
    ]
  }
}
```

---

## 🛍️ SẢN PHẨM & DỊCH VỤ

### 1. Danh sách sản phẩm

**GET** `/api/a/products`

**Query Parameters:**
- `page` (optional): Số trang
- `limit` (optional): Số items/trang
- `categoryId` (optional): Lọc theo danh mục
- `searchKey` (optional): Tìm kiếm theo tên

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "products": [
      {
        "_id": "prod001",
        "name": "Vaccine COVID-19",
        "slug": "vaccine-covid-19",
        "price": 500000,
        "priceDiscount": 450000,
        "discount": 10,
        "typeDiscount": "percentage",
        "quantityInStock": 100,
        "quantitySelled": 50,
        "thumbnail": "https://...",
        "status": "active",
        "category": [
          {
            "_id": "cat001",
            "name": "Vaccine"
          }
        ],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 12
    }
  }
}
```

---

### 2. Chi tiết sản phẩm

**GET** `/api/a/products/:productId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "product": {
      "_id": "prod001",
      "name": "Vaccine COVID-19",
      "slug": "vaccine-covid-19",
      "shortDescription": "Vaccine phòng COVID-19...",
      "description": "Mô tả đầy đủ...",
      "thumbnail": "https://...",
      "images": ["https://...", "https://..."],
      "price": 500000,
      "priceDiscount": 450000,
      "discount": 10,
      "typeDiscount": "percentage",
      "category": [
        {
          "_id": "cat001",
          "name": "Vaccine"
        }
      ],
      "quantityInStock": 100,
      "quantitySelled": 50,
      "isOutOfStock": false,
      "showHome": true,
      "status": "active",
      "gtin": "1234567890123",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 3. Tạo sản phẩm mới

**POST** `/api/a/products`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Vaccine Viêm Gan B",
  "slug": "vaccine-viem-gan-b",
  "shortDescription": "Vaccine phòng viêm gan B",
  "description": "Mô tả đầy đủ về vaccine...",
  "thumbnail": "https://...",
  "images": ["https://..."],
  "price": 300000,
  "priceDiscount": 270000,
  "discount": 10,
  "typeDiscount": "percentage",
  "category": {
    "id": "cat001",
    "name": "Vaccine"
  },
  "quantityInStock": 200,
  "showHome": true,
  "gtin": "9876543210123"
}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "product": {
      "_id": "prod002",
      // ... full product data
    }
  }
}
```

---

### 4. Cập nhật sản phẩm

**PATCH** `/api/a/products/:productId`

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Vaccine Viêm Gan B (Cập nhật)",
  "price": 350000,
  "quantityInStock": 150,
  "status": "active"
}
```

---

### 5. Xóa sản phẩm

**DELETE** `/api/a/products/:productId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "status": true
  }
}
```

---

### 6. Danh mục sản phẩm

**GET** `/api/a/categories`

**Query Parameters:**
- `page`, `limit`: Pagination
- `type`: "product" | "blog"
- `searchKey`: Tìm kiếm
- `status`: Lọc theo trạng thái

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "categories": [
      {
        "_id": "cat001",
        "title": "Vaccine",
        "slug": "vaccine",
        "thumbnail": "https://...",
        "type": "product",
        "postCount": 10,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

---

### 7. Tạo danh mục

**POST** `/api/a/categories`

**Request:**
```json
{
  "title": "Dịch vụ khám",
  "slug": "dich-vu-kham",
  "thumbnail": "https://...",
  "type": "product"
}
```

---

## 📚 KHÓA HỌC (COURSES)

### 1. Danh sách khóa học

**GET** `/api/a/courses`

**Query Parameters:**
- `page`, `limit`: Pagination
- `searchKey`: Tìm theo mã khóa học
- `from`, `to`: Lọc theo ngày
- `status`: Lọc theo trạng thái
- `branch`, `course`: Lọc theo chi nhánh/khóa học

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "courses": [
      {
        "_id": "course001",
        "code": "COURSE001",
        "name": "Chăm sóc sức khỏe thai nhi",
        "thumbnail": "https://...",
        "shortDescription": "Khóa học về...",
        "order": 1,
        "status": "active",
        "notes": "Ghi chú...",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 30,
      "page": 1,
      "limit": 20
    }
  }
}
```

---

### 2. Chi tiết khóa học

**GET** `/api/a/courses/:courseId`

**Headers:**
```
Authorization: Bearer {token}
```

---

### 3. Tạo khóa học mới

**POST** `/api/a/courses`

**Request:**
```json
{
  "code": "COURSE002",
  "name": "Dinh dưỡng cho trẻ",
  "order": 2,
  "thumbnail": "https://...",
  "link": "https://...",
  "title": "Khóa học dinh dưỡng",
  "shortDescription": "Học về dinh dưỡng..."
}
```

---

### 4. Cập nhật khóa học

**PATCH** `/api/a/courses/:courseId`

**Request:**
```json
{
  "name": "Dinh dưỡng cho trẻ (Updated)",
  "status": "active",
  "order": 3
}
```

---

### 5. Xóa khóa học

**DELETE** `/api/a/courses/:courseId`

---

## 📖 SỔ SỨC KHỎE

### 1. Danh sách sổ sức khỏe

**GET** `/api/a/health-book/all`

**Query Parameters:**
- `page`, `limit`: Pagination

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "healthBooks": [
      {
        "_id": "hb001",
        "customerId": "cust001",
        "name": "Nguyễn Văn C",
        "dob": "2020-01-01",
        "gender": "male",
        "weight": "15kg",
        "height": "100cm",
        "healthCondition": "Khỏe mạnh",
        "domain": "vanphuccare",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

---

### 2. Chi tiết sổ sức khỏe

**GET** `/api/a/health-book/:id`

---

### 3. Lấy sổ theo ngày

**GET** `/api/a/health-book/byDate/:customerId`

**Query Parameters:**
- `date`: Ngày cần tra (YYYY-MM-DD)

---

### 4. Tạo sổ sức khỏe

**POST** `/api/a/health-book`

**Request:**
```json
{
  "customerId": "cust001",
  "name": "Nguyễn Văn D",
  "dob": "2021-05-15",
  "gender": "male",
  "weight": "12kg",
  "height": "85cm",
  "healthCondition": "Khỏe mạnh",
  "domain": "vanphuccare"
}
```

---

### 5. Cập nhật sổ sức khỏe

**PATCH** `/api/a/health-book/:id`

**Request:**
```json
{
  "weight": "13kg",
  "height": "90cm",
  "healthCondition": "Tốt, không có vấn đề"
}
```

---

### 6. Xóa sổ sức khỏe

**DELETE** `/api/a/health-book/:id`

---

### 7. Lấy comments

**GET** `/api/a/comments`

**Query Parameters:**
- `healthBookId`: ID của sổ sức khỏe

---

### 8. Tạo comment

**POST** `/api/a/comments`

**Request:**
```json
{
  "healthBookId": "hb001",
  "content": "Ghi chú từ bác sĩ..."
}
```

---

### 9. Xóa comment

**DELETE** `/api/a/comments/:id`

---

## 💉 LỊCH TIÊM CHỦNG

### 1. Danh sách lịch tiêm

**GET** `/api/a/schedule-vaccin`

**Query Parameters:**
- `page`, `limit`: Pagination

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "schedules": [
      {
        "_id": "sch001",
        "customerId": "cust001",
        "title": "Lịch tiêm vaccine COVID-19",
        "content": "Mũi thứ 2",
        "time": "2024-12-15 09:00",
        "numberOfInjections": "2",
        "address": "123 Đường ABC, Hà Nội",
        "status": "scheduled",
        "domain": "vanphuccare",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

---

### 2. Chi tiết lịch tiêm

**GET** `/api/a/schedule-vaccin/:id`

---

### 3. Tạo lịch tiêm mới

**POST** `/api/a/schedule-vaccin`

**Request:**
```json
{
  "customerId": "cust001",
  "title": "Lịch tiêm vaccine Viêm Gan B",
  "content": "Mũi thứ 1",
  "time": "2024-12-20 10:00",
  "numberOfInjections": "1",
  "address": "456 Đường XYZ, HCM",
  "status": "scheduled",
  "domain": "vanphuccare"
}
```

---

### 4. Cập nhật lịch tiêm

**PATCH** `/api/a/schedule-vaccin/:id`

**Request:**
```json
{
  "time": "2024-12-20 14:00",
  "status": "completed"
}
```

**Các trạng thái:**
- `scheduled`: Đã lên lịch
- `completed`: Đã hoàn thành
- `cancelled`: Đã hủy

---

### 5. Xóa lịch tiêm

**DELETE** `/api/a/schedule-vaccin/:id`

---

## 💰 ĐƠN HÀNG & GIAO DỊCH

### 1. Danh sách giao dịch

**GET** `/api/a/transactions`

**Query Parameters:**
- `page`, `limit`: Pagination

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "transactions": [
      {
        "_id": "trans001",
        "origin": "order123",
        "type": "payment",
        "title": "Thanh toán đơn hàng #1001",
        "total": 500000,
        "status": "success",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

---

### 2. Tạo giao dịch

**POST** `/api/a/transactions`

**Request:**
```json
{
  "origin": "order456",
  "type": "payment",
  "title": "Thanh toán đơn hàng #1002",
  "total": 750000,
  "status": "pending"
}
```

**Các trạng thái:**
- `pending`: Đang chờ xử lý
- `success`: Thành công
- `denied`: Bị từ chối

---

### 3. Cập nhật giao dịch

**PATCH** `/api/a/transactions/:id`

**Request:**
```json
{
  "status": "success"
}
```

---

### 4. Xóa giao dịch

**DELETE** `/api/a/transactions/:id`

---

## 📝 NỘI DUNG

### 1. Danh sách FAQs

**GET** `/api/a/faqs`

**Query Parameters:**
- `page`, `limit`: Pagination

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "faqs": [
      {
        "_id": "faq001",
        "title": "Làm thế nào để đặt lịch khám?",
        "content": "Bạn có thể đặt lịch khám bằng cách...",
        "slug": "lam-the-nao-de-dat-lich-kham",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

---

### 2. Chi tiết FAQ

**GET** `/api/a/faqs/:faqId`

---

### 3. Tạo FAQ mới

**POST** `/api/a/faqs`

**Request:**
```json
{
  "title": "Giờ làm việc của phòng khám?",
  "content": "Phòng khám hoạt động từ 8h-17h...",
  "slug": "gio-lam-viec"
}
```

---

### 4. Cập nhật FAQ

**PATCH** `/api/a/faqs/:faqId`

**Request:**
```json
{
  "title": "Giờ làm việc (Updated)",
  "content": "Updated content...",
  "status": "active"
}
```

---

### 5. Xóa FAQ

**DELETE** `/api/a/faqs/:faqId`

---

### 6. Feedbacks

#### Lấy danh sách

**GET** `/api/a/feedbacks`

**Query Parameters:**
- `page`, `limit`: Pagination
- `createdBy`: "admin" | "customer"

**Response:**
```json
{
  "status": true,
  "data": {
    "feedbacks": [
      {
        "_id": "fb001",
        "fullname": "Nguyễn Văn A",
        "email": "customer@example.com",
        "phoneNumber": "0123456789",
        "avatar": "https://...",
        "position": "Khách hàng",
        "content": "Dịch vụ tuyệt vời!",
        "createdBy": "customer",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {}
  }
}
```

#### Tạo feedback

**POST** `/api/a/feedbacks`

**Request:**
```json
{
  "fullname": "Trần Thị B",
  "position": "Giám đốc",
  "content": "Rất hài lòng với dịch vụ...",
  "avatar": "https://..."
}
```

#### Set Active/Inactive

**PATCH** `/api/a/feedbacks/:feedbackId/active`  
**PATCH** `/api/a/feedbacks/:feedbackId/inactive`

---

## 📤 UPLOAD FILE

### 1. Upload lên Firebase

**POST** `/api/uploads`

**Content-Type:** `multipart/form-data`

**Request:**
```
Form data:
- files: File hoặc nhiều files
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "urls": [
      "https://firebasestorage.googleapis.com/v0/b/...",
      "https://firebasestorage.googleapis.com/v0/b/..."
    ]
  }
}
```

---

### 2. Upload hình ảnh

**POST** `/api/uploaders/image`

**Content-Type:** `multipart/form-data`

**Request:**
```
Form data:
- image: Image file
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "url": "https://..."
  }
}
```

**Supported formats:** JPG, PNG, GIF, WebP  
**Max size:** 5MB

---

### 3. Upload video

**POST** `/api/uploaders/video`

**Content-Type:** `multipart/form-data`

**Request:**
```
Form data:
- video: Video file
```

**Response (200 OK):**
```json
{
  "status": true,
  "data": {
    "url": "https://..."
  }
}
```

**Supported formats:** MP4, AVI, MOV  
**Max size:** 100MB

---

## ⚠️ ERROR CODES

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request thành công |
| 201 | Created | Tạo mới thành công |
| 400 | Bad Request | Request không hợp lệ |
| 401 | Unauthorized | Chưa xác thực hoặc token hết hạn |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy resource |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Lỗi server |

---

### Common Error Messages

**401 Unauthorized:**
```json
{
  "status": false,
  "message": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

**404 Not Found:**
```json
{
  "status": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

**422 Validation Error:**
```json
{
  "status": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "phone",
      "message": "Invalid phone number format"
    }
  ]
}
```

---

## 📞 HỖ TRỢ

### Liên hệ kỹ thuật

- **Email**: support@vanphuccare.com
- **Phone**: 1900 xxxx
- **Website**: https://vanphuccare.com

### Testing Environment

Để test API, sử dụng Postman Collection đã cung cấp kèm:
- `Van_Phuc_Care_API.postman_collection.json`
- `Van_Phuc_Care.postman_environment.json`

### Rate Limiting

- **Limit**: 100 requests/minute
- **Header**: `X-RateLimit-Remaining` cho số request còn lại

---

## 📝 CHANGELOG

### Version 1.0.0 (October 2025)
- Initial release
- 100+ API endpoints
- Full documentation

---

**© 2025 Van Phuc Care. All rights reserved.**

