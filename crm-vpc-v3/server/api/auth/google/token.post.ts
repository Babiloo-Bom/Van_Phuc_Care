/**
 * Google OAuth Token Exchange API
 * Exchanges authorization code for access token
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code, redirectUri } = body

    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Authorization code is required'
      })
    }

    const config = useRuntimeConfig()
    
    // Exchange code for token with Google
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

    return tokenResponse

  } catch (error: any) {
    console.error('❌ Google token exchange failed:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to exchange Google authorization code'
    })
  }
})

