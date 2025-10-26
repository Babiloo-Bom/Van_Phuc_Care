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
  type: 'video' | 'document' | 'exam'
  order: number
  videoUrl?: string
  documentUrl?: string
  duration?: number
  isCompleted?: boolean
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

    // Lấy danh sách khóa học của tôi
    async fetchMyCourses(params?: any) {
      this.loading = true
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getMyCourses(params)
        this.myCourses = response.data || response.courses || response
        if (response.pagination) {
          this.pagination = response.pagination
        }
      } catch (error) {
        console.error('Error fetching my courses:', error)
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
        console.log('🔍 Store fetchDetail response:', response)
        this.course = response.data?.course || response.data || response.course || response
        console.log('🔍 Store course after set:', this.course)
      } catch (error) {
        console.error('Error fetching course detail:', error)
        throw error
      } finally {
        this.loadingDetail = false
      }
    },

    // Lấy tiến trình học
    async fetchProcessing(courseId: string) {
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getProcessing(courseId)
        this.processing = response.data || response.processing || response
      } catch (error) {
        console.error('Error fetching processing:', error)
        throw error
      }
    },

    // Lấy chi tiết chapter
    async fetchChapter(params: { origin: string; courseId: string; chapter: string | number }) {
      try {
        const courseApi = useCourseApi()
        const response: any = await courseApi.getChapter(params.chapter.toString())
        this.chapter = response.data || response.chapter || response
      } catch (error) {
        console.error('Error fetching chapter:', error)
        throw error
      }
    },

    // Lấy đánh giá
    async fetchReviews(courseId: string, params?: any) {
      try {
        console.log('🔍 Fetching reviews for course:', courseId)
        const response = await $fetch(`http://localhost:3000/api/a/reviews/course/${courseId}`)
        console.log('✅ Reviews fetched:', response)
        this.reviews = response.data?.reviews || response.reviews || []
      } catch (error) {
        console.error('Error fetching reviews:', error)
        throw error
      }
    },

    // Đánh dấu bài học hoàn thành
    async markLessonComplete(lessonId: string) {
      if (!this.processing) return
      
      if (!this.processing.complete.includes(lessonId)) {
        this.processing.complete.push(lessonId)
        
        try {
          const courseApi = useCourseApi()
          await courseApi.updateProcessing(this.processing._id, {
            complete: this.processing.complete
          })
        } catch (error) {
          console.error('Error updating processing:', error)
          // Rollback on error
          this.processing.complete = this.processing.complete.filter(id => id !== lessonId)
          throw error
        }
      }
    },

    // Đánh dấu bài học chưa hoàn thành
    async markLessonIncomplete(lessonId: string) {
      if (!this.processing) return
      
      const originalComplete = [...this.processing.complete]
      this.processing.complete = this.processing.complete.filter(id => id !== lessonId)
      
      try {
        const courseApi = useCourseApi()
        await courseApi.updateProcessing(this.processing._id, {
          complete: this.processing.complete
        })
      } catch (error) {
        console.error('Error updating processing:', error)
        // Rollback on error
        this.processing.complete = originalComplete
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
    },
  },
})

