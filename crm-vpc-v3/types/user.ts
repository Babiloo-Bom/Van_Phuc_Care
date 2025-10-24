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
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// ===== GOOGLE USER DATA =====
export interface GoogleUserData {
  id: string
  email: string
  name: string
  given_name: string
  family_name: string
  picture: string
  verified_email: boolean
  locale: string
}

// ===== USER CREATION REQUEST =====
export interface CreateUserRequest {
  email: string
  name: string
  avatar?: string
  provider: UserProvider
  googleId?: string
  role?: string
}

// ===== USER RESPONSE =====
export interface UserResponse {
  success: boolean
  data?: User
  error?: string
}

