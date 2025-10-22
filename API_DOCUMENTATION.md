# 📘 VAN PHUC CARE - API DOCUMENTATION

## 📋 Thông Tin Chung

- **Base URL**: `http://localhost:3000/api` (Development)
- **Version**: 1.0.0
- **Protocol**: HTTP/HTTPS
- **Content-Type**: `application/json`
- **Architecture**: RESTful API

---

## 🔐 Authentication

API sử dụng **JWT (JSON Web Token)** để xác thực.

### Header Authentication
```http
Authorization: Bearer {access_token}
```

### Có 2 loại người dùng:
1. **Admin** - Sử dụng route prefix `/api/a/`
2. **User** - Sử dụng route prefix `/api/u/`

---

## 📂 API Endpoints Overview

### Admin Routes (`/api/a/`)
- ✅ Authentication & Sessions
- ✅ FAQs Management
- ✅ Feedbacks Management
- ✅ Categories Management
- ✅ Courses Management
- ✅ Products Management
- ✅ Product Collections
- ✅ Product Reviews
- ✅ Customers Management
- ✅ Orders Management
- ✅ Carts Management
- ✅ Users Management
- ✅ Access Permissions
- ✅ Health Books
- ✅ Transactions
- ✅ Schedule Vaccinations

### User Routes (`/api/u/`)
- ✅ Authentication & Sessions
- ✅ Cart
- ✅ Categories (Read-only)
- ✅ FAQs (Read-only)
- ✅ Feedbacks
- ✅ Orders
- ✅ Products (Read-only)
- ✅ Courses (Read-only)
- ✅ User Profile

### Public Routes (`/api/`)
- ✅ File Uploads

---

## 🔑 ADMIN API ENDPOINTS

### 1️⃣ Admin Authentication & Sessions

Base Path: `/api/a/sessions`

#### 1.1 Login Admin
```http
POST /api/a/sessions/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "fullname": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": [],
      "status": "active"
    }
  }
}
```

#### 1.2 Signup Admin
```http
POST /api/a/sessions
```

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "password123",
  "fullname": "New Admin",
  "phone": "0123456789"
}
```

#### 1.3 Get Current Admin
```http
GET /api/a/sessions/current_admin
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "fullname": "Admin User",
      "email": "admin@example.com",
      "phone": "0123456789",
      "avatar": "https://...",
      "role": "admin",
      "permissions": [],
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### 1.4 Update Admin Profile
```http
PATCH /api/a/sessions
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullname": "Updated Admin Name",
  "phone": "0987654321",
  "avatar": "https://...",
  "address": "New Address"
}
```

