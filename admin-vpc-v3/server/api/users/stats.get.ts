/**
 * User Statistics API
 * Returns user statistics and analytics
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Call backend API
    const response = await $fetch(`${config.public.apiHost}/api/a/users-management/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`
      }
    })

    return {
      success: true,
      data: response.data
    }

  } catch (error: any) {
    console.error('❌ Get user stats from backend failed:', error)
    
    // Fallback to mock service
    try {
      const { MockUserService } = await import('~/server/services/MockUserService')
      const stats = await MockUserService.getUserStats()
      
      return {
        success: true,
        data: stats
      }
    } catch (mockError: any) {
      console.error('❌ Mock service also failed:', mockError)
      
      return {
        success: false,
        error: 'Failed to get user statistics from both backend and mock service'
      }
    }
  }
})
