/**
 * Clear All Users API
 * Clears all users from mock service (for testing only)
 */

export default defineEventHandler(async (event) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      throw createError({
        statusCode: 403,
        statusMessage: 'This endpoint is only available in development'
      })
    }

    let result: any = {}
    
    try {
      // Try to use real database service
      const { UserService } = await import('~/server/services/UserService')
      // Note: Real database clear would need to be implemented
      result = { message: 'Real database clear not implemented', cleared: 0 }
    } catch (dbError: any) {
      
      // Fallback to mock service
      const { MockUserService } = await import('~/server/services/MockUserService')
      
      // Clear mock users
      const usersBefore = await MockUserService.getAllUsers()
      const count = usersBefore.length
      
      // Reset mock users array
      MockUserService['users'] = []
      
      result = { 
        message: 'Mock users cleared successfully', 
        cleared: count 
      }
    }
    
    return {
      success: true,
      data: result
    }

  } catch (error: any) {
    
    return {
      success: false,
      error: error.message || 'Failed to clear users'
    }
  }
})
