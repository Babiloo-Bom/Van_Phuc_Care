# 📡 API Endpoints Reference

## 🔐 Authentication Endpoints

### Admin Authentication

#### 1. Admin Login

```http
POST /api/a/sessions/login
```

**Request:**

```json
{
  "username": "admin001",
  "password": "admin001"
}
```

**Response:**

```json
{
  "status": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenExpireAt": 1735689600000,
    "admin": {
      "id": "admin_id",
      "username": "admin001",
      "email": "admin001@gmail.com",
      "fullname": "Admin001"
    }
  }
}
```

**Implementation:** [`SessionController.login`](../src/controllers/api/admin/SessionController.ts)

#### 2. Admin Signup

```http
POST /api/a/sessions
```

**Request:**

```json
{
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "password123",
  "fullname": "New Admin"
}
```

#### 3. Get Current Admin

```http
GET /api/a/sessions/current_admin
Headers: Authorization: Bearer {token}
```

#### 4. Forgot Password

```http
POST /api/a/sessions/forgot_password
```

**Request:**

```json
{
  "email": "admin@example.com"
}
```

#### 5. Reset Password

```http
POST /api/a/sessions/reset_password
```

**Request:**

```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password_123"
}
```

#### 6. Google OAuth Login

```http
GET /api/a/sessions/google/login
POST /api/a/sessions/google/login
GET /api/a/sessions/google/callback
```

**Implementation:** [`GoogleAuthController`](../src/controllers/api/admin/GoogleAuthController.ts)

---

## 👥 Customer Management

### 1. Get All Customers

