/**
 * Script để fix validTo của các coupon completion
 * Cập nhật validTo = completedAt + 7 ngày (thay vì now + 7 ngày)
 * 
 * Chạy: node scripts/fix-coupon-validTo.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB với authentication
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

// Coupon schema
const couponSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String,
  type: String,
  value: Number,
  minOrderAmount: Number,
  maxDiscountAmount: Number,
  usageLimit: Number,
  usedCount: Number,
  validFrom: Date,
  validTo: Date,
  isActive: Boolean,
  applicableCourses: [mongoose.Schema.Types.ObjectId],
  applicableCategories: [String],
  createdBy: String,
}, { timestamps: true });

// CourseProgress schema
const courseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  totalLessons: Number,
  completedLessons: Number,
  progressPercentage: Number,
  lastAccessedAt: Date,
  completedAt: Date,
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
const CourseProgress = mongoose.models.CourseProgress || mongoose.model('CourseProgress', courseProgressSchema);

async function fixCouponValidTo() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔄 Starting fix coupon validTo...\n');

    // Tìm tất cả coupon completion
    const completionCoupons = await Coupon.find({
      description: { $regex: /completion/i },
    });

    console.log(`📦 Found ${completionCoupons.length} completion coupons\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const coupon of completionCoupons) {
      // Lấy courseId từ applicableCourses
      const courseId = coupon.applicableCourses?.[0]?.toString();
      const userId = coupon.createdBy;

      if (!courseId || !userId) {
        console.log(`⚠️  Skipping coupon ${coupon.code}: missing courseId or userId`);
        skippedCount++;
        continue;
      }

      // Tìm CourseProgress để lấy completedAt
      const courseProgress = await CourseProgress.findOne({
        userId: userId.toString(),
        courseId: courseId.toString(),
      });

      if (!courseProgress || !courseProgress.completedAt) {
        console.log(`⚠️  Skipping coupon ${coupon.code}: no completedAt found for course ${courseId}`);
        skippedCount++;
        continue;
      }

      // Tính validTo đúng: completedAt + 7 ngày
      const completedAtDate = new Date(courseProgress.completedAt);
      completedAtDate.setHours(0, 0, 0, 0); // Reset về 00:00:00

      const correctValidFrom = new Date(completedAtDate);
      const correctValidTo = new Date(completedAtDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      // So sánh với validTo hiện tại
      const currentValidTo = new Date(coupon.validTo);
      const diffDays = Math.abs(correctValidTo.getTime() - currentValidTo.getTime()) / (1000 * 60 * 60 * 24);

      // Nếu sai lệch > 1 ngày, cần fix
      if (diffDays > 1) {
        console.log(`\n📝 Coupon: ${coupon.code}`);
        console.log(`   User: ${userId}`);
        console.log(`   Course: ${courseId}`);
        console.log(`   completedAt: ${completedAtDate.toLocaleDateString('en-GB')}`);
        console.log(`   Current validTo: ${currentValidTo.toLocaleDateString('en-GB')}`);
        console.log(`   Correct validTo: ${correctValidTo.toLocaleDateString('en-GB')}`);
        console.log(`   Difference: ${diffDays.toFixed(1)} days`);

        // Update coupon
        await Coupon.updateOne(
          { _id: coupon._id },
          {
            $set: {
              validFrom: correctValidFrom,
              validTo: correctValidTo,
            }
          }
        );

        console.log(`   ✅ Fixed!`);
        fixedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`\n🎉 Done!`);
    console.log(`   Fixed: ${fixedCount} coupons`);
    console.log(`   Skipped: ${skippedCount} coupons`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixCouponValidTo();