#### 1.5 Change Password
```http
PATCH /api/a/sessions/change_password
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

#### 1.6 Forgot Password
```http
POST /api/a/sessions/forgot_password
```

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

#### 1.7 Verify OTP
```http
POST /api/a/sessions/verify_otp
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "otp": "123456"
}
```

#### 1.8 Verify Email
```http
POST /api/a/sessions/verify_email
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "token": "verification_token"
}
```

#### 1.9 Reset Password
```http
POST /api/a/sessions/reset_password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newpass123"
}
```

---

### 2️⃣ FAQs Management (Admin)

Base Path: `/api/a/faqs`

#### 2.1 Get All FAQs
```http
GET /api/a/faqs?page=1&limit=10
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "faqs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Câu hỏi thường gặp 1",
        "content": "Nội dung câu trả lời...",
        "slug": "cau-hoi-thuong-gap-1",
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### 2.2 Get FAQ by ID
```http
GET /api/a/faqs/{faqId}
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "faq": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Câu hỏi thường gặp 1",
      "content": "Nội dung câu trả lời...",
      "slug": "cau-hoi-thuong-gap-1",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### 2.3 Create FAQ
```http
POST /api/a/faqs
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Câu hỏi mới",
  "content": "Nội dung câu trả lời...",
  "slug": "cau-hoi-moi"
}
```

#### 2.4 Update FAQ
```http
PATCH /api/a/faqs/{faqId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Câu hỏi đã cập nhật",
  "content": "Nội dung mới...",
  "status": "active"
}
```

**Status Values:**
- `active` - Hiển thị
- `inactive` - Ẩn

#### 2.5 Delete FAQ
```http
DELETE /api/a/faqs/{faqId}
Authorization: Bearer {token}
```

---

### 3️⃣ Feedbacks Management (Admin)

Base Path: `/api/a/feedbacks`

#### 3.1 Get All Feedbacks
```http
GET /api/a/feedbacks?page=1&limit=10&createdBy=customer
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `createdBy` (optional): Filter by creator (`admin` | `customer`)

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "feedbacks": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "fullname": "Nguyễn Văn A",
        "email": "customer@example.com",
        "phoneNumber": "0123456789",
        "avatar": "https://...",
        "position": "Khách hàng",
        "content": "Dịch vụ rất tốt...",
        "createdBy": "customer",
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 30
    }
  }
}
```

#### 3.2 Get Feedback by ID
```http
GET /api/a/feedbacks/{feedbackId}
Authorization: Bearer {token}
```

#### 3.3 Create Feedback (Admin)
```http
POST /api/a/feedbacks
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn A",
  "position": "Giám đốc",
  "content": "Nội dung phản hồi...",
  "avatar": "https://..."
}
```

#### 3.4 Update Feedback
```http
PATCH /api/a/feedbacks/{feedbackId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn A Updated",
  "content": "Nội dung cập nhật...",
  "status": "active"
}
```

**Status Values:**
- `active` - Hiển thị
- `inactive` - Ẩn

#### 3.5 Delete Feedback
```http
DELETE /api/a/feedbacks/{feedbackId}
Authorization: Bearer {token}
```

---

### 4️⃣ Categories Management (Admin)

Base Path: `/api/a/categories`

#### 4.1 Get All Categories
```http
GET /api/a/categories?type=product
Authorization: Bearer {token}
```

**Query Parameters:**
- `type` (optional): Filter by type (`product` | `blog`)

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Danh mục sản phẩm 1",
        "slug": "danh-muc-san-pham-1",
        "thumbnail": "https://...",
        "type": "product",
        "postCount": 10,
        "status": "active",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### 4.2 Get Category by ID
```http
GET /api/a/categories/{categoryId}
Authorization: Bearer {token}
```

#### 4.3 Create Category
```http
POST /api/a/categories
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Danh mục mới",
  "slug": "danh-muc-moi",
  "thumbnail": "https://...",
  "type": "product"
}
```

**Type Values:**
- `product` - Danh mục sản phẩm
- `blog` - Danh mục blog

#### 4.4 Update Category
```http
PATCH /api/a/categories/{categoryId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Danh mục đã cập nhật",
  "thumbnail": "https://...",
  "slug": "danh-muc-da-cap-nhat"
}
```

#### 4.5 Delete Category
```http
DELETE /api/a/categories/{categoryId}
Authorization: Bearer {token}
```

---

### 5️⃣ Courses Management (Admin)

Base Path: `/api/a/courses`

#### 5.1 Get All Courses
```http
GET /api/a/courses
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "courses": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "code": "COURSE001",
        "name": "Khóa học chăm sóc trẻ em",
        "status": "active",
        "notes": "Ghi chú...",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### 5.2 Get Course by ID
```http
GET /api/a/courses/{courseId}
Authorization: Bearer {token}
```

#### 5.3 Create Course
```http
POST /api/a/courses
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "code": "COURSE002",
  "name": "Khóa học mới",
  "order": 1,
  "thumbnail": "https://...",
  "link": "https://...",
  "title": "Tiêu đề khóa học",
  "shortDescription": "Mô tả ngắn..."
}
```

#### 5.4 Update Course
```http
PATCH /api/a/courses/{courseId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Khóa học đã cập nhật",
  "status": "active",
  "order": 2,
  "thumbnail": "https://...",
  "shortDescription": "Mô tả mới..."
}
```

**Status Values:**
- `active` - Hoạt động
- `inactive` - Không hoạt động

#### 5.5 Delete Course
```http
DELETE /api/a/courses/{courseId}
Authorization: Bearer {token}
```

---

### 6️⃣ Products Management (Admin)

Base Path: `/api/a/products`

#### 6.1 Get All Products
```http
GET /api/a/products?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Sản phẩm 1",
        "slug": "san-pham-1",
        "thumbnail": "https://...",
        "shortDescription": "Mô tả ngắn...",
        "price": 100000,
        "priceDiscount": 90000,
        "discount": 10,
        "typeDiscount": "percentage",
        "category": [
          {
            "_id": "cat123",
            "name": "Danh mục A"
          }
        ],
        "images": ["https://...", "https://..."],
        "quantityInStock": 100,
        "quantitySelled": 10,
        "isOutOfStock": false,
        "showHome": true,
        "status": "active",
        "reviews": [],
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}
```

