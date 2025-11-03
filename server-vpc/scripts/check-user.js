/**
 * Kiểm tra user theo email trong MongoDB
 * Run: node scripts/check-user.js <email>
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

// Định nghĩa schema tối giản
const userSchema = new mongoose.Schema({
  email: String,
  fullname: String,
  status: String,
  password: String,
}, { collection: 'users' });

const User = mongoose.model('users', userSchema);

const email = process.argv[2];
if (!email) {
  console.error('Vui lòng truyền email cần kiểm tra. Ví dụ: node scripts/check-user.js nguyenvana@example.com');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email });
  if (user) {
    console.log('User found:', user);
  } else {
    console.log('User NOT found with email:', email);
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});