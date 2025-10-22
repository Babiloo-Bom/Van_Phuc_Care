# 📚 VAN PHUC CARE - API DOCUMENTATION INDEX

## 🎯 Mục Đích

Đây là bộ tài liệu API Discovery đầy đủ và chi tiết cho hệ thống Van Phuc Care Healthcare Management System.

---

## 📂 Cấu Trúc Tài Liệu

### 1. 📘 **API_DOCUMENTATION.md** - Tài Liệu Chính
**Mục đích**: Tài liệu API đầy đủ và chi tiết nhất

**Nội dung bao gồm**:
- ✅ Thông tin chung về API (Base URL, Authentication, Architecture)
- ✅ Tất cả endpoints của Admin (16 modules)
- ✅ Tất cả endpoints của User (9 modules)
- ✅ Public endpoints (File upload)
- ✅ Request/Response examples chi tiết
- ✅ Data Models đầy đủ (11 models)
- ✅ Error responses
- ✅ Status codes và enums

**Khi nào sử dụng**: 
- Khi cần hiểu chi tiết về một endpoint
- Khi cần xem request/response structure
- Khi cần tham khảo data models
- Khi implement API integration

**Đọc tài liệu**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

### 2. 🚀 **API_QUICK_REFERENCE.md** - Tham Chiếu Nhanh
**Mục đích**: Tra cứu nhanh các endpoints

**Nội dung bao gồm**:
- ✅ Bảng tổng hợp tất cả endpoints
- ✅ HTTP methods và authentication requirements
- ✅ Query parameters phổ biến
- ✅ Status values
- ✅ Response format chuẩn
- ✅ Authentication examples với curl
- ✅ HTTP status codes

**Khi nào sử dụng**:
- Khi cần tra cứu nhanh một endpoint
- Khi cần xem overview của toàn bộ API
- Khi cần example commands
- Khi làm việc với terminal/curl

**Đọc tài liệu**: [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)

---

### 3. 📖 **API_README.md** - Hướng Dẫn Sử Dụng
**Mục đích**: Hướng dẫn cách sử dụng tài liệu và tools

**Nội dung bao gồm**:
- ✅ Cách đọc và sử dụng tài liệu
- ✅ Hướng dẫn sử dụng Swagger UI
- ✅ Authentication flow chi tiết
- ✅ Examples với curl, HTTPie
- ✅ Testing với Postman
- ✅ SDK generation
- ✅ Security best practices
- ✅ Debugging tips
- ✅ Mobile app integration examples
- ✅ Common issues và solutions

**Khi nào sử dụng**:
- Khi mới bắt đầu với API
- Khi cần setup testing tools
- Khi gặp lỗi và cần debug
- Khi integrate với mobile apps
- Khi cần generate client SDK

**Đọc tài liệu**: [API_README.md](./API_README.md)

---

### 4. 📋 **openapi.yaml** - OpenAPI 3.0 Specification
**Mục đích**: Machine-readable API specification

**Nội dung bao gồm**:
- ✅ OpenAPI 3.0.3 compliant
- ✅ Tất cả endpoints với schemas
- ✅ Request/Response schemas
- ✅ Authentication schemes
- ✅ Component schemas
- ✅ Tags và descriptions

**Khi nào sử dụng**:
- Khi sử dụng Swagger UI
- Khi generate client code
- Khi integrate với API management tools
- Khi cần validate API contracts
- Khi generate documentation tự động

**Cách sử dụng**:
```bash
# View với Swagger Editor
https://editor.swagger.io/

# Run Swagger UI local
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/openapi.yaml \
  -v $(pwd)/openapi.yaml:/openapi.yaml \
  swaggerapi/swagger-ui

# Generate TypeScript client
openapi-generator-cli generate \
  -i openapi.yaml \
  -g typescript-axios \
  -o ./generated-client
```

**Xem file**: [openapi.yaml](./openapi.yaml)

---

### 5. 📮 **Van_Phuc_Care_API.postman_collection.json** - Postman Collection
**Mục đích**: Ready-to-use Postman collection

**Nội dung bao gồm**:
- ✅ Tất cả endpoints organized by modules
- ✅ Pre-configured requests
- ✅ Request body templates
- ✅ Auto-save tokens từ login responses
- ✅ Variables support
- ✅ Environment ready

**Khi nào sử dụng**:
- Khi test API với Postman
- Khi develop và debug
- Khi share API với team
- Khi demo API functionality

**Cách import**:
1. Mở Postman
2. Click **Import**
3. Chọn file `Van_Phuc_Care_API.postman_collection.json`
4. Import environment: `Van_Phuc_Care.postman_environment.json`
5. Chọn environment vừa import
6. Start testing!

