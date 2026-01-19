import { sendError, sendSuccess } from "@libs/response";
import { Request, Response } from "express";
import { NoData } from "@libs/errors";
import CloudflareService from "@services/cloudflare";
import ChaptersModel from "@mongodb/chapters";
import mongoose from "mongoose";
import QuizzesModel from "@mongodb/quizzes";

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
    banner: {
      type: String,
      default: "",
    },
    introVideo: {
      type: String,
      default: null,
    },
    // Video metadata fields
    introVideoStatus: {
      type: String,
      enum: ["uploading", "queueing", "processing", "ready", "error"],
      default: "ready",
    },
    introVideoHlsUrl: {
      type: String,
      default: "",
    },
    introVideoQualityMetadata: {
      resolution: {
        type: String,
        default: "",
      },
      bitrate: {
        type: String,
        default: "",
      },
      codec: {
        type: String,
        default: "",
      },
      fps: {
        type: Number,
        default: 0,
      },
      segments: {
        type: Number,
        default: 0,
      },
    },
    introVideoThumbnail: {
      type: String,
      default: "",
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
   * Get all courses with full statistics
   * Includes isPurchased field if user is authenticated
   */
  public async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({ status: "active" }).sort({
        createdAt: -1,
      });

      const LessonsModel = (await import("@mongodb/lessons")).default;
      const QuizzesModel = (await import("@mongodb/quizzes")).default;
      const MongoDbUsers = (await import("@mongodb/users")).default;

      // Get user's courseRegister if authenticated
      const userId = (req as any).currentUser?._id;
      let userCourseRegister: string[] = [];
      let userCourseCompleted: string[] = [];
      if (userId) {
        try {
          const user = await MongoDbUsers.model.findById(userId.toString());
          if (user) {
            userCourseRegister = (user as any).courseRegister || [];
            userCourseCompleted = (user as any).courseCompleted || [];
          }
        } catch (error) {
          console.error("❌ Error getting user courseRegister:", error);
        }
      }

      const coursesWithStats = await Promise.all(
        courses.map(async (course: any) => {
          const courseData = course.toObject();
          const courseIdStr = course._id.toString();

          // Check if user has purchased this course
          const isPurchased = userCourseRegister.some(
            (id: string) => String(id) === courseIdStr || id === courseIdStr
          );
          const isCompleted = userCourseCompleted.some(
            (id: string) => String(id) === courseIdStr || id === courseIdStr
          );

          const chapters = await ChaptersModel.model.find({
            courseId: course._id,
            status: "active",
          });

          let totalVideoCount = 0;
          let totalDocumentCount = 0;
          let totalQuizCount = 0;

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
              } else if (
                lessonData.type === "document" &&
                lessonData.documentUrl
              ) {
                totalDocumentCount += 1;
              }

              // Đếm số lesson có quiz (type === 'quiz' hoặc có quizId)
              if (lessonData.type === 'quiz' || lessonData.quizId) {
                totalQuizCount += 1;
              }
            }
          }

          // Convert introVideo (15 phút expiry)
          const convertedIntroVideo = courseData.introVideo
            ? await CourseController.convertMinioPathToUrl(
                courseData.introVideo,
                true
              )
            : null;

          return {
            _id: courseData._id.toString(),
            title: courseData.title,
            slug: courseData.slug,
            description: courseData.description,
            shortDescription: courseData.shortDescription,
            thumbnail: courseData.thumbnail,
            introVideo: convertedIntroVideo,
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
            examCount: totalQuizCount, // Alias for consistency
            isPurchased: isPurchased, // Add purchase status
            isCompleted: isCompleted, // Add purchase status
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
          };
        })
      );

      // Sort courses: purchased & not completed -> not purchased -> purchased & completed
      // Tie-breaker: createdAt descending (newest first)
      coursesWithStats.sort((a: any, b: any) => {
        const rank = (c: any) => {
          if (c.isPurchased && !c.isCompleted) return 0;
          if (!c.isPurchased) return 1;
          return 2; // purchased && completed
        };

        const ra = rank(a);
        const rb = rank(b);
        if (ra === rb) {
          const at = new Date(a.createdAt).getTime() || 0;
          const bt = new Date(b.createdAt).getTime() || 0;
          return bt - at;
        }
        return ra - rb;
      });

      sendSuccess(res, { courses: coursesWithStats });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course by slug with modules and lessons
   * Includes progress tracking: isCompleted, isLocked for each lesson
   */
  public async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const userId =
        (req as any).currentUser?._id || (req as any).currentAdmin?._id;

      const course = await Course.findOne({ slug, status: "active" });

      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
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

      // Get user's progress and quiz attempts if authenticated
      const LessonProgress = mongoose.model("LessonProgress");
      const MongoDbQuizAttempts = (await import("@mongodb/quiz-attempts"))
        .default;
      const MongoDbUsers = (await import("@mongodb/users")).default;

      // Check if user has purchased this course
      let userHasPurchased = false;
      if (userId) {
        console.log("userIdsssss", userId);
        try {
          const user = await MongoDbUsers.model.findById(userId.toString());
          if (user) {
            const courseRegister = (user as any).courseRegister || [];
            console.log("courseRegistersssss", courseRegister);
            const courseIdStr = course._id.toString();
            userHasPurchased = courseRegister.some(
              (id: string) => String(id) == courseIdStr || id == courseIdStr
            );
          }
        } catch (error) {
          console.error("❌ Error checking courseRegister:", error);
        }
      }

      const [lessonProgressList, quizAttempts] = await Promise.all([
        userId
          ? LessonProgress.find({
              userId: userId.toString(),
              courseId: course._id.toString(),
            })
          : Promise.resolve([]),
        userId
          ? MongoDbQuizAttempts.find({
              userId: userId.toString(),
              courseId: course._id.toString(),
              status: "completed",
              passed: true,
            })
          : Promise.resolve([]),
      ]);

      const isLessonCompleted = (
        chapterId: string,
        lessonId: string,
        hasQuiz: boolean
      ) => {
        if (!userId) return false;

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
        allLessons: any[],
        lessonData: any
      ) => {
        // Preview lessons are always unlocked (for marketing)
        if (lessonData.isPreview) return false;

        // [getCourseBySlug] If user hasn't purchased the course, lock all non-preview lessons
        if (!userHasPurchased) {
          return true;
        }

        // If user has purchased, check sequential completion
        // First 2 lessons of first chapter are always unlocked
        if (chapterIndex === 0 && lessonIndex <= 1) return false;

        if (!userId) return true;

        // Check if previous lesson in same chapter is completed
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

        // Check if last lesson of previous chapter is completed
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

      // [getCourseBySlug PUBLIC API] Transform chapters - HIDE VIDEO URLs
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
                lessons,
                lessonData
              );

              // SECURITY: TẤT CẢ video (R2 và external) đều stream qua proxy để:
              // 1. Ẩn URL gốc khỏi download tools (Cốc Cốc, IDM)
              // 2. Giải quyết CORS issues
              // 3. Bảo mật tốt hơn
              const rawVideoUrl = firstVideo?.videoUrl || null;
              const hasVideo = !!rawVideoUrl;

              // Không trả về videoUrl trực tiếp - phải stream qua proxy
              const convertedVideoUrl: string | null = null;
              const needsProxy = hasVideo;

              // Convert thumbnail
              const convertedThumbnail =
                await CourseController.convertMinioPathToUrl(
                  firstVideo?.thumbnail || courseData.thumbnail || null,
                  false
                );

              // Convert document URL
              const convertedDocumentUrl =
                await CourseController.convertMinioPathToUrl(
                  firstDocument?.fileUrl || null,
                  false
                );

              // Convert videos array - Detect HLS và stream qua proxy
              const convertedVideos = await Promise.all(
                (lessonData.videos || []).map(async (video: any) => {
                  const rawUrl = video.videoUrl;
                  const hasVideo = !!rawUrl;

                  // Check if video is HLS format (.m3u8)
                  const isHls =
                    rawUrl &&
                    (rawUrl.endsWith(".m3u8") || rawUrl.includes(".m3u8"));

                  if (isHls) {
                    // HLS: Return HLS URL (will be streamed via proxy)
                    const hlsUrl = await CourseController.convertMinioPathToUrl(
                      rawUrl,
                      true
                    );
                    return {
                      ...video,
                      videoUrl: hlsUrl, // HLS URL - frontend will use hls.js
                      needsProxy: true, // Still use proxy for security
                      isHls: true, // Flag to indicate HLS format
                      thumbnail: await CourseController.convertMinioPathToUrl(
                        video.thumbnail,
                        false
                      ),
                    };
                  } else {
                    // MP4: Hide URL, use proxy
                    return {
                      ...video,
                      videoUrl: null, // Hidden - use proxy
                      needsProxy: hasVideo, // Tất cả video đều cần proxy
                      isHls: false,
                      thumbnail: await CourseController.convertMinioPathToUrl(
                        video.thumbnail,
                        false
                      ),
                    };
                  }
                })
              );

              // Convert documents array
              const convertedDocuments = await Promise.all(
                (lessonData.documents || []).map(async (doc: any) => ({
                  ...doc,
                  fileUrl: await CourseController.convertMinioPathToUrl(
                    doc.fileUrl,
                    false
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
                needsProxy, // Flag để frontend biết cần request qua proxy
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

      // Get completedAt from CourseProgress collection (set once when first completed)
      let courseCompletedAt = null;
      if (userId) {
        const CourseProgress = mongoose.model("CourseProgress");
        const courseProgressRecord = await CourseProgress.findOne({
          userId: userId.toString(),
          courseId: course._id.toString(),
        });
        courseCompletedAt = courseProgressRecord?.completedAt || null;
      }

      // Add progress data to course
      courseData.progress = {
        totalLessons,
        completedLessons,
        progressPercentage,
        isCompleted: progressPercentage === 100,
        completedAt: courseCompletedAt,
      };

      let totalVideoCount = 0;
      let totalDocumentCount = 0;
      let totalQuizCount = 0;

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

          // Đếm số lesson có quiz (type === 'quiz' hoặc có quizId)
          if (lessonData.type === 'quiz' || lessonData.quizId) {
            totalQuizCount += 1;
          }
        }
      }

      courseData.videoCount = totalVideoCount;
      courseData.documentCount = totalDocumentCount;
      courseData.quizCount = totalQuizCount;
      courseData.examCount = totalQuizCount; // Alias for consistency
      courseData.isPurchased = userHasPurchased; // Add purchase status

      // Convert introVideo (15 phút expiry)
      if (courseData.introVideo) {
        courseData.introVideo = await CourseController.convertMinioPathToUrl(
          courseData.introVideo,
          true // isVideo = true -> 15 min expiry
        );
      }

      sendSuccess(res, { course: courseData });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Convert MinIO path to full URL (presigned or public)
   * Video URLs có thời gian hết hạn ngắn (15 phút) để bảo mật
   */
  private static async convertMinioPathToUrl(
    path: string | null | undefined,
    isVideo: boolean = false
  ): Promise<string | null> {
    if (!path) return null;

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Normalize path: remove leading /vanphuccare-video-edu/ and fix double slashes
    let objectName = path.replace(/^\/vanphuccare-video-edu\//, "");
    // Fix double slashes (e.g., //images/ -> /images/)
    objectName = objectName.replace(/\/+/g, "/");
    // Remove leading slash if present
    objectName = objectName.replace(/^\//, "");

    try {
      // Video: 15 phút, Các file khác: 24 giờ
      const expirySeconds = isVideo ? 15 * 60 : 24 * 60 * 60;
      const fileUrl = await CloudflareService.getFileUrlWithFallback(
        objectName,
        false,
        expirySeconds
      );
      return fileUrl;
    } catch (error) {
      console.error("❌ Error converting MinIO path to URL:", path, error);
      return CloudflareService.getPublicUrl(objectName);
    }
  }

  /**
   * Get purchased course IDs for a user
   * Returns array of courseIds from completed orders
   */
  private static async getPurchasedCourseIds(
    userId: string
  ): Promise<string[]> {
    try {
      const orderSchema = new mongoose.Schema(
        {
          orderId: { type: String, required: true, unique: true },
          userId: { type: String, required: true },
          items: [
            {
              courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courses",
                required: true,
              },
              course: { type: Object, required: true },
              price: { type: Number, required: true },
            },
          ],
          status: {
            type: String,
            enum: [
              "pending",
              "processing",
              "completed",
              "cancelled",
              "refunded",
            ],
            default: "pending",
          },
          paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "cancelled"],
            default: "pending",
          },
        },
        { timestamps: true }
      );

      const OrderModel =
        mongoose.models.Order || mongoose.model("Order", orderSchema);

      const completedOrders = await OrderModel.find({
        userId: userId.toString(),
        status: "completed",
        paymentStatus: "completed",
      });

      const purchasedCourseIds = new Set<string>();

      completedOrders.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const courseId =
              item.courseId?.toString() || item.course?._id?.toString();
            if (courseId) {
              purchasedCourseIds.add(courseId);
            }
          });
        }
      });

      return Array.from(purchasedCourseIds);
    } catch (error: any) {
      console.error("❌ Error getting purchased course IDs:", error);
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
        return sendError(res, 400, "Unauthorized - User not authenticated");
      }

      const userId = currentUser._id?.toString() || currentUser.id?.toString();

      if (!userId) {
        return sendError(res, 400, "User ID not found");
      }

      const purchasedCourseIds = await CourseController.getPurchasedCourseIds(
        userId
      );

      if (purchasedCourseIds.length === 0) {
        return sendSuccess(res, { courses: [] });
      }

      // Aggregation: compute per-course progress (totalLessons, completedLessons, percentage, isCompleted) for the current user
      const purchasedObjectIds = purchasedCourseIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const userIdStr = userId.toString();

      const agg = await Course.aggregate([
        { $match: { _id: { $in: purchasedObjectIds }, status: "active" } },
        {
          $lookup: {
            from: "chapters",
            localField: "_id",
            foreignField: "courseId",
            as: "chapters",
          },
        },
        {
          $lookup: {
            from: "lessons",
            let: { chapterIds: "$chapters._id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$chapterId", "$$chapterIds"] },
                      { $eq: ["$status", "active"] },
                    ],
                  },
                },
              },
              { $project: { _id: 1 } },
            ],
            as: "lessons",
          },
        },
        {
          $lookup: {
            from: "lessonprogresses",
            let: { courseId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", userIdStr] },
                      { $eq: ["$courseId", { $toString: "$$courseId" }] },
                      { $eq: ["$completed", true] },
                    ],
                  },
                },
              },
              { $project: { lessonId: 1, _id: 0 } },
            ],
            as: "lessonProgresses",
          },
        },
        {
          $lookup: {
            from: "quiz_attempts",
            let: { courseId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", userIdStr] },
                      { $eq: ["$courseId", { $toString: "$$courseId" }] },
                      { $eq: ["$status", "completed"] },
                      { $eq: ["$passed", true] },
                    ],
                  },
                },
              },
              { $project: { lessonId: 1, _id: 0 } },
            ],
            as: "quizAttempts",
          },
        },
        {
          $addFields: {
            totalLessons: { $size: "$lessons" },
            completedLessonIds: {
              $setUnion: [
                {
                  $map: {
                    input: "$lessonProgresses",
                    as: "p",
                    in: "$$p.lessonId",
                  },
                },
                {
                  $map: { input: "$quizAttempts", as: "q", in: "$$q.lessonId" },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            completedLessons: { $size: "$completedLessonIds" },
          },
        },
        {
          $addFields: {
            progressPercentage: {
              $cond: [
                { $gt: ["$totalLessons", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$completedLessons", "$totalLessons"] },
                        100,
                      ],
                    },
                    0,
                  ],
                },
                0,
              ],
            },
          },
        },
        {
          $addFields: {
            isCompleted: {
              $cond: [{ $gte: ["$progressPercentage", 100] }, true, false],
            },
          },
        },
        {
          $project: {
            _id: 1,
            isCompleted: 1,
            progressPercentage: 1,
            completedLessons: 1,
            totalLessons: 1,
            createdAt: 1,
          },
        },
        { $sort: { isCompleted: 1, createdAt: -1 } },
      ]);

      const orderedCourseIds = agg.map((c: any) => c._id);
      const aggMap = new Map(agg.map((c: any) => [String(c._id), c]));

      const LessonsModel = (await import("@mongodb/lessons")).default;
      const QuizzesModel = (await import("@mongodb/quizzes")).default;

      // Fetch course docs (unordered) and preserve order using orderedCourseIds
      const courseDocs = await Course.find({ _id: { $in: orderedCourseIds } });
      const courseDocsById = new Map(
        courseDocs.map((c: any) => [String(c._id), c])
      );

      const coursesWithStats = await Promise.all(
        orderedCourseIds.map(async (orderedCourseId: any) => {
          const course: any = courseDocsById.get(String(orderedCourseId));
          if (!course) return null;
          const courseData = course.toObject();
          const courseId = course._id.toString();

          const chapters = await ChaptersModel.model.find({
            courseId: course._id,
            status: "active",
          });

          let totalVideoCount = 0;
          let totalDocumentCount = 0;
          let totalLessons = 0;
          let totalQuizCount = 0;
          let completedLessons = 0; // will be overridden by aggregation when available

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
              } else if (
                lessonData.type === "document" &&
                lessonData.documentUrl
              ) {
                totalDocumentCount += 1;
              }

              // Đếm số lesson có quiz (type === 'quiz' hoặc có quizId)
              if (lessonData.type === 'quiz' || lessonData.quizId) {
                totalQuizCount += 1;
              }

              totalLessons += 1;
            }
          }

          const progressPercentage =
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

          // Convert introVideo (15 phút expiry)
          const convertedIntroVideo = courseData.introVideo
            ? await CourseController.convertMinioPathToUrl(
                courseData.introVideo,
                true
              )
            : null;

          return {
            _id: courseData._id.toString(),
            title: courseData.title,
            slug: courseData.slug,
            description: courseData.description,
            shortDescription: courseData.shortDescription,
            thumbnail: courseData.thumbnail,
            banner: courseData.banner || '',
            introVideo: convertedIntroVideo,
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
              totalLessons: aggMap.get(courseId)?.totalLessons ?? totalLessons,
              completedLessons:
                aggMap.get(courseId)?.completedLessons ?? completedLessons,
              progressPercentage:
                aggMap.get(courseId)?.progressPercentage ?? progressPercentage,
              isCompleted:
                aggMap.get(courseId)?.isCompleted ??
                (aggMap.get(courseId)?.progressPercentage ??
                  progressPercentage) === 100,
            },

            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
          };
        })
      );

      // courses are already ordered by aggregation (incomplete first, then completed; ties by createdAt desc)
      sendSuccess(res, { courses: coursesWithStats });
    } catch (error: any) {
      console.error("❌ Get my courses error:", error);
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
        return sendError(res, 401, "Unauthorized - User not authenticated");
      }

      const userId = currentUser._id?.toString() || currentUser.id?.toString();

      if (!userId) {
        return sendError(res, 400, "User ID not found");
      }

      // Get course by slug
      const course = await Course.findOne({ slug, status: "active" });

      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      // Check if user has purchased this course
      const purchasedCourseIds = await CourseController.getPurchasedCourseIds(
        userId
      );
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
        allLessons: any[],
        lessonData: any
      ) => {
        // Preview lessons are always unlocked
        if (lessonData.isPreview) return false;

        // [getMyCourseBySlug] User has already purchased, so only check sequential completion
        // First 2 lessons of first chapter are always unlocked
        if (chapterIndex === 0 && lessonIndex <= 1) return false;

        // Check if previous lesson in same chapter is completed
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

        // Check if last lesson of previous chapter is completed
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
                lessons,
                lessonData
              );

              // SECURITY: TẤT CẢ video (R2 và external) đều stream qua proxy để:
              // 1. Ẩn URL gốc khỏi download tools (Cốc Cốc, IDM)
              // 2. Giải quyết CORS issues
              // 3. Bảo mật tốt hơn
              const rawVideoUrl = firstVideo?.videoUrl || null;
              const hasVideo = !!rawVideoUrl;

              // Không trả về videoUrl trực tiếp - phải stream qua proxy
              const convertedVideoUrl: string | null = null;
              const needsProxy = hasVideo;

              // Convert thumbnail
              const convertedThumbnail =
                await CourseController.convertMinioPathToUrl(
                  firstVideo?.thumbnail || courseData.thumbnail || null,
                  false
                );

              // Convert document URL
              const convertedDocumentUrl =
                await CourseController.convertMinioPathToUrl(
                  firstDocument?.fileUrl || null,
                  false
                );

              // Convert videos array - Detect HLS và stream qua proxy
              const convertedVideos = await Promise.all(
                (lessonData.videos || []).map(async (video: any) => {
                  const rawUrl = video.videoUrl;
                  const hasVideo = !!rawUrl;

                  // Check if video is HLS format (.m3u8)
                  const isHls =
                    rawUrl &&
                    (rawUrl.endsWith(".m3u8") || rawUrl.includes(".m3u8"));

                  if (isHls) {
                    // HLS: Return HLS URL (will be streamed via proxy)
                    const hlsUrl = await CourseController.convertMinioPathToUrl(
                      rawUrl,
                      true
                    );
                    return {
                      ...video,
                      videoUrl: hlsUrl, // HLS URL - frontend will use hls.js
                      needsProxy: true, // Still use proxy for security
                      isHls: true, // Flag to indicate HLS format
                      thumbnail: await CourseController.convertMinioPathToUrl(
                        video.thumbnail,
                        false
                      ),
                    };
                  } else {
                    // MP4: Hide URL, use proxy
                    return {
                      ...video,
                      videoUrl: null, // Hidden - use proxy
                      needsProxy: hasVideo, // Tất cả video đều cần proxy
                      isHls: false,
                      thumbnail: await CourseController.convertMinioPathToUrl(
                        video.thumbnail,
                        false
                      ),
                    };
                  }
                })
              );

              // Convert documents array
              const convertedDocuments = await Promise.all(
                (lessonData.documents || []).map(async (doc: any) => ({
                  ...doc,
                  fileUrl: await CourseController.convertMinioPathToUrl(
                    doc.fileUrl,
                    false
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
                needsProxy, // Flag để frontend biết cần request qua proxy
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

      // Get completedAt from CourseProgress collection (set once when first completed)
      const CourseProgress = mongoose.model("CourseProgress");
      const courseProgressRecord = await CourseProgress.findOne({
        userId: userId.toString(),
        courseId: course._id.toString(),
      });

      // Add progress data to course
      courseData.progress = {
        totalLessons,
        completedLessons,
        progressPercentage,
        isCompleted: progressPercentage === 100,
        completedAt: courseProgressRecord?.completedAt || null,
      };

      // Calculate videoCount, documentCount, quizCount
      let totalVideoCount = 0;
      let totalDocumentCount = 0;
      let totalQuizCount = 0;

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

          // Đếm số lesson có quiz (type === 'quiz' hoặc có quizId)
          if (lessonData.type === 'quiz' || lessonData.quizId) {
            totalQuizCount += 1;
          }
        }
      }

      courseData.videoCount = totalVideoCount;
      courseData.documentCount = totalDocumentCount;
      courseData.quizCount = totalQuizCount;

      // Convert introVideo (15 phút expiry)
      if (courseData.introVideo) {
        courseData.introVideo = await CourseController.convertMinioPathToUrl(
          courseData.introVideo,
          true // isVideo = true -> 15 min expiry
        );
      }

      sendSuccess(res, { course: courseData });
    } catch (error: any) {
      console.error("❌ Get my course by slug error:", error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}
export default new CourseController();
