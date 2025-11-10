import { defineStore } from 'pinia'

export interface Course {
  _id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  price: number
  originalPrice?: number
  discount?: number
  instructor?: {
    name: string
    avatar?: string
    bio?: string
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
  examCount?: number
  chapters?: Chapter[]
  progress?: {
    totalLessons: number
    completedLessons: number
    progressPercentage: number
    isCompleted: boolean
  }
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
  videoUrl?: string
  documentUrl?: string
  duration?: number
  isCompleted?: boolean
  description?: string
  descriptions?: string
  content?: string
  thumbnail?: string
  videos?: Array<{
    title: string
    videoUrl: string
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
      examCount: 0
    }
  }),

  getters: {
    // Lấy danh sách khóa học
    allCourses: (state) => state.courses,
    
    // Lấy khóa học hiện tại
    currentCourse: (state) => state.course,
    
    // Lấy tiến trình học
    currentProcessing: (state) => state.processing,
    
    // Tính % hoàn thành
    completionPercentage: (state) => {
      if (!state.processing || !state.course) return 0
      
      const totalLessons = state.course.chapters?.reduce((sum, chapter) => {
        return sum + (chapter.lessons?.length || 0)
      }, 0) || 0
      
      if (totalLessons === 0) return 0
      
      const completedLessons = state.processing.complete?.length || 0
      return Math.round((completedLessons / totalLessons) * 100)
    },
    
    // Tổng số bài học
    totalLessons: (state) => {
      if (!state.course) return 0
      return state.course.chapters?.reduce((sum, chapter) => {
        return sum + (chapter.lessons?.length || 0)
      }, 0) || 0
    },
    
    // Số bài học đã hoàn thành
    completedLessons: (state) => {
      return state.processing?.complete?.length || 0
    },
    
    // Kiểm tra bài học đã hoàn thành chưa
    isLessonCompleted: (state) => (lessonId: string) => {
      return state.processing?.complete?.includes(lessonId) || false
    },

    // Tính số lượng video từ chapters
    videoCount: (state) => {
      if (!state.course?.chapters) return state.courseCounts.videoCount
      
      let count = 0
      state.course.chapters.forEach(chapter => {
        chapter.lessons?.forEach(lesson => {
          if (lesson.type === 'video' || lesson.videoUrl) {
            count++
          }
        })
      })
      return count
    },

    // Lấy document count từ state
    documentCount: (state) => state.courseCounts.documentCount,

    // Lấy exam count từ state  
    examCount: (state) => state.courseCounts.examCount,
  },

  actions: {
    // Set courses directly (for API responses)
    setCourses(courses: Course[]) {
      console.log('🔍 setCourses called with:', courses.length, 'courses')
      this.courses = courses
      console.log('🔍 courses after set:', this.courses.length)
    },

    // Lấy danh sách tất cả khóa học
    async fetchAll(params?: any) {
      this.loading = true
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getAllCourses(params)
        console.log('🔍 Store fetchAll response:', response)
        this.courses = response.data?.courses || response.data || response.courses || response
        console.log('🔍 Store courses after set:', this.courses.length)
        if (response.pagination) {
          this.pagination = response.pagination
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Lấy chi tiết khóa học
    async fetchDetail(courseId: string) {
      this.loadingDetail = true
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getDetail(courseId)
        this.course = response.data?.course || response.data || response.course || response
      } catch (error) {
        throw error
      } finally {
        this.loadingDetail = false
      }
    },

    // Lấy đánh giá
    async fetchReviews(courseId: string, params?: any) {
      try {
        console.log('🔍 Fetching reviews for course:', courseId)
        const response: any = await $fetch(`http://localhost:3000/api/a/reviews/course/${courseId}`)
        console.log('✅ Reviews fetched:', response)
        this.reviews = response.data?.reviews || response.reviews || []
      } catch (error) {
        console.error('Error fetching reviews:', error)
        throw error
      }
    },

    // Set course hiện tại
    setCurrentCourse(course: Course) {
      this.course = course
    },

    // Set processing hiện tại
    setProcessing(processing: CourseProcessing) {
      this.processing = processing
    },

    // Reset state
    resetState() {
      this.courses = []
      this.myCourses = []
      this.course = null
      this.processing = null
      this.chapter = null
      this.reviews = []
      this.pagination = {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      }
      this.courseCounts = {
        videoCount: 0,
        documentCount: 0,
        examCount: 0
      }
    },
  },
})

