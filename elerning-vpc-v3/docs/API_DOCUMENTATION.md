# 📡 API Documentation

> **Tài liệu đầy đủ về API endpoints cho E-Learning Portal**

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Authentication](#authentication)
3. [Base URL & Endpoints](#base-url--endpoints)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Format](#requestresponse-format)
6. [Error Handling](#error-handling)
7. [Examples](#examples)
8. [Rate Limiting](#rate-limiting)

---

## 🎯 Tổng quan

E-Learning Portal sử dụng RESTful API với các đặc điểm:

- **Base URL**: `http://localhost:3000` (development) hoặc production domain
- **API Prefix**: 
  - `/api/a` - Admin endpoints (quản lý)
  - `/api/u` - User endpoints (người dùng)
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`
- **Response Format**: JSON

---

## 🔐 Authentication

### JWT Token

Hầu hết các endpoints yêu cầu authentication token trong header:

```http
Authorization: Bearer <token>
```

### Lấy Token

Token được trả về sau khi login thành công:

```typescript
// Login
const response = await useAuthApi().login(email, password)
// Response: { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", user: {...} }
```

### Token Expiry

- Token có thời hạn (mặc định: 7 ngày)
- Khi token hết hạn, client sẽ nhận `401 Unauthorized`
- Cần login lại để lấy token mới

---

## 🌐 Base URL & Endpoints

### Development

```typescript
// Client-side
const baseURL = 'http://localhost:3000'

// Server-side (SSR)
const baseURL = process.env.NUXT_API_HOST_INTERNAL || 'http://localhost:3000'
```

### Production

```typescript
// Sử dụng relative paths (proxied by Nginx)
const baseURL = '' // Empty string = same origin
```

### API Prefixes

- **Admin API**: `/api/a/*` - Quản lý, CRUD operations
- **User API**: `/api/u/*` - User-facing operations

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/u/sessions`)

#### Login

```http
POST /api/u/sessions/login
```

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123",
  "remindAccount": false
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "fullname": "User Name",
    "role": "user"
  }
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.login(email, password)
```

---

#### Register

```http
POST /api/u/sessions
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "repeat_password": "password123",
  "fullname": "User Name",
  "phoneNumber": "0123456789",
  "source": "elearning"
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
  "user": {
    "_id": "user_id",
    "email": "user@example.com"
  }
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.register(email, password, repeatPassword, fullname, phone)
```

---

#### Verify Email

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

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.verifyEmail(email, otp)
```

---

#### Get User Profile

```http
GET /api/u/users/profile
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "fullname": "User Name",
    "phoneNumber": "0123456789",
    "avatar": "https://...",
    "role": "user"
  }
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.getUserProfile()
```

---

#### Update Profile

```http
PATCH /api/u/sessions
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullname": "New Name",
  "phoneNumber": "0987654321",
  "avatar": "https://..."
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.updateProfile({ fullname, phoneNumber })
```

---

#### Change Password

```http
PATCH /api/u/sessions/change_password
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
await authApi.changePassword(oldPassword, newPassword)
```

---

#### Forgot Password

```http
POST /api/u/sessions/forgot_password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "source": "elearning"
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.forgotPassword(email)
```

---

#### Reset Password

```http
POST /api/u/sessions/reset_password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset_token",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const result = await authApi.resetPassword(email, token, newPassword, confirmPassword)
```

---

#### Google OAuth

**Get OAuth URL:**
```http
GET /api/a/auth/google/url
```

**Login with Google:**
```http
POST /api/a/auth/google/login
```

**Request Body:**
```json
{
  "code": "authorization_code",
  "state": "state_string"
}
```

**Composable:**
```typescript
const authApi = useAuthApi()
const { url } = await authApi.getGoogleAuthUrl()
// Redirect user to url
// After callback, exchange code for token
const result = await authApi.googleLogin(code, state)
```

---

### 📚 Courses (`/api/a/courses`)

#### Get Courses List

```http
GET /api/a/courses?page=1&limit=10&search=keyword&category=category_id
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search keyword
- `category` (string): Category ID filter
- `status` (string): Status filter (active, inactive)
- `sort` (string): Sort field
- `order` (string): Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "_id": "course_id",
      "title": "Course Title",
      "description": "Course Description",
      "price": 500000,
      "originalPrice": 600000,
      "thumbnail": "https://...",
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "instructor": {
        "_id": "instructor_id",
        "name": "Instructor Name"
      },
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Composable:**
```typescript
const coursesApi = useCoursesApi()
const result = await coursesApi.getCourses({ page: 1, limit: 10, search: 'keyword' })
```

---

#### Get Course by ID

```http
GET /api/a/courses/:id
```

**Response:**
```json
{
  "course": {
    "_id": "course_id",
    "title": "Course Title",
    "description": "Full description",
    "shortDescription": "Short description",
    "price": 500000,
    "thumbnail": "https://...",
    "introVideo": "https://...",
    "introVideoHlsUrl": "https://...",
    "lessons": [...],
    "modules": [...],
    "category": {...},
    "instructor": {...}
  }
}
```

**Composable:**
```typescript
const coursesApi = useCoursesApi()
const result = await coursesApi.getCourse(courseId)
```

---

#### Create Course

```http
POST /api/a/courses
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Course",
  "description": "Course description",
  "price": 500000,
  "category": "category_id",
  "instructor": "instructor_id",
  "thumbnail": "https://..."
}
```

**Composable:**
```typescript
const coursesApi = useCoursesApi()
const result = await coursesApi.createCourse(courseData)
```

---

#### Update Course

```http
PATCH /api/a/courses/:id
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "price": 600000
}
```

**Composable:**
```typescript
const coursesApi = useCoursesApi()
const result = await coursesApi.updateCourse(courseId, updateData)
```

---

#### Delete Course

```http
DELETE /api/a/courses/:id
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const coursesApi = useCoursesApi()
const result = await coursesApi.deleteCourse(courseId)
```

---

### 🛒 Orders (`/api/a/orders`)

#### Get Orders List

```http
GET /api/a/orders?page=1&limit=10&status=pending&userId=user_id
```

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Order status (pending, completed, cancelled)
- `userId`: Filter by user
- `from`, `to`: Date range

**Response:**
```json
{
  "data": [
    {
      "_id": "order_id",
      "userId": "user_id",
      "items": [
        {
          "course": {
            "_id": "course_id",
            "title": "Course Title",
            "price": 500000
          },
          "quantity": 1,
          "price": 500000
        }
      ],
      "total": 500000,
      "status": "completed",
      "paymentStatus": "paid",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

**Composable:**
```typescript
const ordersApi = useOrdersApi()
const result = await ordersApi.getOrders({ page: 1, limit: 10 })
```

---

#### Get Order by ID

```http
GET /api/a/orders/:id
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const ordersApi = useOrdersApi()
const result = await ordersApi.getOrder(orderId)
```

---

#### Create Order

```http
POST /api/a/orders
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "courseId": "course_id",
      "quantity": 1,
      "price": 500000
    }
  ],
  "couponCode": "DISCOUNT10",
  "paymentMethod": "vnpay"
}
```

**Composable:**
```typescript
const ordersApi = useOrdersApi()
const result = await ordersApi.createOrder(orderData)
```

---

#### Update Order Status

```http
PATCH /api/a/orders/:id/status
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Composable:**
```typescript
const ordersApi = useOrdersApi()
const result = await ordersApi.updateOrderStatus(orderId, 'completed')
```

---

#### Cancel Order

```http
POST /api/a/orders/:id/cancel
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "User requested cancellation"
}
```

**Composable:**
```typescript
const ordersApi = useOrdersApi()
const result = await ordersApi.cancelOrder(orderId, reason)
```

---

#### Get Order Statistics

```http
GET /api/a/orders/statistics?from=2025-01-01&to=2025-01-31
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const ordersApi = useOrdersApi()
const result = await ordersApi.getOrderStats({ from: '2025-01-01', to: '2025-01-31' })
```

---

### 💰 Transactions (`/api/a/transactions`)

#### Get Transactions List

```http
GET /api/a/transactions?page=1&limit=10
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const transactionsApi = useTransactionsApi()
const result = await transactionsApi.getTransactions({ page: 1, limit: 10 })
```

---

#### Get Transaction by ID

```http
GET /api/a/transactions/:id
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const transactionsApi = useTransactionsApi()
const result = await transactionsApi.getTransaction(transactionId)
```

---

#### Get Transaction Statistics

```http
GET /api/a/transactions/statistics?from=2025-01-01&to=2025-01-31
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const transactionsApi = useTransactionsApi()
const result = await transactionsApi.getTransactionStats({ from: '2025-01-01', to: '2025-01-31' })
```

---

### 📦 Products (`/api/a/products`)

#### Get Products List

```http
GET /api/a/products?page=1&limit=10
```

**Composable:**
```typescript
const productsApi = useProductsApi()
const result = await productsApi.getProducts({ page: 1, limit: 10 })
```

---

#### Get Product by ID

```http
GET /api/a/products/:id
```

**Composable:**
```typescript
const productsApi = useProductsApi()
const result = await productsApi.getProduct(productId)
```

---

### 🏷️ Categories (`/api/a/categories`)

#### Get Categories List

```http
GET /api/a/categories
```

**Composable:**
```typescript
const productsApi = useProductsApi()
const result = await productsApi.getCategories()
```

---

### 📢 Banners (`/api/a/banners`)

#### Get Banners

```http
GET /api/a/banners?position=homepage
```

**Query Parameters:**
- `position` (string): Banner position (homepage, sidebar, etc.)

**Composable:**
```typescript
const bannersApi = useBannersApi()
const result = await bannersApi.getBanners({ position: 'homepage' })
```

---

### 👥 Customers (`/api/a/customers`)

#### Get Customers List

```http
GET /api/a/customers?page=1&limit=10
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const customersApi = useCustomersApi()
const result = await customersApi.getCustomers({ page: 1, limit: 10 })
```

---

#### Get Customer by ID

```http
GET /api/a/customers/:id
Headers: Authorization: Bearer <token>
```

**Composable:**
```typescript
const customersApi = useCustomersApi()
const result = await customersApi.getCustomer(customerId)
```

---

### 📤 File Upload (`/api/a/uploaders`)

#### Upload File

```http
POST /api/a/uploaders
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData:
  file: <File>
  folder: "courses" (optional)
```

**Response:**
```json
{
  "url": "https://cdn.example.com/files/filename.jpg",
  "filename": "filename.jpg",
  "size": 1024000,
  "mimetype": "image/jpeg"
}
```

**Composable:**
```typescript
const uploadsApi = useUploadsApi()
const formData = new FormData()
formData.append('file', file)
formData.append('folder', 'courses')
const result = await uploadsApi.uploadFile(formData)
```

---

## 📝 Request/Response Format

### Request Format

**Headers:**
```http
Content-Type: application/json
Authorization: Bearer <token>  # Required for protected endpoints
```

**Body (for POST/PUT/PATCH):**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### Response Format

**Success Response:**
```json
{
  "status": true,
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "status": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or token expired
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Structure

```json
{
  "status": false,
  "message": "Error message in Vietnamese",
  "error": {
    "code": "ERROR_CODE",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Email không hợp lệ"
      }
    ]
  }
}
```

### Using API Client

API client tự động handle errors và hiển thị messages:

```typescript
const apiClient = useApiClient()

// Error sẽ được tự động handle
const result = await apiClient.get('/api/a/courses')

if (result.status) {
  // Success
  console.log(result.data)
} else {
  // Error (message đã được hiển thị)
  console.error(result.message)
}
```

---

## 💡 Examples

### Complete Login Flow

```typescript
// 1. Login
const authApi = useAuthApi()
const loginResult = await authApi.login('user@example.com', 'password123')

if (loginResult.token) {
  // 2. Save token to store
  const authStore = useAuthStore()
  authStore.setToken(loginResult.token)
  authStore.setUser(loginResult.user)
  
  // 3. Get user profile
  const profile = await authApi.getUserProfile()
  console.log('User profile:', profile)
}
```

### Fetch Courses with Pagination

```typescript
const coursesApi = useCoursesApi()

const result = await coursesApi.getCourses({
  page: 1,
  limit: 10,
  search: 'python',
  category: 'category_id'
})

if (result.status) {
  const { data, pagination } = result.data
  console.log('Courses:', data)
  console.log('Total pages:', pagination.totalPages)
}
```

### Create Order

```typescript
const ordersApi = useOrdersApi()

const orderData = {
  items: [
    {
      courseId: 'course_id',
      quantity: 1,
      price: 500000
    }
  ],
  couponCode: 'DISCOUNT10',
  paymentMethod: 'vnpay'
}

const result = await ordersApi.createOrder(orderData)

if (result.status) {
  console.log('Order created:', result.data.order)
  // Redirect to payment
  window.location.href = result.data.paymentUrl
}
```

### Upload File

```typescript
const uploadsApi = useUploadsApi()

const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'courses')
  
  const result = await uploadsApi.uploadFile(formData)
  
  if (result.status) {
    console.log('File uploaded:', result.data.url)
    return result.data.url
  }
}
```

---

## 🚦 Rate Limiting

API có rate limiting để bảo vệ server:

- **Default**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **Upload endpoints**: 5 requests per minute per IP

Khi vượt quá limit, sẽ nhận `429 Too Many Requests`.

---

## 📚 Related Documentation

- [README.md](../README.md) - Main documentation
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Project structure
- [GTM_SETUP.md](./GTM_SETUP.md) - GTM integration
- [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md) - Payment system

---

## 🔗 API Client Implementation

Tất cả API calls được thực hiện thông qua `useApiClient()` composable:

```typescript
// composables/useApiClient.ts
const apiClient = useApiClient()

// GET request
const result = await apiClient.get('/api/a/courses')

// POST request
const result = await apiClient.post('/api/a/courses', courseData)

// PUT request
const result = await apiClient.put('/api/a/courses/:id', updateData)

// DELETE request
const result = await apiClient.delete('/api/a/courses/:id')

// Upload file
const result = await apiClient.upload('/api/a/uploaders', formData)
```

**Features:**
- ✅ Automatic token injection
- ✅ Error handling
- ✅ Retry logic
- ✅ Timeout handling
- ✅ Request/Response interceptors

---

**Last Updated**: 2025-01-26

