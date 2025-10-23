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
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Service types
export interface Service {
  _id: string
  name: string
  slug: string
  shortDescription: string
  thumbnail: string
  price: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ServiceRegistration {
  _id: string
  serviceId: string
  service: Service
  customerName: string
  customerPhone: string
  customerEmail: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

// Ticket types
export interface Ticket {
  _id: string
  title: string
  content: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdBy: User
  assignedTo?: User
  createdAt: string
  updatedAt: string
}

