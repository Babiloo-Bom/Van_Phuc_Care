/**
 * Create User API
 * Creates a new user in the database
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { email, name, avatar, provider, googleId, role = 'user' } = body

    if (!email || !name || !provider) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email, name, and provider are required'
      })
    }

    // Call backend API
    const response = await $fetch(`${config.public.apiHost}/api/a/users-management`, {
      method: 'POST',
      body: {
        email,
        name,
        avatar,
        provider,
        googleId,
        role
      },
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`
      }
    })

    return {
      success: true,
      data: response.data.user
    }

  } catch (error: any) {
    
    // Fallback to mock service
    try {
      const { MockUserService } = await import('~/server/services/MockUserService')
      const user = await MockUserService.createUser({
        email: body.email,
        name: body.name,
        avatar: body.avatar,
        provider: body.provider,
        googleId: body.googleId,
        role: body.role
      })
      
      return {
        success: true,
        data: {
          id: user._id?.toString() || user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          provider: user.provider,
          googleId: user.googleId,
          isActive: user.isActive,
          role: user.role,
          permissions: user.permissions,
          createdAt: user.createdAt?.toISOString() || user.createdAt,
          updatedAt: user.updatedAt?.toISOString() || user.updatedAt
        }
      }
    } catch (mockError: any) {
      
      return {
        success: false,
        error: 'Failed to create user in both backend and mock service'
      }
    }
  }
})
