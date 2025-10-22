# 🚀 VAN PHUC CARE - API QUICK REFERENCE

## 🔗 Base URL
```
Development: http://localhost:3000/api
Production: https://api.vanphuccare.com/api
```

## 🔑 Authentication Header
```
Authorization: Bearer {access_token}
```

---

## 📋 ADMIN ENDPOINTS (`/api/a/`)

### 🔐 Authentication (Sessions)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/a/sessions/login` | ❌ | Login admin |
| `POST` | `/a/sessions` | ❌ | Signup admin |
| `GET` | `/a/sessions/current_admin` | ✅ | Get current admin |
| `PATCH` | `/a/sessions` | ✅ | Update profile |
| `PATCH` | `/a/sessions/change_password` | ✅ | Change password |
| `POST` | `/a/sessions/forgot_password` | ❌ | Forgot password |
| `POST` | `/a/sessions/verify_otp` | ❌ | Verify OTP |
| `POST` | `/a/sessions/reset_password` | ❌ | Reset password |

### ❓ FAQs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/faqs` | ✅ | List all FAQs |
| `GET` | `/a/faqs/:id` | ✅ | Get FAQ by ID |
| `POST` | `/a/faqs` | ✅ | Create FAQ |
| `PATCH` | `/a/faqs/:id` | ✅ | Update FAQ |
| `DELETE` | `/a/faqs/:id` | ✅ | Delete FAQ |

### 💬 Feedbacks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/feedbacks` | ✅ | List all feedbacks |
| `GET` | `/a/feedbacks/:id` | ✅ | Get feedback by ID |
| `POST` | `/a/feedbacks` | ✅ | Create feedback |
| `PATCH` | `/a/feedbacks/:id` | ✅ | Update feedback |
| `DELETE` | `/a/feedbacks/:id` | ✅ | Delete feedback |

### 📁 Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/categories` | ✅ | List all categories |
| `GET` | `/a/categories/:id` | ✅ | Get category by ID |
| `POST` | `/a/categories` | ✅ | Create category |
| `PATCH` | `/a/categories/:id` | ✅ | Update category |
| `DELETE` | `/a/categories/:id` | ✅ | Delete category |

### 📚 Courses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/courses` | ✅ | List all courses |
| `GET` | `/a/courses/:id` | ✅ | Get course by ID |
| `POST` | `/a/courses` | ✅ | Create course |
| `PATCH` | `/a/courses/:id` | ✅ | Update course |
| `DELETE` | `/a/courses/:id` | ✅ | Delete course |

### 🛍️ Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/products` | ✅ | List all products |
| `GET` | `/a/products/:id` | ✅ | Get product by ID |
| `POST` | `/a/products` | ✅ | Create product |
| `PATCH` | `/a/products/:id` | ✅ | Update product |
| `DELETE` | `/a/products/:id` | ✅ | Delete product |

### 📦 Product Collections
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/product-collections` | ✅ | List all collections |
| `GET` | `/a/product-collections/:id` | ✅ | Get collection by ID |
| `POST` | `/a/product-collections` | ✅ | Create collection |
| `PATCH` | `/a/product-collections/:id` | ✅ | Update collection |
| `DELETE` | `/a/product-collections/:id` | ✅ | Delete collection |

### ⭐ Product Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/product-reviews` | ✅ | List all reviews |
| `GET` | `/a/product-reviews/:id` | ✅ | Get review by ID |
| `POST` | `/a/product-reviews` | ✅ | Create review |
| `PATCH` | `/a/product-reviews/:id` | ✅ | Update review |
| `DELETE` | `/a/product-reviews/:id` | ✅ | Delete review |

### 👥 Customers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/customers` | ✅ | List all customers |
| `GET` | `/a/customers/:id` | ✅ | Get customer by ID |
| `POST` | `/a/customers` | ✅ | Create customer |
| `PATCH` | `/a/customers/:id` | ✅ | Update customer |
| `DELETE` | `/a/customers/:id` | ✅ | Delete customer |

### 📋 Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/orders` | ✅ | List all orders |
| `GET` | `/a/orders/:id` | ✅ | Get order by ID |
| `POST` | `/a/orders` | ✅ | Create order |
| `PATCH` | `/a/orders/:id` | ✅ | Update order |
| `DELETE` | `/a/orders/:id` | ✅ | Delete order |

### 🛒 Carts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/carts` | ✅ | List all carts |
| `GET` | `/a/carts/:id` | ✅ | Get cart by ID |
| `POST` | `/a/carts` | ✅ | Create cart |
| `PATCH` | `/a/carts/:id` | ✅ | Update cart |
| `DELETE` | `/a/carts/:id` | ✅ | Delete cart |

### 👤 Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/users` | ✅ | List all users |
| `GET` | `/a/users/:id` | ✅ | Get user by ID |
| `POST` | `/a/users` | ✅ | Create user |
| `PATCH` | `/a/users/:id` | ✅ | Update user |
| `DELETE` | `/a/users/:id` | ✅ | Delete user |

### 🔒 Access Permissions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/access-permissions` | ✅ | List all permissions |
| `POST` | `/a/access-permissions` | ✅ | Create permission |
| `PATCH` | `/a/access-permissions/:id` | ✅ | Update permission |
| `DELETE` | `/a/access-permissions/:id` | ✅ | Delete permission |

