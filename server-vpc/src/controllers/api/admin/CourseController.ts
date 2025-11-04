import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CourseModulesModel from '@mongodb/course-modules';
import LessonsModel from '@mongodb/lessons';
import QuizzesModel from '@mongodb/quizzes';
import { coursesData } from '../../../constants/courses-data-seed';
// Course schema for E-Learning
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  instructor: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    }
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  lessons: {
    type: Number,
    default: 0
  },
  students: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create model if it doesn't exist
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

class CourseController {
  /**
   * Get all courses with full statistics
   */
  public static async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({ status: 'active' }).sort({ createdAt: -1 });

      const LessonsModel = (await import('@mongodb/lessons')).default;
      const QuizzesModel = (await import('@mongodb/quizzes')).default;

      const coursesWithStats = await Promise.all(
        courses.map(async (course: any) => {
          const courseData = course.toObject();

          const modules = await CourseModulesModel.model.find({
            courseId: course._id,
            status: 'active'
          });

          let totalVideoCount = 0;
          let totalDocumentCount = 0;

          for (const module of modules) {
            const lessons = await LessonsModel.model.find({
              courseModuleId: module._id,
              status: 'active'
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
              } else if (lessonData.type === 'document' && lessonData.documentUrl) {
                totalDocumentCount += 1;
              }
            }
          }

          const totalQuizCount = await QuizzesModel.countDocuments({
            courseId: course._id.toString(),
            status: 'active'
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
              count: courseData.rating?.count || 0
            },
            tags: courseData.tags || [],
            isPublished: courseData.isPublished,
            isFeatured: courseData.isFeatured,
            status: courseData.status,
            videoCount: totalVideoCount,
            documentCount: totalDocumentCount,
            quizCount: totalQuizCount,
            createdAt: courseData.createdAt,
            updatedAt: courseData.updatedAt
          };
        })
      );

