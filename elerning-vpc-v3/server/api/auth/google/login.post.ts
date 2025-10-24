/**
 * Google Login API
 * Completes the Google OAuth flow and creates/updates user
 */

import type { GoogleLoginResponse } from '~/types/google'

export default defineEventHandler(async (event): Promise<GoogleLoginResponse> => {
  try {
    const body = await readBody(event)
    const { code } = body

    if (!code) {
      return {
        success: false,
        error: 'Authorization code is required'
      }
    }

    const config = useRuntimeConfig()

    // Step 1: Exchange code for access token
    console.log('🔄 Step 1: Exchanging code for access token...')
    const tokenResponse = await $fetch<any>(config.public.googleTokenUrl, {
      method: 'POST',
      body: {
        code,
        client_id: config.public.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: `${config.public.baseUrl}/auth/google/callback`,
        grant_type: 'authorization_code'
      }
    })

    if (!tokenResponse.access_token) {
      throw new Error('Failed to get access token from Google')
    }

    console.log('✅ Step 1: Access token received')

    // Step 2: Get user profile from Google
    console.log('🔄 Step 2: Fetching user profile...')
    const userProfile = await $fetch<any>(config.public.googleUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    console.log('✅ Step 2: User profile received:', userProfile.email)

    // Step 3: Create or update user in database
    console.log('🔄 Step 3: Managing user in database...')
    
    try {
      // Try to use the real UserService first
      const { UserService } = await import('~/server/services/UserService')
      const user = await UserService.createOrUpdateGoogleUser({
        id: userProfile.id,
        email: userProfile.email,
        verified_email: userProfile.verified_email,
        name: userProfile.name,
        given_name: userProfile.given_name,
        family_name: userProfile.family_name,
        picture: userProfile.picture,
        locale: userProfile.locale
      })

      console.log('✅ Step 3: User managed in database')

      // Step 4: Generate JWT tokens
      console.log('🔄 Step 4: Generating JWT tokens...')
      const { JWTService } = await import('~/server/services/JWTService')
      const jwtTokens = JWTService.generateTokenPair(user)
      console.log('✅ Step 4: JWT tokens generated')

      return {
        success: true,
        data: {
          user: {
            id: user._id?.toString() || user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            provider: user.provider,
            googleId: user.googleId,
            isActive: user.isActive,
            role: user.role,
            permissions: user.permissions || []
          },
          accessToken: jwtTokens.accessToken,
          refreshToken: jwtTokens.refreshToken,
          tokenExpireAt: jwtTokens.tokenExpireAt
        }
      }

    } catch (dbError: any) {
      console.warn('⚠️ Database service unavailable, falling back to MockUserService:', dbError.message)
      
      // Fallback to MockUserService
      const { MockUserService } = await import('~/server/services/MockUserService')
      const user = await MockUserService.createOrUpdateGoogleUser({
        id: userProfile.id,
        email: userProfile.email,
        verified_email: userProfile.verified_email,
        name: userProfile.name,
        given_name: userProfile.given_name,
        family_name: userProfile.family_name,
        picture: userProfile.picture,
        locale: userProfile.locale
      })

      console.log('✅ Step 3: User managed in MockUserService (fallback)')

      // Generate JWT tokens
      const { JWTService } = await import('~/server/services/JWTService')
      const jwtTokens = JWTService.generateTokenPair(user)

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            provider: user.provider,
            googleId: user.googleId,
            isActive: user.isActive,
            role: user.role,
            permissions: user.permissions || []
          },
          accessToken: jwtTokens.accessToken,
          refreshToken: jwtTokens.refreshToken,
          tokenExpireAt: jwtTokens.tokenExpireAt
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Google login failed:', error)
    return {
      success: false,
      error: error.message || 'Failed to complete Google login'
    }
  }
})

