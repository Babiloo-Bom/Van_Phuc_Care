/**
 * Create Admin User Script
 * Run: node scripts/create-admin-user.js
 * Or inside Docker: docker compose -f docker-compose.prod.yml exec api node scripts/create-admin-user.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Lấy URI từ .env hoặc dùng mặc định
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

// Định nghĩa schema giống file admins.ts
const adminSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, required: true },
  username: String,
  password: String,
  role: String,
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'pending_verification'] },
  verified: { type: String, default: 'true' },
  avatar: String,
  address: String,
  gender: String,
  phone: String,
  permissions: [],
  courseRegister: [String],
  courseCompleted: [String],
}, { 
  timestamps: true,
  strict: false 
});

const Admin = mongoose.model('admins', adminSchema, 'admins');

// User admin cần tạo
const adminUser = {
  fullname: 'Admin User',
  email: 'admin@gmail.com',
  username: 'admin',
  password: '123456', // Sẽ được hash
  role: 'admin',
  status: 'active',
  verified: 'true',
  avatar: null,
  address: '',
  gender: 'male',
  phone: '',
  permissions: [],
  courseRegister: [],
  courseCompleted: [],
};

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Kiểm tra email đã tồn tại chưa
    const existing = await Admin.findOne({ email: adminUser.email });
    if (existing) {
      console.log('⚠️  User already exists with email:', adminUser.email);
      console.log('   Updating existing user...');
      
      // Hash password
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(adminUser.password, salt);
      
      // Update existing user
      await Admin.updateOne(
        { email: adminUser.email },
        {
          $set: {
            fullname: adminUser.fullname,
            username: adminUser.username,
            password: hashedPassword,
            role: adminUser.role,
            status: adminUser.status,
            verified: adminUser.verified,
          }
        }
      );
      
      console.log('✅ Updated existing admin user:', adminUser.email);
      console.log('   Email:', adminUser.email);
      console.log('   Password:', adminUser.password);
      console.log('   Role:', adminUser.role);
    } else {
      // Hash password
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(adminUser.password, salt);
      
      // Tạo user mới
      const user = await Admin.create({
        ...adminUser,
        password: hashedPassword,
      });
      
      console.log('✅ Created admin user successfully!');
      console.log('   Email:', adminUser.email);
      console.log('   Password:', adminUser.password);
      console.log('   Role:', adminUser.role);
      console.log('   ID:', user._id);
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

