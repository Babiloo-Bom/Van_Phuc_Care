# 📚 VAN PHUC CARE - API DOCUMENTATION GUIDE

## 📋 Tổng Quan

Dự án Van Phuc Care bao gồm hệ thống API RESTful phục vụ cho 3 ứng dụng frontend:
- **Admin Dashboard** (admin-vpc)
- **Customer Portal** (crm-vpc)
- **E-Learning Platform** (elerning-vpc)

## 📂 Cấu Trúc Tài Liệu

```
Van_Phuc_Care/
├── API_DOCUMENTATION.md    # Tài liệu API đầy đủ (Markdown)
├── openapi.yaml            # OpenAPI 3.0 Specification
├── API_README.md           # File này - Hướng dẫn sử dụng
└── server-vpc/             # Backend API Server
```

## 🚀 Cách Sử dụng Tài Liệu

### 1. Đọc Tài Liệu Markdown

File `API_DOCUMENTATION.md` chứa tài liệu đầy đủ về tất cả API endpoints bao gồm:
- Thông tin chung về API
- Authentication
- Tất cả endpoints (Admin & User)
- Request/Response examples
- Data models
- Error codes

**Cách đọc:**
- Mở file `API_DOCUMENTATION.md` bằng bất kỳ markdown viewer nào
- Hoặc xem trực tiếp trên GitHub/GitLab
- Hoặc sử dụng VS Code với Markdown Preview

### 2. Sử dụng Swagger UI

File `openapi.yaml` có thể được sử dụng với Swagger UI để:
- Xem tài liệu interactive
- Test API trực tiếp từ browser
- Generate client code

#### Cách 1: Sử dụng Swagger Editor Online
1. Truy cập https://editor.swagger.io/
2. Copy nội dung file `openapi.yaml`
3. Paste vào Swagger Editor
4. Xem và test API

#### Cách 2: Chạy Swagger UI Local
```bash
# Sử dụng Docker
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/openapi.yaml \
  -v $(pwd)/openapi.yaml:/openapi.yaml \
  swaggerapi/swagger-ui

# Truy cập http://localhost:8080
```

#### Cách 3: Tích hợp vào Server (Khuyến nghị)
Thêm vào `server-vpc/src/server.ts`:

```typescript
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Sau đó truy cập: `http://localhost:3000/api-docs`

## 🔑 Authentication Flow

### Admin Authentication
```
1. POST /api/a/sessions/login
   Body: { email, password }
   
2. Nhận response với accessToken
   
3. Sử dụng token trong header:
   Authorization: Bearer {accessToken}
```

### User Authentication
```
1. POST /api/u/sessions/login
   Body: { email, password }
   
2. Nhận response với accessToken
   
3. Sử dụng token trong header:
   Authorization: Bearer {accessToken}
```

## 📝 Ví dụ Sử dụng API

### Example 1: Login Admin
```bash
curl -X POST http://localhost:3000/api/a/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "status": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "_id": "507f1f77bcf86cd799439011",
      "fullname": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

### Example 2: Get All Products (with Auth)
```bash
curl -X GET "http://localhost:3000/api/a/products?page=1&limit=10" \
  -H "Authorization: Bearer {your_token}"
```

### Example 3: Create Order
```bash
curl -X POST http://localhost:3000/api/u/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {your_token}" \
  -d '{
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
        "quantity": 2,
        "price": 100000
      }
    ],
    "paymentMethod": "cod"
  }'
```

### Example 4: Upload File
```bash
curl -X POST http://localhost:3000/api/uploads \
  -F "files=@/path/to/image.jpg"
```

## 🧪 Testing với Postman

### Import Collection
1. Mở Postman
2. Click **Import** > **Link**
3. Nhập: `https://www.postman.com/api-platform/workspace/openapi-3-0/overview`
4. Hoặc import file `openapi.yaml` trực tiếp

### Tạo Environment
```json
{
  "baseUrl": "http://localhost:3000/api",
  "adminToken": "",
  "userToken": ""
}
```

### Sử dụng Variables
- URL: `{{baseUrl}}/a/products`
- Header: `Authorization: Bearer {{adminToken}}`

## 🔍 API Routes Overview

### Admin Routes (`/api/a/`)
| Module | Base Path | Methods | Auth Required |
|--------|-----------|---------|---------------|
| Sessions | `/a/sessions` | POST, GET, PATCH | Partial |
| FAQs | `/a/faqs` | GET, POST, PATCH, DELETE | Yes |
| Feedbacks | `/a/feedbacks` | GET, POST, PATCH, DELETE | Yes |
| Categories | `/a/categories` | GET, POST, PATCH, DELETE | Yes |
| Courses | `/a/courses` | GET, POST, PATCH, DELETE | Yes |
| Products | `/a/products` | GET, POST, PATCH, DELETE | Yes |
| Product Collections | `/a/product-collections` | GET, POST, PATCH, DELETE | Yes |
| Product Reviews | `/a/product-reviews` | GET, POST, PATCH, DELETE | Yes |
| Customers | `/a/customers` | GET, POST, PATCH, DELETE | Yes |
| Orders | `/a/orders` | GET, POST, PATCH, DELETE | Yes |
| Carts | `/a/carts` | GET, POST, PATCH, DELETE | Yes |
| Users | `/a/users` | GET, POST, PATCH, DELETE | Yes |
| Access Permissions | `/a/access-permissions` | GET, POST, PATCH, DELETE | Yes |
| Health Books | `/a/health-book` | GET, POST, PATCH, DELETE | Yes |
| Transactions | `/a/transactions` | GET, POST, PATCH, DELETE | Yes |
| Schedule Vaccinations | `/a/schedule-vaccin` | GET, POST, PATCH | Yes |

