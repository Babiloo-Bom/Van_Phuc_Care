import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useApiBase } from '~/composables/useApiBase';

export interface Course {
  _id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  banner: string
  // Video giới thiệu khóa học (intro), độc lập với lessons
  introVideo?: string | null  // Hidden for security
  hasIntroVideo?: boolean  // Flag indicating course has intro video
  price: number
  originalPrice?: number
  discount?: number
  instructor?: {
    name: string
    avatar?: string
    bio?: string
    specialization?: string
  }
  category?: string
  level?: string
  duration?: number
  lessons?: number
  students?: number
  rating?: {
    average: number
    count: number
  }
  tags?: string[]
  isPublished?: boolean
  isFeatured?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
  // Legacy fields for compatibility
  shortDescriptions?: string
  descriptions?: string
  priceSale?: number
  rate?: number
  reviewsCount?: number
  videoCount?: number
  documentCount?: number
  quizCount?: number
  examCount?: number
  chapters?: Chapter[]
  progress?: {
    totalLessons: number
    completedLessons: number
    progressPercentage: number
    isCompleted: boolean
  }
  isPurchased?: boolean // Whether user has purchased this course
}

export interface Chapter {
  _id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  _id: string
  title: string
  type: 'video' | 'document' | 'exam' | 'quiz' | 'project'
  order: number
  videoUrl?: string | null
  needsProxy?: boolean  // Flag indicating video needs proxy (external URLs like Pexels)
  documentUrl?: string
  duration?: number
  isCompleted?: boolean
  description?: string
  descriptions?: string
  content?: string
  thumbnail?: string
  videos?: Array<{
    _id?: string
    title: string
    videoUrl?: string | null
    needsProxy?: boolean  // Flag indicating video needs proxy
    isHls?: boolean  // Flag indicating HLS format (.m3u8)
    thumbnail?: string
    duration?: number
    fileSize?: number
    quality?: string
    index?: number
  }>
  documents?: Array<{
    title: string
    fileUrl: string
    fileName: string
    fileSize?: number
    fileType: string
    index?: number
  }>
  quiz: Quiz | null
  quizId?: string
  isPreview?: boolean
  hasQuiz?: boolean
  isLocked?: boolean
}

export interface Quiz {
  _id: string
  title: string
  description: string
  questions: Array<{
    question: string
    options: Array<{
      id: string
      text: string
      isCorrect: boolean
    }>
    correctAnswer: string
    explanation: string
    points: number
  }>
  passingScore: number
  timeLimit: number
  attempts: number
}

export interface Instructor {
  _id: string
  name: string
  avatar?: string
  bio?: string
  specialization?: string
}

export interface CourseProcessing {
  _id: string
  courseId: string
  userId: string
  complete: string[] // Array of lesson IDs
  progress: number
  lastAccessedAt?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    // Danh sách tất cả khóa học
    courses: [] as Course[],
    
    // Danh sách khóa học của tôi
    myCourses: [] as Course[],
    
    // Chi tiết khóa học hiện tại
    course: null as Course | null,
    
    // Tiến trình học của khóa học hiện tại
    processing: null as CourseProcessing | null,

    isRepeatLearn: false,
    
    // Chapter hiện tại
    chapter: null as Chapter | null,
    
    // Đánh giá của khóa học
    reviews: [] as any[],
    