#### 6.2 Get Product by ID
```http
GET /api/a/products/{productId}
Authorization: Bearer {token}
```

#### 6.3 Create Product
```http
POST /api/a/products
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Sản phẩm mới",
  "slug": "san-pham-moi",
  "thumbnail": "https://...",
  "shortDescription": "Mô tả ngắn...",
  "price": 150000,
  "priceDiscount": 135000,
  "discount": 10,
  "typeDiscount": "percentage",
  "category": [
    {
      "_id": "cat123",
      "name": "Danh mục A"
    }
  ],
  "images": ["https://...", "https://..."],
  "quantityInStock": 100,
  "showHome": true,
  "gtin": "1234567890123"
}
```

#### 6.4 Update Product
```http
PATCH /api/a/products/{productId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Sản phẩm đã cập nhật",
  "price": 200000,
  "quantityInStock": 150,
  "status": "active"
}
```

**Status Values:**
- `active` - Đang hoạt động
- `archived` - Đã lưu trữ
- `draft` - Nháp
- `out_stock` - Hết hàng

#### 6.5 Delete Product
```http
DELETE /api/a/products/{productId}
Authorization: Bearer {token}
```

---

### 7️⃣ Product Collections Management (Admin)

Base Path: `/api/a/product-collections`

#### 7.1 Get All Collections
```http
GET /api/a/product-collections
Authorization: Bearer {token}
```

#### 7.2 Get Collection by ID
```http
GET /api/a/product-collections/{collectionId}
Authorization: Bearer {token}
```

#### 7.3 Create Collection
```http
POST /api/a/product-collections
Authorization: Bearer {token}
```

#### 7.4 Update Collection
```http
PATCH /api/a/product-collections/{collectionId}
Authorization: Bearer {token}
```

#### 7.5 Delete Collection
```http
DELETE /api/a/product-collections/{collectionId}
Authorization: Bearer {token}
```

---

### 8️⃣ Product Reviews Management (Admin)

Base Path: `/api/a/product-reviews`

#### 8.1 Get All Reviews
```http
GET /api/a/product-reviews
Authorization: Bearer {token}
```

#### 8.2 Get Review by ID
```http
GET /api/a/product-reviews/{reviewId}
Authorization: Bearer {token}
```

#### 8.3 Create Review
```http
POST /api/a/product-reviews
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "order": 1,
  "thumbnail": "https://...",
  "link": "https://...",
  "title": "Đánh giá sản phẩm",
  "shortDescription": "Mô tả..."
}
```

#### 8.4 Update Review
```http
PATCH /api/a/product-reviews/{reviewId}
Authorization: Bearer {token}
```

#### 8.5 Delete Review
```http
DELETE /api/a/product-reviews/{reviewId}
Authorization: Bearer {token}
```

---

### 9️⃣ Customers Management (Admin)

Base Path: `/api/a/customers`