**Download**: [Van_Phuc_Care_API.postman_collection.json](./Van_Phuc_Care_API.postman_collection.json)

---

### 6. 🌍 **Van_Phuc_Care.postman_environment.json** - Postman Environment
**Mục đích**: Environment variables cho Postman

**Variables bao gồm**:
- ✅ `baseUrl` - API base URL
- ✅ `adminToken` - Admin JWT token (auto-saved)
- ✅ `userToken` - User JWT token (auto-saved)
- ✅ `adminEmail` - Admin email for testing
- ✅ `adminPassword` - Admin password for testing
- ✅ `userEmail` - User email for testing
- ✅ `userPassword` - User password for testing

**Cách sử dụng**:
1. Import vào Postman
2. Update các credentials nếu cần
3. Select environment khi test
4. Tokens sẽ tự động được lưu sau khi login

**Download**: [Van_Phuc_Care.postman_environment.json](./Van_Phuc_Care.postman_environment.json)

---

## 🚦 Getting Started

### Bước 1: Đọc Overview
Bắt đầu với **API_README.md** để hiểu:
- Cấu trúc dự án
- Authentication flow
- Cách setup testing tools

### Bước 2: Tra Cứu Nhanh
Sử dụng **API_QUICK_REFERENCE.md** để:
- Xem tất cả endpoints available
- Tìm endpoint cần sử dụng
- Copy example commands

### Bước 3: Đọc Chi Tiết
Đọc **API_DOCUMENTATION.md** để:
- Hiểu chi tiết về endpoint
- Xem request/response structure
- Tham khảo data models

### Bước 4: Test với Tools
Chọn một trong các tools:
- **Postman**: Import collection và environment
- **Swagger UI**: Load openapi.yaml file
- **curl/HTTPie**: Copy commands từ Quick Reference

---

## 🎯 Use Cases

### 🔨 For Developers

**Frontend Developer**:
1. Đọc API_DOCUMENTATION.md cho endpoints cần dùng
2. Import Postman collection để test
3. Use data models để define TypeScript interfaces
4. Refer to Quick Reference khi code

**Backend Developer**:
1. Review openapi.yaml để understand contract
2. Use Postman collection để test endpoints
3. Refer to documentation khi implement
4. Update specs khi có changes

**Mobile Developer**:
1. Đọc API_README.md phần Mobile Integration
2. Generate client SDK từ openapi.yaml
3. Use Postman để test flows
4. Refer to Quick Reference cho status codes

### 📚 For Project Managers

1. Review API_QUICK_REFERENCE.md để understand scope
2. Use documentation để estimate tasks
3. Share Postman collection với QA team
4. Use Swagger UI để demo với stakeholders

### 🧪 For QA Engineers

1. Import Postman collection
2. Use API_DOCUMENTATION.md để create test cases
3. Refer to status codes và error responses
4. Use Quick Reference để create automation scripts

### 📖 For Technical Writers

1. Review tất cả documentation files
2. Use openapi.yaml làm source of truth
3. Generate additional docs nếu cần
4. Keep documentation in sync với code

---

## 📊 API Statistics

### Overview
- **Total Endpoints**: 100+
- **Admin Endpoints**: 70+
- **User Endpoints**: 25+
- **Public Endpoints**: 5+

### Modules
- **Admin Modules**: 16
  - Authentication, FAQs, Feedbacks, Categories, Courses
  - Products, Collections, Reviews, Customers, Orders
  - Carts, Users, Permissions, Health Books
  - Transactions, Schedule Vaccinations
  
- **User Modules**: 9
  - Authentication, Cart, Categories, Courses
  - FAQs, Feedbacks, Orders, Products, Profile

### Authentication
- **JWT Based**: ✅
- **Token Expiry**: 30 days
- **Refresh Token**: ❌ (Future)
- **OAuth Support**: ❌ (Future)

### Features
- ✅ CRUD Operations
- ✅ Pagination
- ✅ Filtering
- ✅ File Upload
- ✅ Search (Future)
- ✅ Sorting (Future)
- ✅ Bulk Operations (Future)

---

## 🔄 API Versioning

**Current Version**: 1.0.0

**Version Strategy**:
- Major version changes khi có breaking changes
- Minor version changes khi add new features
- Patch version changes khi bug fixes

**Future Versions**:
- Version 2.x sẽ có prefix `/api/v2/`
- Version 1.x sẽ được maintain song song
- Deprecation notices sẽ được announce trước 6 tháng

---

## 📝 Changelog

