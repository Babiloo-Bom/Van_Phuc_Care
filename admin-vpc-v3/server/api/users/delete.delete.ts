/**
 * Delete User API
 * Deletes a user
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const { id } = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Call backend API
    const response = await $fetch(`${config.public.apiHost}/api/a/users-management/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`
      }
    })

    return {
      success: true,
      data: response.data
    }

  } catch (error: any) {
    console.error('❌ User deletion from backend failed:', error)
    
    return {
      success: false,
      error: error.message || 'Failed to delete user'
    }
  }
})