```http
GET /api/a/customers
Headers: Authorization: Bearer {token}
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `search`: Search by name, email, phone
- `status`: Filter by status (active, inactive)

**Response:**

```json
{
  "status": true,
  "data": {
    "customers": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 12,
      "totalPages": 9
    }
  }
}
```

**Implementation:** [`CustomerController.index`](../src/controllers/api/admin/CustomerController.ts)

### 2. Get Customer by ID

```http
GET /api/a/customers/:id
Headers: Authorization: Bearer {token}
```

### 3. Create Customer

```http
POST /api/a/customers
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "email": "customer@example.com",
  "phone": "0123456789",
  "firstname": "John",
  "lastname": "Doe",
  "address": "123 Street, City"
}
```

### 4. Update Customer

```http
PATCH /api/a/customers/:id
Headers: Authorization: Bearer {token}
```

### 5. Delete Customer

```http
DELETE /api/a/customers/:id
Headers: Authorization: Bearer {token}
```

### 6. Bulk Delete Customers

```http
POST /api/a/customers/bulk-delete
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "ids": ["customer_id_1", "customer_id_2"]
}
```

---

## 📚 Course Management

### 1. Get All Courses

```http
GET /api/a/courses
Headers: Authorization: Bearer {token}
```

**Query Parameters:**

- `page`, `limit`: Pagination
- `category`: Filter by category
- `status`: Filter by status (active, draft)
- `search`: Search by title, description

**Response:**

```json
{
  "status": true,
  "data": {
    "courses": [
      {
        "id": "course_id",
        "title": "Course Title",
        "description": "Course description",
        "price": 299000,
        "duration": 30,
        "modules": [...],
        "lessons": [...]
      }
    ],
    "pagination": {...}
  }
}
```

**Implementation:** [`CourseController.index`](../src/controllers/api/admin/CourseController.ts)

### 2. Get Course by ID

```http
GET /api/a/courses/:id
```

### 3. Create Course

```http
POST /api/a/courses
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "title": "New Course",
  "description": "Course description",
  "price": 299000,
  "duration": 30,
  "categoryId": "category_id",
  "modules": []
}
```

### 4. Update Course

```http
PATCH /api/a/courses/:id
Headers: Authorization: Bearer {token}
```

### 5. Delete Course

```http
DELETE /api/a/courses/:id
Headers: Authorization: Bearer {token}
```

---

## 🛍️ Product Management

### 1. Get All Products

```http
GET /api/a/products
Headers: Authorization: Bearer {token}
```

**Implementation:** [`ProductController.index`](../src/controllers/api/admin/ProductController.ts)

### 2. Create Product

```http
POST /api/a/products
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 150000,
  "stock": 100,
  "categoryId": "category_id",
  "images": ["image_url_1", "image_url_2"]
}
```

### 3. Update Product

```http
PATCH /api/a/products/:id
Headers: Authorization: Bearer {token}
```

### 4. Delete Product

```http
POST /api/a/products/bulk-delete
Headers: Authorization: Bearer {token}
```

---

## 💰 Order & Transaction Management

### 1. Get All Orders

```http
GET /api/a/orders
Headers: Authorization: Bearer {token}
```

**Query Parameters:**

- `status`: pending, processing, completed, cancelled
- `customerId`: Filter by customer
- `dateFrom`, `dateTo`: Date range

**Implementation:** [`OrderController.index`](../src/controllers/api/admin/OrderController.ts)

### 2. Get Order by ID

```http
GET /api/a/orders/:id
Headers: Authorization: Bearer {token}
```

### 3. Create Order

```http
POST /api/a/orders
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "customerId": "customer_id",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 150000
    }
  ],
  "total": 300000,
  "shippingAddress": "123 Street, City"
}
```

### 4. Update Order Status

```http
PATCH /api/a/orders/:id
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "status": "completed"
}
```

---

## 📖 Health Book Management

### 1. Get All Health Books

```http
GET /api/a/health-book/all
Headers: Authorization: Bearer {token}
```

**Implementation:** [`HealthBookController`](../src/controllers/api/admin/HealthBookController.ts)

### 2. Get Health Book by Customer

```http
GET /api/a/health-book/byDate/:customerId?date=2025-01-15
Headers: Authorization: Bearer {token}
```

### 3. Create Health Book Entry

```http
POST /api/a/health-book
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "customerId": "customer_id",
  "date": "2025-01-15",
  "vitals": {
    "weight": 70,
    "height": 175,
    "bloodPressure": "120/80",
    "temperature": 36.5
  },
  "notes": "Patient notes"
}
```

### 4. Update Health Book

```http
PATCH /api/a/health-book/:id
Headers: Authorization: Bearer {token}
```

---

## 💉 Vaccination Schedule

### 1. Get All Schedules

```http
GET /api/a/schedule-vaccin
Headers: Authorization: Bearer {token}
```

**Implementation:** [`ScheduleVaccinController`](../src/controllers/api/admin/ScheduleVaccinController.ts)

### 2. Create Schedule

```http
POST /api/a/schedule-vaccin
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "customerId": "customer_id",
  "vaccineName": "COVID-19",
  "scheduledDate": "2025-02-01",
  "status": "scheduled"
}
```

---

## ❓ FAQ Management

### 1. Get All FAQs

```http
GET /api/a/faqs
```

**Implementation:** [`FaqController.index`](../src/controllers/api/admin/FaqController.ts)

### 2. Create FAQ

```http
POST /api/a/faqs
Headers: Authorization: Bearer {token}
```

**Request:**

```json
{
  "question": "How to register?",
  "answer": "Click on sign up button...",
  "category": "account",
  "order": 1
}
```

### 3. Update FAQ

```http
PATCH /api/a/faqs/:id
Headers: Authorization: Bearer {token}
```

---

## 💬 Feedback Management

### 1. Get All Feedbacks

```http
GET /api/a/feedbacks
Headers: Authorization: Bearer {token}
```

**Implementation:** [`FeedbackController.index`](../src/controllers/api/admin/FeedbackController.ts)

### 2. Create Feedback

```http
POST /api/a/feedbacks
```

**Request:**

```json
{
  "customerId": "customer_id",
  "courseId": "course_id",
  "rating": 5,
  "comment": "Great course!",
  "type": "course"
}
```

---

## 📤 File Upload

### Upload Single File

```http
POST /uploads/single
Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
```

**Request (multipart/form-data):**

```
file: [binary file data]
```

**Response:**

```json
{
  "status": true,
  "data": {
    "url": "https://storage.example.com/files/image.jpg",
    "filename": "image.jpg",
    "size": 102400
  }
}
```

**Implementation:** [`UploadersController.single`](../src/controllers/api/UploadersController.ts)

### Upload Multiple Files

```http
POST /uploads/multiple
Headers:
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
```

---

## 🔍 Search & Filter

### Global Search

```http
GET /api/a/search?q=keyword
Headers: Authorization: Bearer {token}
```

**Response:**

```json
{
  "status": true,
  "data": {
    "customers": [...],
    "products": [...],
    "courses": [...]
  }
}
```

---

## 📊 Analytics & Reports

### Dashboard Statistics

```http
GET /api/a/analytics/dashboard
Headers: Authorization: Bearer {token}
```

**Response:**

```json
{
  "status": true,
  "data": {
    "totalCustomers": 1500,
    "totalOrders": 3200,
    "totalRevenue": 150000000,
    "activeCourses": 45
  }
}
```

---

## ⚠️ Error Responses

### Error Format

```json
{
  "status": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Server Error

---

## 📝 Notes

1. All protected endpoints require JWT token in Authorization header
2. Pagination defaults: page=1, limit=12
3. Date format: ISO 8601 (YYYY-MM-DD)
4. All responses follow standard format: `{ status, data, message, errors }`

---

**For complete API documentation, see:**

- [VAN_PHUC_CARE_API_DOCUMENTATION.md](../../VAN_PHUC_CARE_API_DOCUMENTATION.md)
- [Postman Collection](../../Van_Phuc_Care_API.postman_collection.json)
