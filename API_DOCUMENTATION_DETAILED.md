# 📘 VAN PHUC CARE - API DOCUMENTATION (DETAILED TABLE FORMAT)

> **Complete API Reference với Method, URL, Payload, và Response**

## 📋 Table of Contents
- [Authentication](#authentication)
- [FAQs](#faqs)
- [Feedbacks](#feedbacks)
- [Categories](#categories)
- [Courses](#courses)
- [Products](#products)
- [Customers](#customers)
- [Health Books](#health-books)
- [Schedule Vaccinations](#schedule-vaccinations)
- [Transactions](#transactions)
- [Access Permissions](#access-permissions)
- [File Uploads](#file-uploads)

---

## 🔐 AUTHENTICATION

### Login Admin
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/sessions/login` |
| **Auth Required** | ❌ No |
| **Request Body** | ```json<br/>{<br/>  "email": "admin@example.com",<br/>  "password": "password123"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "accessToken": "eyJhbGciOiJI...",<br/>    "admin": {<br/>      "_id": "507f1f77bcf86cd799439011",<br/>      "fullname": "Admin User",<br/>      "email": "admin@example.com",<br/>      "role": "admin",<br/>      "permissions": [],<br/>      "status": "active"<br/>    }<br/>  }<br/>}``` |
| **Response (401)** | ```json<br/>{<br/>  "status": false,<br/>  "message": "Invalid credentials"<br/>}``` |
| **Notes** | Returns JWT token for subsequent requests |

---

### Get Current Admin
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/sessions/current_admin` |
| **Auth Required** | ✅ Yes (Bearer token) |
| **Query Parameters** | None |
| **Request Body** | None |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "admin": {<br/>      "_id": "string",<br/>      "fullname": "string",<br/>      "email": "string",<br/>      "phone": "string",<br/>      "avatar": "string",<br/>      "role": "string",<br/>      "permissions": [],<br/>      "status": "active",<br/>      "createdAt": "2024-01-01T00:00:00.000Z"<br/>    }<br/>  }<br/>}``` |
| **Response (401)** | ```json<br/>{<br/>  "status": false,<br/>  "message": "Unauthorized"<br/>}``` |
| **Notes** | Requires valid JWT token in Authorization header |

---

### Update Profile
| Field | Value |
|-------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/a/sessions` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "fullname": "Updated Name",<br/>  "phone": "0987654321",<br/>  "avatar": "https://...",<br/>  "address": "New Address"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "admin": {}<br/>  }<br/>}``` |
| **Notes** | All fields are optional |

---

### Change Password
| Field | Value |
|-------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/a/sessions/change_password` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "oldPassword": "oldpass123",<br/>  "newPassword": "newpass123"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {}<br/>}``` |
| **Response (400)** | ```json<br/>{<br/>  "status": false,<br/>  "message": "Old password incorrect"<br/>}``` |

---

### Forgot Password
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/passwords/forgot_password` |
| **Auth Required** | ❌ No |
| **Request Body** | ```json<br/>{<br/>  "email": "admin@example.com"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "message": "Reset email sent"<br/>  }<br/>}``` |
| **Notes** | Sends OTP to email |

---

### Verify OTP
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/passwords/verify_otp` |
| **Auth Required** | ❌ No |
| **Request Body** | ```json<br/>{<br/>  "email": "admin@example.com",<br/>  "otp": "123456"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "token": "reset_token"<br/>  }<br/>}``` |
| **Response (400)** | ```json<br/>{<br/>  "status": false,<br/>  "message": "Invalid OTP"<br/>}``` |

---

### Reset Password
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/passwords?email={email}&token={token}` |
| **Auth Required** | ❌ No |
| **Query Parameters** | `email`: User email<br/>`token`: Reset token from OTP verification |
| **Request Body** | ```json<br/>{<br/>  "newPassword": "newpass123"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "message": "Password reset successful"<br/>  }<br/>}``` |

---

## ❓ FAQS

### Get All FAQs
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/faqs` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number (default: 1)<br/>`limit`: Items per page (default: 12) |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "faqs": [<br/>      {<br/>        "_id": "507f1f77bcf86cd799439011",<br/>        "title": "FAQ Title",<br/>        "content": "FAQ Content...",<br/>        "slug": "faq-title",<br/>        "status": "active",<br/>        "createdAt": "2024-01-01T00:00:00.000Z",<br/>        "updatedAt": "2024-01-01T00:00:00.000Z"<br/>      }<br/>    ],<br/>    "pagination": {<br/>      "total": 50,<br/>      "page": 1,<br/>      "limit": 12<br/>    }<br/>  }<br/>}``` |

---

### Get FAQ by ID
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/faqs/:faqId` |
| **Auth Required** | ✅ Yes |
| **URL Parameters** | `faqId`: FAQ ID |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "faq": {<br/>      "_id": "507f1f77bcf86cd799439011",<br/>      "title": "string",<br/>      "content": "string",<br/>      "slug": "string",<br/>      "status": "active"<br/>    }<br/>  }<br/>}``` |
| **Response (404)** | ```json<br/>{<br/>  "status": false,<br/>  "message": "FAQ not found"<br/>}``` |

---

### Create FAQ
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/faqs` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "title": "New FAQ Title",<br/>  "content": "FAQ content here...",<br/>  "slug": "new-faq-title"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "faqs": {<br/>      "_id": "507f1f77bcf86cd799439011",<br/>      "title": "New FAQ Title",<br/>      "content": "FAQ content here...",<br/>      "slug": "new-faq-title"<br/>    }<br/>  }<br/>}``` |
| **Notes** | Slug is auto-generated from title if not provided |

---

### Update FAQ
| Field | Value |
|-------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/a/faqs/:faqId` |
| **Auth Required** | ✅ Yes |
| **URL Parameters** | `faqId`: FAQ ID |
| **Request Body** | ```json<br/>{<br/>  "title": "Updated Title",<br/>  "content": "Updated content...",<br/>  "status": "active",<br/>  "slug": "updated-title"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "faq": {}<br/>  }<br/>}``` |
| **Field Values** | `status`: "active" \| "inactive" |

---

### Delete FAQ
| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/a/faqs/:faqId` |
| **Auth Required** | ✅ Yes |
| **URL Parameters** | `faqId`: FAQ ID |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {}<br/>}``` |

---

## 💬 FEEDBACKS

### Get All Feedbacks
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/feedbacks` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number (default: 1)<br/>`limit`: Items per page (default: 12)<br/>`createdBy`: Filter by creator ("admin" \| "customer") |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "feedbacks": [<br/>      {<br/>        "_id": "string",<br/>        "fullname": "Customer Name",<br/>        "email": "customer@example.com",<br/>        "phoneNumber": "0123456789",<br/>        "avatar": "https://...",<br/>        "position": "Customer",<br/>        "content": "Great service!",<br/>        "createdBy": "customer",<br/>        "status": "active",<br/>        "createdAt": "2024-01-01T00:00:00.000Z"<br/>      }<br/>    ],<br/>    "pagination": {<br/>      "total": 30,<br/>      "page": 1,<br/>      "limit": 12<br/>    }<br/>  }<br/>}``` |

---

### Create Feedback (Admin)
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/feedbacks` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "fullname": "Customer Name",<br/>  "position": "Director",<br/>  "content": "Excellent service...",<br/>  "avatar": "https://..."<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "feedback": {}<br/>  }<br/>}``` |
| **Notes** | Created by admin, no email/phone required |

---

### Set Active/Inactive
| Field | Value |
|-------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/a/feedbacks/:feedbackId/active`<br/>`/api/a/feedbacks/:feedbackId/inactive` |
| **Auth Required** | ✅ Yes |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {}<br/>}``` |
| **Notes** | Quick toggle for feedback status |

---

## 📁 CATEGORIES

### Get All Categories
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/categories` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number<br/>`limit`: Items per page<br/>`type`: "product" \| "blog"<br/>`searchKey`: Search term<br/>`status`: Filter by status<br/>`from`: Start date<br/>`to`: End date |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "categories": [<br/>      {<br/>        "_id": "string",<br/>        "title": "Category Name",<br/>        "slug": "category-name",<br/>        "thumbnail": "https://...",<br/>        "type": "product",<br/>        "postCount": 10,<br/>        "status": "active",<br/>        "createdAt": "2024-01-01T00:00:00.000Z"<br/>      }<br/>    ],<br/>    "pagination": {<br/>      "total": 20,<br/>      "page": 1,<br/>      "limit": 12<br/>    }<br/>  }<br/>}``` |

---

### Create Category
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/categories` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "title": "New Category",<br/>  "slug": "new-category",<br/>  "thumbnail": "https://...",<br/>  "type": "product"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "category": {}<br/>  }<br/>}``` |
| **Field Values** | `type`: "product" \| "blog" |

---

## 📚 COURSES

### Get All Courses
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/courses` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number (default: 1)<br/>`limit`: Items per page (default: 20)<br/>`searchKey`: Search by code<br/>`from`: Start date<br/>`to`: End date<br/>`status`: Filter by status<br/>`branch`: Filter by branch<br/>`course`: Filter by course |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "courses": [<br/>      {<br/>        "_id": "string",<br/>        "code": "COURSE001",<br/>        "name": "Course Name",<br/>        "status": "active",<br/>        "notes": "Course notes...",<br/>        "createdAt": "2024-01-01T00:00:00.000Z"<br/>      }<br/>    ],<br/>    "pagination": {<br/>      "total": 30,<br/>      "page": 1,<br/>      "limit": 20<br/>    }<br/>  }<br/>}``` |

---

### Create Course
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/courses` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "code": "COURSE002",<br/>  "name": "New Course",<br/>  "order": 1,<br/>  "thumbnail": "https://...",<br/>  "link": "https://...",<br/>  "title": "Course Title",<br/>  "shortDescription": "Course description..."<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "course": {}<br/>  }<br/>}``` |

---

## 🛍️ PRODUCTS

### Get All Products
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/products` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number (default: 1)<br/>`limit`: Items per page (default: 12)<br/>`categoryId`: Filter by category<br/>`searchKey`: Search by name |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "products": [<br/>      {<br/>        "_id": "string",<br/>        "name": "Product Name",<br/>        "price": 100000,<br/>        "quantityInStock": 50,<br/>        "quantitySelled": 10,<br/>        "status": "active",<br/>        "thumbnail": "https://...",<br/>        "createdAt": "2024-01-01T00:00:00.000Z"<br/>      }<br/>    ],<br/>    "pagination": {<br/>      "total": 100,<br/>      "page": 1,<br/>      "limit": 12<br/>    }<br/>  }<br/>}``` |
| **Notes** | Returns limited fields for list view |

---

### Get Product by ID
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/products/:productId` |
| **Auth Required** | ✅ Yes |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "product": {<br/>      "_id": "string",<br/>      "name": "Product Name",<br/>      "slug": "product-name",<br/>      "shortDescription": "Description...",<br/>      "thumbnail": "https://...",<br/>      "price": 100000,<br/>      "priceDiscount": 90000,<br/>      "discount": 10,<br/>      "typeDiscount": "percentage",<br/>      "category": [<br/>        {<br/>          "_id": "cat123",<br/>          "name": "Category A"<br/>        }<br/>      ],<br/>      "images": ["https://...", "https://..."],<br/>      "quantityInStock": 50,<br/>      "quantitySelled": 10,<br/>      "isOutOfStock": false,<br/>      "showHome": true,<br/>      "status": "active"<br/>    }<br/>  }<br/>}``` |
| **Notes** | Returns full product details |

---

### Create Product
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/products` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "name": "New Product",<br/>  "slug": "new-product",<br/>  "thumbnail": "https://...",<br/>  "shortDescription": "Product description...",<br/>  "price": 150000,<br/>  "priceDiscount": 135000,<br/>  "discount": 10,<br/>  "typeDiscount": "percentage",<br/>  "category": {<br/>    "id": "cat123",<br/>    "name": "Category A"<br/>  },<br/>  "images": ["https://..."],<br/>  "quantityInStock": 100,<br/>  "showHome": true,<br/>  "gtin": "1234567890123"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "product": {}<br/>  }<br/>}``` |

---

### Update Product
| Field | Value |
|-------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/a/products/:productId` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "name": "Updated Product",<br/>  "price": 200000,<br/>  "quantityInStock": 150,<br/>  "status": "active",<br/>  "category": [<br/>    {<br/>      "_id": "cat123",<br/>      "name": "Category A"<br/>    }<br/>  ],<br/>  "categoryRemove": ["cat456"]<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "product": {}<br/>  }<br/>}``` |
| **Field Values** | `status`: "active" \| "archived" \| "draft" \| "out_stock" |
| **Notes** | Updates product and manages category relationships |

---

### Delete Product
| Field | Value |
|-------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/a/products/:productId` |
| **Auth Required** | ✅ Yes |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "status": true<br/>  }<br/>}``` |
| **Notes** | Also deletes related product reviews |

---

## 👥 CUSTOMERS

### Get All Customers
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/customers` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number<br/>`limit`: Items per page |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "customers": [],<br/>    "pagination": {}<br/>  }<br/>}``` |

---

### Create Customer
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/customers` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "email": "customer@example.com",<br/>  "firstname": "John",<br/>  "lastname": "Doe",<br/>  "phone": "0123456789",<br/>  "address": "123 Street",<br/>  "city": "Hanoi"<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "customer": {}<br/>  }<br/>}``` |

---

### Bulk Operations

#### Delete Many Customers
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/customers/deleteMany` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "ids": ["id1", "id2", "id3"]<br/>}``` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {}<br/>}``` |