#### 9.1 Get All Customers
```http
GET /api/a/customers?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "customers": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "email": "customer@example.com",
        "firstname": "Văn",
        "lastname": "Nguyễn",
        "phone": "0123456789",
        "address": "123 Đường ABC",
        "city": "Hà Nội",
        "province": "Hà Nội",
        "country": "Vietnam",
        "total_order": 5,
        "total_spent": 5000000,
        "status": "verified",
        "tags": ["vip", "regular"],
        "note": "Khách hàng thân thiết",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

#### 9.2 Get Customer by ID
```http
GET /api/a/customers/{customerId}
Authorization: Bearer {token}
```

#### 9.3 Create Customer
```http
POST /api/a/customers
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "email": "newcustomer@example.com",
  "firstname": "Văn",
  "lastname": "Trần",
  "phone": "0987654321",
  "address": "456 Đường XYZ",
  "city": "Hồ Chí Minh",
  "province": "Hồ Chí Minh",
  "country": "Vietnam",
  "note": "Ghi chú..."
}
```

#### 9.4 Update Customer
```http
PATCH /api/a/customers/{customerId}
Authorization: Bearer {token}
```

#### 9.5 Delete Customer
```http
DELETE /api/a/customers/{customerId}
Authorization: Bearer {token}
```

---

### 🔟 Orders Management (Admin)

Base Path: `/api/a/orders`

#### 10.1 Get All Orders
```http
GET /api/a/orders?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "orders": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "code": 1001,
        "cartId": "cart123",
        "customer": {
          "_id": "cust123",
          "fullname": "Nguyễn Văn A",
          "email": "customer@example.com",
          "phone": "0123456789",
          "address": "123 Đường ABC",
          "note": "Giao hàng buổi chiều"
        },
        "products": [
          {
            "_id": "prod123",
            "name": "Sản phẩm 1",
            "thumbnail": "https://...",
            "quantity": 2,
            "price": 100000
          }
        ],
        "status": "pending",
        "paymentMethod": "cod",
        "discount": {
          "name": "Giảm 10%",
          "price": "10000",
          "type": "amount"
        },
        "transport": {
          "name": "Giao hàng nhanh",
          "price": "30000",
          "partner": "GHN",
          "tracking": []
        },
        "notes": "Ghi chú đơn hàng",
        "archived": {
          "status": false
        },
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 200
    }
  }
}
```

#### 10.2 Get Order by ID
```http
GET /api/a/orders/{orderId}
Authorization: Bearer {token}
```

#### 10.3 Create Order
```http
POST /api/a/orders
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "cartId": "cart123",
  "customer": {
    "_id": "cust123",
    "fullname": "Nguyễn Văn A",
    "email": "customer@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC"
  },
  "products": [
    {
      "_id": "prod123",
      "name": "Sản phẩm 1",
      "thumbnail": "https://...",
      "quantity": 2,
      "price": 100000
    }
  ],
  "paymentMethod": "cod",
  "transport": {
    "name": "Giao hàng nhanh",
    "price": "30000",
    "partner": "GHN"
  }
}
```

#### 10.4 Update Order
```http
PATCH /api/a/orders/{orderId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "processing",
  "notes": "Đơn hàng đang được xử lý"
}
```

**Status Values:**
- `pending` - Chờ xử lý
- `processing` - Đang xử lý
- `shipping` - Đang giao hàng
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

#### 10.5 Delete Order
```http
DELETE /api/a/orders/{orderId}
Authorization: Bearer {token}
```

---

### 1️⃣1️⃣ Carts Management (Admin)

Base Path: `/api/a/carts`

#### 11.1 Get All Carts
```http
GET /api/a/carts
Authorization: Bearer {token}
```

#### 11.2 Get Cart by ID
```http
GET /api/a/carts/{cartId}
Authorization: Bearer {token}
```

#### 11.3 Create Cart
```http
POST /api/a/carts
Authorization: Bearer {token}
```

#### 11.4 Update Cart
```http
PATCH /api/a/carts/{cartId}
Authorization: Bearer {token}
```

#### 11.5 Delete Cart
```http
DELETE /api/a/carts/{cartId}
Authorization: Bearer {token}
```

---

### 1️⃣2️⃣ Users Management (Admin)

Base Path: `/api/a/users`

#### 12.1 Get All Users
```http
GET /api/a/users?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "fullname": "Nguyễn Văn A",
        "email": "user@example.com",
        "phoneNumber": "0123456789",
        "avatar": "https://...",
        "gender": "male",
        "address": {
          "province": {
            "id": "01",
            "name": "Hà Nội"
          },
          "district": {
            "id": "001",
            "name": "Ba Đình"
          },
          "ward": {
            "id": "00001",
            "name": "Phúc Xá"
          },
          "addressDetail": "123 Đường ABC"
        },
        "status": "active",
        "type": "normal",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 500
    }
  }
}
```

#### 12.2 Get User by ID
```http
GET /api/a/users/{userId}
Authorization: Bearer {token}
```

#### 12.3 Create User
```http
POST /api/a/users
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn B",
  "email": "newuser@example.com",
  "phoneNumber": "0987654321",
  "password": "password123",
  "gender": "male",
  "avatar": "https://...",
  "address": {
    "province": {
      "id": "01",
      "name": "Hà Nội"
    },
    "district": {
      "id": "001",
      "name": "Ba Đình"
    },
    "ward": {
      "id": "00001",
      "name": "Phúc Xá"
    },
    "addressDetail": "456 Đường XYZ"
  }
}
```

#### 12.4 Update User
```http
PATCH /api/a/users/{userId}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn B Updated",
  "status": "active",
  "type": "vip"
}
```

**Status Values:**
- `active` - Hoạt động
- `inactive` - Không hoạt động
- `pending` - Chờ xác thực

**Type Values:**
- `normal` - Người dùng thường
- `vip` - Người dùng VIP

#### 12.5 Delete User
```http
DELETE /api/a/users/{userId}
Authorization: Bearer {token}
```

---

### 1️⃣3️⃣ Access Permissions Management (Admin)

Base Path: `/api/a/access-permissions`

#### 13.1 Get All Permissions
```http
GET /api/a/access-permissions
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "permissions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "origin": "admin123",
        "type": "read",
        "request": {},
        "access": {},
        "status": "pending",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### 13.2 Create Permission
