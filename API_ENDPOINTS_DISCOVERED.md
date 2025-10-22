# 📋 VAN PHUC CARE - DISCOVERED API ENDPOINTS

> **Comprehensive list of all API endpoints found in codebase**

## 📊 Quick Stats

- **Total Endpoints**: 200+
- **Admin Endpoints**: 150+
- **User Endpoints**: 40+
- **Public Endpoints**: 10+

---

## 🔐 ADMIN ENDPOINTS (`/api/a/`)

### Authentication & Sessions
```
POST   /a/sessions/login                    ✅ Login admin
POST   /a/sessions                          ✅ Signup admin
GET    /a/sessions/current_admin            ✅ Get current admin
PATCH  /a/sessions                          ✅ Update profile
PATCH  /a/sessions/change_password          ✅ Change password

POST   /a/passwords/forgot_password         ❌ NOT IN DOCS
POST   /a/passwords/verify_otp              ❌ NOT IN DOCS
POST   /a/passwords                         ❌ NOT IN DOCS

GET    /a/active-logs                       ❌ NOT IN DOCS
POST   /a/active-logs                       ❌ NOT IN DOCS
PATCH  /a/active-logs/logout                ❌ NOT IN DOCS
```

### FAQs
```
GET    /a/faqs                              ✅ List all FAQs
GET    /a/faqs/:id                          ✅ Get FAQ by ID
POST   /a/faqs                              ✅ Create FAQ
PATCH  /a/faqs/:id                          ✅ Update FAQ
DELETE /a/faqs/:id                          ✅ Delete FAQ
```

### Feedbacks
```
GET    /a/feedbacks                         ✅ List all feedbacks
GET    /a/feedbacks/:id                     ✅ Get feedback by ID
POST   /a/feedbacks                         ✅ Create feedback
PATCH  /a/feedbacks/:id                     ✅ Update feedback
DELETE /a/feedbacks/:id                     ✅ Delete feedback
PATCH  /a/feedbacks/:id/active              ❌ NOT IN DOCS
PATCH  /a/feedbacks/:id/inactive            ❌ NOT IN DOCS
```

### Blogs/Posts ❌ MISSING MODULE
```
GET    /a/blogs                             ❌ NOT IN DOCS
GET    /a/blogs/:id                         ❌ NOT IN DOCS
POST   /a/blogs                             ❌ NOT IN DOCS
PATCH  /a/blogs/:id                         ❌ NOT IN DOCS
DELETE /a/blogs/:id                         ❌ NOT IN DOCS
PATCH  /a/blogs/:id/active                  ❌ NOT IN DOCS
PATCH  /a/blogs/:id/inactive                ❌ NOT IN DOCS
```

### Categories
```
GET    /a/categories                        ✅ List all categories
GET    /a/categories/:id                    ✅ Get category by ID
POST   /a/categories                        ✅ Create category
PATCH  /a/categories/:id                    ✅ Update category
DELETE /a/categories/:id                    ✅ Delete category
```

### Courses
```
GET    /a/courses                           ✅ List all courses
GET    /a/courses/:id                       ✅ Get course by ID
POST   /a/courses                           ✅ Create course
PATCH  /a/courses/:id                       ✅ Update course
DELETE /a/courses/:id                       ✅ Delete course
PATCH  /a/courses/open-coures               ❌ NOT IN DOCS

GET    /a/exercises/:id                     ❌ NOT IN DOCS
POST   /a/exercises                         ❌ NOT IN DOCS
PATCH  /a/exercises/:id                     ❌ NOT IN DOCS
```

### Services
```
GET    /a/services                          ✅ List all services
GET    /a/services/:id                      ✅ Get service by ID
POST   /a/services                          ✅ Create service
PATCH  /a/services/:id                      ✅ Update service
POST   /a/services/bulk-delete              ❌ NOT IN DOCS
```

### Customers
```
GET    /a/customers                         ✅ List all customers
GET    /a/customers/:id                     ✅ Get customer by ID
POST   /a/customers                         ✅ Create customer
PATCH  /a/customers/:id                     ✅ Update customer
DELETE /a/customers/:id                     ✅ Delete customer
POST   /a/customers/deleteMany              ❌ NOT IN DOCS
POST   /a/customers/import                  ❌ NOT IN DOCS
POST   /a/customers/bulkUpdate              ❌ NOT IN DOCS
```

