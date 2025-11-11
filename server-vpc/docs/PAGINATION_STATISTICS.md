# 📊 Pagination & Statistics API Standard

## 📋 Tổng quan

Document này mô tả chuẩn pagination và statistics APIs được áp dụng thống nhất trên toàn bộ hệ thống Van Phuc Care Backend.

---

## 🔄 Pagination Standard

### Response Format

Tất cả API GET trả về danh sách dữ liệu **BẮT BUỘC** tuân theo format sau:

```json
{
  "message": "",
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 125
    }
  }
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `data` | Array | Mảng chứa danh sách items | `[{...}, {...}]` |
| `pagination.page` | Number | Trang hiện tại (bắt đầu từ 1) | `1` |
| `pagination.pageSize` | Number | Số items trên mỗi trang | `10` |
| `pagination.total` | Number | Tổng số items trong database | `125` |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Số trang cần lấy |
| `limit` hoặc `pageSize` | Number | 10-20 | Số items trên mỗi trang |

### Request Example

```bash
GET /api/a/customers?page=2&limit=20
Authorization: Bearer {token}
```

### Response Example

```json
{
  "message": "",
  "data": {
    "data": [
      {
        "_id": "customer_id_1",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "phone": "0123456789",
        "status": "verified",
        "createdAt": "2025-11-01T10:00:00.000Z"
      },
      {
        "_id": "customer_id_2",
        "firstname": "Jane",
        "lastname": "Smith",
        "email": "jane@example.com",
        "phone": "0987654321",
        "status": "verified",
        "createdAt": "2025-11-02T11:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 2,
      "pageSize": 20,
      "total": 125
    }
  }
}
```

---

## 📈 Statistics APIs

### 1. Customer Statistics

**Endpoint:** `GET /api/a/customers/statistics`

**Query Parameters:**

| Parameter | Type | Values | Default | Description |
|-----------|------|--------|---------|-------------|
| `range` | String | `7d`, `30d`, `90d`, `all` | `30d` | Khoảng thời gian thống kê |
| `groupBy` | String | `status`, `region`, `date` | `status` | Nhóm dữ liệu theo |
| `from` | String (Date) | `YYYY-MM-DD` | - | Ngày bắt đầu (custom range) |
| `to` | String (Date) | `YYYY-MM-DD` | - | Ngày kết thúc (custom range) |

**Request Examples:**

```bash
# Get last 7 days, grouped by status
GET /api/a/customers/statistics?range=7d&groupBy=status

# Get custom date range, grouped by region
GET /api/a/customers/statistics?from=2025-10-01&to=2025-10-31&groupBy=region

# Get last 30 days, grouped by date
GET /api/a/customers/statistics?range=30d&groupBy=date
```

**Response Example (groupBy=status):**

```json
{
  "message": "",
  "data": {
    "statistics": {
      "summary": {
        "totalInRange": 45,
        "totalAllTime": 125,
        "growthRate": 25.5,
        "periodStart": "2025-10-11",
        "periodEnd": "2025-11-10",
        "periodDays": 30
      },
      "grouped": {
        "byStatus": [
          {
            "status": "verified",
            "count": 38,
            "percentage": "84.44"
          },
          {
            "status": "pending",
            "count": 5,
            "percentage": "11.11"
          },
          {
            "status": "inactive",
            "count": 2,
            "percentage": "4.44"
          }
        ]
      },
      "recent": [
        {
          "_id": "customer_id",
          "firstname": "John",
          "lastname": "Doe",
          "email": "john@example.com",
          "phone": "0123456789",
          "createdAt": "2025-11-10T08:00:00.000Z",
          "status": "verified",
          "city": "Ho Chi Minh"
        }
      ]
    }
  }
}
```

**Response Example (groupBy=region):**

```json
{
  "message": "",
  "data": {
    "statistics": {
      "summary": { ... },
      "grouped": {
        "byRegion": [
          {
            "region": "Ho Chi Minh",
            "count": 25,
            "percentage": "55.56"
          },
          {
            "region": "Hanoi",
            "count": 15,
            "percentage": "33.33"
          },
          {
            "region": "Da Nang",
            "count": 5,
            "percentage": "11.11"
          }
        ]
      },
      "recent": [...]
    }
  }
}
```

**Response Example (groupBy=date):**

```json
{
  "message": "",
  "data": {
    "statistics": {
      "summary": { ... },
      "grouped": {
        "byDate": {
          "format": "daily",
          "data": [
            { "date": "2025-11-01", "count": 3 },
            { "date": "2025-11-02", "count": 5 },
            { "date": "2025-11-03", "count": 2 },
            { "date": "2025-11-04", "count": 4 }
          ]
        }
      },
      "recent": [...]
    }
  }
}
```

---

### 2. Service Statistics

**Endpoint:** `GET /api/a/services/statistics`

**Query Parameters:**

| Parameter | Type | Values | Default | Description |
|-----------|------|--------|---------|-------------|
| `range` | String | `7d`, `30d`, `90d`, `all` | `30d` | Khoảng thời gian thống kê |
| `groupBy` | String | `status`, `type`, `date` | `status` | Nhóm dữ liệu theo |
| `from` | String (Date) | `YYYY-MM-DD` | - | Ngày bắt đầu (custom range) |
| `to` | String (Date) | `YYYY-MM-DD` | - | Ngày kết thúc (custom range) |

**Request Examples:**

```bash
# Get last 30 days, grouped by type
GET /api/a/services/statistics?range=30d&groupBy=type

# Get last 90 days, grouped by status
GET /api/a/services/statistics?range=90d&groupBy=status

# Get custom range, grouped by date
GET /api/a/services/statistics?from=2025-10-01&to=2025-10-31&groupBy=date
```

**Response Example (groupBy=type):**

```json
{
  "message": "",
  "data": {
    "statistics": {
      "summary": {
        "totalInRange": 12,
        "totalAllTime": 35,
        "growthRate": 20.0,
        "periodStart": "2025-10-11",
        "periodEnd": "2025-11-10",
        "periodDays": 30
      },
      "grouped": {
        "byType": [
          {
            "type": "medical",
            "count": 8,
            "avgPrice": 250000,
            "percentage": "66.67"
          },
          {
            "type": "consultation",
            "count": 3,
            "avgPrice": 150000,
            "percentage": "25.00"
          },
          {
            "type": "examination",
            "count": 1,
            "avgPrice": 500000,
            "percentage": "8.33"
          }
        ]
      },
      "popular": [
        {
          "_id": "service_id",
          "title": "General Health Checkup",
          "slug": "general-health-checkup",
          "status": "active",
          "type": "medical",
          "price": 250000,
          "views": 1520,
          "createdAt": "2025-10-15T10:00:00.000Z"
        }
      ],
      "feedbacks": {
        "total": 45,
        "avgRating": 4.35,
        "satisfied": 38,
        "neutral": 5,
        "unsatisfied": 2
      }
    }
  }
}
```

**Response Example (groupBy=status):**

```json
{
  "message": "",
  "data": {
    "statistics": {
      "summary": { ... },
      "grouped": {
        "byStatus": [
          {
            "status": "active",
            "count": 10,
            "percentage": "83.33"
          },
          {
            "status": "inactive",
            "count": 2,
            "percentage": "16.67"
          }
        ]
      },
      "popular": [...],
      "feedbacks": { ... }
    }
  }
}
```

---

## 📚 APIs Đã Chuẩn Hóa

### ✅ List APIs với Pagination

| API Endpoint | Controller | Status |
|--------------|------------|--------|
| `GET /api/a/customers` | CustomerController.index | ✅ Chuẩn hóa |
| `GET /api/a/services` | ServiceController.index | ✅ Chuẩn hóa |
| `GET /api/a/orders` | OrderController.getAllOrders | ✅ Chuẩn hóa |
| `GET /api/a/feedbacks` | FeedbackController.index | ✅ Chuẩn hóa |
| `GET /api/a/transactions` | TransactionController.index | ✅ Chuẩn hóa |
| `GET /api/a/tickets` | TicketController.index | ✅ Chuẩn hóa |

### ✅ Statistics APIs

| API Endpoint | Features | Status |
|--------------|----------|--------|
| `GET /api/a/customers/statistics` | range, groupBy (status/region/date), custom dates | ✅ Hoàn thành |
| `GET /api/a/services/statistics` | range, groupBy (status/type/date), custom dates | ✅ Hoàn thành |
| `GET /api/a/tickets/statistics` | Total, status breakdown, latest tickets | ✅ Hoàn thành |
| `GET /api/a/dashboard/summary` | Overall summary (customers, tickets, services, feedbacks) | ✅ Hoàn thành |

---

## 🎯 Use Cases

### Use Case 1: Phân trang danh sách khách hàng

```bash
# Trang 1, 20 items
GET /api/a/customers?page=1&limit=20

# Trang 2, 20 items
GET /api/a/customers?page=2&limit=20

# Calculate total pages: Math.ceil(total / pageSize)
# Example: total=125, pageSize=20 → totalPages=7
```

### Use Case 2: Thống kê khách hàng theo khu vực

```bash
# Last 30 days
GET /api/a/customers/statistics?range=30d&groupBy=region

# Response có thể dùng để vẽ:
# - Pie chart: Distribution by region
# - Bar chart: Count per region
# - Map visualization: Geographic distribution
```

### Use Case 3: Thống kê dịch vụ theo thời gian

```bash
# Daily stats for last 7 days
GET /api/a/services/statistics?range=7d&groupBy=date

# Response có thể dùng để vẽ:
# - Line chart: Daily trend
# - Area chart: Cumulative growth
# - Bar chart: Daily comparison
```

### Use Case 4: Thống kê custom date range

```bash
# October 2025 stats
GET /api/a/customers/statistics?from=2025-10-01&to=2025-10-31&groupBy=status

# Q3 2025 stats
GET /api/a/services/statistics?from=2025-07-01&to=2025-09-30&groupBy=type
```

---

## 🔧 Implementation Notes

### Backend Implementation

1. **Pagination Logic:**
```typescript
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 10;
const offset = (page - 1) * limit;

const [items, total] = await Promise.all([
  Model.find(query).skip(offset).limit(limit).sort({ createdAt: -1 }),
  Model.countDocuments(query)
]);

sendSuccess(res, {
  data: items,
  pagination: {
    page,
    pageSize: limit,
    total
  }
});
```

2. **Date Range Logic:**
```typescript
let startDate: Date;
let endDate: Date = new Date();

if (from && to) {
  startDate = moment(from.toString()).startOf('day').toDate();
  endDate = moment(to.toString()).endOf('day').toDate();
} else if (range === '7d') {
  startDate = moment().subtract(7, 'days').startOf('day').toDate();
} else if (range === '30d') {
  startDate = moment().subtract(30, 'days').startOf('day').toDate();
}
```

### Frontend Integration

```typescript
// Example: Fetch customers with pagination
async function fetchCustomers(page: number = 1, pageSize: number = 20) {
  const response = await fetch(
    `/api/a/customers?page=${page}&limit=${pageSize}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const result = await response.json();
  
  // Access data
  const customers = result.data.data;
  const pagination = result.data.pagination;
  
  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  
  return { customers, pagination, totalPages };
}

// Example: Fetch statistics for chart
async function fetchCustomerStats(range: string = '30d', groupBy: string = 'date') {
  const response = await fetch(
    `/api/a/customers/statistics?range=${range}&groupBy=${groupBy}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const result = await response.json();
  const statistics = result.data.statistics;
  
  // Use for chart
  if (groupBy === 'date') {
    const chartData = statistics.grouped.byDate.data.map(item => ({
      x: item.date,
      y: item.count
    }));
    return chartData;
  }
}
```

---

## ⚠️ Important Notes

### DO's ✅

- **ALWAYS** use `data` as the array key
- **ALWAYS** use `pageSize` (not `limit`) in response
- **ALWAYS** include all 3 pagination fields: `page`, `pageSize`, `total`
- **ALWAYS** validate page and limit parameters
- **ALWAYS** use Promise.all for parallel queries
- **ALWAYS** handle edge cases (page=0, limit=0, invalid dates)

### DON'Ts ❌

- ❌ Don't use `items`, `results`, `list` instead of `data`
- ❌ Don't use `limit` in response (use `pageSize`)
- ❌ Don't add `totalPages` in response (calculate on frontend)
- ❌ Don't forget to validate input parameters
- ❌ Don't use different field names across endpoints

---

## 📊 Chart Integration Examples

### Pie Chart (Status Distribution)

```typescript
const response = await fetch('/api/a/customers/statistics?range=30d&groupBy=status');
const stats = response.data.statistics;

const pieData = stats.grouped.byStatus.map(item => ({
  label: item.status,
  value: item.count,
  percentage: parseFloat(item.percentage)
}));
```

### Line Chart (Time Series)

```typescript
const response = await fetch('/api/a/services/statistics?range=30d&groupBy=date');
const stats = response.data.statistics;

const lineData = stats.grouped.byDate.data.map(item => ({
  date: item.date,
  count: item.count
}));
```

### Bar Chart (Regional Distribution)

```typescript
const response = await fetch('/api/a/customers/statistics?range=90d&groupBy=region');
const stats = response.data.statistics;

const barData = stats.grouped.byRegion.map(item => ({
  region: item.region,
  count: item.count,
  percentage: parseFloat(item.percentage)
}));
```

---

## 🔗 Related Documentation

- [Customer API](./CUSTOMER_API.md)
- [Service API](./SERVICE_API.md)
- [Ticket API](./TICKET_API.md)
- [Dashboard API](./DASHBOARD_API.md)

---

**© 2025 Van Phuc Care - API Standards**
