/**
 * Google User Profile API
 * Fetches user profile from Google using access token
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { accessToken } = body

    if (!accessToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Access token is required'
      })
    }

    // Get user profile from Google
    const profileResponse = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    return profileResponse

  } catch (error: any) {
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch Google user profile'
    })
  }
})
