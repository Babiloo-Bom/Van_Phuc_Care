# 💾 Database Schema Documentation

## 📊 Overview

Van Phuc Care sử dụng MongoDB với Mongoose ODM. Tất cả models được định nghĩa trong thư mục [`src/mongodb/`](../src/mongodb/).

## 🗄️ Collections

### 1. Admins Collection

**File:** [`src/mongodb/admins.ts`](../src/mongodb/admins.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  username: String (required, unique, index),
  email: String (required, unique, index),
  password: String (required, bcrypt hashed),
  fullname: String,
  avatar: String (URL),
  address: String,
  gender: String (enum: 'male', 'female', 'other'),
  status: String (enum: 'ACTIVE', 'INACTIVE', default: 'ACTIVE'),
  forgotPasswordToken: String,
  forgotPasswordExpireAt: Date,
  domain: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**

- `username`: unique
- `email`: unique
- `status`: normal

**Methods:**

```typescript
// Create admin with hashed password
await MongoDbAdmins.model.create({
  username: "admin001",
  email: "admin@example.com",
  password: bcrypt.hashSync("password", 10),
  fullname: "Admin User",
  status: "ACTIVE",
});
```

---

### 2. Customers Collection

**File:** [`src/mongodb/customers.ts`](../src/mongodb/customers/index.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  email: String (required, unique, index),
  phone: String (required, index),
  firstname: String (required),
  lastname: String (required),
  fullname: String (virtual: firstname + lastname),
  avatar: String (URL),
  address: {
    street: String,
    city: String,
    district: String,
    ward: String,
    zipCode: String
  },
  dateOfBirth: Date,
  gender: String (enum: 'male', 'female', 'other'),
  status: String (enum: 'active', 'inactive', default: 'active'),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `email`: unique
- `phone`: normal
- `status`: normal
- Compound: `{ firstname: 1, lastname: 1 }`

---

### 3. Courses Collection

**File:** [`src/mongodb/courses.ts`](../src/mongodb/courses.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, auto-generated, index),
  description: String,
  shortDescription: String,
  thumbnail: String (URL),
  price: Number (default: 0),
  salePrice: Number,
  duration: Number (in days),
  level: String (enum: 'beginner', 'intermediate', 'advanced'),
  categoryId: ObjectId (ref: 'categories'),
  instructorId: ObjectId (ref: 'admins'),
  status: String (enum: 'draft', 'published', 'archived', default: 'draft'),
  modules: [{
    title: String,
    order: Number,
    lessons: [ObjectId] (ref: 'lessons')
  }],
  totalLessons: Number,
  totalStudents: Number (default: 0),
  rating: Number (default: 0, min: 0, max: 5),
  totalReviews: Number (default: 0),
  tags: [String],
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `slug`: unique
- `status`: normal
- `categoryId`: normal
- `isFeatured`: normal
- Compound: `{ status: 1, isFeatured: -1 }`

**Virtuals:**

```typescript
// Populate modules with lessons
course.populate("modules.lessons");
```

---

### 4. Lessons Collection

**File:** [`src/mongodb/lessons.ts`](../src/mongodb/lessons.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, index),
  content: String (HTML content),
  videoUrl: String,
  duration: Number (in minutes),
  order: Number,
  courseId: ObjectId (ref: 'courses', required),
  moduleId: ObjectId,
  type: String (enum: 'video', 'text', 'quiz', 'exercise'),
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isPreview: Boolean (default: false),
  status: String (enum: 'draft', 'published', default: 'draft'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `courseId`: normal
- `order`: normal
- Compound: `{ courseId: 1, order: 1 }`

---

### 5. Products Collection

**File:** [`src/mongodb/products.ts`](../src/mongodb/products.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, index),
  description: String,
  shortDescription: String,
  price: Number (required),
  salePrice: Number,
  stock: Number (default: 0),
  sku: String (unique),
  categoryId: ObjectId (ref: 'categories'),
  images: [String] (URLs),
  specifications: [{
    key: String,
    value: String
  }],
  status: String (enum: 'active', 'inactive', 'out_of_stock'),
  rating: Number (default: 0, min: 0, max: 5),
  totalReviews: Number (default: 0),
  tags: [String],
  isFeatured: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `slug`: unique
- `sku`: unique
- `categoryId`: normal
- `status`: normal

---

### 6. Orders Collection

**File:** [`src/mongodb/orders.ts`](../src/mongodb/orders.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  orderNumber: String (unique, auto-generated),
  customerId: ObjectId (ref: 'customers', required),
  items: [{
    productId: ObjectId (ref: 'products'),
    productName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  subtotal: Number,
  shippingFee: Number (default: 0),
  discount: Number (default: 0),
  total: Number (required),
  status: String (enum: 'pending', 'processing', 'shipped', 'completed', 'cancelled'),
  paymentMethod: String (enum: 'cod', 'vnpay', 'momo'),
  paymentStatus: String (enum: 'pending', 'paid', 'failed'),
  shippingAddress: {
    fullname: String,
    phone: String,
    street: String,
    city: String,
    district: String,
    ward: String
  },
  notes: String,
  cancelReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `orderNumber`: unique
- `customerId`: normal
- `status`: normal
- `createdAt`: descending

---

### 7. Health Books Collection

**File:** [`src/mongodb/vanphuccare/health-book.ts`](../src/mongodb/vanphuccare/health-book.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  customerId: ObjectId (ref: 'customers', required),
  date: Date (required, index),
  vitals: {
    weight: Number (kg),
    height: Number (cm),
    bloodPressure: String (e.g., "120/80"),
    heartRate: Number (bpm),
    temperature: Number (°C),
    bloodSugar: Number (mg/dL)
  },
  symptoms: [String],
  diagnosis: String,
  treatment: String,
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  doctorId: ObjectId (ref: 'admins'),
  notes: String,
  attachments: [String] (URLs),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `customerId`: normal
- `date`: descending
- Compound: `{ customerId: 1, date: -1 }`

---

### 8. Vaccination Schedule Collection

**File:** [`src/mongodb/vanphuccare/schedule-vaccin.ts`](../src/mongodb/vanphuccare/schedule-vaccin.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  customerId: ObjectId (ref: 'customers', required),
  vaccineName: String (required),
  scheduledDate: Date (required, index),
  administeredDate: Date,
  status: String (enum: 'scheduled', 'completed', 'missed', 'cancelled'),
  dose: Number,
  totalDoses: Number,
  location: String,
  administeredBy: ObjectId (ref: 'admins'),
  notes: String,
  sideEffects: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `customerId`: normal
- `scheduledDate`: ascending
- `status`: normal
- Compound: `{ customerId: 1, scheduledDate: 1 }`

---

### 9. Transactions Collection

**File:** [`src/mongodb/transactions.ts`](../src/mongodb/transactions.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  transactionNumber: String (unique, auto-generated),
  customerId: ObjectId (ref: 'customers', required),
  orderId: ObjectId (ref: 'orders'),
  amount: Number (required),
  type: String (enum: 'payment', 'refund'),
  method: String (enum: 'vnpay', 'momo', 'cod', 'bank_transfer'),
  status: String (enum: 'pending', 'completed', 'failed', 'cancelled'),
  paymentGatewayRef: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `transactionNumber`: unique
- `customerId`: normal
- `orderId`: normal
- `status`: normal

---

### 10. FAQs Collection

**File:** [`src/mongodb/faqs.ts`](../src/mongodb/faqs.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  question: String (required),
  answer: String (required),
  category: String (enum: 'account', 'course', 'payment', 'general'),
  order: Number (default: 0),
  status: String (enum: 'active', 'inactive', default: 'active'),
  views: Number (default: 0),
  helpful: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 11. Feedbacks Collection

**File:** [`src/mongodb/feedbacks.ts`](../src/mongodb/feedbacks.ts)

**Schema:**

```typescript
{
  _id: ObjectId,
  customerId: ObjectId (ref: 'customers', required),
  courseId: ObjectId (ref: 'courses'),
  productId: ObjectId (ref: 'products'),
  rating: Number (required, min: 1, max: 5),
  comment: String,
  type: String (enum: 'course', 'product', 'service'),
  status: String (enum: 'pending', 'approved', 'rejected'),
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `customerId`: normal
- `courseId`: normal
- `productId`: normal
- `status`: normal

---

## 🔗 Relationships

### One-to-Many

```typescript
// Customer has many Orders
Customer → Orders (customerId)

// Course has many Lessons
Course → Lessons (courseId)

// Customer has many Health Books
Customer → HealthBooks (customerId)
```

### Many-to-Many

```typescript
// Courses and Customers (Enrollments)
// Implemented via separate enrollment collection or embedded array

// Products and Categories
// Using categoryId reference
```

## 🔍 Common Queries

### Find with Pagination

```typescript
const page = 1;
const limit = 12;
const skip = (page - 1) * limit;

const customers = await MongoDbCustomers.model
  .find({ status: "active" })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

const total = await MongoDbCustomers.model.countDocuments({ status: "active" });
```

### Search with Text Index

```typescript
// Create text index
MongoDbProducts.schema.index({ name: "text", description: "text" });

// Search
const products = await MongoDbProducts.model
  .find({ $text: { $search: "keyword" } })
  .sort({ score: { $meta: "textScore" } });
```

### Aggregate Pipeline

```typescript
// Get order statistics
const stats = await MongoDbOrders.model.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: null,
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$total" },
    },
  },
]);
```

## 📝 Migration Scripts

Located in [`src/scripts/`](../src/scripts/):

- [`createAdminRoot.ts`](../src/scripts/createAdminRoot.ts) - Create root admin
- `seed-courses-simple.js` - Seed sample courses
- `seed-user.js` - Seed sample users

## 🔧 Maintenance

### Backup Command

```bash
mongodump --uri="mongodb://admin:password@localhost:27017/vanphuccare" --out=/backup
```

### Restore Command

```bash
mongorestore --uri="mongodb://admin:password@localhost:27017/vanphuccare" /backup/vanphuccare
```

---

**© 2025 Van Phuc Care Database Team**
