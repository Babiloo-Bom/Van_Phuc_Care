import { sendError, sendSuccess } from "@libs/response";
import { Request, Response } from "express";
import mongoose from "mongoose";
import ChaptersModel from "@mongodb/chapters";
import LessonsModel from "@mongodb/lessons";
import QuizzesModel from "@mongodb/quizzes";
import MinioService from "@services/minio";
import CloudflareService from "@services/cloudflare"; // Thêm import này
import { coursesData } from "../../../constants/courses-data-seed";
// Course schema for E-Learning
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
      default: '',
    },
    introVideo: {
      type: String,
      default: null,
    },
    // Video metadata fields
    introVideoStatus: {
      type: String,
      enum: ['uploading', 'queueing', 'processing', 'ready', 'error'],
      default: 'ready',
    },
    introVideoHlsUrl: {
      type: String,
      default: '',
    },
    introVideoQualityMetadata: {
      resolution: {
        type: String,
        default: '',
      },
      bitrate: {
        type: String,
        default: '',
      },
      codec: {
        type: String,
        default: '',
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
      default: '',
    },
    introVideoJobId: {
      type: String,
      default: '',
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
      specialization: {
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

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    if (path.startsWith("/van-phuc-care/")) {
      try {
        const objectName = path.replace(/^\/van-phuc-care\//, "");

        const fileUrl = await MinioService.getFileUrlWithFallback(
          objectName,
          false,
          7 * 24 * 60 * 60
        );
        return fileUrl;
      } catch (error) {
        console.error("❌ Error converting MinIO path to URL:", path, error);
        const objectName = path.replace(/^\/van-phuc-care\//, "");
        return MinioService.getPublicUrl(objectName);
      }
    }

    return path;
  }
  /**
   * Get all courses with full statistics
   */
  public static async getAllCourses(req: Request, res: Response) {
    try {
      // Pagination
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const offset = (page - 1) * limit;

      // Filters
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const query: any = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
          { title: regex },
          { slug: regex },
          { description: regex },
          { shortDescription: regex },
          { category: regex },
          { 'instructor.name': regex },
          { tags: regex },
        ];
      }

      // Lấy dữ liệu + tổng số bản ghi
      const [courses, total] = await Promise.all([
        Course.find(query)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit),
        Course.countDocuments(query),
      ]);

      const LessonsModel = (await import('@mongodb/lessons')).default;
      const QuizzesModel = (await import('@mongodb/quizzes')).default;

      const coursesWithStats = await Promise.all(
        courses.map(async (course: any) => {
          const courseData = course.toObject();

          const chapters = await ChaptersModel.model.find({
            courseId: course._id,
            status: 'active',
          });

          let totalVideoCount = 0;
          let totalDocumentCount = 0;

          for (const chapter of chapters) {
            const lessons = await LessonsModel.model.find({
              chapterId: chapter._id,
              status: 'active',
            });

            for (const lesson of lessons) {
              const lessonData: any = lesson.toObject();

              if (lessonData.videos && Array.isArray(lessonData.videos)) {
                totalVideoCount += lessonData.videos.length;
              } else if (lessonData.type === 'video' && lessonData.videoUrl) {
                totalVideoCount += 1;
              }

              if (lessonData.documents && Array.isArray(lessonData.documents)) {
                totalDocumentCount += lessonData.documents.length;
              } else if (
                lessonData.type === 'document' &&
                lessonData.documentUrl
              ) {
                totalDocumentCount += 1;
              }
            }
          }

          const totalQuizCount = await QuizzesModel.countDocuments({
            courseId: course._id.toString(),
            status: 'active',
          });

          return {
            _id: courseData._id.toString(),
            title: courseData.title,
            slug: courseData.slug,
            description: courseData.description,
            shortDescription: courseData.shortDescription,
            thumbnail: courseData.thumbnail,
            banner: courseData.banner || '',
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
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
          };
        }),
      );

      // Format trả về khớp với admin-vpc-v3/pages/elearning/courses/index.vue
      sendSuccess(res, {
        data: {
          courses: coursesWithStats,
          pagination: {
            page,
            pageSize: limit,
            total,
          },
        },
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course by slug with modules and lessons
   * Includes progress tracking: isCompleted, isLocked for each lesson
   * Also supports getting by ID if the slug is a valid ObjectId
   */
  public static async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const userId =
        (req as any).currentUser?._id || (req as any).currentAdmin?._id;
      
      // Kiểm tra xem slug có phải là ObjectId hợp lệ không
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
      
      let course: any;
      if (isObjectId) {
        // Nếu là ObjectId, tìm theo ID
        course = await Course.findById(slug);
      } else {
        // Nếu không phải ObjectId, tìm theo slug
        course = await Course.findOne({ slug, status: "active" });
      }

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
        allLessons: any[]
      ) => {
        if (chapterIndex === 0 && lessonIndex <= 1) return false;

        if (!userId) return true;

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
          // Get all lessons for this chapter, then deduplicate by _id
          // This prevents duplicate lessons from appearing (in case of data inconsistency)
          const allLessons = await LessonsModel.model
            .find({
              chapterId: chapter._id,
              status: "active",
            })
            .populate("quiz")
            .sort({ createdAt: 1 });
          
          // Deduplicate lessons by _id (keep the most recent one if duplicates exist)
          const lessonMap = new Map();
          for (const lesson of allLessons) {
            const lessonId = lesson._id.toString();
            const lessonData = lesson as any;
            if (!lessonMap.has(lessonId)) {
              lessonMap.set(lessonId, lesson);
            } else {
              // If duplicate exists, keep the one with later createdAt
              const existing = lessonMap.get(lessonId) as any;
              const existingCreatedAt = existing?.createdAt || new Date(0);
              const lessonCreatedAt = lessonData?.createdAt || new Date(0);
              if (lessonCreatedAt > existingCreatedAt) {
                lessonMap.set(lessonId, lesson);
              }
            }
          }
          
          const lessons = Array.from(lessonMap.values());

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
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course by ID
   */
  public static async getCourseById(req: Request, res: Response) {
    try {
      // Đọc từ cả id và slug (vì route có thể truyền slug nhưng là ObjectId)
      const id = (req.params as any).id || (req.params as any).slug;
      
      if (!id) {
        return sendError(res, 400, "ID hoặc slug không được cung cấp");
      }
      
      // Kiểm tra xem id có phải là ObjectId hợp lệ không
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      
      let course: any;
      if (isObjectId) {
        // Tìm theo ID
        course = await Course.findById(id);
      } else {
        // Tìm theo slug
        course = await Course.findOne({ slug: id });
      }

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
      const QuizzesModel = (await import("@mongodb/quizzes")).default;

      const chaptersWithLessons = await Promise.all(
        chapters.map(async (chapter: any) => {
          // Get all lessons for this chapter, then deduplicate by _id
          const allLessons = await LessonsModel.model
            .find({
              chapterId: chapter._id,
              status: "active",
            })
            .sort({ index: 1 });
          
          // Deduplicate lessons by _id (keep the most recent one if duplicates exist)
          const lessonMap = new Map();
          for (const lesson of allLessons) {
            const lessonId = lesson._id.toString();
            const lessonData = lesson as any;
            if (!lessonMap.has(lessonId)) {
              lessonMap.set(lessonId, lesson);
            } else {
              // If duplicate exists, keep the one with later createdAt
              const existing = lessonMap.get(lessonId) as any;
              const existingCreatedAt = existing?.createdAt || new Date(0);
              const lessonCreatedAt = lessonData?.createdAt || new Date(0);
              if (lessonCreatedAt > existingCreatedAt) {
                lessonMap.set(lessonId, lesson);
              }
            }
          }
          
          const lessons = Array.from(lessonMap.values());

          const lessonsWithQuiz = await Promise.all(
            lessons.map(async (lesson: any) => {
              const lessonData: any = lesson.toObject();
              
              // Get quiz if exists
              if (lessonData.quizId) {
                const quiz = await QuizzesModel.findById(lessonData.quizId);
                lessonData.quiz = quiz ? quiz.toObject() : null;
              } else {
                lessonData.quiz = null;
              }

              return lessonData;
            })
          );

          return {
            _id: chapter._id.toString(),
            title: chapter.title,
            description: chapter.description || "",
            index: chapter.index || 0,
            status: chapter.status || "active",
            lessons: lessonsWithQuiz,
          };
        })
      );

      const courseData = course.toObject();
      courseData.chapters = chaptersWithLessons;

      sendSuccess(res, { course: courseData });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Create new course
   */
  public static async createCourse(req: Request, res: Response) {
    try {
      const courseData = req.body;

      // Check if course with same slug exists
      const existingCourse = await Course.findOne({ slug: courseData.slug });
      if (existingCourse) {
        return sendError(res, 400, "Khóa học với slug này đã tồn tại");
      }

      const course = await Course.create(courseData);
      let chapters = [];
      let totalLessons = 0;
      let totalQuizzes = 0;

      if (Array.isArray(req.body.chapters)) {
        for (const [idx, chapter] of req.body.chapters.entries()) {
          const newChapter = await ChaptersModel.model.create({
            courseId: course._id,
            title: chapter.title,
            description: chapter.description || "",
            index: typeof chapter.index === "number" ? chapter.index : idx,
            status: chapter.status || "active",
          });
          chapters.push(newChapter);

          // Tạo lessons cho chapter này
          if (Array.isArray(chapter.lessons) && chapter.lessons.length > 0) {
            for (const lessonData of chapter.lessons) {
              const lesson = await LessonsModel.model.create({
                chapterId: newChapter._id,
                quizId: null,
                title: lessonData.title,
                description: lessonData.description || "",
                content: lessonData.content || "",
                type: lessonData.type || "video",
                isPreview: lessonData.isPreview || false,
                videos: lessonData.videos || [],
                documents: lessonData.documents || [],
                duration: lessonData.duration || 0,
                status: lessonData.status || "active",
              });

              totalLessons++;

              // Tạo quiz nếu có
              if (lessonData.quizData) {
                const quizData = typeof lessonData.quizData === 'string' 
                  ? JSON.parse(lessonData.quizData) 
                  : lessonData.quizData;

                const quiz = await QuizzesModel.create({
                  courseId: course._id.toString(),
                  chapterId: newChapter._id.toString(),
                  lessonId: lesson._id.toString(),
                  title: quizData.title || 'Quiz',
                  description: quizData.description || "",
                  questions: quizData.questions || [],
                  passingScore: quizData.passingScore || 80,
                  timeLimit: quizData.timeLimit || 0,
                  attempts: quizData.attempts || 3,
                  status: "active",
                });

                // Update lesson with quizId
                await LessonsModel.model.findByIdAndUpdate(lesson._id, {
                  quizId: quiz._id,
                });

                totalQuizzes++;
              }
            }
          }
        }
      }

      // Update course với số lượng lessons
      await Course.findByIdAndUpdate(course._id, {
        lessons: totalLessons,
      });

      if (chapters.length > 0) {
        sendSuccess(res, { 
          course, 
          chapters,
          summary: {
            chapters: chapters.length,
            lessons: totalLessons,
            quizzes: totalQuizzes,
          }
        });
      } else {
        sendSuccess(res, { course });
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update course
   */
  public static async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`🔍 [Update Course] ========== START UPDATE COURSE ==========`);
      console.log(`🔍 [Update Course] Request body chapters:`, req.body.chapters ? `${req.body.chapters.length} chapters` : 'NO CHAPTERS');
      console.log(`🔍 [Update Course] Instructor data:`, JSON.stringify(req.body.instructor, null, 2));

      // Ensure instructor object is properly structured if provided
      if (req.body.instructor) {
        updateData.instructor = {
          name: req.body.instructor.name || '',
          avatar: req.body.instructor.avatar || '',
          bio: req.body.instructor.bio || '',
          specialization: req.body.instructor.specialization || '',
        };
      }

      const course = await Course.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      let chapters = [];
      let totalLessons = 0;
      let totalQuizzes = 0;

      // Lấy tất cả chapters hiện tại của course để so sánh
      const existingChapters = await ChaptersModel.model.find({ courseId: id });
      const existingChapterIds = new Set(existingChapters.map((ch: any) => ch._id.toString()));
      
      console.log(`🔍 [Update Course] Course ID: ${id}`);
      console.log(`🔍 [Update Course] Existing chapters count: ${existingChapters.length}`);
      console.log(`🔍 [Update Course] Existing chapter IDs:`, Array.from(existingChapterIds));
      
      // Tập hợp các chapter IDs được gửi lên (có _id)
      const requestedChapterIds = new Set<string>();
      let hasChaptersWithId = false;
      if (Array.isArray(req.body.chapters)) {
        console.log(`🔍 [Update Course] Request chapters count: ${req.body.chapters.length}`);
        for (const chapter of req.body.chapters) {
          // Convert _id to string (có thể là ObjectId hoặc string)
          let chapterIdStr = null;
          if (chapter._id) {
            if (typeof chapter._id === 'object' && chapter._id.toString) {
              chapterIdStr = chapter._id.toString();
            } else if (typeof chapter._id === 'string') {
              chapterIdStr = chapter._id;
            }
          }
          
          console.log(`🔍 [Update Course] Chapter in request:`, {
            _id: chapter._id,
            _idType: typeof chapter._id,
            _idString: chapterIdStr,
            title: chapter.title,
            hasId: !!chapter._id
          });
          
          if (chapterIdStr) {
            requestedChapterIds.add(chapterIdStr);
            hasChaptersWithId = true;
          }
        }
        console.log(`🔍 [Update Course] Requested chapter IDs:`, Array.from(requestedChapterIds));
        console.log(`🔍 [Update Course] Has chapters with ID: ${hasChaptersWithId}`);
      } else {
        console.log(`⚠️ [Update Course] req.body.chapters is not an array:`, typeof req.body.chapters, req.body.chapters);
      }

      // Xóa những chapters không có trong request
      // Logic: 
      // - Nếu request có chapters với _id: Xóa các chapters không có trong request
      // - Nếu request có chapters nhưng không có _id (tạo mới): Không xóa (tránh xóa nhầm)
      // - Nếu request không có chapters (mảng rỗng): Xóa tất cả chapters cũ (user đã xóa hết)
      const shouldDeleteChapters = 
        (hasChaptersWithId && existingChapters.length > 0) || // Có chapters với _id, xóa những cái không có trong request
        (Array.isArray(req.body.chapters) && req.body.chapters.length === 0 && existingChapters.length > 0); // Request rỗng = user xóa hết
      
      console.log(`🔍 [Update Course] Will delete chapters? shouldDeleteChapters=${shouldDeleteChapters}, hasChaptersWithId=${hasChaptersWithId}, requestChaptersLength=${Array.isArray(req.body.chapters) ? req.body.chapters.length : 'N/A'}, existingChapters.length=${existingChapters.length}`);
      if (shouldDeleteChapters) {
        console.log(`✅ [Update Course] Starting to delete chapters...`);
        for (const existingChapter of existingChapters) {
          const chapterData = existingChapter as any;
          const chapterId = chapterData._id.toString();
          if (!requestedChapterIds.has(chapterId)) {
            console.log(`🗑️ [Update Course] Chapter to delete: ${chapterId} (${chapterData.title || 'No title'})`);
            // Xóa tất cả lessons của chapter này
            const lessonsToDelete = await LessonsModel.model.find({ chapterId: chapterData._id });
            for (const lesson of lessonsToDelete) {
              const lessonData = lesson as any;
              
              // Xóa folder HLS và thumbnails của videos trong lesson
              if (lessonData.videos && Array.isArray(lessonData.videos)) {
                const hlsFoldersToDelete = new Set<string>();
                const thumbnailFoldersToDelete = new Set<string>();
                
                for (const video of lessonData.videos) {
                  if (video.videoUrl || video.hlsUrl) {
                    const videoUrl = video.hlsUrl || video.videoUrl;
                    const hlsFolder = CloudflareService.extractHlsFolderFromUrl(videoUrl);
                    if (hlsFolder) {
                      hlsFoldersToDelete.add(hlsFolder);
                      
                      // Extract thumbnail folder from HLS folder
                      // HLS folder: "courses/lessons/{timestamp}/hls"
                      // Thumbnail folder: "courses/lessons/{timestamp}/thumbnails"
                      const thumbnailFolder = hlsFolder.replace('/hls', '/thumbnails');
                      thumbnailFoldersToDelete.add(thumbnailFolder);
                    }
                  }
                  
                  // Also try to extract thumbnail folder from thumbnail URL if exists
                  if (video.thumbnail) {
                    try {
                      let thumbnailPath = video.thumbnail;
                      if (thumbnailPath.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                        thumbnailPath = thumbnailPath.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                      }
                      
                      // Extract folder path (remove filename)
                      const lastSlash = thumbnailPath.lastIndexOf('/');
                      if (lastSlash > 0) {
                        const thumbnailFolder = thumbnailPath.substring(0, lastSlash);
                        thumbnailFoldersToDelete.add(thumbnailFolder);
                      }
                    } catch (err) {
                      console.warn('⚠️ Error extracting thumbnail folder from URL:', err);
                    }
                  }
                }
                
                // Xóa toàn bộ folder HLS
                for (const hlsFolder of hlsFoldersToDelete) {
                  try {
                    await CloudflareService.deleteFilesByPrefix(hlsFolder);
                    console.log(`✅ [Delete Chapter] Deleted HLS folder: ${hlsFolder}`);
                  } catch (err) {
                    console.error(`❌ [Delete Chapter] Error deleting HLS folder ${hlsFolder}:`, err);
                  }
                }
                
                // Xóa toàn bộ folder thumbnails
                for (const thumbnailFolder of thumbnailFoldersToDelete) {
                  try {
                    await CloudflareService.deleteFilesByPrefix(thumbnailFolder);
                    console.log(`✅ [Delete Chapter] Deleted thumbnail folder: ${thumbnailFolder}`);
                  } catch (err) {
                    console.error(`❌ [Delete Chapter] Error deleting thumbnail folder ${thumbnailFolder}:`, err);
                  }
                }
              }
              
              // Xóa documents từ R2
              if (lessonData.documents && Array.isArray(lessonData.documents)) {
                for (const doc of lessonData.documents) {
                  if (doc.fileUrl) {
                    try {
                      const url = doc.fileUrl;
                      let objectName = '';
                      
                      if (url.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                        objectName = url.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                      } else if (url.includes('/')) {
                        const urlParts = url.split('/');
                        const coursesIndex = urlParts.findIndex((part: string) => part === 'courses' || part === 'lessons');
                        if (coursesIndex !== -1) {
                          objectName = urlParts.slice(coursesIndex).join('/');
                        }
                      }
                      
                      if (objectName) {
                        await CloudflareService.deleteFile(objectName);
                        console.log(`✅ Deleted document: ${objectName}`);
                      }
                    } catch (err) {
                      console.error('❌ Error deleting document from R2:', err);
                    }
                  }
                }
              }
              
              // Xóa quiz nếu có
              if (lessonData.quizId) {
                try {
                  await QuizzesModel.findByIdAndDelete(lessonData.quizId);
                  console.log(`✅ Deleted quiz: ${lessonData.quizId}`);
                } catch (err) {
                  console.error(`❌ Error deleting quiz ${lessonData.quizId}:`, err);
                }
              }
              
              // Xóa lesson từ database
              await LessonsModel.model.findByIdAndDelete(lesson._id);
              console.log(`✅ Deleted lesson: ${lesson._id}`);
            }
            
            // Xóa chapter
            await ChaptersModel.model.findByIdAndDelete(chapterData._id);
            console.log(`✅ [Update Course] Deleted chapter: ${chapterData._id} (${chapterData.title || 'No title'})`);
          } else {
            console.log(`⏭️ [Update Course] Keeping chapter: ${chapterId} (${chapterData.title || 'No title'})`);
          }
        }
        console.log(`✅ [Update Course] Finished deleting chapters`);
      } else {
        console.log(`⏭️ [Update Course] Skipping chapter deletion - hasChaptersWithId=${hasChaptersWithId}, existingChapters.length=${existingChapters.length}`);
      }

      if (Array.isArray(req.body.chapters)) {
        for (const [idx, chapter] of req.body.chapters.entries()) {
          let updatedChapter;
          
          if (chapter._id) {
            // Update existing chapter
            updatedChapter = await ChaptersModel.model.findByIdAndUpdate(
              chapter._id,
              {
                title: chapter.title,
                description: chapter.description || "",
                index: typeof chapter.index === "number" ? chapter.index : idx,
                status: chapter.status || "active",
              },
              { new: true }
            );
            if (updatedChapter) chapters.push(updatedChapter);
          } else {
            // Create new chapter
            updatedChapter = await ChaptersModel.model.create({
              courseId: course._id,
              title: chapter.title,
              description: chapter.description || "",
              index: typeof chapter.index === "number" ? chapter.index : idx,
              status: chapter.status || "active",
            });
            chapters.push(updatedChapter);
          }

          // Xử lý lessons cho chapter
          if (updatedChapter && Array.isArray(chapter.lessons)) {
            // Collect lesson IDs from request to keep existing lessons
            const lessonIdsToKeep = new Set<string>();
            let hasLessonsWithoutId = false;
            for (const lessonData of chapter.lessons) {
              if (lessonData._id) {
                lessonIdsToKeep.add(lessonData._id.toString());
              } else {
                hasLessonsWithoutId = true;
              }
            }
            
            // DISABLED: Không tự động xóa lessons khi update course
            // Chỉ update/create lessons, không xóa để tránh xóa nhầm khi server khởi động hoặc request không đầy đủ
            // Nếu cần xóa lessons, phải gọi API delete riêng hoặc xóa thủ công
            // if (chapter._id && !hasLessonsWithoutId && lessonIdsToKeep.size > 0) {
            //   const oldLessons = await LessonsModel.model.find({ chapterId: updatedChapter._id });
            //   for (const oldLesson of oldLessons) {
            //     const oldLessonId = oldLesson._id.toString();
            //     
            //     // Nếu lesson vẫn còn trong request, skip (sẽ được update sau)
            //     if (lessonIdsToKeep.has(oldLessonId)) {
            //       continue;
            //     }
            //     
            //     // Lesson bị xóa - xóa HLS folders và lesson
            //     const lessonData = oldLesson as any;
            //     
            //     // Xóa folder HLS của videos trong lesson bị xóa
            //     if (lessonData.videos && Array.isArray(lessonData.videos)) {
            //       const hlsFoldersToDelete = new Set<string>();
            //       
            //       for (const video of lessonData.videos) {
            //         if (video.videoUrl || video.hlsUrl) {
            //           const videoUrl = video.hlsUrl || video.videoUrl;
            //           const hlsFolder = CloudflareService.extractHlsFolderFromUrl(videoUrl);
            //           if (hlsFolder) {
            //             hlsFoldersToDelete.add(hlsFolder);
            //           }
            //         }
            //       }
            //       
            //       // Xóa toàn bộ folder HLS của lesson bị xóa
            //       for (const hlsFolder of hlsFoldersToDelete) {
            //         try {
            //           await CloudflareService.deleteFilesByPrefix(hlsFolder);
            //         } catch (err) {
            //           console.error(`Error deleting HLS folder ${hlsFolder}:`, err);
            //         }
            //       }
            //     }
            //     
            //     // Xóa quiz nếu có
            //     if (lessonData.quizId) {
            //       await QuizzesModel.findByIdAndDelete(lessonData.quizId);
            //     }
            //     
            //     // Xóa lesson từ database
            //     await LessonsModel.model.findByIdAndDelete(oldLesson._id);
            //   }
            // }

            // Tạo lessons mới hoặc update lessons đã có
            for (const lessonData of chapter.lessons) {
              // Validate và clean videos data
              let validVideos = [];
              if (Array.isArray(lessonData.videos)) {
                validVideos = lessonData.videos.map((video: any) => {
                  // Đảm bảo video có đầy đủ các trường cần thiết
                  const validVideo: any = {
                    title: video.title || '',
                    videoUrl: video.videoUrl || video.hlsUrl || '',
                    thumbnail: video.thumbnail || '',
                    duration: video.duration || 0,
                    fileSize: video.fileSize || 0,
                    quality: video.quality || '720',
                    index: video.index || 0,
                    status: video.status || 'uploading',
                    hlsUrl: video.hlsUrl || '',
                    qualityMetadata: video.qualityMetadata || {
                      resolution: '',
                      bitrate: '',
                      codec: '',
                      fps: 0,
                      segments: 0,
                    },
                    errorMessage: video.errorMessage || '',
                    jobId: video.jobId || '', // Store jobId to allow auto-update from worker
                  };
                  
                  // Nếu status là "ready" nhưng không có videoUrl hoặc hlsUrl, đặt status là "error"
                  if (validVideo.status === 'ready' && !validVideo.videoUrl && !validVideo.hlsUrl) {
                    validVideo.status = 'error';
                    validVideo.errorMessage = 'Video URL is missing';
                  }
                  
                  return validVideo;
                });
              }

              let lesson;
              
              // Nếu lesson đã có _id, update thay vì tạo mới
              if (lessonData._id) {
                
                // Get existing lesson để so sánh videos
                const existingLesson = await LessonsModel.model.findById(lessonData._id);
                if (existingLesson) {
                  const existingLessonData = existingLesson as any;
                  
                  // Xóa HLS folders của videos bị thay thế (không còn trong validVideos)
                  if (existingLessonData.videos && Array.isArray(existingLessonData.videos)) {
                    const existingVideoUrls = new Set(
                      validVideos
                        .map((v: any) => v.hlsUrl || v.videoUrl)
                        .filter((url: string) => url)
                    );
                    
                    const hlsFoldersToDelete = new Set<string>();
                    for (const oldVideo of existingLessonData.videos) {
                      const oldVideoUrl = oldVideo.hlsUrl || oldVideo.videoUrl;
                      // Nếu video cũ không còn trong danh sách mới, xóa folder HLS
                      if (oldVideoUrl && !existingVideoUrls.has(oldVideoUrl)) {
                        const hlsFolder = CloudflareService.extractHlsFolderFromUrl(oldVideoUrl);
                        if (hlsFolder) {
                          hlsFoldersToDelete.add(hlsFolder);
                        }
                      }
                    }
                    
                    // Xóa HLS folders của videos bị thay thế
                    for (const hlsFolder of hlsFoldersToDelete) {
                      try {
                        await CloudflareService.deleteFilesByPrefix(hlsFolder);
                      } catch (err) {
                        console.error(`Error deleting HLS folder ${hlsFolder}:`, err);
                      }
                    }
                  }
                }
                
                // Update lesson
                lesson = await LessonsModel.model.findByIdAndUpdate(
                  lessonData._id,
                  {
                    chapterId: updatedChapter._id,
                    title: lessonData.title,
                    description: lessonData.description || "",
                    content: lessonData.content || "",
                    type: lessonData.type || "video",
                    isPreview: lessonData.isPreview || false,
                    videos: validVideos,
                    documents: lessonData.documents || [],
                    duration: lessonData.duration || 0,
                    status: lessonData.status || "active",
                  },
                  { new: true }
                );
                
                if (!lesson) {
                  console.error(`❌ [Course Update] Failed to update lesson: ${lessonData._id}`);
                  // Fallback: create new lesson
                  lesson = await LessonsModel.model.create({
                    chapterId: updatedChapter._id,
                    quizId: null,
                    title: lessonData.title,
                    description: lessonData.description || "",
                    content: lessonData.content || "",
                    type: lessonData.type || "video",
                    isPreview: lessonData.isPreview || false,
                    videos: validVideos,
                    documents: lessonData.documents || [],
                    duration: lessonData.duration || 0,
                    status: lessonData.status || "active",
                  });
                }
              } else {
                // Tạo lesson mới
                lesson = await LessonsModel.model.create({
                  chapterId: updatedChapter._id,
                  quizId: null,
                  title: lessonData.title,
                  description: lessonData.description || "",
                  content: lessonData.content || "",
                  type: lessonData.type || "video",
                  isPreview: lessonData.isPreview || false,
                  videos: validVideos,
                  documents: lessonData.documents || [],
                  duration: lessonData.duration || 0,
                  status: lessonData.status || "active",
                });
              }

              totalLessons++;

              // Tạo quiz nếu có
              if (lessonData.quizData) {
                const quizData = typeof lessonData.quizData === 'string' 
                  ? JSON.parse(lessonData.quizData) 
                  : lessonData.quizData;

                const quiz = await QuizzesModel.create({
                  courseId: course._id.toString(),
                  chapterId: updatedChapter._id.toString(),
                  lessonId: lesson._id.toString(),
                  title: quizData.title || 'Quiz',
                  description: quizData.description || "",
                  questions: quizData.questions || [],
                  passingScore: quizData.passingScore || 80,
                  timeLimit: quizData.timeLimit || 0,
                  attempts: quizData.attempts || 3,
                  status: "active",
                });

                await LessonsModel.model.findByIdAndUpdate(lesson._id, {
                  quizId: quiz._id,
                });

                totalQuizzes++;
              }
            }
          }
        }
      }

      // Update course với số lượng lessons
      await Course.findByIdAndUpdate(course._id, {
        lessons: totalLessons,
      });

      if (chapters.length > 0) {
        sendSuccess(res, { 
          course, 
          chapters,
          summary: {
            chapters: chapters.length,
            lessons: totalLessons,
            quizzes: totalQuizzes,
          }
        });
      } else {
        sendSuccess(res, { course });
      }
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update course chapters
   */
  public static async updateCourseChapters(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { chapters } = req.body;

      const course = await Course.findOneAndUpdate(
        { slug },
        { chapters },
        { new: true }
      );

      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      sendSuccess(res, { course });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Delete course
   */
  public static async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Tìm course trước khi xóa để lấy thông tin
      const course = await Course.findById(id);
      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      const courseData = course.toObject() as any;

      // 1. Tìm tất cả chapters của course
      const chapters = await ChaptersModel.model.find({ courseId: id });

      // 2. Xóa tất cả lessons và quizzes của từng chapter
      for (const chapter of chapters) {
        const lessons = await LessonsModel.model.find({ chapterId: chapter._id });
        
        for (const lesson of lessons) {
          const lessonData = lesson.toObject() as any;
          
          // Xóa quiz nếu có
          if (lessonData.quizId) {
            await QuizzesModel.findByIdAndDelete(lessonData.quizId);
          }
          
          // Xóa files của lesson (videos, folder HLS và thumbnails từ R2)
          if (lessonData.videos && Array.isArray(lessonData.videos)) {
            const hlsFoldersToDelete = new Set<string>();
            const thumbnailFoldersToDelete = new Set<string>();
            
            for (const video of lessonData.videos) {
              if (video.videoUrl || video.hlsUrl) {
                try {
                  const videoUrl = video.hlsUrl || video.videoUrl;
                  
                  // Extract HLS folder path
                  const hlsFolder = CloudflareService.extractHlsFolderFromUrl(videoUrl);
                  if (hlsFolder) {
                    hlsFoldersToDelete.add(hlsFolder);
                    
                    // Extract thumbnail folder from HLS folder
                    // HLS folder: "courses/lessons/{timestamp}/hls"
                    // Thumbnail folder: "courses/lessons/{timestamp}/thumbnails"
                    const thumbnailFolder = hlsFolder.replace('/hls', '/thumbnails');
                    thumbnailFoldersToDelete.add(thumbnailFolder);
                  } else {
                    // Fallback: try to delete single file
                    let objectName = '';
                    
                    // Nếu là URL từ R2/CDN
                    if (videoUrl.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                      objectName = videoUrl.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                    } else if (videoUrl.includes('/')) {
                      // Extract từ path
                      const urlParts = videoUrl.split('/');
                      const coursesIndex = urlParts.findIndex((part: string) => part === 'courses' || part === 'lessons');
                      if (coursesIndex !== -1) {
                        objectName = urlParts.slice(coursesIndex).join('/');
                      }
                    }
                    
                    if (objectName) {
                      await CloudflareService.deleteFile(objectName);
                    }
                  }
                  
                  // Also try to extract thumbnail folder from thumbnail URL if exists
                  if (video.thumbnail) {
                    try {
                      let thumbnailPath = video.thumbnail;
                      if (thumbnailPath.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                        thumbnailPath = thumbnailPath.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                      }
                      
                      // Extract folder path (remove filename)
                      const lastSlash = thumbnailPath.lastIndexOf('/');
                      if (lastSlash > 0) {
                        const thumbnailFolder = thumbnailPath.substring(0, lastSlash);
                        thumbnailFoldersToDelete.add(thumbnailFolder);
                      }
                    } catch (err) {
                      console.warn('⚠️ [Delete Course] Error extracting thumbnail folder from URL:', err);
                    }
                  }
                } catch (err) {
                  console.error('❌ [Delete Course] Error deleting video from R2:', err);
                }
              }
            }

            // Xóa toàn bộ folder HLS của lesson
            for (const hlsFolder of hlsFoldersToDelete) {
              try {
                await CloudflareService.deleteFilesByPrefix(hlsFolder);
                console.log(`✅ [Delete Course] Deleted HLS folder: ${hlsFolder}`);
              } catch (err) {
                console.error(`❌ [Delete Course] Error deleting HLS folder ${hlsFolder}:`, err);
              }
            }
            
            // Xóa toàn bộ folder thumbnails của lesson
            for (const thumbnailFolder of thumbnailFoldersToDelete) {
              try {
                await CloudflareService.deleteFilesByPrefix(thumbnailFolder);
                console.log(`✅ [Delete Course] Deleted thumbnail folder: ${thumbnailFolder}`);
              } catch (err) {
                console.error(`❌ [Delete Course] Error deleting thumbnail folder ${thumbnailFolder}:`, err);
              }
            }
          }
          
          // Xóa files của lesson (documents từ R2)
          if (lessonData.documents && Array.isArray(lessonData.documents)) {
            for (const doc of lessonData.documents) {
              if (doc.fileUrl) {
                try {
                  const url = doc.fileUrl;
                  let objectName = '';
                  
                  if (url.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                    objectName = url.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
                  } else if (url.includes('/')) {
                    const urlParts = url.split('/');
                    objectName = urlParts.slice(urlParts.indexOf('courses') || 0).join('/');
                  }
                  
                  if (objectName) {
                    await CloudflareService.deleteFile(objectName);
                  }
                } catch (err) {
                  console.error('Error deleting document from R2:', err);
                }
              }
            }
          }
          
          // Xóa lesson
          await LessonsModel.model.findByIdAndDelete(lesson._id);
        }
        
        // Xóa chapter
        await ChaptersModel.model.findByIdAndDelete(chapter._id);
      }

      // 3. Xóa quizzes trực tiếp liên quan đến course (nếu có)
      await QuizzesModel.deleteMany({ courseId: id });

      // 4. Xóa files của course (thumbnail từ MinIO, introVideo từ R2)
      try {
        // Xóa thumbnail từ MinIO
        if (courseData.thumbnail) {
          try {
            const thumbnailUrl = courseData.thumbnail;
            // Extract object name từ URL
            if (thumbnailUrl.includes(process.env.MINIO_ENDPOINT || '')) {
              const urlParts = thumbnailUrl.split('/');
              const bucketIndex = urlParts.findIndex((part: string) => part === process.env.MINIO_BUCKET_NAME);
              if (bucketIndex !== -1) {
                const objectName = urlParts.slice(bucketIndex + 1).join('/');
                await MinioService.deleteFile(objectName);
              }
            }
          } catch (err) {
            console.error('Error deleting thumbnail from MinIO:', err);
          }
        }
        
        // Xóa introVideo và folder HLS từ R2
        if (courseData.introVideo || courseData.introVideoHlsUrl) {
          try {
            const videoUrl = courseData.introVideoHlsUrl || courseData.introVideo;
            
            // Extract HLS folder path
            const hlsFolder = CloudflareService.extractHlsFolderFromUrl(videoUrl);
            if (hlsFolder) {
              // Xóa toàn bộ folder HLS
              await CloudflareService.deleteFilesByPrefix(hlsFolder);
              console.log(`✅ Deleted intro video HLS folder: ${hlsFolder}`);
            } else {
              // Fallback: try to delete single file
              let objectName = '';
              
              if (videoUrl.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL || '')) {
                objectName = videoUrl.replace(process.env.CLOUDFLARE_R2_PUBLIC_URL || '', '').replace(/^\//, '');
              } else if (videoUrl.includes('/')) {
                const urlParts = videoUrl.split('/');
                const coursesIndex = urlParts.findIndex((part: string) => part === 'courses' || part === 'lessons');
                if (coursesIndex !== -1) {
                  objectName = urlParts.slice(coursesIndex).join('/');
                }
              }
              
              if (objectName) {
                await CloudflareService.deleteFile(objectName);
              }
            }
          } catch (err) {
            console.error('Error deleting intro video from R2:', err);
          }
        }
        
        // Xóa instructor avatar từ MinIO (nếu có)
        if (courseData.instructor?.avatar) {
          try {
            const avatarUrl = courseData.instructor.avatar;
            if (avatarUrl.includes(process.env.MINIO_ENDPOINT || '')) {
              const urlParts = avatarUrl.split('/');
              const bucketIndex = urlParts.findIndex((part: string) => part === process.env.MINIO_BUCKET_NAME);
              if (bucketIndex !== -1) {
                const objectName = urlParts.slice(bucketIndex + 1).join('/');
                await MinioService.deleteFile(objectName);
              }
            }
          } catch (err) {
            console.error('Error deleting instructor avatar from MinIO:', err);
          }
        }
      } catch (err) {
        console.error('Error deleting course files:', err);
      }

      // 5. Cuối cùng mới xóa course
      await Course.findByIdAndDelete(id);

      sendSuccess(res, { message: "Khóa học và tất cả dữ liệu liên quan đã được xóa" });
    } catch (error: any) {
      console.error('Delete course error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Seed sample courses
   */
  public static async seedCourses(req: Request, res: Response) {
    try {
      const coursesDataSeed: any = coursesData;

      await Course.deleteMany({});
      await ChaptersModel.model.deleteMany({});
      await LessonsModel.model.deleteMany({});
      await QuizzesModel.deleteMany({});

      let totalCourses = 0;
      let totalChapters = 0;
      let totalLessons = 0;
      let totalQuizzes = 0;

      for (const courseData of coursesDataSeed) {
        const course = new Course({
          ...courseData,
          slug: courseData.slug,
        });

        const savedCourse = await course.save();
        totalCourses++;

        if (courseData.chapters && courseData.chapters.length > 0) {
          for (
            let chapterIndex = 0;
            chapterIndex < courseData.chapters.length;
            chapterIndex++
          ) {
            const chapterDataSeed = courseData.chapters[chapterIndex];

            const chapterDataObj = await ChaptersModel.model.create({
              courseId: savedCourse._id,
              title: chapterDataSeed.title,
              description: chapterDataSeed.description || "",
              index: chapterIndex,
              status: "active",
            });

            totalChapters++;

            if (chapterDataSeed.lessons && chapterDataSeed.lessons.length > 0) {
              for (
                let lessonIndex = 0;
                lessonIndex < chapterDataSeed.lessons.length;
                lessonIndex++
              ) {
                const lessonDataSeed = chapterDataSeed.lessons[lessonIndex];

                const lesson = await LessonsModel.model.create({
                  chapterId: chapterDataObj._id,
                  quizId: null,
                  title: lessonDataSeed.title,
                  description: lessonDataSeed.description || "",
                  content: lessonDataSeed.content || "",
                  type: lessonDataSeed.type || "video",
                  isPreview: lessonDataSeed.isPreview || false,
                  videos: lessonDataSeed.videos || [],
                  documents: lessonDataSeed.documents || [],
                  duration: lessonDataSeed.duration || 0,
                  status: "active",
                });

                // Create quiz if exists, using chapterId and lessonId
                if (lessonDataSeed.quiz) {
                  const quiz = await QuizzesModel.create({
                    courseId: savedCourse._id.toString(),
                    chapterId: chapterDataObj._id.toString(),
                    lessonId: lesson._id.toString(),
                    title: lessonDataSeed.quiz.title,
                    description: lessonDataSeed.quiz.description || "",
                    questions: lessonDataSeed.quiz.questions || [],
                    passingScore: lessonDataSeed.quiz.passingScore || 80,
                    timeLimit: lessonDataSeed.quiz.timeLimit || 0,
                    attempts: lessonDataSeed.quiz.attempts || 3,
                    status: "active",
                  });

                  // Update lesson with quizId
                  await LessonsModel.model.findByIdAndUpdate(lesson._id, {
                    quizId: quiz._id,
                  });

                  totalQuizzes++;
                }

                totalLessons++;
              }
            }
          }
        }
      }

      sendSuccess(res, {
        message: `Đã thêm ${totalCourses} khóa học với đầy đủ thông tin`,
        summary: {
          courses: totalCourses,
          chapters: totalChapters,
          lessons: totalLessons,
          quizzes: totalQuizzes,
        },
      });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default CourseController;
 