```http
POST /api/a/access-permissions
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "origin": "admin123",
  "type": "write",
  "request": {},
  "access": {}
}
```

#### 13.3 Update Permission
```http
PATCH /api/a/access-permissions/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Status Values:**
- `pending` - Chờ duyệt
- `accepted` - Chấp nhận
- `denied` - Từ chối

#### 13.4 Delete Permission
```http
DELETE /api/a/access-permissions/{id}
Authorization: Bearer {token}
```

---

### 1️⃣4️⃣ Health Books Management (Admin)

Base Path: `/api/a/health-book`

#### 14.1 Get All Health Books
```http
GET /api/a/health-book/all?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "healthBooks": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "customerId": "cust123",
        "name": "Nguyễn Văn A",
        "dob": "2020-01-01",
        "avatar": "https://...",
        "weight": "15kg",
        "height": "100cm",
        "gender": "male",
        "skinConditions": "Tốt",
        "tooth": {
          "count": "20",
          "descriptions": "Răng khỏe"
        },
        "nutrition": {
          "count": "3",
          "descriptions": "3 bữa/ngày"
        },
        "sleep": {
          "time": "10 giờ",
          "descriptions": "Ngủ ngon"
        },
        "frequencyOfDefecation": "1 lần/ngày",
        "fecalCondition": "Bình thường",
        "digestiveProblems": "Không",
        "healthCondition": "Khỏe mạnh",
        "vaccination": "Đã tiêm đủ",
        "vaccinationDate": "2023-01-01",
        "vaccinationContent": "Vaccine A, B, C",
        "note": "Ghi chú...",
        "domain": "vanphuccare",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}
```

#### 14.2 Get Health Book by Email/Admin ID
```http
GET /api/a/health-book/show?email=customer@example.com
Authorization: Bearer {token}
```

#### 14.3 Get Health Book by ID
```http
GET /api/a/health-book/{id}
Authorization: Bearer {token}
```

#### 14.4 Get Health Book by Date
```http
GET /api/a/health-book/by-date/{customerId}?date=2023-01-01
Authorization: Bearer {token}
```

#### 14.5 Create Health Book
```http
POST /api/a/health-book
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "customerId": "cust123",
  "name": "Nguyễn Văn A",
  "dob": "2020-01-01",
  "avatar": "https://...",
  "weight": "15kg",
  "height": "100cm",
  "gender": "male",
  "skinConditions": "Tốt",
  "healthCondition": "Khỏe mạnh",
  "domain": "vanphuccare"
}
```

#### 14.6 Create Health Book Log
```http
POST /api/a/health-book/logs
Authorization: Bearer {token}
```

#### 14.7 Update Health Book
```http
PATCH /api/a/health-book/{id}
Authorization: Bearer {token}
```

#### 14.8 Delete Health Book
```http
DELETE /api/a/health-book/{id}
Authorization: Bearer {token}
```

#### 14.9 Add Comment to Health Book
```http
POST /api/a/health-book/comment
Authorization: Bearer {token}
```

#### 14.10 Get Temperature Data
```http
GET /api/a/health-book/temperature?customerId=cust123&date=2023-01-01
Authorization: Bearer {token}
```

---

### 1️⃣5️⃣ Transactions Management (Admin)

Base Path: `/api/a/transactions`

#### 15.1 Get All Transactions
```http
GET /api/a/transactions?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "transactions": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "origin": "order123",
        "type": "payment",
        "title": "Thanh toán đơn hàng #1001",
        "total": 500000,
        "status": "success",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

#### 15.2 Get Transaction by ID
```http
GET /api/a/transactions/{id}
Authorization: Bearer {token}
```

#### 15.3 Create Transaction
```http
POST /api/a/transactions
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "origin": "order123",
  "type": "payment",
  "title": "Thanh toán đơn hàng",
  "total": 500000,
  "status": "pending"
}
```

**Status Values:**
- `pending` - Chờ xử lý
- `success` - Thành công
- `denied` - Thất bại
- `active` - Hoạt động
- `inactive` - Không hoạt động