      console.log(`📚 Found ${coursesWithStats.length} courses with statistics`);
      sendSuccess(res, { courses: coursesWithStats });
    } catch (error: any) {
      console.error('❌ Get courses error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course by slug with modules and lessons
   */
  public static async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await Course.findOne({ slug, status: 'active' });

      if (!course) {
        return sendError(res, 404, 'Khóa học không tồn tại');
      }

      // Get modules for this course
      const modules = await CourseModulesModel.model.find({
        courseId: course._id,
        status: 'active'
      }).sort({ index: 1 });

      // Get lessons for each module
      const LessonsModel = (await import('@mongodb/lessons')).default;
      const courseData = course.toObject();

      // Transform modules to chapters format for frontend
      const chapters = await Promise.all(
        modules.map(async (module: any) => {
          const lessons = await LessonsModel.model.find({
            courseModuleId: module._id,
            status: 'active'
          }).sort({ createdAt: 1 });

          // Transform lessons to frontend format
          const transformedLessons = lessons.map((lesson: any) => {
            const lessonData = lesson.toObject();
            // Get first video if exists
            const firstVideo = lessonData.videos && lessonData.videos.length > 0
              ? lessonData.videos[0]
              : null;

            // Get first document if exists
            const firstDocument = lessonData.documents && lessonData.documents.length > 0
              ? lessonData.documents[0]
              : null;

            return {
              _id: lessonData._id.toString(),
              title: lessonData.title,
              description: lessonData.description || '',
              descriptions: lessonData.description || '',
              type: lessonData.type || 'video',
              order: lessonData.index || 0,
              videoUrl: firstVideo?.videoUrl || null,
              documentUrl: firstDocument?.fileUrl || null,
              thumbnail: firstVideo?.thumbnail || courseData.thumbnail || null,
              duration: lessonData.duration || firstVideo?.duration || 0,
              videos: lessonData.videos || [],
              documents: lessonData.documents || [],
              quizId: lessonData.quizId || null,
              quiz: lessonData.quiz || null,
              isPreview: lessonData.isPreview || false,
              content: lessonData.content || ''
            };
          });

          return {
            _id: module._id.toString(),
            title: module.title,
            description: module.description || '',
            order: module.index || 0,
            lessons: transformedLessons
          };
        })
      );

      // Add chapters to course data
      courseData.chapters = chapters;

      console.log(`📖 Found course: ${course.title} with ${chapters.length} modules`);
      sendSuccess(res, { course: courseData });
    } catch (error: any) {
      console.error('❌ Get course error:', error);
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
        return sendError(res, 404, 'Khóa học không tồn tại');
      }

      console.log(`📖 Found course by ID: ${course.title}`);
      sendSuccess(res, { course });
    } catch (error: any) {
      console.error('❌ Get course by ID error:', error);
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
        return sendError(res, 400, 'Khóa học với slug này đã tồn tại');
      }

      const course = await Course.create(courseData);
      console.log(`✅ Created course: ${course.title}`);
      let modules = [];
      if (Array.isArray(req.body.modules)) {
        for (const [idx, mod] of req.body.modules.entries()) {
          const newModule = await CourseModulesModel.model.create({
            courseId: course._id,
            title: mod.title,
            description: mod.description || '',
            index: typeof mod.index === 'number' ? mod.index : idx,
            status: mod.status || 'active'
          });
          modules.push(newModule);
        }
      }
      if (modules.length > 0)
        sendSuccess(res, { course, modules });
      else
        sendSuccess(res, { course });
    } catch (error: any) {
      console.error('❌ Create course error:', error);
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

      const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
      if (!course) {
        return sendError(res, 404, 'Khóa học không tồn tại');
      }

      let modules = [];
      if (Array.isArray(req.body.modules)) {
        for (const [idx, mod] of req.body.modules.entries()) {
          if (mod._id) {
            // Update existing module
            const updated = await CourseModulesModel.model.findByIdAndUpdate(mod._id, {
              title: mod.title,
              description: mod.description || '',
              index: typeof mod.index === 'number' ? mod.index : idx,
              status: mod.status || 'active'
            }, { new: true });
            if (updated) modules.push(updated);
          } else {
            // Create new module
            const newModule = await CourseModulesModel.model.create({
              courseId: course._id,
              title: mod.title,
              description: mod.description || '',
              index: typeof mod.index === 'number' ? mod.index : idx,
              status: mod.status || 'active'
            });
            modules.push(newModule);
          }
        }
      }

      if (modules.length > 0)
        sendSuccess(res, { course, modules });
      else
        sendSuccess(res, { course });
    } catch (error: any) {
      console.error('❌ Update course error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Update course chapters
   */
  public static async updateCourseChapters(req: Request, res: Response) {
    try {
      console.log('🔍 updateCourseChapters called');
      console.log('📝 Request params:', req.params);
      console.log('📝 Request body:', req.body);

      const { slug } = req.params;
      const { chapters } = req.body;

      console.log('🔍 Looking for course with slug:', slug);

      const course = await Course.findOneAndUpdate(
        { slug },
        { chapters },
        { new: true }
      );

      if (!course) {
        console.log('❌ Course not found with slug:', slug);
        return sendError(res, 404, 'Khóa học không tồn tại');
      }

      console.log(`✅ Updated course chapters: ${course.title}`);
      console.log('📚 Chapters count:', course.chapters?.length || 0);
      sendSuccess(res, { course });
    } catch (error: any) {
      console.error('❌ Update course chapters error:', error);
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
        return sendError(res, 404, 'Khóa học không tồn tại');
      }

      console.log(`✅ Deleted course: ${course.title}`);
      sendSuccess(res, { message: 'Khóa học đã được xóa' });
    } catch (error: any) {
      console.error('❌ Delete course error:', error);
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
      await CourseModulesModel.model.deleteMany({});
      await LessonsModel.model.deleteMany({});
      await QuizzesModel.deleteMany({});
      console.log('🗑️ Cleared existing courses, modules, lessons and quizzes');

      let totalCourses = 0;
      let totalModules = 0;
      let totalLessons = 0;
      let totalQuizzes = 0;

      for (const courseData of coursesDataSeed) {
        const course = new Course({
          ...courseData,
          slug: courseData.slug
        });

        const savedCourse = await course.save();
        console.log(`✅ Đã tạo course: ${savedCourse.title}`);
        totalCourses++;

        if (courseData.modules && courseData.modules.length > 0) {
          for (let moduleIndex = 0; moduleIndex < courseData.modules.length; moduleIndex++) {
            const moduleData = courseData.modules[moduleIndex];

            const courseModule = await CourseModulesModel.model.create({
              courseId: savedCourse._id,
              title: moduleData.title,
              description: moduleData.description || '',
              index: moduleIndex,
              status: 'active'
            });

            const courseModuleData = courseModule as any;
            console.log(`  ✅ Đã tạo module: ${courseModuleData.title}`);
            totalModules++;

            if (moduleData.lessons && moduleData.lessons.length > 0) {
              for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
                const lessonData = moduleData.lessons[lessonIndex] as any;

                let quizId = null;

                if (lessonData.quiz) {
                  const quiz = await QuizzesModel.create({
                    courseId: savedCourse._id.toString(),
                    chapterIndex: moduleIndex,
                    lessonIndex: lessonIndex,
                    title: lessonData.quiz.title,
                    description: lessonData.quiz.description || '',
                    questions: lessonData.quiz.questions || [],
                    passingScore: lessonData.quiz.passingScore || 80,
                    timeLimit: lessonData.quiz.timeLimit || 0,
                    attempts: lessonData.quiz.attempts || 3,
                    status: 'active'
                  });

                  const quizData = quiz as any;
                  quizId = quizData._id;
                  console.log(`    ✅ Đã tạo quiz: ${quizData.title} với ${quizData.questions.length} câu hỏi`);
                  totalQuizzes++;
                }

                const lesson = await LessonsModel.model.create({
                  courseModuleId: courseModuleData._id,
                  quizId: quizId,
                  title: lessonData.title,
                  description: lessonData.description || '',
                  content: lessonData.content || '',
                  type: lessonData.type || 'video',
                  isPreview: lessonData.isPreview || false,
                  videos: lessonData.videos || [],
                  documents: lessonData.documents || [],
                  duration: lessonData.duration || 0,
                  status: 'active'
                });

                const lessonDataObj = lesson as any;
                console.log(`    ✅ Đã tạo lesson: ${lessonDataObj.title}`);
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
          modules: totalModules,
          lessons: totalLessons,
          quizzes: totalQuizzes
        }
      });
    } catch (error: any) {
      console.error('❌ Seed courses error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default CourseController;