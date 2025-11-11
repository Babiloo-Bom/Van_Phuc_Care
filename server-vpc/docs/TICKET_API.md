# 🎫 Ticket Management API Documentation

## 📋 Overview

Ticket Management module cung cấp các API để quản lý ticket hỗ trợ khách hàng. Module này cho phép tạo, cập nhật, xem và xóa tickets, cũng như theo dõi thống kê tickets.

## 🔐 Authentication

Tất cả Ticket APIs yêu cầu JWT authentication:
```
Headers: Authorization: Bearer {admin_token}
```

---

## 📡 API Endpoints

### 1. Get All Tickets (Danh sách Tickets)

```http
GET /api/a/tickets
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |
| status | string | No | Filter by status: `open`, `pending`, `in_progress`, `resolved`, `closed` |
| priority | string | No | Filter by priority: `low`, `medium`, `high`, `urgent` |
| category | string | No | Filter by category: `technical`, `billing`, `general`, `complaint`, `feature_request` |
| customerId | string | No | Filter by customer ID |
| assignedTo | string | No | Filter by assigned admin ID |
| search | string | No | Search by title, description, or ticket number |
| sort | string | No | Sort field (prefix with `-` for descending, e.g., `-createdAt`) |

**Request Example:**
```bash
GET /api/a/tickets?page=1&limit=10&status=open&priority=high&sort=-createdAt
```

**Response Success (200):**
```json
{
  "message": "",
  "data": {
    "data": [
      {
        "_id": "ticket_id_123",
        "ticketNumber": "TK000001",
        "title": "Cannot login to account",
        "description": "I forgot my password and cannot reset it",
        "customerId": {
          "_id": "customer_id",
          "firstname": "John",
          "lastname": "Doe",
          "email": "john@example.com",
          "phone": "0123456789"
        },
        "assignedTo": {
          "_id": "admin_id",
          "fullname": "Admin Support",
          "email": "admin@vanphuccare.com"
        },
        "priority": "high",
        "status": "open",
        "category": "technical",
        "attachments": [],
        "notes": "",
        "createdAt": "2025-11-10T10:30:00.000Z",
        "updatedAt": "2025-11-10T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 125
    }
  }
}
```

---

### 2. Get Ticket Statistics (Thống kê Tickets)

```http
GET /api/a/tickets/statistics
```

**⚠️ Important:** This endpoint must be called **before** `GET /api/a/tickets/:id` to avoid route conflicts.

**Response Success (200):**
```json
{
  "message": "",
  "data": {
    "statistics": {
      "total": 250,
      "active": 45,
      "pending": 12,
      "resolved": 180,
      "closed": 25,
      "byStatus": {
        "open": 20,
        "pending": 12,
        "in_progress": 13,
        "resolved": 180,
        "closed": 25
      },
      "byPriority": {
        "low": 50,
        "medium": 100,
        "high": 80,
        "urgent": 20
      },
      "byCategory": {
        "technical": 100,
        "billing": 50,
        "general": 60,
        "complaint": 30,
        "feature_request": 10
      },
      "latest": [
        {
          "_id": "ticket_id",
          "ticketNumber": "TK000250",
          "title": "Payment issue",
          "customerId": {
            "firstname": "Jane",
            "lastname": "Smith",
            "email": "jane@example.com"
          },
          "assignedTo": {
            "fullname": "Admin Support",
            "email": "admin@vanphuccare.com"
          },
          "status": "open",
          "priority": "high",
          "createdAt": "2025-11-10T15:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### 3. Get Ticket by ID (Chi tiết Ticket)

```http
GET /api/a/tickets/:id
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Ticket ID |

**Request Example:**
```bash
GET /api/a/tickets/673098d12345abcdef678901
```

**Response Success (200):**
```json
{
  "message": "",
  "data": {
    "ticket": {
      "_id": "673098d12345abcdef678901",
      "ticketNumber": "TK000001",
      "title": "Cannot login to account",
      "description": "I forgot my password and cannot reset it. Please help me recover my account.",
      "customerId": {
        "_id": "customer_id",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "phone": "0123456789",
        "address": "123 Street, City",
        "dateOfBirth": "1990-01-15"
      },
      "assignedTo": {
        "_id": "admin_id",
        "fullname": "Admin Support",
        "email": "admin@vanphuccare.com",
        "avatar": "https://storage.example.com/avatars/admin.jpg"
      },
      "priority": "high",
      "status": "in_progress",
      "category": "technical",
      "attachments": [
        {
          "filename": "screenshot.png",
          "url": "https://storage.example.com/tickets/screenshot.png",
          "uploadedAt": "2025-11-10T10:31:00.000Z"
        }
      ],
      "notes": "Customer confirmed email address. Sending password reset link.",
      "resolvedAt": null,
      "resolvedBy": null,
      "createdAt": "2025-11-10T10:30:00.000Z",
      "updatedAt": "2025-11-10T11:00:00.000Z"
    }
  }
}
```

**Response Error (404):**
```json
{
  "error": "Ticket not found"
}
```

---

### 4. Create Ticket (Tạo Ticket mới)

```http
POST /api/a/tickets
```

**Request Body:**
```json
{
  "title": "Cannot access course materials",
  "description": "I purchased the course but cannot view the lessons",
  "customerId": "customer_id_123",
  "assignedTo": "admin_id_456",
  "priority": "medium",
  "status": "open",
  "category": "technical",
  "notes": "Customer has paid for the course",
  "attachments": [
    {
      "filename": "payment_receipt.pdf",
      "url": "https://storage.example.com/receipts/payment.pdf"
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Ticket title (max 200 chars) |
| description | string | Yes | Detailed description |
| customerId | string | Yes | Customer ID (must exist) |
| assignedTo | string | No | Admin ID to assign ticket |
| priority | string | No | Priority level (default: `medium`) |
| status | string | No | Initial status (default: `open`) |
| category | string | No | Ticket category (default: `general`) |
| notes | string | No | Internal notes |
| attachments | array | No | Array of attachment objects |

**Response Success (200):**
```json
{
  "message": "Ticket created successfully",
  "data": {
    "ticket": {
      "_id": "new_ticket_id",
      "ticketNumber": "TK000251",
      "title": "Cannot access course materials",
      "description": "I purchased the course but cannot view the lessons",
      "customerId": {
        "_id": "customer_id_123",
        "firstname": "Alice",
        "lastname": "Brown",
        "email": "alice@example.com",
        "phone": "0987654321"
      },
      "assignedTo": {
        "_id": "admin_id_456",
        "fullname": "Support Team",
        "email": "support@vanphuccare.com"
      },
      "priority": "medium",
      "status": "open",
      "category": "technical",
      "attachments": [
        {
          "filename": "payment_receipt.pdf",
          "url": "https://storage.example.com/receipts/payment.pdf",
          "uploadedAt": "2025-11-10T12:00:00.000Z"
        }
      ],
      "notes": "Customer has paid for the course",
      "createdAt": "2025-11-10T12:00:00.000Z",
      "updatedAt": "2025-11-10T12:00:00.000Z"
    }
  }
}
```

**Response Error (404):**
```json
{
  "error": "Customer not found"
}
```

---

### 5. Update Ticket (Cập nhật Ticket)

```http
PATCH /api/a/tickets/:id
```

**Request Body (tất cả fields đều optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "assignedTo": "new_admin_id",
  "priority": "urgent",
  "status": "resolved",
  "category": "billing",
  "notes": "Issue has been resolved",
  "attachments": [
    {
      "filename": "solution.pdf",
      "url": "https://storage.example.com/solutions/solution.pdf"
    }
  ]
}
```

**Special Behaviors:**

1. **Status Change to `resolved` or `closed`:**
   - Automatically sets `resolvedAt` timestamp
   - Sets `resolvedBy` to current admin if not provided

2. **Auto-generated fields:**
   - `ticketNumber` is auto-generated and cannot be changed
   - `customerId` cannot be changed after creation

**Response Success (200):**
```json
{
  "message": "Ticket updated successfully",
  "data": {
    "ticket": {
      "_id": "ticket_id",
      "ticketNumber": "TK000001",
      "title": "Updated title",
      "status": "resolved",
      "priority": "urgent",
      "resolvedAt": "2025-11-10T14:00:00.000Z",
      "resolvedBy": {
        "_id": "admin_id",
        "fullname": "Admin Support",
        "email": "admin@vanphuccare.com"
      },
      "updatedAt": "2025-11-10T14:00:00.000Z"
    }
  }
}
```

**Response Error (404):**
```json
{
  "error": "Ticket not found"
}
```

---

### 6. Delete Ticket (Xóa Ticket)

```http
DELETE /api/a/tickets/:id
```

**⚠️ Warning:** This action is **permanent** and cannot be undone.

**Request Example:**
```bash
DELETE /api/a/tickets/673098d12345abcdef678901
```

**Response Success (200):**
```json
{
  "message": "Ticket deleted successfully",
  "data": {}
}
```

**Response Error (404):**
```json
{
  "error": "Ticket not found"
}
```

---

### 7. Bulk Delete Tickets (Xóa nhiều Tickets)

```http
POST /api/a/tickets/bulk-delete
```

**Request Body:**
```json
{
  "ids": [
    "ticket_id_1",
    "ticket_id_2",
    "ticket_id_3"
  ]
}
```

**Response Success (200):**
```json
{
  "message": "3 ticket(s) deleted successfully",
  "data": {
    "deletedCount": 3
  }
}
```

**Response Error (400):**
```json
{
  "error": "Invalid ticket IDs provided"
}
```

---

## 📊 Dashboard Integration

Dashboard API đã được tích hợp Ticket statistics:

### Get Dashboard Statistics

```http
GET /api/a/dashboard/statistics
```

**Response includes Ticket data:**
```json
{
  "data": {
    "statistics": {
      "customers": { ... },
      "orders": { ... },
      "revenue": { ... },
      "courses": { ... },
      "tickets": {
        "total": 250,
        "active": 45,
        "pending": 12,
        "resolved": 180,
        "latest": [
          {
            "_id": "ticket_id",
            "ticketNumber": "TK000250",
            "title": "Payment issue",
            "status": "open",
            "priority": "high",
            "createdAt": "2025-11-10T15:00:00.000Z"
          }
        ]
      }
    }
  }
}
```

---

## 🔍 Field Reference

### Ticket Status Values

| Status | Description |
|--------|-------------|
| `open` | Ticket mới được tạo, chưa xử lý |
| `pending` | Đang chờ thông tin từ khách hàng |
| `in_progress` | Đang được xử lý bởi admin |
| `resolved` | Đã giải quyết xong |
| `closed` | Đã đóng ticket |

### Priority Levels

| Priority | Description | Use Case |
|----------|-------------|----------|
| `low` | Không gấp | Câu hỏi thông thường |
| `medium` | Bình thường | Hầu hết các tickets |
| `high` | Ưu tiên cao | Vấn đề ảnh hưởng dịch vụ |
| `urgent` | Khẩn cấp | Sự cố nghiêm trọng |

### Category Types

| Category | Description |
|----------|-------------|
| `technical` | Vấn đề kỹ thuật (login, access, bugs) |
| `billing` | Vấn đề thanh toán, hoá đơn |
| `general` | Câu hỏi chung |
| `complaint` | Khiếu nại, phàn nàn |
| `feature_request` | Yêu cầu tính năng mới |

---

## 📝 Example Use Cases

### Use Case 1: Create Support Ticket

**Scenario:** Customer báo lỗi không thể đăng nhập

```bash
POST /api/a/tickets
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "title": "Cannot login - Password reset not working",
  "description": "Customer tried to reset password but did not receive email",
  "customerId": "6730xyz123",
  "priority": "high",
  "category": "technical",
  "status": "open"
}
```

### Use Case 2: Assign and Update Ticket

**Step 1:** Assign to support team
```bash
PATCH /api/a/tickets/673098d12345
{
  "assignedTo": "admin_support_id",
  "status": "in_progress",
  "notes": "Assigned to support team for investigation"
}
```

**Step 2:** Resolve ticket
```bash
PATCH /api/a/tickets/673098d12345
{
  "status": "resolved",
  "notes": "Password reset email was in spam folder. Resolved with customer."
}
```

### Use Case 3: Filter High Priority Open Tickets

```bash
GET /api/a/tickets?status=open&priority=high&sort=-createdAt&limit=20
```

### Use Case 4: Search Tickets by Customer Email

```bash
GET /api/a/tickets?search=john@example.com
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid ticket IDs provided"
}
```

**404 Not Found:**
```json
{
  "error": "Ticket not found"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

**500 Server Error:**
```json
{
  "error": "Failed to fetch tickets"
}
```

---

## 🎯 Best Practices

### 1. Pagination
- Always use pagination for list queries
- Default page size is 10, maximum recommended is 50
- Use `total` from pagination to calculate total pages

### 2. Filtering
- Combine multiple filters for precise results
- Use search for flexible text matching
- Use specific filters (status, priority) for exact matching

### 3. Sorting
- Default sort is by `createdAt` descending (newest first)
- Use `-` prefix for descending order: `-createdAt`
- Available sort fields: `createdAt`, `updatedAt`, `priority`, `status`

### 4. Status Management
- Always update `status` when processing tickets
- Add `notes` when changing status for audit trail
- Use `resolved` status before `closed` status

### 5. Priority Management
- Set priority based on impact and urgency
- Review `urgent` tickets immediately
- Regular tickets should be `medium` by default

---

## 🔗 Related APIs

- **Customers API:** `/api/a/customers` - Manage customer information
- **Dashboard API:** `/api/a/dashboard` - View statistics including tickets
- **Admins API:** `/api/a/admins` - Manage admin users who handle tickets

---

## 📚 Additional Resources

- [Main API Documentation](../../../VAN_PHUC_CARE_API_DOCUMENTATION.md)
- [Database Schema - Tickets](./DATABASE_SCHEMA.md#8-tickets-collection)
- [Postman Collection](../../../Van_Phuc_Care_API.postman_collection.json)

---

**© 2025 Van Phuc Care - Ticket Management System**
