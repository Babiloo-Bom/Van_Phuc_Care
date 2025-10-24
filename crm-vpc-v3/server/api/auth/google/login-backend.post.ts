/**
 * Google Login API - Backend Integration
 * Proxies Google OAuth to backend API
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

    console.log('🔄 Step 1: Exchange code for Google token...')
    
    // Step 1: Exchange authorization code for Google access token
    const tokenResponse = await $fetch<any>('https://oauth2.googleapis.com/token', {
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
    console.log('🔄 Step 2: Fetching user profile from Google...')

    // Step 2: Get user profile from Google
    const userProfile = await $fetch<any>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    console.log('✅ Step 2: User profile received:', userProfile.email)
    console.log('🔄 Step 3: Sending to backend API for user creation & JWT generation...')

    // Step 3: Send to backend API to create/update user and get JWT
    try {
      const backendResponse = await $fetch<any>(`${config.public.apiHost}/api/a/auth/google/login`, {
        method: 'POST',
        body: {
          googleProfile: userProfile,
          googleAccessToken: tokenResponse.access_token
        }
      })

      console.log('✅ Step 3: Backend response received')
      console.log('📦 Backend response:', JSON.stringify(backendResponse, null, 2))

      // Check if backend returned success
      if (!backendResponse || (!backendResponse.status && !backendResponse.data)) {
        console.error('❌ Invalid backend response:', backendResponse)
        throw new Error(backendResponse?.message || 'Backend authentication failed')
      }

      // Backend response is valid, continue
      console.log('✅ Backend authentication successful')

      // Extract data from backend response
      const userData = backendResponse.data
      const userInfo = userData.user || userData
      
      return {
        success: true,
        data: {
          user: {
            id: userInfo._id || userInfo.id,
            email: userInfo.email,
            name: userInfo.fullname || userInfo.name,
            avatar: userInfo.avatar,
            provider: userInfo.provider || 'google',
            googleId: userInfo.googleId || userProfile.id,
            isActive: userInfo.isActive !== false,
            role: userInfo.role || 'user',
            permissions: userInfo.permissions || []
          },
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken || userData.accessToken,
          tokenExpireAt: Date.now() + 24 * 60 * 60 * 1000 // 24h from now
        }
      }

    } catch (backendError: any) {
      console.error('❌ Backend API error:', backendError)
      
      // If backend fails, we can't proceed (no fallback to MockService for security)
      throw new Error(`Backend authentication failed: ${backendError.message}`)
    }

  } catch (error: any) {
    console.error('❌ Google login failed:', error)
    return {
      success: false,
      error: error.message || 'Failed to complete Google login'
    }
  }
})

