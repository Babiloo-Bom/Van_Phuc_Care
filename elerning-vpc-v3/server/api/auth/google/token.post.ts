/**
 * Google Token Exchange API
 * Exchanges authorization code for access token
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { code } = body

    if (!code) {
      throw createError({
        statusCode: 400,
        message: 'Authorization code is required'
      })
    }

    const config = useRuntimeConfig()

    // Exchange code for token
    const tokenResponse = await $fetch(config.public.googleTokenUrl, {
      method: 'POST',
      body: {
        code,
        client_id: config.public.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: `${config.public.baseUrl}/auth/google/callback`,
        grant_type: 'authorization_code'
      }
    })

    return tokenResponse

  } catch (error: any) {
    console.error('❌ Token exchange failed:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to exchange code for token'
    })
  }
})

