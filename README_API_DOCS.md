# 📚 Van Phuc Care - API Documentation Suite

> **Bộ tài liệu API Discovery hoàn chỉnh cho hệ thống Van Phuc Care Healthcare Management System**

## 🎯 Quick Access

| Tài Liệu | Mục Đích | Link |
|----------|----------|------|
| 📋 **API Index** | Điểm bắt đầu - Tổng quan toàn bộ tài liệu | [API_INDEX.md](./API_INDEX.md) |
| 📘 **Full Documentation** | Tài liệu API đầy đủ chi tiết | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| 🚀 **Quick Reference** | Tra cứu nhanh endpoints | [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md) |
| 📖 **Usage Guide** | Hướng dẫn sử dụng | [API_README.md](./API_README.md) |
| 📋 **OpenAPI Spec** | Machine-readable specification | [openapi.yaml](./openapi.yaml) |
| 📮 **Postman Collection** | Ready-to-use collection | [Van_Phuc_Care_API.postman_collection.json](./Van_Phuc_Care_API.postman_collection.json) |
| 🌍 **Postman Environment** | Environment variables | [Van_Phuc_Care.postman_environment.json](./Van_Phuc_Care.postman_environment.json) |

---

## 🚀 Getting Started

### 1️⃣ Người mới bắt đầu
```
Đọc theo thứ tự:
1. API_INDEX.md         → Hiểu tổng quan
2. API_README.md        → Học cách sử dụng
3. API_QUICK_REFERENCE  → Tra cứu endpoints
4. Thử với Postman      → Hands-on practice
```

### 2️⃣ Developers có kinh nghiệm
```
1. Import Postman Collection
2. Đọc API_QUICK_REFERENCE.md
3. Tham khảo API_DOCUMENTATION.md khi cần
4. Generate SDK từ openapi.yaml (optional)
```

### 3️⃣ QA/Testers
```
1. Import Postman Collection + Environment
2. Đọc API_DOCUMENTATION.md để hiểu flows
3. Create test cases
4. Automate tests
```

---

## 📊 Tổng Quan API

### Cấu Trúc
```
/api
├── /a/              Admin APIs (70+ endpoints)
│   ├── /sessions           Authentication
│   ├── /faqs              FAQs Management
│   ├── /products          Products Management
│   ├── /orders            Orders Management
│   ├── /health-book       Health Books
│   └── ...                16 modules
│
├── /u/              User APIs (25+ endpoints)
│   ├── /sessions          Authentication
│   ├── /cart              Shopping Cart
│   ├── /products          Browse Products
│   ├── /order             Place Orders
│   └── ...                9 modules
│
└── /uploads         File Upload (Public)
```

### Tính Năng
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **RESTful Design** - Standard HTTP methods
- ✅ **Pagination** - Efficient data loading
- ✅ **File Upload** - Firebase integration
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **CORS Support** - Cross-origin enabled

---

## 🔑 Authentication

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

## 📮 Postman Setup

### Quick Setup (2 phút)
1. Mở Postman
2. Click **Import** → Chọn files:
   - `Van_Phuc_Care_API.postman_collection.json`
   - `Van_Phuc_Care.postman_environment.json`
3. Select environment "Van Phuc Care - Development"
4. Chạy request "Admin - Login" hoặc "User - Login"
5. Token sẽ tự động được lưu!

### Video Guide
```
📹 Xem video hướng dẫn: [Coming soon]
```

---

## 🌐 Swagger UI

### Option 1: Online (Nhanh nhất)
1. Truy cập https://editor.swagger.io/
2. Copy nội dung `openapi.yaml`
3. Paste vào editor
4. Explore và test!

### Option 2: Docker (Recommended)
```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/openapi.yaml \
  -v $(pwd)/openapi.yaml:/openapi.yaml \
  swaggerapi/swagger-ui

# Truy cập: http://localhost:8080
```

### Option 3: Tích hợp vào Server
```typescript
// server-vpc/src/server.ts
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Access: http://localhost:3000/api-docs
```

---

## 🛠️ Generate Client SDK

### TypeScript/JavaScript
```bash
npm install @openapitools/openapi-generator-cli -g

openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o ./client-sdk
```

### Python
```bash
openapi-generator-cli generate \
  -i openapi.yaml \
  -g python \
  -o ./client-sdk-python
```

