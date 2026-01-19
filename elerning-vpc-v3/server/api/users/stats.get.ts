/**
 * User Statistics API
 * Returns user statistics and analytics
 */

export default defineEventHandler(async event => {
  try {
    const config = useRuntimeConfig();
    
    // Call backend API
    const apiHost = config.apiHostInternal || config.public.apiHost || 'http://localhost:3000'
    const response = await $fetch(`${apiHost}/api/a/users-management/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`,
      },
    });

    return {
      success: true,
      data: response.data,
    };

  } catch (error: any) {
    // Fallback to mock service
    try {
      const { MockUserService } = await import('~/server/services/MockUserService');
      const stats = await MockUserService.getUserStats();
      
      return {
        success: true,
        data: stats,
      };
    } catch (mockError: any) {
      
      return {
        success: false,
        error: 'Failed to get user statistics from both backend and mock service',
      };
    }
  }
});