### Version 1.0.0 (October 2024)
**Initial Release**

**Admin APIs**:
- ✅ Full authentication flow
- ✅ 16 admin modules
- ✅ CRUD operations cho tất cả resources
- ✅ Health book management
- ✅ Schedule vaccination management

**User APIs**:
- ✅ User authentication
- ✅ Product browsing
- ✅ Cart management
- ✅ Order placement
- ✅ Profile management

**Infrastructure**:
- ✅ JWT authentication
- ✅ File upload to Firebase
- ✅ MongoDB integration
- ✅ Error handling
- ✅ CORS support

---

## 🛠️ Tools & Resources

### Development Tools
- **Postman**: API testing
- **Swagger UI**: Interactive documentation
- **curl**: Command-line testing
- **HTTPie**: User-friendly HTTP client

### Code Generation
- **OpenAPI Generator**: Generate client SDKs
- **Swagger Codegen**: Alternative generator
- **Postman Code Generator**: Generate code snippets

### Validation
- **Swagger Editor**: Validate OpenAPI spec
- **Postman Tests**: API testing
- **JSON Schema Validator**: Validate responses

### Monitoring
- **Postman Monitor**: Scheduled API tests
- **API Metrics**: Performance monitoring (Future)
- **Error Tracking**: Error monitoring (Future)

---

## 🔐 Security

### Best Practices
1. ✅ Always use HTTPS in production
2. ✅ Keep JWT tokens secure
3. ✅ Implement rate limiting
4. ✅ Validate all inputs
5. ✅ Use environment variables for secrets
6. ✅ Regular security audits

### Token Management
- Store tokens securely (localStorage/AsyncStorage)
- Never commit tokens to Git
- Implement token refresh logic (Future)
- Handle token expiration gracefully

### API Security Features
- JWT authentication
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

---

## 📞 Support & Contact

### Documentation Issues
Nếu tìm thấy lỗi trong tài liệu:
1. Tạo issue mô tả chi tiết
2. Include endpoint path và method
3. Provide example request/response
4. Suggest correction nếu có

### API Issues
Nếu gặp lỗi khi sử dụng API:
1. Check API_README.md phần Debugging
2. Review error response
3. Check authentication token
4. Contact support team

### Contact Information
- **Email**: support@vanphuccare.com
- **Hotline**: 1900-xxxx
- **Documentation**: https://docs.vanphuccare.com
- **API Status**: https://status.vanphuccare.com

---

## 🎓 Learning Path

### Beginner
1. Đọc API_README.md
2. Follow authentication examples
3. Test với Postman collection
4. Try simple GET requests

### Intermediate
1. Đọc API_DOCUMENTATION.md chi tiết
2. Implement authentication flow
3. Create, update, delete resources
4. Handle errors properly

### Advanced
1. Study data models
2. Implement complex workflows
3. Generate client SDKs
4. Optimize API calls
5. Implement caching

---

## 🚀 Next Steps

### For API Consumers
1. ✅ Review documentation
2. ✅ Setup testing environment
3. ✅ Test authentication
4. ✅ Implement API calls
5. ✅ Handle errors
6. ✅ Deploy to production

### For API Maintainers
1. ✅ Keep documentation updated
2. ✅ Add new endpoints to specs
3. ✅ Version API properly
4. ✅ Monitor API usage
5. ✅ Collect feedback
6. ✅ Plan improvements

---

## 📚 Additional Resources

### Internal Documentation
- Server README: `server-vpc/README.md`
- Admin Frontend: `admin-vpc/README.md`
- CRM Frontend: `crm-vpc/README.md`
- E-Learning: `elerning-vpc/README.md`

### External Resources
- [OpenAPI Specification](https://swagger.io/specification/)
- [Postman Learning Center](https://learning.postman.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT.io](https://jwt.io/)

---

## 🎉 Summary

Bộ tài liệu này cung cấp:
- ✅ **6 files** tài liệu chi tiết
- ✅ **100+** endpoints được document
- ✅ **Ready-to-use** Postman collection
- ✅ **Machine-readable** OpenAPI spec
- ✅ **Comprehensive** examples và guides
- ✅ **Multiple formats** phù hợp với mọi use case

**Choose your path**:
- 🚀 **Quick Start**: API_QUICK_REFERENCE.md
- 📘 **Deep Dive**: API_DOCUMENTATION.md
- 🛠️ **Hands-on**: Postman Collection
- 🤖 **Automation**: openapi.yaml

---

**Happy Coding! 🎉**

---

**Documentation Version**: 1.0.0  
**Last Updated**: October 2024  
**Maintained by**: Van Phuc Care Development Team