#### 15.4 Update Transaction
```http
PATCH /api/a/transactions/{id}
Authorization: Bearer {token}
```

#### 15.5 Delete Transaction
```http
DELETE /api/a/transactions/{id}
Authorization: Bearer {token}
```

---

### 1️⃣6️⃣ Schedule Vaccinations Management (Admin)

Base Path: `/api/a/schedule-vaccin`

#### 16.1 Get All Schedule Vaccinations
```http
GET /api/a/schedule-vaccin?page=1&limit=10
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "schedules": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "customerId": "cust123",
        "thumbnail": "https://...",
        "content": "Nội dung lịch tiêm",
        "title": "Tiêm vaccine A",
        "time": "2023-12-01 09:00",
        "numberOfInjections": "1",
        "address": "123 Đường ABC, Hà Nội",
        "status": "scheduled",
        "domain": "vanphuccare",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 30
    }
  }
}
```

#### 16.2 Get Schedule by ID
```http
GET /api/a/schedule-vaccin/{id}
Authorization: Bearer {token}
```

#### 16.3 Create Schedule
```http
POST /api/a/schedule-vaccin
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "customerId": "cust123",
  "thumbnail": "https://...",
  "content": "Nội dung lịch tiêm",
  "title": "Tiêm vaccine B",
  "time": "2023-12-15 10:00",
  "numberOfInjections": "2",
  "address": "456 Đường XYZ, Hà Nội",
  "status": "scheduled",
  "domain": "vanphuccare"
}
```

#### 16.4 Update Schedule
```http
PATCH /api/a/schedule-vaccin/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "time": "2023-12-15 14:00",
  "status": "completed"
}
```

---

## 👤 USER API ENDPOINTS

### 1️⃣ User Authentication & Sessions

Base Path: `/api/u/sessions`

#### 1.1 Login User
```http
POST /api/u/sessions/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullname": "Nguyễn Văn A",
      "email": "user@example.com",
      "phoneNumber": "0123456789",
      "status": "active"
    }
  }
}
```

#### 1.2 Register User
```http
POST /api/u/sessions
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn A",
  "email": "newuser@example.com",
  "phoneNumber": "0123456789",
  "password": "password123",
  "gender": "male"
}
```

#### 1.3 Verify Email
```http
POST /api/u/sessions/verify_email
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### 1.4 Send Back OTP
```http
POST /api/u/sessions/send_back_otp
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### 1.5 Get Current User
```http
GET /api/u/sessions/current_user
Authorization: Bearer {token}
```

#### 1.6 Update User Profile
```http
PATCH /api/u/sessions
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn A Updated",
  "phoneNumber": "0987654321",
  "avatar": "https://...",
  "address": {
    "province": {
      "id": "01",
      "name": "Hà Nội"
    },
    "addressDetail": "123 Đường ABC"
  }
}
```

