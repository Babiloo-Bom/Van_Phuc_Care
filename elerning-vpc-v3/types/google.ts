/**
 * Google OAuth Types and Interfaces
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
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

// ===== GOOGLE TOKEN RESPONSE =====
export interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: string
  id_token?: string
}

// ===== GOOGLE LOGIN REQUEST =====
export interface GoogleLoginRequest {
  code: string
  state?: string
}

// ===== GOOGLE LOGIN RESPONSE =====
export interface GoogleLoginResponse {
  success: boolean
  data?: {
    user: any
    accessToken: string
    refreshToken: string
    tokenExpireAt: number
  }
  error?: string
}

