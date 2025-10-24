/**
 * Google Profile API
 * Fetches user profile from Google using access token
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { accessToken } = body

    if (!accessToken) {
      throw createError({
        statusCode: 400,
        message: 'Access token is required'
      })
    }

    const config = useRuntimeConfig()

    // Fetch user profile from Google
    const userProfile = await $fetch(config.public.googleUserInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    return userProfile

  } catch (error: any) {
    console.error('❌ Profile fetch failed:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch user profile'
    })
  }
})

