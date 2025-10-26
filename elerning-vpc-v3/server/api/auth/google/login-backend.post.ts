/**
 * Google Login API - Backend Integration
 * Proxies Google OAuth to backend API
 */

import type { GoogleLoginResponse } from '~/types/google'

export default defineEventHandler(async (event): Promise<GoogleLoginResponse> => {
  try {
    console.log('🔄 Google login API endpoint called')
    const body = await readBody(event)
    console.log('🔍 Request body:', body)
    const { code } = body

    if (!code) {
      console.log('❌ No authorization code provided')
      return {
        success: false,
        error: 'Authorization code is required'
      }
    }

    const config = useRuntimeConfig(event)

    console.log('🔄 Step 1: Exchange code for Google token...')
    console.log('🔍 Config check:', {
      clientId: config.public.googleClientId,
      hasClientSecret: !!config.googleClientSecret,
      clientSecretLength: config.googleClientSecret?.length || 0,
      baseUrl: config.public.baseUrl,
      redirectUri: `${config.public.baseUrl}/auth/google/callback`
    })
    
    // Step 1: Exchange authorization code for Google access token
    const params = new URLSearchParams({
      code,
      client_id: config.public.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: `${config.public.baseUrl}/auth/google/callback`,
      grant_type: 'authorization_code'
    })
    
    console.log('🔍 Request params:', params.toString())
    
    const tokenResponse = await $fetch<any>('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    }).catch((error: any) => {
      console.error('❌ Google token exchange error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        data: error.data
      })
      throw new Error(`Google OAuth error: ${error.message || 'Invalid authorization code'}`)
    })

    if (!tokenResponse.access_token) {
      throw new Error('Failed to get access token from Google')
    }

    console.log('✅ Step 1: Access token received')
    console.log('🔍 Token response:', { 
      hasAccessToken: !!tokenResponse.access_token,
      tokenType: tokenResponse.token_type,
      expiresIn: tokenResponse.expires_in
    })
    console.log('🔄 Step 2: Fetching user profile from Google...')

    // Step 2: Get user profile from Google
    const userProfile = await $fetch<any>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    }).catch((error: any) => {
      console.error('❌ Google user profile error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        data: error.data
      })
      throw new Error(`Failed to get user profile: ${error.message || 'Invalid access token'}`)
    })

    console.log('✅ Step 2: User profile received:', userProfile.email)
    console.log('🔄 Step 3: Sending to backend API for user creation & JWT generation...')

    // Step 3: Send to backend API to create/update user and get JWT
    try {
      const apiHost = config.apiHostInternal || config.public.apiHost
      const backendResponse = await $fetch<any>(`${apiHost}/api/a/auth/google/login`, {
        method: 'POST',
        body: {
          googleProfile: userProfile,
          googleAccessToken: tokenResponse.access_token
        }
      })

      console.log('✅ Step 3: Backend response received')
      console.log('📦 Backend response type:', typeof backendResponse)
      console.log('📦 Backend response keys:', Object.keys(backendResponse || {}))
      console.log('📦 Backend response:', JSON.stringify(backendResponse, null, 2))

      // Check if backend returned success
      if (!backendResponse || !backendResponse.data) {
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
            _id: userInfo._id,
            email: userInfo.email,
            fullname: userInfo.fullname,
            avatar: userInfo.avatar,
            role: userInfo.role || 'user',
            permissions: userInfo.permissions || [],
            provider: userInfo.provider || 'google',
            googleId: userInfo.googleId
          },
          accessToken: userData.accessToken,
          tokenExpireAt: userData.tokenExpireAt
        }
      }

    } catch (backendError: any) {
      console.error('❌ Backend API error:', backendError)
      throw new Error(backendError.message || 'Backend authentication failed')
    }

  } catch (error: any) {
    console.error('❌ Google login failed:', error)
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return {
      success: false,
      error: error.message || 'Google login failed'
    }
  }
})