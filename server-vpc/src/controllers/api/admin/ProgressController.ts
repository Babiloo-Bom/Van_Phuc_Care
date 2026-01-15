import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Progress tracking schemas
const lessonProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  chapterId: {
    type: String,
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  totalLessons: {
    type: Number,
    required: true
  },
  completedLessons: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create models
const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);
const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default class ProgressController {
  /**
   * Get user's progress
   */
  public static async getUserProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const [lessonProgress, courseProgress] = await Promise.all([
        LessonProgress.find({ userId: userId.toString() }),
        CourseProgress.find({ userId: userId.toString() })
      ]);

      sendSuccess(res, {
        lessonProgress,
        courseProgress
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Save user's progress
   */
  public static async saveProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const { lessonProgress, courseProgress } = req.body;

      // Save lesson progress
      if (lessonProgress && Array.isArray(lessonProgress)) {
        for (const progress of lessonProgress) {
          await LessonProgress.findOneAndUpdate(
            {
              userId: userId.toString(),
              courseId: progress.courseId,
              chapterId: progress.chapterId,
              lessonId: progress.lessonId
            },
            {
              ...progress,
              userId: userId.toString()
            },
            { upsert: true, new: true }
          );
        }
      }

      // Save course progress
      if (courseProgress && Array.isArray(courseProgress)) {
        for (const progress of courseProgress) {
          // Check if course progress already exists to preserve completedAt
          const existingCourseProgress = await CourseProgress.findOne({
            userId: userId.toString(),
            courseId: progress.courseId
          });

          // Build update data - exclude completedAt if it already exists
          const updateData: any = {
            ...progress,
            userId: userId.toString()
          };

          // IMPORTANT: Never overwrite completedAt if it already exists
          // completedAt should only be set once when course is first completed
          if (existingCourseProgress?.completedAt) {
            delete updateData.completedAt;
          }

          await CourseProgress.findOneAndUpdate(
            {
              userId: userId.toString(),
              courseId: progress.courseId
            },
            updateData,
            { upsert: true, new: true }
          );
        }
      }

      sendSuccess(res, { message: 'Progress saved successfully' });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Mark lesson as completed
   * Checks if lesson has quiz - if yes, requires passed quiz attempt
   */
  public static async markLessonCompleted(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const { courseId, chapterId, lessonId, timeSpent } = req.body;

      if (!courseId || chapterId === undefined || lessonId === undefined) {
        return sendError(res, 400, 'Missing required fields');
      }

      // Get course and lesson details to check if lesson has quiz
      const Course = mongoose.model('Course');
      const course = await Course.findById(courseId);
      if (!course) {
        return sendError(res, 404, 'Course not found');
      }
      
      const ChaptersModel = (await import('@mongodb/chapters')).default;
      const LessonsModel = (await import('@mongodb/lessons')).default;
      
      const chapter = await ChaptersModel.model.findOne({
        courseId: course._id,
        _id: chapterId,
        status: 'active'
      });
      
      if (!chapter) {
        return sendError(res, 404, 'Chapter not found');
      }
      
      const lesson: any = await LessonsModel.model.findOne({
        _id: lessonId,
        chapterId: chapter._id,
        status: 'active'
      }).populate('quiz');
      if (!lesson) {
        return sendError(res, 404, 'Lesson not found');
      }
      
      // Check if lesson has quiz
      const hasQuiz = !!lesson.quizId || !!lesson.quiz;
      
      if (hasQuiz) {
        // Lesson có quiz: phải check quiz attempt passed
        const MongoDbQuizAttempts = (await import('@mongodb/quiz-attempts')).default;
        const passedAttempt = await MongoDbQuizAttempts.findOne({
          userId: userId.toString(),
          courseId: courseId.toString(),
          chapterId: chapterId.toString(),
          lessonId: lessonId.toString(),
          status: 'completed',
          passed: true
        });
        
        if (!passedAttempt) {
          return sendError(res, 400, 'Bạn phải hoàn thành quiz trước khi đánh dấu lesson hoàn thành');
        }
      }

      // Update lesson progress
      const lessonProgress = await LessonProgress.findOneAndUpdate(
        {
          userId: userId.toString(),
          courseId,
          chapterId: chapterId.toString(),
          lessonId: lessonId.toString()
        },
        {
          userId: userId.toString(),
          courseId,
          chapterId: chapterId.toString(),
          lessonId: lessonId.toString(),
          completed: true,
          completedAt: new Date(),
          timeSpent: timeSpent || 0
        },
        { upsert: true, new: true }
      );

      // Update course progress
      await ProgressController.updateCourseProgress(userId.toString(), courseId);

      sendSuccess(res, { lessonProgress });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update course progress
   */
  public static async updateCourseProgress(userId: string, courseId: string) {
    try {
      // Count UNIQUE completed lessons for this course (use distinct to avoid duplicates)
      // This ensures we only count each lesson once, even if there are duplicate records
      const completedLessonIds = await LessonProgress.distinct('lessonId', {
        userId,
        courseId,
        completed: true
      });
      const completedLessons = completedLessonIds.length;

      // Get course details to calculate total lessons
      const Course = mongoose.model('Course');
      const course = await Course.findById(courseId);
      
      if (!course) return;

      // Calculate total lessons from Chapters and Lessons collections
      const ChaptersModel = (await import('@mongodb/chapters')).default;
      const LessonsModel = (await import('@mongodb/lessons')).default;
      
      const chapters = await ChaptersModel.model.find({
        courseId: course._id,
        status: 'active'
      });
      
      let totalLessons = 0;
      for (const chapter of chapters) {
        const lessonCount = await LessonsModel.model.countDocuments({
          chapterId: chapter._id,
          status: 'active'
        });
        totalLessons += lessonCount;
      }

      // Calculate progress percentage, ensuring it never exceeds 100%
      // Also ensure completedLessons doesn't exceed totalLessons (in case of data inconsistency)
      const actualCompletedLessons = Math.min(completedLessons, totalLessons);
      const progressPercentage = totalLessons > 0 
        ? Math.min(Math.round((actualCompletedLessons / totalLessons) * 100), 100) 
        : 0;

      // Check if course progress already exists to preserve completedAt
      const existingProgress = await CourseProgress.findOne({
        userId,
        courseId
      });

      // Only set completedAt if course is newly completed (100%) and doesn't have completedAt yet
      const shouldSetCompletedAt = progressPercentage === 100 && !existingProgress?.completedAt;
      
      // Debug log
      console.log(`[updateCourseProgress] userId=${userId}, courseId=${courseId}, progress=${progressPercentage}%, existingCompletedAt=${existingProgress?.completedAt}, shouldSetCompletedAt=${shouldSetCompletedAt}`);

      // Update course progress
      // Use actualCompletedLessons instead of completedLessons to ensure consistency
      const updateData: any = {
        userId,
        courseId,
        totalLessons,
        completedLessons: actualCompletedLessons, // Use capped value
        progressPercentage, // Already capped at 100%
        lastAccessedAt: new Date()
      };

      // Only set completedAt once - when first reaching 100%
      let completedAtDate: Date | null = null;
      if (shouldSetCompletedAt) {
        completedAtDate = new Date();
        updateData.completedAt = completedAtDate;
      }

      const courseProgress = await CourseProgress.findOneAndUpdate(
        {
          userId,
          courseId
        },
        updateData,
        { upsert: true, new: true }
      );

      // If course is completed (100%), add to user's courseCompleted array
      if (progressPercentage === 100) {
        const UserModel = (await import('@mongodb/users')).default;
        const user = (await UserModel.model.findById(userId)) as any;
        if (user && !user.courseCompleted?.includes(courseId.toString())) {
          if (!user.courseCompleted) {
            user.courseCompleted = [];
          }
          user.courseCompleted = [...user.courseCompleted, courseId.toString()];
          user.updatedAt = new Date();
          await user.save();
        }

        // Tự động tạo coupon quà tặng khi hoàn thành khóa học (chỉ tạo 1 lần)
        if (completedAtDate) {
          try {
            const UserCouponController = (await import('@controllers/api/user/CouponController')).default;
            await UserCouponController.createCompletionCouponIfNeeded(
              userId,
              courseId.toString(),
              completedAtDate
            );
          } catch (error: any) {
            console.error(`[updateCourseProgress] Error creating completion coupon:`, error);
            // Không throw error để không ảnh hưởng đến việc update progress
          }
        }
      }

      return courseProgress;
    } catch (error: any) {
      console.error('Error updating course progress:', error);
    }
  }

  /**
   * Get course progress for a specific course
   */
  public static async getCourseProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      const { courseId } = req.params;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const courseProgress = await CourseProgress.findOne({
        userId: userId.toString(),
        courseId
      });

      const lessonProgress = await LessonProgress.find({
        userId: userId.toString(),
        courseId
      });

      sendSuccess(res, {
        courseProgress: courseProgress || {
          courseId,
          totalLessons: 0,
          completedLessons: 0,
          progressPercentage: 0
        },
        lessonProgress
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Reset progress for a course
   */
  public static async resetProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      const { courseId } = req.params;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      // Delete lesson progress
      await LessonProgress.deleteMany({
        userId: userId.toString(),
        courseId
      });

      // Delete quiz attempts for this course (so lessons with quiz are not considered completed)
      const MongoDbQuizAttempts = (await import('@mongodb/quiz-attempts')).default;
      await MongoDbQuizAttempts.deleteMany({
        userId: userId.toString(),
        courseId: courseId.toString(),
      });

      sendSuccess(res, { message: 'Progress reset successfully' });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course completion rate statistics
   * Tính tỷ lệ hoàn thành khóa học: số khóa học đã hoàn thành / tổng số khóa học đã mua
   */
  public static async getCompletionRate(req: Request, res: Response) {
    try {
      // Lấy tất cả orders đã hoàn thành để đếm số khóa học đã mua
      const orderSchema = new mongoose.Schema({
        orderId: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        items: [{
          courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
          course: { type: Object, required: true },
          price: { type: Number, required: true }
        }],
        status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'], default: 'pending' },
        paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' }
      }, { timestamps: true });

      const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

      // Đếm số khóa học đã mua (từ orders completed)
      const completedOrders = await Order.find({
        status: 'completed',
        paymentStatus: 'completed'
      }).select('items');

      let totalPurchasedCourses = 0;
      const purchasedCourseIds = new Set<string>();
      
      if (completedOrders && Array.isArray(completedOrders)) {
        completedOrders.forEach((order: any) => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach((item: any) => {
              const courseId = item.courseId?.toString() || item.course?._id?.toString();
              if (courseId) {
                purchasedCourseIds.add(courseId);
                totalPurchasedCourses++;
              }
            });
          }
        });
      }

      // Đếm số khóa học đã hoàn thành (có completedAt trong CourseProgress)
      const completedCourses = await CourseProgress.countDocuments({
        progressPercentage: 100,
        completedAt: { $exists: true, $ne: null }
      });

      // Tính tỷ lệ hoàn thành
      const completionRateValue = totalPurchasedCourses > 0 
        ? parseFloat(((completedCourses / totalPurchasedCourses) * 100).toFixed(2))
        : 0;

      // Lấy thống kê theo khóa học (top courses được hoàn thành nhiều nhất)
      const courseCompletionStats = await CourseProgress.aggregate([
        {
          $match: {
            progressPercentage: 100,
            completedAt: { $exists: true, $ne: null }
          }
        },
        {
          $group: {
            _id: '$courseId',
            completedCount: { $sum: 1 }
          }
        },
        {
          $sort: { completedCount: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Populate course info
      const Course = mongoose.model('Course');
      const courseStatsWithInfo = await Promise.all(
        courseCompletionStats.map(async (stat: any) => {
          const course = await Course.findById(stat._id).select('title slug');
          return {
            courseId: stat._id,
            courseTitle: course?.title || 'Unknown',
            courseSlug: course?.slug || '',
            completedCount: stat.completedCount
          };
        })
      );

      sendSuccess(res, {
        totalPurchasedCourses,
        completedCourses,
        completionRate: completionRateValue,
        topCourses: courseStatsWithInfo
      });
    } catch (error: any) {
      console.error('❌ Get completion rate error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}
