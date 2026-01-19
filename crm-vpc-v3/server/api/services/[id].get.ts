/**
 * GET /api/services/:id
 * Get service detail by ID or slug
 * Proxies to backend: GET /api/u/services/:id
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get authorization header from client (optional)
    const authHeader = getHeader(event, 'authorization');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Service ID is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/services/${id}`;

    // Build headers
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    return response;
  } catch (error: any) {
    const id = getRouterParam(event, 'id');

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get service detail',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get service detail',
    });
  }
});
