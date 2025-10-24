/**
 * Toggle User Status API
 * Activates or deactivates a user
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { id, isActive } = body

    if (!id || typeof isActive !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID and isActive status are required'
      })
    }

    // Call backend API
    const response = await $fetch(`${config.public.apiHost}/api/a/users-management/${id}/status`, {
      method: 'PATCH',
      body: { isActive },
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`
      }
    })

    return {
      success: true,
      data: response.data.user
    }

  } catch (error: any) {
    console.error('❌ User status toggle from backend failed:', error)
    
    return {
      success: false,
      error: error.message || 'Failed to toggle user status'
    }
  }
})
