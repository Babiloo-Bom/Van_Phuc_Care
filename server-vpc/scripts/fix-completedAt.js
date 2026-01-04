/**
 * Script để fix completedAt cho các khóa học đã hoàn thành
 * Lấy completedAt từ createdAt của CourseProgress record (ngày tạo record lần đầu)
 * hoặc từ completedAt của lesson cuối cùng được hoàn thành
 * 
 * Chạy: node scripts/fix-completedAt.js
 */

require('module-alias/register');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:vanphuccare2025@localhost:27017/vanphuccare?authSource=admin';

// Schema definitions
const courseProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  totalLessons: Number,
  completedLessons: Number,
  progressPercentage: Number,
  lastAccessedAt: Date,
  completedAt: Date
}, { timestamps: true });

const lessonProgressSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  chapterId: String,
  lessonId: String,
  completed: Boolean,
  completedAt: Date,
  timeSpent: Number
}, { timestamps: true });

async function fixCompletedAt() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
    const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);

    // Tìm tất cả course progress đã hoàn thành 100%
    const completedCourses = await CourseProgress.find({
      progressPercentage: 100
    });

    console.log(`📊 Found ${completedCourses.length} completed courses to check`);

    let fixedCount = 0;

    for (const courseProgress of completedCourses) {
      // Tìm ngày hoàn thành lesson cuối cùng của user cho khóa học này
      const lastCompletedLesson = await LessonProgress.findOne({
        userId: courseProgress.userId,
        courseId: courseProgress.courseId,
        completed: true
      }).sort({ completedAt: -1 }); // Lấy lesson hoàn thành gần nhất

      // Tìm ngày hoàn thành lesson đầu tiên đạt 100% (lesson cuối cùng trong danh sách)
      const allCompletedLessons = await LessonProgress.find({
        userId: courseProgress.userId,
        courseId: courseProgress.courseId,
        completed: true
      }).sort({ completedAt: 1 }); // Sort theo thời gian tăng dần

      // Ngày hoàn thành thực sự = ngày hoàn thành lesson cuối cùng (khi đạt 100%)
      let actualCompletedAt = null;
      
      if (allCompletedLessons.length > 0) {
        // Lấy lesson hoàn thành cuối cùng (lesson cuối cùng hoàn thành = đạt 100%)
        const lastLesson = allCompletedLessons[allCompletedLessons.length - 1];
        actualCompletedAt = lastLesson.completedAt || lastLesson.createdAt;
      }

      // Fallback: dùng createdAt của CourseProgress record
      if (!actualCompletedAt) {
        actualCompletedAt = courseProgress.createdAt;
      }

      // So sánh với completedAt hiện tại
      const currentCompletedAt = courseProgress.completedAt;
      
      // Nếu completedAt hiện tại khác với ngày hoàn thành thực sự (sai lệch > 1 ngày)
      if (actualCompletedAt && currentCompletedAt) {
        const diffDays = Math.abs(currentCompletedAt - actualCompletedAt) / (1000 * 60 * 60 * 24);
        
        if (diffDays > 1) {
          console.log(`\n📝 Course: ${courseProgress.courseId}`);
          console.log(`   User: ${courseProgress.userId}`);
          console.log(`   Current completedAt: ${currentCompletedAt.toISOString()}`);
          console.log(`   Actual completedAt: ${actualCompletedAt.toISOString()}`);
          console.log(`   Difference: ${diffDays.toFixed(1)} days`);
          
          // Update completedAt về ngày đúng
          await CourseProgress.updateOne(
            { _id: courseProgress._id },
            { $set: { completedAt: actualCompletedAt } }
          );
          
          console.log(`   ✅ Fixed!`);
          fixedCount++;
        }
      } else if (!currentCompletedAt && actualCompletedAt) {
        // Nếu chưa có completedAt nhưng đã 100%
        await CourseProgress.updateOne(
          { _id: courseProgress._id },
          { $set: { completedAt: actualCompletedAt } }
        );
        console.log(`\n📝 Set completedAt for course ${courseProgress.courseId}, user ${courseProgress.userId}`);
        fixedCount++;
      }
    }

    console.log(`\n🎉 Done! Fixed ${fixedCount} records.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixCompletedAt();

