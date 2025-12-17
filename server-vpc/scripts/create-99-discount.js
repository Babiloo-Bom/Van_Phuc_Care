/**
 * Tạo mã giảm giá 99%
 * Run: node scripts/create-99-discount.js [COUPON_CODE] [DAYS_VALID]
 * 
 * Ví dụ:
 *   node scripts/create-99-discount.js SUPER99 30
 *   node scripts/create-99-discount.js VPC99 60
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Lấy URI từ .env hoặc dùng mặc định
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

// Định nghĩa schema giống CouponController
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null // null = unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses'
  }],
  applicableCategories: [{
    type: String
  }],
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

async function main() {
  try {
    // Kết nối MongoDB
    console.log('🔌 Đang kết nối MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB thành công!\n');

    // Lấy tham số từ command line
    const couponCode = process.argv[2] || 'SUPER99';
    const daysValid = parseInt(process.argv[3]) || 30;
    const usageLimit = process.argv[4] ? parseInt(process.argv[4]) : null; // null = unlimited

    // Kiểm tra xem mã đã tồn tại chưa
    const existingCoupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (existingCoupon) {
      console.log(`❌ Mã giảm giá "${couponCode.toUpperCase()}" đã tồn tại!`);
      console.log(`   Mã hiện tại: ${existingCoupon.code}`);
      console.log(`   Giá trị: ${existingCoupon.value}${existingCoupon.type === 'percentage' ? '%' : ' VND'}`);
      console.log(`   Trạng thái: ${existingCoupon.isActive ? 'Hoạt động' : 'Không hoạt động'}`);
      console.log(`   Đã sử dụng: ${existingCoupon.usedCount}/${existingCoupon.usageLimit || '∞'}`);
      process.exit(1);
    }

    // Tính toán ngày hiệu lực
    const now = new Date();
    const validFrom = now;
    const validTo = new Date(now.getTime() + daysValid * 24 * 60 * 60 * 1000);

    // Tạo coupon 99%
    const couponData = {
      code: couponCode.toUpperCase(),
      name: 'Giảm giá 99% - Ưu đãi đặc biệt',
      description: `Mã giảm giá 99% cho tất cả khóa học. Hiệu lực ${daysValid} ngày.`,
      type: 'percentage',
      value: 99,
      minOrderAmount: 0, // Không giới hạn số tiền tối thiểu
      maxDiscountAmount: null, // Không giới hạn số tiền giảm tối đa
      usageLimit: usageLimit, // null = unlimited
      usedCount: 0,
      validFrom: validFrom,
      validTo: validTo,
      isActive: true,
      applicableCourses: [], // Áp dụng cho tất cả khóa học
      applicableCategories: [], // Áp dụng cho tất cả danh mục
      createdBy: 'admin-script'
    };

    // Tạo coupon
    console.log('📝 Đang tạo mã giảm giá...');
    const coupon = await Coupon.create(couponData);

    // Hiển thị kết quả
    console.log('\n✅ Đã tạo mã giảm giá thành công!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 THÔNG TIN MÃ GIẢM GIÁ');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   Mã code:        ${coupon.code}`);
    console.log(`   Tên:            ${coupon.name}`);
    console.log(`   Mô tả:          ${coupon.description}`);
    console.log(`   Loại:           ${coupon.type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định'}`);
    console.log(`   Giá trị:        ${coupon.value}%`);
    console.log(`   Số tiền tối thiểu: ${coupon.minOrderAmount.toLocaleString('vi-VN')} VND`);
    console.log(`   Giảm tối đa:     ${coupon.maxDiscountAmount ? coupon.maxDiscountAmount.toLocaleString('vi-VN') + ' VND' : 'Không giới hạn'}`);
    console.log(`   Giới hạn sử dụng: ${coupon.usageLimit ? coupon.usageLimit + ' lần' : 'Không giới hạn'}`);
    console.log(`   Đã sử dụng:     ${coupon.usedCount} lần`);
    console.log(`   Hiệu lực từ:    ${new Date(coupon.validFrom).toLocaleString('vi-VN')}`);
    console.log(`   Hiệu lực đến:   ${new Date(coupon.validTo).toLocaleString('vi-VN')}`);
    console.log(`   Trạng thái:     ${coupon.isActive ? '✅ Hoạt động' : '❌ Không hoạt động'}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Hướng dẫn sử dụng
    console.log('💡 HƯỚNG DẪN SỬ DỤNG:');
    console.log(`   1. Người dùng nhập mã: ${coupon.code}`);
    console.log('   2. Mã sẽ giảm 99% giá trị đơn hàng');
    console.log('   3. Áp dụng cho tất cả khóa học');
    console.log(`   4. Hiệu lực trong ${daysValid} ngày\n`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo mã giảm giá:', error.message);
    if (error.code === 11000) {
      console.error('   Mã giảm giá đã tồn tại trong database!');
    }
    process.exit(1);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối MongoDB.');
  }
}

// Chạy script
main();

