/**
 * Google OAuth Types
 */

export interface GoogleOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
}

export interface GoogleUserProfile {
  id: string
  email: string
  name: string
  picture: string
  verified_email: boolean
  given_name?: string
  family_name?: string
}

export interface GoogleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}

export interface GoogleLoginRequest {
  code: string
  state?: string
  redirectUri: string
}

export interface GoogleLoginResponse {
  success: boolean
  data?: {
    user: {
      _id: string
      email: string
      fullname: string
      avatar: string
      role: string
      permissions: string[]
      provider: string
      googleId: string
    }
    accessToken: string
    tokenExpireAt: string
  }
  error?: string
}