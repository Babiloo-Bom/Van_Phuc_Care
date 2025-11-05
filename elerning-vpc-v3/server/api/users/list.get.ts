/**
 * Get All Users API
 * Returns list of all users (with fallback to mock service)
 */

export default defineEventHandler(async event => {
  try {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    
    // Call backend API
    const response = await $fetch(`${config.public.apiHost}/api/a/users-management`, {
      method: 'GET',
      query,
      headers: {
        'Authorization': `Bearer ${getHeader(event, 'authorization')?.replace('Bearer ', '') || ''}`,
      },
    });

    return {
      success: true,
      data: {
        users: response.data.users || [],
        total: response.data.pagination?.total || 0,
      },
    };

  } catch (error: any) {
    console.error('❌ Get users from backend failed:', error);
    
    // Fallback to mock service
    try {
      const { MockUserService } = await import('~/server/services/MockUserService');
      const users = await MockUserService.getAllUsers();
      
      return {
        success: true,
        data: {
          users: users.map(user => ({
            id: user._id?.toString() || user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            provider: user.provider,
            googleId: user.googleId,
            isActive: user.isActive,
            role: user.role,
            permissions: user.permissions || [],
            createdAt: user.createdAt?.toISOString() || user.createdAt,
            updatedAt: user.updatedAt?.toISOString() || user.updatedAt,
          })),
          total: users.length,
        },
      };
    } catch (mockError: any) {
      console.error('❌ Mock service also failed:', mockError);
      
      return {
        success: false,
        error: 'Failed to get users from both backend and mock service',
      };
    }
  }
});

