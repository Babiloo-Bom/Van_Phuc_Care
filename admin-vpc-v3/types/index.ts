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
export interface Admin {
  _id: string
  fullname: string
  email: string
  phone?: string
  avatar?: string
  role: string
  permissions: string[]
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
  admin: Admin
}

// FAQ types
export interface FAQ {
  _id: string
  title: string
  content: string
  slug: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateFAQRequest {
  title: string
  content: string
  slug?: string
}

// Product types
export interface Product {
  _id: string
  name: string
  slug: string
  shortDescription: string
  thumbnail: string
  price: number
  priceDiscount: number
  discount: number
  category: Category[]
  images: string[]
  quantityInStock: number
  quantitySelled: number
  status: 'active' | 'archived' | 'draft' | 'out_stock'
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  thumbnail: string
  type: 'product' | 'blog'
  status: 'active' | 'inactive'
}

// Customer types
export interface Customer {
  _id: string
  email: string
  firstname: string
  lastname: string
  phone: string
  address?: string
  city?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

