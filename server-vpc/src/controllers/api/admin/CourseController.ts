import { sendError, sendSuccess } from "@libs/response";
import { Request, Response } from "express";
import mongoose from "mongoose";
import ChaptersModel from "@mongodb/chapters";
import LessonsModel from "@mongodb/lessons";
import QuizzesModel from "@mongodb/quizzes";
import MinioService from "@services/minio";
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
      const courses = await Course.find({ status: "active" }).sort({
        createdAt: -1,
      });

      const LessonsModel = (await import("@mongodb/lessons")).default;
      const QuizzesModel = (await import("@mongodb/quizzes")).default;

      const coursesWithStats = await Promise.all(
        courses.map(async (course: any) => {
          const courseData = course.toObject();

          const chapters = await ChaptersModel.model.find({
            courseId: course._id,
            status: "active",
          });

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
              } else if (
                lessonData.type === "document" &&
                lessonData.documentUrl
              ) {
                totalDocumentCount += 1;
              }
            }
          }

          const totalQuizCount = await QuizzesModel.countDocuments({
            courseId: course._id.toString(),
            status: "active",
          });

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
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt,
          };
        })
      );

      sendSuccess(res, { courses: coursesWithStats });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course by slug with modules and lessons
   * Includes progress tracking: isCompleted, isLocked for each lesson
   */
  public static async getCourseBySlug(req: Request, res: Response) {
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
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      sendSuccess(res, { course });
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
        }
      }
      if (chapters.length > 0) sendSuccess(res, { course, chapters });
      else sendSuccess(res, { course });
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

      const course = await Course.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      let chapters = [];
      if (Array.isArray(req.body.chapters)) {
        for (const [idx, chapter] of req.body.chapters.entries()) {
          if (chapter._id) {
            // Update existing chapter
            const updated = await ChaptersModel.model.findByIdAndUpdate(
              chapter._id,
              {
                title: chapter.title,
                description: chapter.description || "",
                index: typeof chapter.index === "number" ? chapter.index : idx,
                status: chapter.status || "active",
              },
              { new: true }
            );
            if (updated) chapters.push(updated);
          } else {
            // Create new module
            const newChapter = await ChaptersModel.model.create({
              courseId: course._id,
              title: chapter.title,
              description: chapter.description || "",
              index: typeof chapter.index === "number" ? chapter.index : idx,
              status: chapter.status || "active",
            });
            chapters.push(newChapter);
          }
        }
      }

      if (chapters.length > 0) sendSuccess(res, { course, chapters });
      else sendSuccess(res, { course });
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

      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return sendError(res, 404, "Khóa học không tồn tại");
      }

      sendSuccess(res, { message: "Khóa học đã được xóa" });
    } catch (error: any) {
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

            const chapter = await ChaptersModel.model.create({
              courseId: savedCourse._id,
              title: chapterDataSeed.title,
              description: chapterDataSeed.description || "",
              index: chapterIndex,
              status: "active",
            });

            const chapterDataObj = chapter as any;
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
