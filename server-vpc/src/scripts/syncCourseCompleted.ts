import mongoose from 'mongoose';
import '../initializers/mongoConnection';

const execute = async () => {
  try {
    console.log('🔄 Starting sync courseCompleted...');

    // CourseProgress schema
    const courseProgressSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      courseId: { type: String, required: true },
      totalLessons: { type: Number, required: true },
      completedLessons: { type: Number, default: 0 },
      progressPercentage: { type: Number, default: 0 },
      lastAccessedAt: { type: Date, default: Date.now },
      completedAt: { type: Date }
    }, { timestamps: true });

    const CourseProgress = mongoose.models.CourseProgress || mongoose.model('CourseProgress', courseProgressSchema);

    // User model
    const UserModel = (await import('../mongodb/users')).default;

    // Find all completed course progress (completedAt is not null)
    const completedProgresses = await CourseProgress.find({
      completedAt: { $ne: null }
    });

    console.log(`📊 Found ${completedProgresses.length} completed course progress records`);

    let updatedUsers = 0;
    let addedCourses = 0;

    // Group by userId
    const userProgressMap = new Map<string, Set<string>>();

    for (const progress of completedProgresses) {
      const userId = progress.userId.toString();
      const courseId = progress.courseId.toString();

      if (!userProgressMap.has(userId)) {
        userProgressMap.set(userId, new Set());
      }
      userProgressMap.get(userId)!.add(courseId);
    }

    // Update each user
    for (const [userId, courseIds] of userProgressMap.entries()) {
      try {
        const user = await UserModel.model.findById(userId) as any;
        if (!user) {
          console.log(`⚠️ User ${userId} not found, skipping...`);
          continue;
        }

        if (!user.courseCompleted) {
          user.courseCompleted = [];
        }

        const courseCompletedSet = new Set(user.courseCompleted.map((id: any) => id.toString()));
        let hasChanges = false;

        for (const courseId of courseIds) {
          if (!courseCompletedSet.has(courseId)) {
            courseCompletedSet.add(courseId);
            user.courseCompleted.push(courseId);
            addedCourses++;
            hasChanges = true;
          }
        }

        if (hasChanges) {
          user.courseCompleted = Array.from(courseCompletedSet);
          user.updatedAt = new Date();
          await user.save();
          updatedUsers++;
          console.log(`✅ Updated user ${userId}: added ${courseIds.size} completed courses`);
        }
      } catch (error: any) {
        console.error(`❌ Error updating user ${userId}:`, error.message);
      }
    }

    console.log(`\n✅ Sync completed!`);
    console.log(`   - Updated ${updatedUsers} users`);
    console.log(`   - Added ${addedCourses} course completions`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error syncing courseCompleted:', error);
    process.exit(1);
  }
};

execute();