### User Routes (`/api/u/`)
| Module | Base Path | Methods | Auth Required |
|--------|-----------|---------|---------------|
| Sessions | `/u/sessions` | POST, GET, PATCH | Partial |
| Cart | `/u/cart` | GET, POST, PATCH | No |
| Categories | `/u/categories` | GET | No |
| Courses | `/u/courses` | GET | No |
| FAQs | `/u/faqs` | GET | No |
| Feedbacks | `/u/feedbacks` | GET, POST | Partial |
| Orders | `/u/order` | GET, POST, PATCH | Partial |
| Products | `/u/products` | GET | No |
| Users | `/u/users` | GET | Yes |

### Public Routes
| Module | Base Path | Methods | Auth Required |
|--------|-----------|---------|---------------|
| Uploads | `/uploads` | POST | No |

## 📊 HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request thành công |
| 201 | Created | Tạo mới thành công |
| 400 | Bad Request | Request không hợp lệ |
| 401 | Unauthorized | Chưa xác thực hoặc token không hợp lệ |
| 403 | Forbidden | Không có quyền truy cập |
| 404 | Not Found | Không tìm thấy resource |
| 500 | Internal Server Error | Lỗi server |

## 🛠️ Tools & Utilities

### 1. VS Code Extensions
- **REST Client**: Test API trong VS Code
- **Thunder Client**: Alternative của Postman
- **OpenAPI (Swagger) Editor**: Edit OpenAPI specs

### 2. CLI Tools
```bash
# HTTPie
http POST localhost:3000/api/a/sessions/login \
  email="admin@example.com" \
  password="password123"

# curl with jq for JSON formatting
curl -s http://localhost:3000/api/u/products | jq
```

### 3. SDK Generation
Generate client SDK từ OpenAPI spec:

```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate TypeScript client
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o ./generated-client

# Generate Python client
openapi-generator-cli generate \
  -i openapi.yaml \
  -g python \
  -o ./generated-client-python
```

## 🔐 Security Best Practices

1. **Luôn sử dụng HTTPS** trong production
2. **Không commit token** vào Git
3. **Token có thời hạn**: JWT token hết hạn sau 30 ngày
4. **Rate Limiting**: Giới hạn số request/phút
5. **Input Validation**: Validate tất cả input từ client
6. **CORS**: Cấu hình CORS đúng cho production

## 🐛 Debugging

### Enable Debug Mode
```bash
# Server
cd server-vpc
DEBUG=* npm start

# Check logs
tail -f logs/app.log
```

### Common Issues

**Issue 1: 401 Unauthorized**
```
Solution: 
- Check token có hợp lệ không
- Check token có hết hạn không
- Check header Authorization có đúng format không
```

**Issue 2: CORS Error**
```
Solution:
- Check CORS config trong server.ts
- Thêm origin của frontend vào whitelist
```

**Issue 3: 404 Not Found**
```
Solution:
- Check route có đúng không
- Check baseURL có đúng không
- Check server có đang chạy không
```

## 📱 Mobile App Integration

### React Native
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Add token to header
api.interceptors.request.use(config => {
  const token = getToken(); // Get from AsyncStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login example
const login = async (email, password) => {
  const response = await api.post('/a/sessions/login', {
    email,
    password,
  });
  return response.data;
};
```

### Flutter
```dart
import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'http://localhost:3000/api',
      connectTimeout: 10000,
    ),
  );

  Future<Response> login(String email, String password) async {
    return await _dio.post('/a/sessions/login', data: {
      'email': email,
      'password': password,
    });
  }
}
```

## 📖 Additional Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [OpenAPI Specification](https://swagger.io/specification/)

### Code Examples
Xem thêm examples trong:
- `admin-vpc/api/` - Frontend API service layer
- `server-vpc/src/controllers/` - Backend controllers

### Support
- **Email**: support@vanphuccare.com
- **Documentation**: https://docs.vanphuccare.com
- **API Status**: https://status.vanphuccare.com

## 🔄 API Versioning

Hiện tại: **v1.0.0**

Khi có breaking changes, version mới sẽ được tạo:
- `/api/v2/a/...`
- `/api/v2/u/...`

Tài liệu sẽ được maintain cho mỗi version.

## 📝 Changelog

### Version 1.0.0 (2024)
- ✅ Initial API release
- ✅ Admin authentication & management
- ✅ User authentication & profile
- ✅ Product management
- ✅ Order management
- ✅ Cart functionality
- ✅ Health book management
- ✅ Schedule vaccination
- ✅ File upload

## 🤝 Contributing

Nếu bạn tìm thấy lỗi trong tài liệu hoặc muốn đóng góp:

1. Tạo issue mô tả vấn đề
2. Fork repository
3. Tạo branch: `git checkout -b fix/documentation`
4. Commit changes: `git commit -m 'Fix: Update API docs'`
5. Push to branch: `git push origin fix/documentation`
6. Tạo Pull Request

## 📄 License

Copyright © 2024 Van Phuc Care. All rights reserved.

---

**Last Updated**: October 2024
**Maintained by**: Van Phuc Care Development Team

