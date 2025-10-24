/**
 * Google Login API
 * Complete Google OAuth login flow
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, state, redirectUri } = body

    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Authorization code is required'
      })
    }

    const config = useRuntimeConfig()
    
    // Step 1: Exchange code for token
    const tokenResponse = await $fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: config.public.googleClientId,
        client_secret: config.googleClientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    })

    // Step 2: Get user profile
    const profileResponse = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`
      }
    })

    // Step 3: Create or find user in database
    let user: any
    
    try {
      // Try to use real database service
      const { UserService } = await import('~/server/services/UserService')
      
      const googleUserData = {
        id: profileResponse.id,
        email: profileResponse.email,
        name: profileResponse.name,
        given_name: profileResponse.given_name,
        family_name: profileResponse.family_name,
        picture: profileResponse.picture,
        verified_email: profileResponse.verified_email,
        locale: profileResponse.locale
      }

      user = await UserService.createOrUpdateGoogleUser(googleUserData)
    } catch (dbError: any) {
      console.warn('⚠️ Database not available, using mock service:', dbError.message)
      
      // Fallback to mock service
      const { MockUserService } = await import('~/server/services/MockUserService')
      
      const googleUserData = {
        id: profileResponse.id,
        email: profileResponse.email,
        name: profileResponse.name,
        given_name: profileResponse.given_name,
        family_name: profileResponse.family_name,
        picture: profileResponse.picture,
        verified_email: profileResponse.verified_email,
        locale: profileResponse.locale
      }

      user = await MockUserService.createOrUpdateGoogleUser(googleUserData)
    }

    // Step 4: Generate JWT tokens
    const { JWTService } = await import('~/server/services/JWTService')
    const jwtTokens = JWTService.generateTokenPair(user)

    return {
      success: true,
      data: {
        accessToken: jwtTokens.accessToken,
        refreshToken: jwtTokens.refreshToken,
        tokenExpireAt: jwtTokens.tokenExpireAt,
        refreshTokenExpireAt: jwtTokens.refreshTokenExpireAt,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider,
          googleId: user.googleId,
          isActive: user.isActive,
          role: user.role,
          permissions: user.permissions,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Google login failed:', error)
    
    return {
      success: false,
      error: error.message || 'Google login failed'
    }
  }
})
