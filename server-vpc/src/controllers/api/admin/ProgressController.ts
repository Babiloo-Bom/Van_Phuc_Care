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
          await CourseProgress.findOneAndUpdate(
            {
              userId: userId.toString(),
              courseId: progress.courseId
            },
            {
              ...progress,
              userId: userId.toString()
            },
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
      // Count completed lessons for this course
      const completedLessons = await LessonProgress.countDocuments({
        userId,
        courseId,
        completed: true
      });

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

      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Update course progress
      const courseProgress = await CourseProgress.findOneAndUpdate(
        {
          userId,
          courseId
        },
        {
          userId,
          courseId,
          totalLessons,
          completedLessons,
          progressPercentage,
          lastAccessedAt: new Date(),
          completedAt: progressPercentage === 100 ? new Date() : undefined
        },
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
}
