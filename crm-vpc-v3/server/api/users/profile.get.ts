/**
 * GET /api/users/profile
 * Get current user profile
 * Proxies to backend: GET /api/u/users/profile
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get authorization header from client
    const authHeader = getHeader(event, 'authorization');

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'Authorization header is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/users/profile`;

    console.log(`[GET /api/users/profile] -> ${targetUrl}`);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    console.log('[GET /api/users/profile] Success');
    return response;
  } catch (error: any) {
    console.error('[GET /api/users/profile] Error:', error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get user profile',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get user profile',
    });
  }
});
