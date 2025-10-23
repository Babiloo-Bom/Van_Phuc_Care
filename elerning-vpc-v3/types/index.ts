// API Response types
export interface ApiResponse<T> {
  status: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages?: number
  }
}

// User types
export interface User {
  _id: string
  fullname: string
  email: string
  phone?: string
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

// Course types
export interface Course {
  _id: string
  code: string
  name: string
  order: number
  thumbnail: string
  link: string
  title: string
  shortDescription: string
  fullDescription?: string
  instructor?: string
  duration?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Lesson types
export interface Lesson {
  _id: string
  courseId: string
  title: string
  content: string
  videoUrl?: string
  order: number
  duration?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Exercise types
export interface Exercise {
  _id: string
  lessonId: string
  title: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Progress types
export interface CourseProgress {
  _id: string
  userId: string
  courseId: string
  course: Course
  completedLessons: string[]
  progress: number
  lastAccessedAt: string
  createdAt: string
  updatedAt: string
}

