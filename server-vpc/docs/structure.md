# 🏗️ Backend Architecture - Van Phuc Care API

## 📋 Tổng quan

Backend API cho hệ thống Van Phuc Care Healthcare Management, được xây dựng với Node.js, TypeScript, Express và MongoDB.

## 🎯 Tech Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB 7.0
- **ODM**: Mongoose
- **Authentication**: JWT + Passport.js
- **File Storage**: MinIO (S3-compatible)
- **Email**: Nodemailer
- **Validation**: Express Strong Params

## 📁 Cấu trúc thư mục

```
server-vpc/
├── src/
│   ├── server.ts                 # Entry point
│   ├── configs/                  # Configuration files
│   │   ├── database.ts          # MongoDB connection
│   │   ├── settings.ts          # App settings
│   │   └── routesServer/        # Route definitions
│   │       ├── index.ts         # Main router
│   │       ├── admin/           # Admin routes
│   │       └── user/            # User routes
│   ├── controllers/             # Request handlers
│   │   └── api/
│   │       ├── admin/           # Admin controllers
│   │       └── user/            # User controllers
│   ├── mongodb/                 # Mongoose models
│   │   ├── admins.ts
│   │   ├── customers.ts
│   │   ├── courses.ts
│   │   └── ...
│   ├── middlewares/             # Custom middlewares
│   │   ├── passport.ts          # JWT authentication
│   │   ├── parameters.ts        # Request validation
│   │   └── uploaders.ts         # File upload handling
│   ├── services/                # Business logic
│   │   ├── mailer.ts           # Email service
│   │   └── minio.ts            # File storage service
│   ├── libs/                    # Utilities
│   │   ├── response.ts         # Response formatters
│   │   └── errors.ts           # Error handlers
│   └── initializers/            # Startup scripts
│       └── mongoConnection.ts
├── scripts/                     # Utility scripts
├── views/                       # Email templates (Handlebars)
├── Dockerfile                   # Production build
├── Dockerfile.dev              # Development build
└── package.json
```

## 🔌 API Routes Structure

### Base Routes

```
/api/a/*    - Admin APIs (requires admin JWT)
/api/u/*    - User APIs (requires user JWT)
/api/*      - Public APIs (no auth required)
/uploads/*  - File upload endpoints
```

### Route Organization

1. **Admin Routes** ([`/api/a/*`](src/configs/routesServer/admin/index.ts))

   - Sessions (login, signup, password reset)
   - Customers management
   - Products & Services
   - Courses management
   - Orders & Transactions
   - Health Books
   - FAQs & Feedbacks

2. **User Routes** ([`/api/u/*`](src/configs/routesServer/user/index.ts))
   - User authentication
   - Course enrollment
   - Profile management
   - Health records

## 🔐 Authentication Flow

### Admin Authentication

```typescript
// 1. Login: POST /api/a/sessions/login
Request: {
  username, password;
}
Response: {
  accessToken, tokenExpireAt;
}

// 2. Access protected routes
Headers: {
  Authorization: "Bearer {token}";
}

// 3. Token validation via Passport JWT strategy
passport.authenticate("jwt", { session: false });
```

### User Authentication

```typescript
// 1. Login: POST /api/u/sessions/login
Request: {
  email, password;
}
Response: {
  token, user;
}

// 2. Similar flow with user-specific JWT strategy
```

## 💾 Database Models

### Core Models

1. **Admins** ([`admins.ts`](src/mongodb/admins.ts))

   - Admin user management
   - Fields: username, email, password (bcrypt), role, status

2. **Customers** ([`customers.ts`](src/mongodb/customers.ts))

   - Customer/patient records
   - Fields: email, phone, firstname, lastname, address

3. **Courses** ([`courses.ts`](src/mongodb/courses.ts))

   - E-learning courses
   - Fields: title, description, price, modules, lessons

4. **Products** ([`products.ts`](src/mongodb/products.ts))

   - Healthcare products
   - Fields: name, price, category, stock

5. **Orders** ([`orders.ts`](src/mongodb/orders.ts))

   - Order management
   - Fields: customer, items, total, status

6. **Health Books** ([`health-book.ts`](src/mongodb/vanphuccare/health-book.ts))
   - Patient health records
   - Fields: customerId, date, vitals, notes

## 🔄 Request/Response Flow

```
Client Request
     ↓
Express Server (server.ts)
     ↓
CORS Middleware
     ↓
Body Parser
     ↓
Route Matching (/api/a/*, /api/u/*)
     ↓
Authentication Middleware (Passport JWT)
     ↓
Parameter Validation (strongParams)
     ↓
Controller (business logic)
     ↓
MongoDB Query (Mongoose)
     ↓
Response Formatter
     ↓
Client Response
```

## 🛡️ Security Features

1. **JWT Authentication**

   - Separate tokens for admin/user
   - Token expiration (7 days default)
   - Refresh token support

2. **Password Security**

   - bcrypt hashing
   - Salt rounds: 10
   - Password reset via email OTP

3. **CORS Configuration**

   - Whitelist origins
   - Credentials support
   - Preflight handling

4. **Input Validation**
   - strongParams middleware
   - Type checking
   - XSS prevention

## 📦 Dependencies

### Core

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `passport-jwt`: JWT authentication
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT generation

### Services

- `minio`: S3-compatible storage
- `nodemailer`: Email sending
- `handlebars`: Email templates

### Development

- `typescript`: Type safety
- `nodemon`: Hot reload
- `ts-node`: TypeScript execution

## 🚀 Deployment

### Docker Support

- **Production**: [`Dockerfile`](Dockerfile)

  - Multi-stage build
  - Optimized image size
  - Health checks

- **Development**: [`Dockerfile.dev`](Dockerfile.dev)
  - Hot reload
  - Volume mounts
  - Debug support

### Environment Variables

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://admin:password@mongodb:27017/vanphuccare
JWT_SECRET=your_secret_key
JWT_ADMIN_SECRET=admin_secret
JWT_USER_SECRET=user_secret
MINIO_ENDPOINT=minio
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## 📊 Performance Considerations

1. **Database Indexing**

   - Indexed fields: email, username, slug
   - Compound indexes for queries

2. **Connection Pooling**

   - MongoDB connection pool
   - Keep-alive connections

3. **Caching Strategy**
   - Response caching for static data
   - Redis integration (optional)

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📝 API Documentation

Xem chi tiết tại:

- [VAN_PHUC_CARE_API_DOCUMENTATION.md](../../VAN_PHUC_CARE_API_DOCUMENTATION.md)
- [openapi.yaml](../../openapi.yaml)

## 🔗 Related Documentation

- [Database Schema](./DATABASE_SCHEMA.md)
- [API Endpoints](./API_ENDPOINTS.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [File Upload Guide](./FILE_UPLOAD.md)

---

**© 2025 Van Phuc Care Backend Team**
