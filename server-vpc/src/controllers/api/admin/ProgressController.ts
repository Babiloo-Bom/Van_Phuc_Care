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
  chapterIndex: {
    type: Number,
    required: true
  },
  lessonIndex: {
    type: Number,
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
              chapterIndex: progress.chapterIndex,
              lessonIndex: progress.lessonIndex
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
   */
  public static async markLessonCompleted(req: Request, res: Response) {
    try {
      const userId = (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      
      if (!userId) {
        return sendError(res, 401, 'User not authenticated');
      }

      const { courseId, chapterIndex, lessonIndex, timeSpent } = req.body;

      if (!courseId || chapterIndex === undefined || lessonIndex === undefined) {
        return sendError(res, 400, 'Missing required fields');
      }

      // Update lesson progress
      const lessonProgress = await LessonProgress.findOneAndUpdate(
        {
          userId: userId.toString(),
          courseId,
          chapterIndex,
          lessonIndex
        },
        {
          userId: userId.toString(),
          courseId,
          chapterIndex,
          lessonIndex,
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

      const totalLessons = course.chapters?.reduce((total: number, chapter: any) => 
        total + (chapter.lessons?.length || 0), 0) || 0;

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

      // Delete course progress
      await CourseProgress.deleteMany({
        userId: userId.toString(),
        courseId
      });

      sendSuccess(res, { message: 'Progress reset successfully' });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}