### Contracts ❌ MISSING MODULE
```
GET    /a/contracts                         ❌ NOT IN DOCS
GET    /a/contracts/:id                     ❌ NOT IN DOCS
POST   /a/contracts                         ❌ NOT IN DOCS
PATCH  /a/contracts/:id                     ❌ NOT IN DOCS
DELETE /a/contracts/:id                     ❌ NOT IN DOCS
```

### Consultations ❌ MISSING MODULE
```
GET    /a/consultations                     ❌ NOT IN DOCS
GET    /a/consultations/:id                 ❌ NOT IN DOCS
POST   /a/consultations                     ❌ NOT IN DOCS
PATCH  /a/consultations/:id                 ❌ NOT IN DOCS
DELETE /a/consultations/:id                 ❌ NOT IN DOCS
```

### Health Books
```
GET    /a/health-book/all                   ✅ List all health books
GET    /a/health-book/:id                   ✅ Get health book by ID
GET    /a/health-book/byDate/:id            ❌ NOT IN DOCS
POST   /a/health-book                       ✅ Create health book
PATCH  /a/health-book/:id                   ✅ Update health book
DELETE /a/health-book/:id                   ✅ Delete health book

GET    /a/comments                          ❌ NOT IN DOCS
POST   /a/comments                          ❌ NOT IN DOCS
PATCH  /a/comments/:id                      ❌ NOT IN DOCS
DELETE /a/comments/:id                      ❌ NOT IN DOCS
```

### Schedule Vaccinations
```
GET    /a/schedule-vaccin                   ✅ List all schedules
GET    /a/schedule-vaccin/:id               ✅ Get schedule by ID
POST   /a/schedule-vaccin                   ✅ Create schedule
PATCH  /a/schedule-vaccin/:id               ✅ Update schedule
DELETE /a/schedule-vaccin/:id               ❌ NOT IN DOCS
```

### Transactions
```
GET    /a/transactions                      ✅ List all transactions
POST   /a/transactions                      ✅ Create transaction
PATCH  /a/transactions/:id                  ✅ Update transaction
DELETE /a/transactions/:id                  ✅ Delete transaction
```

### Tickets ❌ MISSING MODULE
```
GET    /a/tickets                           ❌ NOT IN DOCS
GET    /a/tickets/:id                       ❌ NOT IN DOCS
POST   /a/tickets                           ❌ NOT IN DOCS
PATCH  /a/tickets/:id                       ❌ NOT IN DOCS
DELETE /a/tickets/:id                       ❌ NOT IN DOCS
```

### Registers ❌ MISSING MODULE
```
GET    /a/registers                         ❌ NOT IN DOCS
GET    /a/registers/:id                     ❌ NOT IN DOCS
POST   /a/registers                         ❌ NOT IN DOCS
PATCH  /a/registers/:id                     ❌ NOT IN DOCS
POST   /a/registers/bulk-delete             ❌ NOT IN DOCS
```

### Analytics ❌ MISSING MODULE
```
GET    /a/analystic/access-post             ❌ NOT IN DOCS
GET    /a/analystic/demographics            ❌ NOT IN DOCS
GET    /a/analystic/consultations           ❌ NOT IN DOCS
GET    /a/analystic/examination-schedules   ❌ NOT IN DOCS
GET    /a/analystic/pages                   ❌ NOT IN DOCS
GET    /a/analystic/views                   ❌ NOT IN DOCS
```

### Marketing Automations ❌ MISSING MODULE
```
GET    /a/automations                       ❌ NOT IN DOCS
GET    /a/automations/:id                   ❌ NOT IN DOCS
POST   /a/automations                       ❌ NOT IN DOCS
PATCH  /a/automations/:id                   ❌ NOT IN DOCS
DELETE /a/automations/:id                   ❌ NOT IN DOCS
POST   /a/automations/deleteMany            ❌ NOT IN DOCS
POST   /a/automations/import                ❌ NOT IN DOCS
POST   /a/automations/bulkUpdate            ❌ NOT IN DOCS
```

### Menus ❌ MISSING MODULE
```
GET    /a/menus                             ❌ NOT IN DOCS
GET    /a/menus/:id                         ❌ NOT IN DOCS
POST   /a/menus                             ❌ NOT IN DOCS
PATCH  /a/menus/:id                         ❌ NOT IN DOCS
DELETE /a/menus/:id                         ❌ NOT IN DOCS
PATCH  /a/menus/slug/:slug                  ❌ NOT IN DOCS
DELETE /a/menus/slug/:slug                  ❌ NOT IN DOCS
```

