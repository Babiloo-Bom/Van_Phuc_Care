import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import CourseModulesModel from '@mongodb/course-modules';

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
   * Get all courses
   */
  public static async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await Course.find({ status: 'active' }).sort({ createdAt: -1 });
      console.log(`📚 Found ${courses.length} courses`);
      sendSuccess(res, { courses });
    } catch (error: any) {
      console.error('❌ Get courses error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * Get course by slug
   */
  public static async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await Course.findOne({ slug, status: 'active' });
      
      if (!course) {
        return sendError(res, 404, 'Khóa học không tồn tại');
      }
      
      console.log(`📖 Found course: ${course.title}`);
      sendSuccess(res, { course });
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
      const sampleCourses = [
        {
          title: "Lập Trình Web Frontend với React.js",
          slug: "lap-trinh-web-frontend-voi-reactjs",
          description: "Khóa học toàn diện về lập trình web frontend sử dụng React.js, từ cơ bản đến nâng cao. Bạn sẽ học được cách xây dựng các ứng dụng web hiện đại, tương tác và responsive.",
          shortDescription: "Học React.js từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại",
          thumbnail: "/images/courses/react-course.jpg",
          price: 299000,
          originalPrice: 599000,
          discount: 50,
          instructor: {
            name: "Nguyễn Văn A",
            avatar: "/images/instructors/instructor-1.jpg",
            bio: "Senior Frontend Developer với 5+ năm kinh nghiệm"
          },
          category: "Lập Trình",
          level: "beginner",
          duration: 1200,
          lessons: 45,
          students: 1250,
          rating: {
            average: 4.8,
            count: 320
          },
          tags: ["React", "JavaScript", "Frontend", "Web Development"],
          chapters: [
            {
              title: "Giới thiệu React.js",
              description: "Tìm hiểu về React.js và cách thiết lập môi trường phát triển",
              lessons: [
                {
                  title: "React.js là gì?",
                  duration: 15,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/4F46E5/FFFFFF?text=React+Introduction",
                  fileSize: 1048576,
                  quality: "720"
                },
                {
                  title: "Cài đặt Node.js và npm",
                  duration: 10,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/059669/FFFFFF?text=Node.js+Setup",
                  fileSize: 2097152,
                  quality: "720"
                }
              ]
            },
            {
              title: "Components và JSX",
              description: "Học cách tạo và sử dụng React components",
              lessons: [
                {
                  title: "Tạo Component đầu tiên",
                  duration: 20,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/DC2626/FFFFFF?text=First+Component",
                  fileSize: 1048576,
                  quality: "720"
                }
              ]
            }
          ],
          isPublished: true,
          isFeatured: true,
          status: "active"
        },
        {
          title: "Thiết Kế UI/UX với Figma",
          slug: "thiet-ke-ui-ux-voi-figma",
          description: "Khóa học thiết kế giao diện người dùng và trải nghiệm người dùng chuyên nghiệp với Figma. Từ wireframe đến prototype hoàn chỉnh.",
          shortDescription: "Học thiết kế UI/UX chuyên nghiệp với Figma",
          thumbnail: "/images/courses/figma-course.jpg",
          price: 199000,
          originalPrice: 399000,
          discount: 50,
          instructor: {
            name: "Trần Thị B",
            avatar: "/images/instructors/instructor-2.jpg",
            bio: "UI/UX Designer với 6+ năm kinh nghiệm tại các công ty lớn"
          },
          category: "Thiết Kế",
          level: "beginner",
          duration: 900,
          lessons: 32,
          students: 890,
          rating: {
            average: 4.7,
            count: 156
          },
          tags: ["Figma", "UI Design", "UX Design", "Prototype"],
          isPublished: true,
          isFeatured: true,
          status: "active"
        },
        {
          title: "Phân Tích Dữ Liệu với Python",
          slug: "phan-tich-du-lieu-voi-python",
          description: "Khóa học phân tích dữ liệu và machine learning với Python. Sử dụng pandas, numpy, matplotlib và scikit-learn để xử lý và phân tích dữ liệu thực tế.",
          shortDescription: "Học phân tích dữ liệu và ML với Python",
          thumbnail: "/images/courses/python-course.jpg",
          price: 399000,
          originalPrice: 799000,
          discount: 50,
          instructor: {
            name: "Lê Văn C",
            avatar: "/images/instructors/instructor-3.jpg",
            bio: "Data Scientist với 7+ năm kinh nghiệm trong lĩnh vực AI/ML"
          },
          category: "Khoa Học Dữ Liệu",
          level: "intermediate",
          duration: 1500,
          lessons: 58,
          students: 2100,
          rating: {
            average: 4.9,
            count: 445
          },
          tags: ["Python", "Data Analysis", "Machine Learning", "Pandas", "NumPy"],
          chapters: [
            {
              title: "Python cơ bản",
              description: "Học các khái niệm cơ bản của Python",
              lessons: [
                {
                  title: "Giới thiệu Python",
                  duration: 20,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/4F46E5/FFFFFF?text=Python+Introduction",
                  fileSize: 1048576,
                  quality: "720"
                },
                {
                  title: "Biến và Kiểu dữ liệu",
                  duration: 25,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/059669/FFFFFF?text=Variables+Types",
                  fileSize: 2097152,
                  quality: "720"
                },
                {
                  title: "Cấu trúc điều khiển",
                  duration: 30,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/DC2626/FFFFFF?text=Control+Structures",
                  fileSize: 1048576,
                  quality: "720"
                }
              ]
            },
            {
              title: "Pandas và NumPy",
              description: "Thư viện xử lý dữ liệu quan trọng",
              lessons: [
                {
                  title: "Giới thiệu Pandas",
                  duration: 35,
                  type: "video",
                  videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
                  thumbnail: "https://via.placeholder.com/1280x720/7C3AED/FFFFFF?text=Pandas+Introduction",
                  fileSize: 2097152,
                  quality: "720"
                }
              ]
            }
          ],
          isPublished: true,
          isFeatured: false,
          status: "active"
        },
        {
          title: "Marketing Digital Toàn Diện",
          slug: "marketing-digital-toan-dien",
          description: "Khóa học marketing digital từ A-Z, bao gồm SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing. Phù hợp cho người mới bắt đầu và muốn nâng cao kỹ năng.",
          shortDescription: "Học marketing digital từ cơ bản đến nâng cao",
          thumbnail: "/images/courses/marketing-course.jpg",
          price: 249000,
          originalPrice: 499000,
          discount: 50,
          instructor: {
            name: "Phạm Thị D",
            avatar: "/images/instructors/instructor-4.jpg",
            bio: "Digital Marketing Manager với 8+ năm kinh nghiệm"
          },
          category: "Marketing",
          level: "beginner",
          duration: 1800,
          lessons: 67,
          students: 3200,
          rating: {
            average: 4.6,
            count: 678
          },
          tags: ["Digital Marketing", "SEO", "Google Ads", "Facebook Ads", "Content Marketing"],
          isPublished: true,
          isFeatured: true,
          status: "active"
        }
      ];

      // Clear existing courses first
      await Course.deleteMany({});
      console.log('🗑️ Cleared existing courses');

      // Insert sample courses
      const courses = await Course.insertMany(sampleCourses);
      console.log(`✅ Inserted ${courses.length} sample courses`);

      sendSuccess(res, { 
        message: `Đã thêm ${courses.length} khóa học mẫu`,
        courses: courses.map(course => ({
          id: course._id,
          title: course.title,
          price: course.price
        }))
      });
    } catch (error: any) {
      console.error('❌ Seed courses error:', error);
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default CourseController;