    // Phân trang
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
    } as Pagination,
    
    // Loading states
    loading: false,
    loadingDetail: false,
    
    // Course counts
    courseCounts: {
      videoCount: 0,
      documentCount: 0,
      examCount: 0,
    },
  }),

  getters: {
    // Lấy danh sách khóa học
    allCourses: state => state.courses,
    
    // Lấy khóa học hiện tại
    currentCourse: state => state.course,
    
    // Lấy tiến trình học
    currentProcessing: state => state.processing,

    isRepeating: state => state.isRepeatLearn,
    
    // Tính % hoàn thành
    completionPercentage: state => {
      if (!state.processing || !state.course) return 0;
      
      const totalLessons = state.course.chapters?.reduce((sum, chapter) => {
        return sum + (chapter.lessons?.length || 0);
      }, 0) || 0;
      
      if (totalLessons === 0) return 0;
      
      // Count unique completed lessons (use Set to avoid duplicates)
      const completedLessonIds = new Set(state.processing.complete || []);
      const completedLessons = completedLessonIds.size;
      
      // Ensure progress never exceeds 100%
      const actualCompletedLessons = Math.min(completedLessons, totalLessons);
      return Math.min(Math.round((actualCompletedLessons / totalLessons) * 100), 100);
    },
    
    // Tổng số bài học
    totalLessons: state => {
      if (!state.course) return 0;
      return state.course.chapters?.reduce((sum, chapter) => {
        return sum + (chapter.lessons?.length || 0);
      }, 0) || 0;
    },
    
    // Số bài học đã hoàn thành
    completedLessons: state => {
      return state.processing?.complete?.length || 0;
    },
    
    // Kiểm tra bài học đã hoàn thành chưa
    isLessonCompleted: state => (lessonId: string) => {
      return state.processing?.complete?.includes(lessonId) || false;
    },

    // Tính số lượng video từ chapters
    videoCount: state => {
      if (!state.course?.chapters) return state.courseCounts.videoCount;
      
      let count = 0;
      state.course.chapters.forEach(chapter => {
        chapter.lessons?.forEach(lesson => {
          if (lesson.type === 'video' || lesson.videoUrl) {
            count++;
          }
        });
      });
      return count;
    },

    // Lấy document count từ state
    documentCount: state => state.courseCounts.documentCount,

    // Lấy exam count từ state  
    examCount: state => state.courseCounts.examCount,
  },

  actions: {
    // Set courses directly (for API responses)
    setCourses(courses: Course[]) {
      this.courses = courses
    },

    setIsRepeatLearn(value: boolean) {
      this.isRepeatLearn = value;
    },

    // Lấy danh sách tất cả khóa học
    async fetchAll(params?: any) {
      this.loading = true;
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getAllCourses(params)
        const raw = response.data?.courses || response.data || response.courses || response || []
        const authStore = useAuthStore()
        const purchasedSet = new Set(authStore.user?.courseRegister || [])
        this.courses = raw.map((c: any) => {
          const id = c?._id?.toString?.()
          return {
            ...c,
            isPurchased: c?.isPurchased === true || (id ? purchasedSet.has(id) : false)
          }
        })
        if (response.pagination) {
          this.pagination = response.pagination;
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false;
      }
    },

    async fetchMyCourses(params?: any) {
      this.loading = true;
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getMyCourses(params)
        this.myCourses = response.data?.courses || response.data || response.courses || response

        // Cập nhật courseRegister vào authStore để UI “Mua ngay / Vào học” hiển thị đúng
        try {
          const authStore = useAuthStore()
          const purchasedIds = (this.myCourses || []).map((c: any) => c._id?.toString()).filter(Boolean)
          if (authStore.user) {
            authStore.user.courseRegister = purchasedIds
            // Persist vào localStorage (giữ nguyên các field khác)
            const userData = { ...authStore.user, courseRegister: purchasedIds }
            if (process.client) {
              localStorage.setItem('user', JSON.stringify(userData))
              localStorage.setItem('authData', JSON.stringify({
                user: userData,
                token: authStore.token,
                tokenExpireAt: authStore.tokenExpireAt,
                loginTimestamp: authStore.loginTimestamp,
              }))
            }
          }
        } catch (e) {
          console.warn('Không thể đồng bộ courseRegister vào authStore:', e)
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false;
      }
    },

    async fetchMyCourseBySlug(slug: string, chapterIndex: number, lessonIndex: number) {
      this.loadingDetail = true;
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getMyCourseBySlug(slug)

        const responseCourse = response.data?.course || response.data || response.course || response;
        if (this.isRepeatLearn && responseCourse) {
          let totalLessons = 0;

          const resetChapters = (responseCourse.chapters || []).map((chapter: Chapter) => {
            const lessons = (chapter.lessons || []).map((lesson) => {
              totalLessons += 1;
              return {
                ...lesson,
                isCompleted: false,
              };
            });

            return {
              ...chapter,
              lessons,
            };
          });

          const progressPercentage = totalLessons > 0 ? 0 : 0;

          this.setCurrentCourse({
            ...(responseCourse || {}),
            progress: {
              ...(responseCourse?.progress || {}),
              progressPercentage,
              isCompleted: false,
              completedLessons: 0,
              totalLessons,
            },
            chapters: resetChapters,
          });
          // Sau lần reset đầu tiên, tắt cờ học lại để các lần fetch tiếp theo dùng tiến trình thật từ backend
          this.isRepeatLearn = false;
        } else {
          this.course = responseCourse;
        }
      } catch (error) {
        throw error
      } finally {
        this.loadingDetail = false;
      }
    },

    // Lấy chi tiết khóa học
    async fetchDetail(courseId: string) {
      this.loadingDetail = true;
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getDetail(courseId)
        const rawCourse = response.data?.course || response.data || response.course || response

        // Bổ sung trạng thái purchased/completed dựa trên thông tin user
        const authStore = useAuthStore()
        const id = rawCourse?._id?.toString?.()
        const isPurchased =
          rawCourse?.isPurchased === true ||
          (id ? authStore.user?.courseRegister?.includes(id) : false)
        const isCompletedFlag =
          rawCourse?.progress?.isCompleted === true ||
          (id ? authStore.user?.courseCompleted?.includes(id) : false)

        this.course = {
          ...(rawCourse || {}),
          isPurchased,
          progress: {
            ...(rawCourse?.progress || {}),
            isCompleted: isCompletedFlag,
          },
        }
      } catch (error) {
        throw error
      } finally {
        this.loadingDetail = false;
      }
    },

    // Lấy đánh giá
    async fetchReviews(courseId: string, params?: any) {
      try {
        const { apiAdmin } = useApiBase()
        const response: any = await $fetch(`${apiAdmin}/reviews/course/${courseId}`)
        const reviews = response.data?.reviews || response.reviews || []
        // Debug: Log reviews data (only on client side)
        if (import.meta.client) {
          console.log('🔍 [Fetch Reviews] Response:', response);
          console.log('🔍 [Fetch Reviews] Reviews:', reviews);
          if (reviews.length > 0) {
            console.log('🔍 [Fetch Reviews] First review:', reviews[0]);
            console.log('🔍 [Fetch Reviews] First review rating:', reviews[0]?.rating);
          }
        }
        this.reviews = reviews
      } catch (error) {
        console.error('❌ [Fetch Reviews] Error:', error);
        throw error
      }
    },

    // Set course hiện tại
    setCurrentCourse(course: Course) {
      this.course = course;
    },

    // Set processing hiện tại
    setProcessing(processing: CourseProcessing) {
      this.processing = processing;
    },

    // Reset state
    resetState() {
      this.courses = [];
      this.myCourses = [];
      this.course = null;
      this.processing = null;
      this.chapter = null;
      this.reviews = [];
      this.pagination = {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      };
      this.courseCounts = {
        videoCount: 0,
        documentCount: 0,
        examCount: 0,
      };
    },
  },
});

