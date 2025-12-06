/**
 * GET /api/services
 * Get all services (public)
 * Proxies to backend: GET /api/u/services
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';
    const query = getQuery(event);

    // Get authorization header from client (optional)
    const authHeader = getHeader(event, 'authorization');

    // Build query string
    const queryString = new URLSearchParams();
    if (query.page) queryString.append('page', String(query.page));
    if (query.limit) queryString.append('limit', String(query.limit));
    if (query.search) queryString.append('search', String(query.search));

    const queryStr = queryString.toString();
    const targetUrl = `${apiHost}/api/u/services${queryStr ? `?${queryStr}` : ''}`;

    console.log(`[GET /api/services] -> ${targetUrl}`);

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

    console.log('[GET /api/services] Success');
    return response;
  } catch (error: any) {
    console.error('[GET /api/services] Error:', error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get services',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get services',
    });
  }
});