---

#### Import Customers
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/customers/import` |
| **Auth Required** | ✅ Yes |
| **Content-Type** | `multipart/form-data` |
| **Request Body** | Excel/CSV file with customer data |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "imported": 100,<br/>    "failed": 5<br/>  }<br/>}``` |

---

## 📖 HEALTH BOOKS

### Get All Health Books
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/health-book/all` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`: Page number<br/>`limit`: Items per page |

---

### Get by Date
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/health-book/byDate/:customerId` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `date`: Date to query (YYYY-MM-DD) |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "healthBook": {}<br/>  }<br/>}``` |

---

### Create Health Book
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/health-book` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "customerId": "cust123",<br/>  "name": "Baby Name",<br/>  "dob": "2020-01-01",<br/>  "gender": "male",<br/>  "weight": "15kg",<br/>  "height": "100cm",<br/>  "healthCondition": "Healthy",<br/>  "domain": "vanphuccare"<br/>}``` |

---

### Comments System

#### Get Comments
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/comments` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `healthBookId`: Health book ID |

---

#### Create Comment
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/comments` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "healthBookId": "hb123",<br/>  "content": "Comment text..."<br/>}``` |

---

## 💉 SCHEDULE VACCINATIONS

### Get All Schedules
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/schedule-vaccin` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`, `limit` |

---

### Create Schedule
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/schedule-vaccin` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "customerId": "cust123",<br/>  "title": "Vaccination Schedule",<br/>  "content": "Details...",<br/>  "time": "2024-12-01 09:00",<br/>  "numberOfInjections": "1",<br/>  "address": "123 Street, Hanoi",<br/>  "status": "scheduled",<br/>  "domain": "vanphuccare"<br/>}``` |

---

## 💰 TRANSACTIONS

### Get All Transactions
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `/api/a/transactions` |
| **Auth Required** | ✅ Yes |
| **Query Parameters** | `page`, `limit` |

---

### Create Transaction
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/a/transactions` |
| **Auth Required** | ✅ Yes |
| **Request Body** | ```json<br/>{<br/>  "origin": "order123",<br/>  "type": "payment",<br/>  "title": "Payment for Order #1001",<br/>  "total": 500000,<br/>  "status": "pending"<br/>}``` |
| **Field Values** | `status`: "pending" \| "success" \| "denied" |

