/**
 * Google OAuth Configuration and Types
 */

// ===== GOOGLE OAUTH CONFIG =====
export interface GoogleOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

// ===== GOOGLE USER PROFILE =====
export interface GoogleUserProfile {
  id: string
  email: string
  name: string
  given_name: string
  family_name: string
  picture: string
  verified_email: boolean
  locale: string
}

// ===== GOOGLE TOKEN RESPONSE =====
export interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

// ===== GOOGLE LOGIN REQUEST =====
export interface GoogleLoginRequest {
  code: string
  state?: string
  redirectUri: string
}

// ===== GOOGLE LOGIN RESPONSE =====
export interface GoogleLoginResponse {
  success: boolean
  data?: {
    accessToken: string
    tokenExpireAt: string
    user: {
      id: string
      email: string
      name: string
      avatar?: string
      provider: 'google'
    }
  }
  error?: string
}

// ===== GOOGLE OAUTH SCOPES =====
export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile'
] as const

// ===== GOOGLE OAUTH ENDPOINTS =====
export const GOOGLE_ENDPOINTS = {
  AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN: 'https://oauth2.googleapis.com/token',
  USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo'
} as const
