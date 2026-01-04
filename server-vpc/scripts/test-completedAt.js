/**
 * Script để test completedAt - đổi về ngày 24/12/2025
 * Chạy: node scripts/test-completedAt.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

async function testCompletedAt() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Tìm record cuối cùng (có completedAt gần nhất)
    const record = await db.collection('courseprogresses').findOne(
      { progressPercentage: 100 },
      { sort: { completedAt: -1 } }
    );
    
    if (!record) {
      console.log('❌ Không tìm thấy course progress nào đã hoàn thành');
      return;
    }
    
    console.log('\n📋 Record hiện tại:');
    console.log(`   _id: ${record._id}`);
    console.log(`   courseId: ${record.courseId}`);
    console.log(`   userId: ${record.userId}`);
    console.log(`   completedAt: ${record.completedAt}`);
    
    // Đổi completedAt về ngày 24/12/2025
    const newDate = new Date('2025-12-24T10:00:00.000Z');
    
    const result = await db.collection('courseprogresses').updateOne(
      { _id: record._id },
      { $set: { completedAt: newDate } }
    );
    
    console.log(`\n✅ Đã đổi completedAt thành: ${newDate.toISOString()}`);
    console.log(`   Modified: ${result.modifiedCount} record(s)`);
    
    // Verify
    const updated = await db.collection('courseprogresses').findOne({ _id: record._id });
    console.log(`\n📋 Record sau khi update:`);
    console.log(`   completedAt: ${updated.completedAt}`);
    
    console.log('\n🧪 Bây giờ hãy:');
    console.log('   1. Vào trang chứng nhận khóa học');
    console.log('   2. Xem ngày chứng nhận có hiển thị 24/12/2025 không');
    console.log('   3. Reload trang nhiều lần');
    console.log('   4. Nếu ngày vẫn là 24/12/2025 → FIX THÀNH CÔNG!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

testCompletedAt();