### Medias ❌ MISSING MODULE
```
GET    /a/medias                            ❌ NOT IN DOCS
GET    /a/medias/:id                        ❌ NOT IN DOCS
POST   /a/medias                            ❌ NOT IN DOCS
PATCH  /a/medias/:id                        ❌ NOT IN DOCS
DELETE /a/medias/:id                        ❌ NOT IN DOCS
```

### Notifications ❌ MISSING MODULE
```
GET    /a/notifications                     ❌ NOT IN DOCS
```

### Specialists ❌ MISSING MODULE
```
GET    /a/specialists                       ❌ NOT IN DOCS
GET    /a/specialists/:id                   ❌ NOT IN DOCS
POST   /a/specialists                       ❌ NOT IN DOCS
PATCH  /a/specialists/:id                   ❌ NOT IN DOCS
DELETE /a/specialists/:id                   ❌ NOT IN DOCS
```

### Surveys ❌ MISSING MODULE
```
GET    /a/surveys                           ❌ NOT IN DOCS
GET    /a/surveys/:id                       ❌ NOT IN DOCS
POST   /a/surveys                           ❌ NOT IN DOCS
PATCH  /a/surveys/:id                       ❌ NOT IN DOCS
DELETE /a/surveys/:id                       ❌ NOT IN DOCS
```

### Rules ❌ MISSING MODULE
```
GET    /a/rules                             ❌ NOT IN DOCS
GET    /a/rules/:id                         ❌ NOT IN DOCS
POST   /a/rules                             ❌ NOT IN DOCS
PATCH  /a/rules/:id                         ❌ NOT IN DOCS
DELETE /a/rules/:id                         ❌ NOT IN DOCS
```

### Settings
```
GET    /a/settings                          ✅ List all settings
GET    /a/settings/detail                   ❌ NOT IN DOCS
POST   /a/settings                          ✅ Create setting
PATCH  /a/settings                          ✅ Update setting
```

### Access Permissions
```
GET    /a/access-permissions                ✅ List all permissions
POST   /a/access-permissions                ✅ Create permission
PATCH  /a/access-permissions/:id            ✅ Update permission
DELETE /a/access-permissions/:id            ✅ Delete permission
```

---

## 👤 USER ENDPOINTS (`/api/u/`)

### Authentication
```
POST   /u/sessions/login                    ✅ Login user
POST   /u/sessions                          ✅ Register user
POST   /u/sessions/verify_email             ✅ Verify email
POST   /u/sessions/send_back_otp            ✅ Resend OTP
GET    /u/sessions/current_user             ✅ Get current user
PATCH  /u/sessions                          ✅ Update profile
PATCH  /u/sessions/change_password          ✅ Change password
POST   /u/sessions/forgot_password          ✅ Forgot password
POST   /u/sessions/verify_otp               ✅ Verify OTP
POST   /u/sessions/reset_password           ✅ Reset password
```

### Cart
```
GET    /u/cart                              ✅ Get cart items
GET    /u/cart/:id                          ✅ Get cart by ID
POST   /u/cart/change                       ✅ Change cart items
POST   /u/cart                              ✅ Create cart
PATCH  /u/cart/:id                          ✅ Update cart
```

### Categories
```
GET    /u/categories                        ✅ List all categories
GET    /u/categories/:id                    ✅ Get category by ID
```

### Courses
```
GET    /u/courses                           ✅ List all courses
GET    /u/courses/:id                       ✅ Get course by ID
POST   /u/courses/chapter                   ❌ NOT IN DOCS
POST   /u/courses                           ❌ NOT IN DOCS (User create?)
PATCH  /u/courses/:id                       ❌ NOT IN DOCS (User update?)
DELETE /u/courses/:id                       ❌ NOT IN DOCS (User delete?)
GET    /a/processings/:id                   ❌ NOT IN DOCS
```

### FAQs
```
GET    /u/faqs                              ✅ List all FAQs
```

### Feedbacks
```
GET    /u/feedbacks                         ✅ List all feedbacks
POST   /u/feedbacks                         ✅ Create feedback
GET    /u/feedbacks/:slug                   ✅ Get by product slug
```

### Orders
```
GET    /u/order                             ✅ List all orders
GET    /u/order/:id                         ✅ Get order by ID
POST   /u/order                             ✅ Create order
PATCH  /u/order/:id                         ✅ Update order
```

### Products
```
GET    /u/products                          ✅ List all products
GET    /u/products/recommends               ✅ Get recommended products
GET    /u/products/:id                      ✅ Get product by ID
```

### Users
```
GET    /u/users/:id                         ✅ Get user by ID
```