#### 1.7 Change Password
```http
PATCH /api/u/sessions/change_password
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

#### 1.8 Forgot Password
```http
POST /api/u/sessions/forgot_password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### 1.9 Verify OTP (Password Reset)
```http
POST /api/u/sessions/verify_otp
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### 1.10 Reset Password
```http
POST /api/u/sessions/reset_password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newpass123"
}
```

---

### 2️⃣ User Cart

Base Path: `/api/u/cart`

#### 2.1 Get All Cart Items
```http
GET /api/u/cart
```

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "cart": {
      "_id": "cart123",
      "customer": {
        "_id": "cust123",
        "fullname": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone": "0123456789"
      },
      "items": [
        {
          "name": "Sản phẩm 1",
          "thumbnail": "https://...",
          "number": "2",
          "price": "100000",
          "discount": "10000",
          "typeDiscount": "amount"
        }
      ],
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### 2.2 Get Cart by ID
```http
GET /api/u/cart/{cartId}
```

#### 2.3 Change Cart Items
```http
POST /api/u/cart/change
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod123",
      "quantity": 2
    }
  ]
}
```

#### 2.4 Create Cart
```http
POST /api/u/cart
```

**Request Body:**
```json
{
  "items": [
    {
      "name": "Sản phẩm 1",
      "thumbnail": "https://...",
      "number": "1",
      "price": "100000"
    }
  ]
}
```

#### 2.5 Update Cart
```http
PATCH /api/u/cart/{cartId}
```

---

### 3️⃣ User Categories (Read-only)

Base Path: `/api/u/categories`

#### 3.1 Get All Categories
```http
GET /api/u/categories?type=product
```

#### 3.2 Get Category by ID
```http
GET /api/u/categories/{categoryId}
```

---

### 4️⃣ User Courses (Read-only)

Base Path: `/api/u/courses`

#### 4.1 Get All Courses
```http
GET /api/u/courses
```

#### 4.2 Get Course by ID
```http
GET /api/u/courses/{courseId}
```

---

### 5️⃣ User FAQs (Read-only)

Base Path: `/api/u/faqs`

#### 5.1 Get All FAQs
```http
GET /api/u/faqs?page=1&limit=10
```

---

### 6️⃣ User Feedbacks

Base Path: `/api/u/feedbacks`

#### 6.1 Get All Feedbacks
```http
GET /api/u/feedbacks
```

#### 6.2 Create Feedback
```http
POST /api/u/feedbacks
```

**Request Body:**
```json
{
  "fullname": "Nguyễn Văn A",
  "email": "user@example.com",
  "phoneNumber": "0123456789",
  "position": "Khách hàng",
  "content": "Dịch vụ rất tốt, tôi rất hài lòng!",
  "avatar": "https://..."
}
```

#### 6.3 Get Feedback by Product Slug
```http
GET /api/u/feedbacks/{slugProduct}
```

---

### 7️⃣ User Orders

Base Path: `/api/u/order`

#### 7.1 Get All Orders
```http
GET /api/u/order
```

#### 7.2 Get Order by ID
```http
GET /api/u/order/{orderId}
```

#### 7.3 Create Order
```http
POST /api/u/order
```

**Request Body:**
```json
{
  "cartId": "cart123",
  "customer": {
    "fullname": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC"
  },
  "products": [
    {
      "_id": "prod123",
      "name": "Sản phẩm 1",
      "thumbnail": "https://...",
      "quantity": 2,
      "price": 100000
    }
  ],
  "paymentMethod": "cod"
}
```

#### 7.4 Update Order
```http
PATCH /api/u/order/{orderId}
```

---

### 8️⃣ User Products (Read-only)

Base Path: `/api/u/products`

#### 8.1 Get All Products
```http
GET /api/u/products?page=1&limit=10&categoryId=cat123
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `categoryId` (optional): Filter by category

#### 8.2 Get Recommended Products
```http
GET /api/u/products/recommends
```

#### 8.3 Get Product by ID
```http
GET /api/u/products/{productId}
```

---

### 9️⃣ User Profile

Base Path: `/api/u/users`

#### 9.1 Get User by ID
```http
GET /api/u/users/{userId}
```

---

## 📤 FILE UPLOAD API

### Upload Files

Base Path: `/api/uploads`

#### Upload to Firebase
```http
POST /api/uploads
Content-Type: multipart/form-data
```

**Form Data:**
- `files`: File(s) to upload (multiple files supported)

**Response Success (200):**
```json
{
  "status": true,
  "data": {
    "urls": [
      "https://firebasestorage.googleapis.com/..."
    ]
  }
}
```

---

## 📊 Data Models

