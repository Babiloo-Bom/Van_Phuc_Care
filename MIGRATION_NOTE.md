# 📝 Migration Note - Van Phuc Care

> **Ghi chú về database migration, schema changes, và các thay đổi quan trọng trong quá trình phát triển**

---

## 📋 Mục lục

1. [Tổng quan Database](#tổng-quan-database)
2. [Schema Changes](#schema-changes)
3. [Migration Scripts](#migration-scripts)
4. [Seed Data](#seed-data)
5. [Backup & Restore](#backup--restore)
6. [Breaking Changes](#breaking-changes)

---

## 🗄️ Tổng quan Database

### Database Information

- **Database Name**: `vanphuccare`
- **Database Type**: MongoDB 7
- **ODM**: Mongoose
- **Connection**: `mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin`

### Collections chính

1. **admins** - Quản trị viên hệ thống
2. **users** - Người dùng (khách hàng)
3. **courses** - Khóa học
4. **chapters** - Chương trong khóa học
5. **lessons** - Bài học
6. **quizzes** - Câu hỏi quiz
7. **orders** - Đơn hàng
8. **products** - Sản phẩm
9. **services** - Dịch vụ
10. **healthbooks** - Sổ sức khỏe
11. **schedulevaccins** - Lịch tiêm chủng
12. **tickets** - Support tickets
13. **categories** - Danh mục

---

## 📊 Schema Changes

### Version 1.0.0 (Current)

#### Admins Collection

```typescript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  fullname: String,
  role: String (enum: 'admin', 'manager', 'worker'),
  status: String (enum: 'active', 'inactive', 'pending_verification'),
  avatar: String,
  address: String,
  gender: String,
  phone: String,
  domain: String,
  permissions: Array,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `username`: unique
- `email`: unique
- `status`: normal

#### Users Collection

```typescript
{
  _id: ObjectId,
  email: String (required, unique),
  phoneNumber: String (required),
  fullname: String,
  firstname: String,
  lastname: String,
  password: String (bcrypt hashed),
  avatar: String,
  address: {
    province: { id: String, name: String },
    district: { id: String, name: String },
    ward: { id: String, name: String },
    addressDetail: String
  },
  dateOfBirth: Date,
  gender: String (enum: 'male', 'female', 'other'),
  status: String (enum: 'active', 'inactive', 'pending'),
  type: String (enum: 'normal', 'vip'),
  role: String (default: 'customer'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: unique
- `phoneNumber`: normal
- `status`: normal

#### Courses Collection

```typescript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique),
  description: String,
  shortDescription: String,
  thumbnail: String,
  introVideo: String, // URL to Cloudflare R2
  price: Number,
  originalPrice: Number,
  discount: Number,
  instructor: {
    name: String,
    bio: String,
    avatar: String
  },
  category: String,
  level: String (enum: 'beginner', 'intermediate', 'advanced'),
  tags: Array,
  isPublished: Boolean,
  isFeatured: Boolean,
  rating: Number,
  students: Number,
  lessons: Number,
  chapters: [ObjectId], // References to chapters collection
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `slug`: unique
- `isPublished`: normal
- `isFeatured`: normal
- `category`: normal

#### Lessons Collection

```typescript
{
  _id: ObjectId,
  chapterId: ObjectId (ref: 'chapters'),
  courseId: ObjectId (ref: 'courses'),
  title: String (required),
  description: String,
  type: String (enum: 'video', 'document', 'quiz', 'text'),
  content: String, // For text type
  videos: [{
    title: String,
    url: String, // Cloudflare R2 URL
    duration: Number
  }],
  documents: [{
    title: String,
    url: String, // MinIO URL
    size: Number
  }],
  quizzes: [ObjectId], // References to quizzes collection
  isPreview: Boolean (default: false), // Cho phép học thử
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `chapterId`: normal
- `courseId`: normal
- `type`: normal
- `isPreview`: normal

#### Tickets Collection

```typescript
{
  _id: ObjectId,
  ticketNumber: String (required, unique, auto-generated),
  title: String (required),
  description: String (required),
  userId: ObjectId (ref: 'users', required),
  assignedTo: ObjectId (ref: 'admins', optional),
  priority: String (enum: 'low', 'medium', 'high', 'urgent', default: 'medium'),
  status: String (enum: 'open', 'pending', 'in_progress', 'resolved', 'closed', default: 'open'),
  category: String (enum: 'technical', 'billing', 'general', 'complaint', 'feature_request', default: 'general'),
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  notes: String,
  resolvedAt: Date,
  resolvedBy: ObjectId (ref: 'admins'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `ticketNumber`: unique
- `status + createdAt`: compound
- `assignedTo + status`: compound
- `priority + status`: compound

---

## 🔄 Migration Scripts

### 1. Tạo Admin Root

**File**: `server-vpc/scripts/create-admin-user.js`

```bash
# Chạy trong container
docker compose exec api node scripts/create-admin-user.js

# Hoặc local
cd server-vpc
node scripts/create-admin-user.js
```

**Thông tin mặc định:**
- Email: `admin@gmail.com`
- Username: `admin`
- Password: `123456` (sẽ được hash)
- Role: `admin`

### 2. Seed Users

**File**: `server-vpc/scripts/seed-user.js`

```bash
docker compose exec api node scripts/seed-user.js
```

### 3. Seed Courses

**File**: `server-vpc/scripts/seed-courses-simple.js`

```bash
docker compose exec api node scripts/seed-courses-simple.js
```

Hoặc qua API endpoint (nếu có):

```bash
POST /api/a/courses/seed
Authorization: Bearer <admin-token>
```

### 4. Seed Schedule Vaccins

Qua API endpoint:

```bash
POST /api/a/schedule-vaccins/seed
Authorization: Bearer <admin-token>
```

### 5. Seed Tickets

Qua API endpoint:

```bash
POST /api/a/tickets/seed
Authorization: Bearer <admin-token>
```

---

## 🌱 Seed Data

### Dữ liệu mẫu được tạo tự động

1. **Admin User**: `admin@gmail.com` / `123456`
2. **Sample Users**: Người dùng mẫu với thông tin đầy đủ
3. **Sample Courses**: Khóa học mẫu với chapters và lessons
4. **Sample Schedule Vaccins**: Lịch tiêm chủng mẫu
5. **Sample Tickets**: Support tickets mẫu

### Lưu ý khi seed

⚠️ **Cảnh báo**: Các script seed có thể xóa dữ liệu hiện có!

- `seed-courses-simple.js` sẽ xóa tất cả courses, chapters, lessons, quizzes
- Chỉ chạy seed trong môi trường development hoặc khi cần reset dữ liệu

---

## 💾 Backup & Restore

### Backup Database

```bash
# Backup toàn bộ database
mongodump \
  --uri="mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin" \
  --out=/backup/vanphuccare-$(date +%Y%m%d-%H%M%S)

# Backup một collection cụ thể
mongodump \
  --uri="mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin" \
  --collection=users \
  --out=/backup/users-$(date +%Y%m%d)
```

### Restore Database

```bash
# Restore toàn bộ database
mongorestore \
  --uri="mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin" \
  /backup/vanphuccare-20250101-120000

# Restore một collection
mongorestore \
  --uri="mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin" \
  --collection=users \
  /backup/users-20250101/users.bson
```

### Backup trong Docker

```bash
# Backup từ container MongoDB
docker compose exec mongodb mongodump \
  --uri="mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin" \
  --out=/data/backup

# Copy backup ra host
docker cp vpc-mongodb:/data/backup ./backup
```

### Restore trong Docker

```bash
# Copy backup vào container
docker cp ./backup vpc-mongodb:/data/backup

# Restore
docker compose exec mongodb mongorestore \
  --uri="mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin" \
  /data/backup/vanphuccare
```

---

## ⚠️ Breaking Changes

### Version 1.0.0

#### 1. Thay đổi cấu trúc Lessons

**Trước:**
```typescript
lesson: {
  video: String,
  document: String
}
```

**Sau:**
```typescript
lesson: {
  type: 'video' | 'document' | 'quiz' | 'text',
  videos: [{ title, url, duration }],
  documents: [{ title, url, size }],
  quizzes: [ObjectId],
  content: String // For text type
}
```

**Migration:**
- Cần migrate dữ liệu cũ sang cấu trúc mới
- Script migration: `server-vpc/scripts/migrate-lessons.js` (nếu có)

#### 2. Thêm field `isPreview` vào Lessons

**Migration:**
```javascript
// Set default value for existing lessons
db.lessons.updateMany(
  { isPreview: { $exists: false } },
  { $set: { isPreview: false } }
);
```

#### 3. Thay đổi Services Collection

**Trước:**
- Services không có field `origin`

**Sau:**
- Services có thể có field `origin` (optional)
- Admin API không filter theo `origin` nữa (hiển thị tất cả)

**Migration:**
- Không cần migration, field `origin` là optional

#### 4. Thay đổi Schedule Vaccins

**Trước:**
- Dùng field `name` và `time`

**Sau:**
- Ưu tiên `title` và `age`, fallback về `name` và `time`
- Đồng bộ `name` với `title` khi tạo/sửa

**Migration:**
```javascript
// Sync name with title
db.schedulevaccins.updateMany(
  { title: { $exists: true }, name: { $exists: false } },
  [{ $set: { name: "$title" } }]
);
```

---

## 🔍 Data Validation

### Kiểm tra dữ liệu

```bash
# Kết nối MongoDB shell
docker compose exec mongodb mongosh \
  -u admin -p vanphuccare2025 \
  --authenticationDatabase admin \
  vanphuccare

# Kiểm tra số lượng documents
db.admins.countDocuments()
db.users.countDocuments()
db.courses.countDocuments()
db.lessons.countDocuments()
db.tickets.countDocuments()

# Kiểm tra indexes
db.admins.getIndexes()
db.users.getIndexes()
db.courses.getIndexes()
```

### Validate Schema

```bash
# Chạy validation script (nếu có)
cd server-vpc
npm run validate-schema
```

---

## 📝 Notes

### Indexes

Tất cả indexes quan trọng đã được tạo tự động bởi Mongoose:

- Unique indexes: `username`, `email`, `slug`, `ticketNumber`
- Normal indexes: `status`, `category`, `type`, `isPublished`
- Compound indexes: `status + createdAt`, `assignedTo + status`

### Performance

- Sử dụng indexes cho các query thường xuyên
- Compound indexes cho các query phức tạp
- Text indexes cho search (nếu cần)

### Data Consistency

- Sử dụng transactions cho các operations quan trọng
- Validate data ở cả frontend và backend
- Sử dụng Mongoose validators

---

## 🚀 Future Migrations

### Planned Changes

1. **Multi-tenancy**: Thêm field `domain` vào tất cả collections
2. **Soft Delete**: Thêm field `deletedAt` thay vì xóa thật
3. **Audit Log**: Collection riêng để log các thay đổi
4. **Full-text Search**: Thêm text indexes cho search nâng cao

---

**Last Updated**: January 2025  
**Version**: 1.0.0