---

## 📤 FILE UPLOADS

### Upload to Firebase
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/uploads` |
| **Auth Required** | ❌ No |
| **Content-Type** | `multipart/form-data` |
| **Request Body** | Form field: `files` (can be multiple) |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "urls": [<br/>      "https://firebasestorage.googleapis.com/..."<br/>    ]<br/>  }<br/>}``` |

---

### Upload Image
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/uploaders/image` |
| **Auth Required** | ❌ No |
| **Content-Type** | `multipart/form-data` |
| **Request Body** | Form field: `image` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "url": "https://..."<br/>  }<br/>}``` |

---

### Upload Video
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `/api/uploaders/video` |
| **Auth Required** | ❌ No |
| **Content-Type** | `multipart/form-data` |
| **Request Body** | Form field: `video` |
| **Response (200)** | ```json<br/>{<br/>  "status": true,<br/>  "data": {<br/>    "url": "https://..."<br/>  }<br/>}``` |

---

## 📝 NOTES

### Response Format
All successful responses follow this format:
```json
{
  "status": true,
  "data": {
    // Response data here
  }
}
```

### Error Format
All error responses follow this format:
```json
{
  "status": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

### Pagination Format
Lists with pagination include:
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

### Authentication
Most endpoints require JWT authentication:
```
Authorization: Bearer {your_access_token}
```

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Format**: Detailed Table Documentation