### Admin Model
```typescript
{
  _id: string;
  fullname: string;
  firstName?: string;
  lastName?: string;
  code?: string;
  email: string;
  phone?: string;
  username?: string;
  password: string;
  address?: string;
  avatar?: string;
  workAt?: string;
  dob?: string;
  gender?: string;
  role?: string;
  permissions: any[];
  accessToken?: string;
  verified?: string;
  status: 'active' | 'inactive';
  secret2fa?: {
    ascii: string;
    hex: string;
    base32: string;
    otpauth_url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### User Model
```typescript
{
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  password: string;
  avatar?: string;
  gender?: string;
  address?: {
    province: { id: string; name: string; };
    district: { id: string; name: string; };
    ward: { id: string; name: string; };
    addressDetail: string;
  };
  status: 'active' | 'inactive' | 'pending';
  type: 'normal' | 'vip';
  verifyOtp?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpireAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
{
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  thumbnail?: string;
  typeDiscount?: string;
  category: Array<{
    _id: string;
    name: string;
  }>;
  price: number;
  priceDiscount?: number;
  discount?: number;
  gtin?: string;
  images: string[];
  reviews: Array<{
    user: string;
    rating: number;
    comment: string;
  }>;
  quantityInStock: number;
  quantitySelled: number;
  isOutOfStock: boolean;
  showHome: boolean;
  status: 'active' | 'archived' | 'draft' | 'out_stock';
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model
```typescript
{
  _id: string;
  cartId?: string;
  code: number;
  products: Array<{
    _id: string;
    name: string;
    thumbnail: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  };
  salesChannel?: {
    _id: string;
    name: string;
  };
  status: string;
  archived: {
    status: boolean;
    createdAt: Date;
  };
  notes?: string;
  paymentMethod?: string;
  discount?: {
    name: string;
    price: string;
    type: string;
  };
  transport?: {
    name: string;
    price: string;
    partner: string;
    tracking: Array<{
      time: Date;
      status: string;
      descriptions: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer Model
```typescript
{
  _id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  accepts_email_marketing?: string;
  accepts_sms_marketing?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  province_code?: string;
  country?: string;
  country_code?: string;
  zip?: string;
  total_order: number;
  total_spent: number;
  tags: any[];
  note?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart Model
```typescript
{
  _id: string;
  customer?: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  };
  status: string;
  discount?: string;
  archived: {
    status: boolean;
    createdAt: Date;
  };
  notes?: string;
  paymentMethod?: string;
  transport?: {
    name: string;
    price: string;
    partner: string;
    tracking: Array<{
      time: Date;
      status: string;
      descriptions: string;
    }>;
  };
  items: Array<{
    name: string;
    thumbnail: string;
    number: string;
    price: string;
    discount?: string;
    typeDiscount?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model
```typescript
{
  _id: string;
  type: string;
  title: string;
  thumbnail?: string;
  postCount: number;
  status?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### FAQ Model
```typescript
{
  _id: string;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Feedback Model
```typescript
{
  _id: string;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
  createdBy: 'admin' | 'customer';
  content: string;
  position?: string;
  product?: string;
  fullname: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Course Model
```typescript
{
  _id: string;
  code?: string;
  name: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Health Book Model
```typescript
{
  _id: string;
  customerId: string;
  name: string;
  dob?: string;
  avatar?: string;
  weight?: string;
  height?: string;
  gender?: string;
  skinConditions?: string;
  tooth?: {
    count: string;
    descriptions: string;
  };
  nutrition?: {
    count: string;
    descriptions: string;
  };
  sleep?: {
    time: string;
    descriptions: string;
  };
  frequencyOfDefecation?: string;
  fecalCondition?: string;
  digestiveProblems?: string;
  healthCondition?: string;
  vaccination?: string;
  vaccinationDate?: string;
  vaccinationContent?: string;
  note?: string;
  method?: {
    status: string;
    descriptions: string;
  };
  exerciseAndSkills?: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Schedule Vaccination Model
```typescript
{
  _id: string;
  customerId: string;
  thumbnail?: string;
  content?: string;
  title: string;
  time?: string;
  numberOfInjections?: string;
  address?: string;
  status?: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction Model
```typescript
{
  _id: string;
  origin: string;
  type: string;
  title: string;
  total: number;
  status: 'pending' | 'success' | 'denied' | 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Access Permission Model
```typescript
{
  _id: string;
  origin: string;
  type: string;
  request: any;
  access: any;
  status: 'pending' | 'accepted' | 'denied';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "status": false,
  "message": "Invalid request parameters",
  "errors": []
}
```

### 401 Unauthorized
```json
{
  "status": false,
  "message": "Unauthorized. Token is missing or invalid"
}
```

### 403 Forbidden
```json
{
  "status": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "status": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## 📝 Notes

1. **Authentication**: Hầu hết các endpoints yêu cầu JWT token trong header `Authorization: Bearer {token}`
2. **Pagination**: Các endpoint list thường hỗ trợ pagination với query params `page` và `limit`
3. **Status Codes**: API sử dụng standard HTTP status codes
4. **CORS**: API hỗ trợ CORS với origin `*` (development mode)
5. **Content-Type**: Tất cả request body phải là `application/json` trừ upload files
6. **Date Format**: Sử dụng ISO 8601 format cho dates
7. **MongoDB ObjectId**: Tất cả `_id` đều là MongoDB ObjectId dạng string

---

## 🔄 API Versioning

Hiện tại API đang ở version 1.0.0. Khi có breaking changes, version mới sẽ được tạo với prefix khác (ví dụ: `/api/v2/`)

---

## 📞 Support

Để được hỗ trợ về API, vui lòng liên hệ:
- Email: support@vanphuccare.com
- Hotline: 1900-xxxx

---

**Last Updated**: 2024
**Version**: 1.0.0

