import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import { NoData } from '@libs/errors';
import MinioService from '@services/minio';
import ChaptersModel from '@mongodb/chapters';
import mongoose from 'mongoose';
import QuizzesModel from '@mongodb/quizzes';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    instructor: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: "",
      },
      bio: {
        type: String,
        default: "",
      },
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    lessons: {
      type: Number,
      default: 0,
    },
    students: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [
      {
        type: String,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Create model if it doesn't exist
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

class CourseController {
    /**
   * Convert MinIO path to full URL (presigned or public)
   */
    private static async convertMinioPathToUrl(
      path: string | null | undefined
    ): Promise<string | null> {
      if (!path) return null;
  
      // If already a full URL (http/https), return as is
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }
  
      // If it's a MinIO path (starts with /van-phuc-care/)
      if (path.startsWith("/van-phuc-care/")) {
        try {
          // Remove leading slash and bucket name to get object name
          const objectName = path.replace(/^\/van-phuc-care\//, "");
  
          // Get presigned URL (valid for 7 days)
          const presignedUrl = await MinioService.getFileUrl(
            objectName,
            7 * 24 * 60 * 60
          );
          return presignedUrl;
        } catch (error) {
          console.error("Error getting presigned URL for:", path, error);
          // Fallback: construct public URL (requires public bucket)
          const minioEndpoint = process.env.MINIO_ENDPOINT || "localhost";
          const minioPort = process.env.MINIO_PORT || "9000";
          const protocol =
            process.env.MINIO_USE_SSL === "true" ? "https" : "http";
          return `${protocol}://${minioEndpoint}:${minioPort}${path}`;
        }
      }
  
      return path;
    }

  /**
   * Get purchased course IDs for a user
   * Returns array of courseIds from completed orders
   */
  private static async getPurchasedCourseIds(userId: string): Promise<string[]> {
    try {
      // Get Order model (same schema as OrderController)
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

      const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

      // Find all completed orders for this user
      const completedOrders = await OrderModel.find({
        userId: userId.toString(),
        status: 'completed',
        paymentStatus: 'completed'
      });

      // Extract all unique courseIds from order items
      const purchasedCourseIds = new Set<string>();
      
      completedOrders.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const courseId = item.courseId?.toString() || item.course?._id?.toString();
            if (courseId) {
              purchasedCourseIds.add(courseId);
            }
          });
        }
      });

      return Array.from(purchasedCourseIds);
    } catch (error: any) {
      console.error('❌ Error getting purchased course IDs:', error);
      return [];
    }
  }

  /**
   * Get all courses that user has purchased
   * Only returns courses from completed orders
   */
  public async getMyCourses(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      
      if (!currentUser) {
        return sendError(res, 400, 'Unauthorized - User not authenticated');
      }

      const userId = currentUser._id?.toString() || currentUser.id?.toString();
      
      if (!userId) {
        return sendError(res, 400, 'User ID not found');
      }

      // Get purchased course IDs from orders
      const purchasedCourseIds = await CourseController.getPurchasedCourseIds(userId);

      if (purchasedCourseIds.length === 0) {
        return sendSuccess(res, { courses: [] });
      }

      // Get courses that user has purchased
      const courses = await Course.find({
        _id: { $in: purchasedCourseIds.map(id => new mongoose.Types.ObjectId(id)) },
        status: 'active'
      }).sort({ createdAt: -1 });

      const LessonsModel = (await import("@mongodb/lessons")).default;
      const QuizzesModel = (await import("@mongodb/quizzes")).default;

      // Get user's progress for all courses
      const LessonProgress = mongoose.model("LessonProgress");
      const MongoDbQuizAttempts = (await import("@mongodb/quiz-attempts")).default;

      // Get all lesson progress and quiz attempts for this user across all purchased courses
      const [allLessonProgress, allQuizAttempts] = await Promise.all([
        LessonProgress.find({
          userId: userId.toString(),
          courseId: { $in: purchasedCourseIds.map(id => new mongoose.Types.ObjectId(id)) }
        }),
        MongoDbQuizAttempts.find({
          userId: userId.toString(),
          courseId: { $in: purchasedCourseIds.map(id => new mongoose.Types.ObjectId(id)) },
          status: "completed",
          passed: true,
        }),
      ]);

      // Calculate statistics and progress for each course
      const coursesWithStats = await Promise.all(
        courses.map(async (course: any) => {
          const courseData = course.toObject();
          const courseId = course._id.toString();

          const chapters = await ChaptersModel.model.find({
            courseId: course._id,
            status: "active",
          });

          let totalVideoCount = 0;
          let totalDocumentCount = 0;
          let totalLessons = 0;
          let completedLessons = 0;

          // Get lesson progress and quiz attempts for this specific course
          const courseLessonProgress = allLessonProgress.filter(
            (p: any) => p.courseId?.toString() === courseId
          );
          const courseQuizAttempts = allQuizAttempts.filter(
            (attempt: any) => attempt.courseId?.toString() === courseId
          );

          for (const chapter of chapters) {
            const lessons = await LessonsModel.model.find({
              chapterId: chapter._id,
              status: "active",
            });

            for (const lesson of lessons) {
              const lessonData: any = lesson.toObject();
              const lessonId = lesson._id.toString();
              const chapterId = chapter._id.toString();

              // Count videos
              if (lessonData.videos && Array.isArray(lessonData.videos)) {
                totalVideoCount += lessonData.videos.length;
              } else if (lessonData.type === "video" && lessonData.videoUrl) {
                totalVideoCount += 1;
              }

              // Count documents
              if (lessonData.documents && Array.isArray(lessonData.documents)) {
                totalDocumentCount += lessonData.documents.length;
              } else if (
                lessonData.type === "document" &&
                lessonData.documentUrl
              ) {
                totalDocumentCount += 1;
              }

              // Check if lesson is completed for progress calculation
              totalLessons += 1;
              const hasQuiz = !!lessonData.quizId || !!lessonData.quiz;

              if (hasQuiz) {
                // For lessons with quiz, check if user passed the quiz
                const passedAttempt = courseQuizAttempts.find(
                  (attempt: any) =>
                    attempt.chapterId?.toString() === chapterId &&
                    attempt.lessonId?.toString() === lessonId &&
                    attempt.passed === true
                );
                if (passedAttempt) {
                  completedLessons += 1;
                }
              } else {
                // For lessons without quiz, check lesson progress
                const progress = courseLessonProgress.find(
                  (p: any) =>
                    p.chapterId?.toString() === chapterId &&
                    p.lessonId?.toString() === lessonId &&
                    p.completed === true
                );
                if (progress) {
                  completedLessons += 1;
                }
              }
            }
          }

          const totalQuizCount = await QuizzesModel.countDocuments({
            courseId: course._id.toString(),
            status: "active",
          });

          // Calculate progress percentage
          const progressPercentage =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

          return {
            _id: courseData._id.toString(),
            title: courseData.title,
            slug: courseData.slug,
            description: courseData.description,
            shortDescription: courseData.shortDescription,
            thumbnail: courseData.thumbnail,
            price: courseData.price,
            originalPrice: courseData.originalPrice || courseData.price,
            discount: courseData.discount || 0,
            instructor: courseData.instructor,
            category: courseData.category,
            level: courseData.level,
            duration: courseData.duration,
            lessons: courseData.lessons || 0,
            students: courseData.students || 0,
            rating: {
              average: courseData.rating?.average || 0,
              count: courseData.rating?.count || 0,
            },
            tags: courseData.tags || [],
            isPublished: courseData.isPublished,
            isFeatured: courseData.isFeatured,
            status: courseData.status,
            videoCount: totalVideoCount,
            documentCount: totalDocumentCount,
            quizCount: totalQuizCount,
            progress: {
              totalLessons,
              completedLessons,
              progressPercentage,
              isCompleted: progressPercentage === 100,
            },
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
          };
        })
      );

      sendSuccess(res, { courses: coursesWithStats });
    } catch (error: any) {
      console.error('❌ Get my courses error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course detail by slug - only for purchased courses
   * Checks if user has purchased this course before returning details
   */
  public async getMyCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const currentUser = (req as any).currentUser;

      if (!currentUser) {
        return sendError(res, 401, 'Unauthorized - User not authenticated');
      }

      const userId = currentUser._id?.toString() || currentUser.id?.toString();

      if (!userId) {
        return sendError(res, 400, 'User ID not found');
      }

      // Get course by slug
      const course = await Course.findOne({ slug, status: "active" });

      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      // Check if user has purchased this course
      const purchasedCourseIds = await CourseController.getPurchasedCourseIds(userId);
      const courseId = course._id.toString();

      if (!purchasedCourseIds.includes(courseId)) {
        return sendError(res, 403, "Bạn chưa mua khóa học này");
      }

      // Get chapters for this course
      const chapters = await ChaptersModel.model
        .find({
          courseId: course._id,
          status: "active",
        })
        .sort({ index: 1 });

      // Get lessons for each chapter
      const LessonsModel = (await import("@mongodb/lessons")).default;
      const courseData = course.toObject();

      // Get user's progress and quiz attempts
      const LessonProgress = mongoose.model("LessonProgress");
      const MongoDbQuizAttempts = (await import("@mongodb/quiz-attempts"))
        .default;

      const [lessonProgressList, quizAttempts] = await Promise.all([
        LessonProgress.find({
          userId: userId.toString(),
          courseId: course._id.toString(),
        }),
        MongoDbQuizAttempts.find({
          userId: userId.toString(),
          courseId: course._id.toString(),
          status: "completed",
          passed: true,
        }),
      ]);

      const isLessonCompleted = (
        chapterId: string,
        lessonId: string,
        hasQuiz: boolean
      ) => {
        const progress = lessonProgressList.find(
          (p: any) =>
            p.courseId === course._id.toString() &&
            p.chapterId === chapterId &&
            p.lessonId === lessonId &&
            p.completed === true
        );

        if (hasQuiz) {
          const passedAttempt = quizAttempts.find(
            (attempt: any) =>
              attempt.courseId === course._id.toString() &&
              attempt.chapterId === chapterId &&
              attempt.lessonId === lessonId &&
              attempt.passed === true
          );
          return !!passedAttempt;
        } else {
          return !!progress;
        }
      };

      const isLessonLocked = async (
        chapterId: string,
        lessonId: string,
        chapterIndex: number,
        lessonIndex: number,
        allLessons: any[]
      ) => {
        if (chapterIndex === 0 && lessonIndex <= 1) return false;

        if (lessonIndex > 0) {
          const prevLesson = allLessons[lessonIndex - 1];
          const prevHasQuiz = !!prevLesson.quizId || !!prevLesson.quiz;
          const prevCompleted = isLessonCompleted(
            chapterId,
            prevLesson._id.toString(),
            prevHasQuiz
          );

          if (!prevCompleted) return true;
        }

        if (chapterIndex > 0 && lessonIndex === 0) {
          const prevChapter = chapters[chapterIndex - 1];
          const prevLessons = await LessonsModel.model
            .find({
              chapterId: prevChapter._id,
              status: "active",
            })
            .populate("quiz")
            .sort({ createdAt: 1 });

          if (prevLessons.length > 0) {
            const lastPrevLesson: any = prevLessons[prevLessons.length - 1];
            const lastPrevHasQuiz =
              !!lastPrevLesson.quizId || !!lastPrevLesson.quiz;
            const lastPrevCompleted = isLessonCompleted(
              prevChapter._id.toString(),
              lastPrevLesson._id.toString(),
              lastPrevHasQuiz
            );

            if (!lastPrevCompleted) return true;
          }
        }

        return false;
      };

      const transformedChapters = await Promise.all(
        chapters.map(async (chapter: any, chapterIndex: number) => {
          const lessons = await LessonsModel.model
            .find({
              chapterId: chapter._id,
              status: "active",
            })
            .populate("quiz")
            .sort({ createdAt: 1 });

          const transformedLessons = await Promise.all(
            lessons.map(async (lesson: any, lessonIndex: number) => {
              const lessonData = lesson.toObject();

              const firstVideo =
                lessonData.videos && lessonData.videos.length > 0
                  ? lessonData.videos[0]
                  : null;

              const firstDocument =
                lessonData.documents && lessonData.documents.length > 0
                  ? lessonData.documents[0]
                  : null;

              const hasQuiz = !!lessonData.quizId || !!lessonData.quiz;

              const completed = isLessonCompleted(
                chapter._id.toString(),
                lesson._id.toString(),
                hasQuiz
              );

              const locked = await isLessonLocked(
                chapter._id.toString(),
                lesson._id.toString(),
                chapterIndex,
                lessonIndex,
                lessons
              );

              // Convert video URLs
              const convertedVideoUrl =
                await CourseController.convertMinioPathToUrl(
                  firstVideo?.videoUrl || null
                );

              // Convert thumbnail
              const convertedThumbnail =
                await CourseController.convertMinioPathToUrl(
                  firstVideo?.thumbnail || courseData.thumbnail || null
                );

              // Convert document URL
              const convertedDocumentUrl =
                await CourseController.convertMinioPathToUrl(
                  firstDocument?.fileUrl || null
                );

              // Convert videos array
              const convertedVideos = await Promise.all(
                (lessonData.videos || []).map(async (video: any) => ({
                  ...video,
                  videoUrl: await CourseController.convertMinioPathToUrl(
                    video.videoUrl
                  ),
                  thumbnail: await CourseController.convertMinioPathToUrl(
                    video.thumbnail
                  ),
                }))
              );

              // Convert documents array
              const convertedDocuments = await Promise.all(
                (lessonData.documents || []).map(async (doc: any) => ({
                  ...doc,
                  fileUrl: await CourseController.convertMinioPathToUrl(
                    doc.fileUrl
                  ),
                }))
              );

              return {
                _id: lessonData._id.toString(),
                title: lessonData.title,
                description: lessonData.description || "",
                descriptions: lessonData.description || "",
                type: lessonData.type || "video",
                order: lessonData.index || 0,
                videoUrl: convertedVideoUrl,
                documentUrl: convertedDocumentUrl,
                thumbnail: convertedThumbnail,
                duration: lessonData.duration || firstVideo?.duration || 0,
                videos: convertedVideos,
                documents: convertedDocuments,
                quizId: lessonData.quizId || null,
                quiz: lessonData.quiz || null,
                isPreview: lessonData.isPreview || false,
                content: lessonData.content || "",
                hasQuiz,
                isCompleted: completed,
                isLocked: locked,
              };
            })
          );

          return {
            _id: chapter._id.toString(),
            title: chapter.title,
            description: chapter.description || "",
            order: chapter.index || 0,
            lessons: transformedLessons,
          };
        })
      );

      courseData.chapters = transformedChapters;

      // Calculate course progress
      let totalLessons = 0;
      let completedLessons = 0;

      for (const chapter of transformedChapters) {
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
          totalLessons += chapter.lessons.length;
          completedLessons += chapter.lessons.filter(
            (lesson: any) => lesson.isCompleted === true
          ).length;
        }
      }

      const progressPercentage =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      // Add progress data to course
      courseData.progress = {
        totalLessons,
        completedLessons,
        progressPercentage,
        isCompleted: progressPercentage === 100,
      };

      // Calculate videoCount, documentCount, quizCount
      let totalVideoCount = 0;
      let totalDocumentCount = 0;

      for (const chapter of chapters) {
        const lessons = await LessonsModel.model.find({
          chapterId: chapter._id,
          status: "active",
        });

        for (const lesson of lessons) {
          const lessonData: any = lesson.toObject();

          if (lessonData.videos && Array.isArray(lessonData.videos)) {
            totalVideoCount += lessonData.videos.length;
          } else if (lessonData.type === "video" && lessonData.videoUrl) {
            totalVideoCount += 1;
          }

          if (lessonData.documents && Array.isArray(lessonData.documents)) {
            totalDocumentCount += lessonData.documents.length;
          } else if (lessonData.type === "document" && lessonData.documentUrl) {
            totalDocumentCount += 1;
          }
        }
      }

      const totalQuizCount = await QuizzesModel.countDocuments({
        courseId: course._id.toString(),
        status: "active",
      });

      courseData.videoCount = totalVideoCount;
      courseData.documentCount = totalDocumentCount;
      courseData.quizCount = totalQuizCount;

      sendSuccess(res, { course: courseData });
    } catch (error: any) {
      console.error('❌ Get my course by slug error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CourseController();