### More Languages
- Java: `-g java`
- C#: `-g csharp`
- Go: `-g go`
- Ruby: `-g ruby`
- PHP: `-g php`
- [Full list](https://openapi-generator.tech/docs/generators)

---

## 📖 Documentation Structure

```
📁 API Documentation
│
├── 📋 API_INDEX.md
│   └── Tổng quan và navigation cho tất cả tài liệu
│
├── 📘 API_DOCUMENTATION.md
│   ├── Thông tin chung
│   ├── Admin APIs (16 modules)
│   │   ├── Authentication
│   │   ├── FAQs
│   │   ├── Products
│   │   ├── Orders
│   │   └── ...
│   ├── User APIs (9 modules)
│   ├── Data Models (11 models)
│   └── Error Handling
│
├── 🚀 API_QUICK_REFERENCE.md
│   ├── Bảng tổng hợp endpoints
│   ├── Status values
│   ├── Query parameters
│   └── curl examples
│
├── 📖 API_README.md
│   ├── Cách sử dụng tài liệu
│   ├── Swagger UI setup
│   ├── Postman guide
│   ├── SDK generation
│   ├── Mobile integration
│   └── Troubleshooting
│
├── 📋 openapi.yaml
│   ├── OpenAPI 3.0.3 spec
│   ├── Schemas
│   ├── Components
│   └── Security schemes
│
├── 📮 Van_Phuc_Care_API.postman_collection.json
│   ├── 100+ pre-configured requests
│   ├── Organized by modules
│   ├── Auto-save tokens
│   └── Example bodies
│
└── 🌍 Van_Phuc_Care.postman_environment.json
    └── Environment variables
```

---

## 🎯 Use Cases

### Frontend Development
```javascript
// Example: Fetch products
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const getProducts = async () => {
  const response = await api.get('/u/products?page=1&limit=10');
  return response.data;
};
```

### Mobile Development (React Native)
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/api/u/sessions/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  await AsyncStorage.setItem('token', data.data.accessToken);
  return data;
};
```

### Automated Testing
```javascript
// Example: Jest + Supertest
describe('Products API', () => {
  let token;
  
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/a/sessions/login')
      .send({ email: 'admin@example.com', password: 'password123' });
    token = response.body.data.accessToken;
  });
  
  test('GET /api/a/products', async () => {
    const response = await request(app)
      .get('/api/a/products')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
  });
});
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Development
API_URL=http://localhost:3000/api

# Production
API_URL=https://api.vanphuccare.com/api

# Staging
API_URL=https://staging-api.vanphuccare.com/api
```

### Postman Environment
```json
{
  "baseUrl": "http://localhost:3000/api",
  "adminToken": "",
  "userToken": "",
  "adminEmail": "admin@example.com",
  "userEmail": "user@example.com"
}
```

---

## 📊 API Statistics

- **Total Endpoints**: 100+
- **Admin Modules**: 16
- **User Modules**: 9
- **Data Models**: 11
- **Authentication**: JWT
- **File Upload**: Firebase
- **Database**: MongoDB
- **Documentation Pages**: 6
- **Code Examples**: 50+

---

## 🔐 Security

### Best Practices
- ✅ Use HTTPS in production
- ✅ Secure token storage
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Handle errors gracefully
- ✅ Regular security audits

### Token Management
```javascript
// Good
localStorage.setItem('token', token);
const token = localStorage.getItem('token');

// Better (with encryption)
import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.AES.encrypt(token, secretKey);
localStorage.setItem('token', encrypted.toString());
```

---

## 🐛 Troubleshooting

### Common Issues

**401 Unauthorized**
```
✗ Lỗi: Token không hợp lệ hoặc hết hạn
✓ Giải pháp: Login lại để lấy token mới
```

**404 Not Found**
```
✗ Lỗi: Endpoint không tồn tại
✓ Giải pháp: Check API_QUICK_REFERENCE.md cho đúng path
```

**CORS Error**
```
✗ Lỗi: CORS blocked
✓ Giải pháp: Check server CORS config hoặc use proxy
```

**500 Internal Server Error**
```
✗ Lỗi: Server error
✓ Giải pháp: Check server logs, validate request body
```

---

## 📞 Support

### Documentation
- **Index**: [API_INDEX.md](./API_INDEX.md)
- **Full Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Quick Ref**: [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)

### Contact
- **Email**: support@vanphuccare.com
- **Hotline**: 1900-xxxx
- **Website**: https://vanphuccare.com
- **Docs**: https://docs.vanphuccare.com

---

## 📝 Changelog

### Version 1.0.0 (October 2024)
- ✅ Initial API release
- ✅ Complete documentation suite
- ✅ Postman collection
- ✅ OpenAPI specification
- ✅ 100+ endpoints documented
- ✅ Examples và guides

---

## 🎉 What's Included

### ✅ Complete Documentation
- Full API documentation (100+ pages)
- Quick reference guide
- Usage guide with examples
- Index và navigation

### ✅ Testing Tools
- Postman collection (100+ requests)
- Postman environment
- OpenAPI spec for Swagger UI
- curl examples

### ✅ Code Examples
- JavaScript/TypeScript
- React Native
- Python
- curl/HTTPie
- Testing with Jest

### ✅ Best Practices
- Authentication flow
- Error handling
- Security guidelines
- Mobile integration
- SDK generation

---

## 🚀 Next Steps

1. ✅ **Read**: [API_INDEX.md](./API_INDEX.md)
2. ✅ **Import**: Postman Collection
3. ✅ **Test**: Login và explore
4. ✅ **Integrate**: Into your app
5. ✅ **Deploy**: To production

---

## 💡 Pro Tips

- 📌 Bookmark API_QUICK_REFERENCE.md for quick lookup
- 🔖 Save tokens in Postman environment
- 🧪 Test in Postman before coding
- 📖 Read full docs for complex flows
- 🤖 Generate SDK for faster development
- 🔄 Keep documentation in sync with code

---

**Ready to build something awesome? Start with [API_INDEX.md](./API_INDEX.md)! 🚀**

---

**Version**: 1.0.0  
**Last Updated**: October 2024  
**License**: Proprietary  
**Maintained by**: Van Phuc Care Development Team

