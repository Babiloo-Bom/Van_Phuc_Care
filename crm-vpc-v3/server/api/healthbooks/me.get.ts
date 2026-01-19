/**
 * GET /api/healthbooks/me
 * Get current user's health book
 * Proxies to backend: GET /api/u/healthbooks/me
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
    // Forward request to backend
    const response = await $fetch(`${apiHost}/api/u/healthbooks/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });
    return response;
  } catch (error: any) {
    // If it's a 404 or similar, return empty data instead of error
    if (error.statusCode === 404 || error.status === 404) {
      return { data: null };
    }

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get health book',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get health book',
    });
  }
});
