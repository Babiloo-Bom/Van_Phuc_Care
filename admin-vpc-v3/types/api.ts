/**
 * ====================================
 * API Types & Interfaces
 * ====================================
 * Centralized type definitions for API responses
 */

// ============================================
// Common Response Types
// ============================================

export interface ApiResponse<T = any> {
  status: boolean
  data?: T
  message?: string
  errors?: ApiError[]
}

export interface ApiError {
  field?: string
  message: string
  code?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: PaginationMeta
}

// ============================================
// Request Options
// ============================================

export interface ApiRequestOptions {
  // Query parameters
  params?: Record<string, any>
  
  // Request body
  body?: any
  
  // Custom headers
  headers?: Record<string, string>
  
  // Timeout in milliseconds
  timeout?: number
  
  // Retry configuration
  retry?: number | {
    limit: number
    delay: number
    statusCodes?: number[]
  }
  
  // Show loading indicator
  showLoading?: boolean
  
  // Show error message
  showError?: boolean
  
  // Custom error message
  errorMessage?: string
  
  // Cache response
  cache?: boolean | {
    key: string
    ttl: number
  }
}

// ============================================
// Entity Types
// ============================================

export interface Customer {
  _id: string
  email: string
  firstname: string
  lastname: string
  phone?: string
  address?: string
  city?: string
  dob?: string
  gender?: 'male' | 'female' | 'other'
  status: 'active' | 'inactive'
  totalOrders?: number
  totalSpent?: number
  createdAt: string
  updatedAt?: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  price: number
  priceDiscount?: number
  discount?: number
  typeDiscount?: 'percentage' | 'fixed'
  thumbnail?: string
  images?: string[]
  description?: string
  shortDescription?: string
  category?: Category[]
  quantityInStock: number
  quantitySelled?: number
  isOutOfStock: boolean
  showHome?: boolean
  status: 'active' | 'inactive'
  gtin?: string
  createdAt: string
}

export interface Category {
  _id: string
  title: string
  slug: string
  thumbnail?: string
  type: 'product' | 'blog'
  postCount?: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Order {
  _id: string
  orderNumber: string
  customerId: string
  items: OrderItem[]
  total: number
  subtotal: number
  discount?: number
  tax?: number
  shippingFee?: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  shippingAddress?: Address
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Address {
  street: string
  city: string
  state?: string
  zipCode?: string
  country: string
}

export interface Course {
  _id: string
  code?: string
  name?: string
  title?: string
  slug?: string
  thumbnail?: string
  banner?: string
  shortDescription?: string
  description?: string
  order?: number
  status: 'active' | 'inactive' | 'draft'
  notes?: string
  price?: number
  originalPrice?: number
  discount?: number
  introVideo?: string
  introVideoStatus?: 'uploading' | 'queueing' | 'processing' | 'ready' | 'error'
  introVideoHlsUrl?: string
  introVideoThumbnail?: string
  introVideoQualityMetadata?: {
    resolution?: string
    bitrate?: string
    codec?: string
    fps?: number
    segments?: number
  }
  instructor?: {
    name?: string
    avatar?: string
    bio?: string
  }
  category?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  isPublished?: boolean
  isFeatured?: boolean
  chapters?: any[]
  createdAt: string
}

export interface HealthBook {
  _id: string
  customerId: string
  name: string
  dob: string
  gender: 'male' | 'female'
  weight?: string
  height?: string
  healthCondition?: string
  domain: string
  createdAt: string
}

export interface Transaction {
  _id: string
  origin: string
  type: 'payment' | 'refund' | 'deposit'
  title: string
  total: number
  status: 'pending' | 'success' | 'denied'
  createdAt: string
}

export interface FAQ {
  _id: string
  title: string
  content: string
  slug: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Feedback {
  _id: string
  fullname: string
  email?: string
  phoneNumber?: string
  avatar?: string
  position?: string
  content: string
  createdBy: 'admin' | 'customer'
  status: 'active' | 'inactive'
  createdAt: string
}

// ============================================
// Query Filters
// ============================================

export interface BaseQueryParams {
  page?: number
  limit?: number
  searchKey?: string
  status?: string
}

export interface CustomerQueryParams extends BaseQueryParams {
  city?: string
  gender?: string
}

export interface ProductQueryParams extends BaseQueryParams {
  categoryId?: string
  priceMin?: number
  priceMax?: number
}

export interface OrderQueryParams extends BaseQueryParams {
  customerId?: string
  status?: string
  paymentStatus?: string
  from?: string
  to?: string
}

// ============================================
// Upload Types
// ============================================

export interface UploadResponse {
  url: string
  urls?: string[]
}

export interface FileUploadOptions {
  maxSize?: number // in MB
  allowedTypes?: string[]
  folder?: string
}

