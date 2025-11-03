/**
 * Seed a single user to MongoDB
 * Run: node scripts/seed-user.js
 */

const mongoose = require('mongoose');

// Lấy URI từ .env hoặc dùng mặc định
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

// Định nghĩa schema giống file users.ts
const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  address: {
    province: { id: String, name: String },
    district: { id: String, name: String },
    ward: { id: String, name: String },
    addressDetail: String,
  },
  avatar: String,
  gender: String,
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'pending'] },
  type: { type: String, default: 'normal', enum: ['normal', 'vip'] },
}, { timestamps: true });

const User = mongoose.model('users', userSchema, 'users');

// User mẫu
const seedUser = {
  fullname: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phoneNumber: '0987654321',
  password: '123456', // Nên hash nếu dùng thực tế!
  address: {
    province: { id: '01', name: 'Hà Nội' },
    district: { id: '001', name: 'Ba Đình' },
    ward: { id: '0001', name: 'Phúc Xá' },
    addressDetail: 'Số 1 Phúc Xá',
  },
  avatar: '',
  gender: 'male',
  status: 'active',
  type: 'normal',
};

async function main () {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Kiểm tra email đã tồn tại chưa
  const existing = await User.findOne({ email: seedUser.email });
  if (existing) {
    console.log('User already exists:', existing.email);
  } else {
    const user = await User.create(seedUser);
    console.log('Seeded user:', user.email);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