### 📖 Health Books
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/health-book/all` | ✅ | List all health books |
| `GET` | `/a/health-book/show` | ✅ | Get by email/admin |
| `GET` | `/a/health-book/:id` | ✅ | Get by ID |
| `GET` | `/a/health-book/by-date/:customerId` | ✅ | Get by date |
| `POST` | `/a/health-book` | ✅ | Create health book |
| `POST` | `/a/health-book/logs` | ✅ | Create log |
| `PATCH` | `/a/health-book/:id` | ✅ | Update health book |
| `DELETE` | `/a/health-book/:id` | ✅ | Delete health book |
| `POST` | `/a/health-book/comment` | ✅ | Add comment |
| `GET` | `/a/health-book/temperature` | ✅ | Get temperature data |

### 💰 Transactions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/transactions` | ✅ | List all transactions |
| `GET` | `/a/transactions/:id` | ✅ | Get transaction by ID |
| `POST` | `/a/transactions` | ✅ | Create transaction |
| `PATCH` | `/a/transactions/:id` | ✅ | Update transaction |
| `DELETE` | `/a/transactions/:id` | ✅ | Delete transaction |

### 💉 Schedule Vaccinations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/a/schedule-vaccin` | ✅ | List all schedules |
| `GET` | `/a/schedule-vaccin/:id` | ✅ | Get schedule by ID |
| `POST` | `/a/schedule-vaccin` | ✅ | Create schedule |
| `PATCH` | `/a/schedule-vaccin/:id` | ✅ | Update schedule |

---

## 👥 USER ENDPOINTS (`/api/u/`)

### 🔐 Authentication (Sessions)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/u/sessions/login` | ❌ | Login user |
| `POST` | `/u/sessions` | ❌ | Register user |
| `POST` | `/u/sessions/verify_email` | ❌ | Verify email |
| `POST` | `/u/sessions/send_back_otp` | ❌ | Resend OTP |
| `GET` | `/u/sessions/current_user` | ✅ | Get current user |
| `PATCH` | `/u/sessions` | ✅ | Update profile |
| `PATCH` | `/u/sessions/change_password` | ✅ | Change password |
| `POST` | `/u/sessions/forgot_password` | ❌ | Forgot password |
| `POST` | `/u/sessions/verify_otp` | ❌ | Verify OTP |
| `POST` | `/u/sessions/reset_password` | ❌ | Reset password |

### 🛒 Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/cart` | ❌ | Get cart items |
| `GET` | `/u/cart/:id` | ❌ | Get cart by ID |
| `POST` | `/u/cart/change` | ❌ | Change cart items |
| `POST` | `/u/cart` | ❌ | Create cart |
| `PATCH` | `/u/cart/:id` | ❌ | Update cart |

### 📁 Categories (Read-only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/categories` | ❌ | List all categories |
| `GET` | `/u/categories/:id` | ❌ | Get category by ID |

### 📚 Courses (Read-only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/courses` | ❌ | List all courses |
| `GET` | `/u/courses/:id` | ❌ | Get course by ID |

### ❓ FAQs (Read-only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/faqs` | ❌ | List all FAQs |

### 💬 Feedbacks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/feedbacks` | ❌ | List all feedbacks |
| `POST` | `/u/feedbacks` | ❌ | Create feedback |
| `GET` | `/u/feedbacks/:slug` | ❌ | Get by product slug |

### 📋 Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/order` | ❌ | List all orders |
| `GET` | `/u/order/:id` | ❌ | Get order by ID |
| `POST` | `/u/order` | ❌ | Create order |
| `PATCH` | `/u/order/:id` | ❌ | Update order |

### 🛍️ Products (Read-only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/products` | ❌ | List all products |
| `GET` | `/u/products/recommends` | ❌ | Get recommended products |
| `GET` | `/u/products/:id` | ❌ | Get product by ID |

### 👤 Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/u/users/:id` | ❌ | Get user by ID |

---

## 📤 PUBLIC ENDPOINTS

### 📁 File Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/uploads` | ❌ | Upload files to Firebase |

---

## 📝 Common Query Parameters

### Pagination
```
?page=1&limit=10
```

### Filtering
```
?type=product          # For categories
?categoryId=xxx        # For products
?createdBy=customer    # For feedbacks
```

---

## 🔑 Status Values

### Product Status
- `active` - Đang hoạt động
- `archived` - Đã lưu trữ
- `draft` - Nháp
- `out_stock` - Hết hàng

### Order Status
- `pending` - Chờ xử lý
- `processing` - Đang xử lý
- `shipping` - Đang giao hàng
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

### User Status
- `active` - Hoạt động
- `inactive` - Không hoạt động
- `pending` - Chờ xác thực

### General Status
- `active` - Hiển thị/Hoạt động
- `inactive` - Ẩn/Không hoạt động

### Transaction Status
- `pending` - Chờ xử lý
- `success` - Thành công
- `denied` - Thất bại

### Permission Status
- `pending` - Chờ duyệt
- `accepted` - Chấp nhận
- `denied` - Từ chối

---

## 🌐 Response Format

### Success Response
```json
{
  "status": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": false,
  "message": "Error message",
  "errors": []
}
```

### List Response with Pagination
```json
{
  "status": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

## 🔐 Authentication Examples

### Admin Login
```bash
curl -X POST http://localhost:3000/api/a/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/u/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Using Token
```bash
curl -X GET http://localhost:3000/api/a/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created |
| `400` | Bad Request - Invalid request |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - No permission |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error |

---

## 💡 Tips

1. **Save your tokens**: Store tokens securely in environment variables
2. **Use pagination**: Always use pagination for list endpoints
3. **Check status codes**: Always check HTTP status codes
4. **Handle errors**: Implement proper error handling
5. **Rate limiting**: Be aware of rate limits in production

---

## 📚 Full Documentation

- **Markdown**: `API_DOCUMENTATION.md`
- **OpenAPI Spec**: `openapi.yaml`
- **Postman Collection**: `Van_Phuc_Care_API.postman_collection.json`
- **Usage Guide**: `API_README.md`

---

**Last Updated**: October 2024
**Version**: 1.0.0

