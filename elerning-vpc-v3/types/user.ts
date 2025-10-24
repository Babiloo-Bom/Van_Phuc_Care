/**
 * User Types and Interfaces
 */

// ===== USER PROVIDER =====
export type UserProvider = 'local' | 'google' | 'facebook' | 'github'

// ===== USER INTERFACE =====
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  provider: UserProvider
  googleId?: string
  isActive: boolean
  role: string
  permissions?: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

// ===== GOOGLE USER DATA =====
export interface GoogleUserData {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

// ===== CREATE USER REQUEST =====
export interface CreateUserRequest {
  email: string
  name: string
  avatar?: string
  provider: UserProvider
  googleId?: string
  role?: string
  permissions?: string[]
}

// ===== USER RESPONSE =====
export interface UserResponse {
  success: boolean
  data?: User
  error?: string
}