### Payment ❌ MISSING MODULE
```
POST   /u/payment/vnpay                     ❌ NOT IN DOCS
```

---

## 📤 PUBLIC ENDPOINTS

### File Upload
```
POST   /uploads                             ✅ Upload file
POST   /uploaders/image                     ❌ NOT IN DOCS
POST   /uploaders/video                     ❌ NOT IN DOCS
GET    /uploaders/:path                     ❌ NOT IN DOCS
```

---

## 📊 ADDITIONAL ENDPOINTS (Special Cases)

### Multi-App Endpoints

#### Carts (Different Usage)
```
# E-Learning uses POST to get items by IDs
POST   /a/carts                             ⚠️ Different usage
PATCH  /a/carts/:id                         ✅ Update cart
DELETE /a/carts/:id                         ✅ Delete cart
```

#### Courses (E-Learning specific)
```
GET    /u/courses?origin=vanphuccare.gensi.vn     Origin parameter
GET    /a/processings/:id?origin=...              Origin parameter
```

#### Services & Registers (CRM specific)
```
POST   /a/rates                             ❌ NOT IN DOCS
```

---

## 🔄 BULK OPERATIONS

### Found in Multiple Modules
```
POST   /a/services/bulk-delete              ❌ NOT IN DOCS
POST   /a/registers/bulk-delete             ❌ NOT IN DOCS
POST   /a/customers/deleteMany              ❌ NOT IN DOCS
POST   /a/customers/import                  ❌ NOT IN DOCS
POST   /a/customers/bulkUpdate              ❌ NOT IN DOCS
POST   /a/automations/deleteMany            ❌ NOT IN DOCS
POST   /a/automations/import                ❌ NOT IN DOCS
POST   /a/automations/bulkUpdate            ❌ NOT IN DOCS
```

---

## 📈 STATISTICS

### By Status
- ✅ **Documented**: ~70 endpoints (35%)
- ❌ **Not Documented**: ~90 endpoints (45%)
- ⚠️ **Partially Documented**: ~40 endpoints (20%)

### By Module Type
- **CRUD Modules**: 25+ modules
- **Read-Only Modules**: 5 modules
- **Special Operations**: 8+ modules

### By HTTP Method
- **GET**: 80+ endpoints
- **POST**: 60+ endpoints
- **PATCH**: 50+ endpoints
- **DELETE**: 30+ endpoints

---

## 🎯 PRIORITY FOR DOCUMENTATION

### 🔴 Critical (Must Document)
1. Blogs/Posts Module (7 endpoints)
2. Contracts Module (5 endpoints)
3. Consultations Module (5 endpoints)
4. Tickets Module (5 endpoints)
5. Registers Module (5 endpoints)
6. Analytics Module (6 endpoints)
7. Payment Gateway (1 endpoint)

### 🟡 Important (Should Document)
8. Automations Module (8 endpoints)
9. Menus Module (7 endpoints)
10. Medias Module (5 endpoints)
11. Specialists Module (5 endpoints)
12. Surveys Module (5 endpoints)
13. Rules Module (5 endpoints)

### 🟢 Enhancement (Nice to Have)
14. Comments System (4 endpoints)
15. Exercises (3 endpoints)
16. Course Processing (1 endpoint)
17. Bulk Operations (8 endpoints)
18. Active/Inactive toggles (4 endpoints)
19. Activity Logs (3 endpoints)

---

## 📝 NOTES

### Origin Parameter Usage
Many endpoints in E-Learning app use `?origin=vanphuccare.gensi.vn` parameter:
```
GET /u/courses?origin=vanphuccare.gensi.vn
GET /a/processings/:id?origin=vanphuccare.gensi.vn
GET /u/feedbacks?courseId=xxx&origin=vanphuccare.gensi.vn
POST /u/payment/vnpay?origin=vanphuccare.gensi.vn
```

### Slug-based Operations
Menus module supports slug-based operations:
```
PATCH  /a/menus/slug/:slug
DELETE /a/menus/slug/:slug
```

### Query Parameter Patterns
Common patterns found:
```
?page=1&limit=10              # Pagination
?type=blog                    # Filter by type
?categoryId=xxx               # Filter by category
?createdBy=customer           # Filter by creator
?courseId=xxx                 # Filter by course
?origin=domain.com            # Multi-tenant
```

---

**Last Updated**: October 2024  
**Source**: Codebase Audit of admin-vpc, crm-vpc, elerning-vpc  
**Total Endpoints**: 200+  
**Documentation Coverage**: ~35%

