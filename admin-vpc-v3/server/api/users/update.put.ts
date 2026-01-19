/**
 * Update User API
 * Updates user information
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { id, ...updateData } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Call backend API
    const response = await $fetch(`${config.public.apiHost}/api/a/users-management/${id}`, {
      method: 'PUT',
      body: updateData,
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`
      }
    })

    return {
      success: true,
      data: response.data.user
    }

  } catch (error: any) {
    
    return {
      success: false,
      error: error.message || 'Failed to update user'
    }
  }
})
