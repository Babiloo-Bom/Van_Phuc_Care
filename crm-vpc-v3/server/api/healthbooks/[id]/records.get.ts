/**
 * GET /api/healthbooks/:id/records
 * Get health records for a specific health book
 * Supports query: ?date=YYYY-MM-DD
 * Proxies to backend: GET /api/u/healthbooks/:id/records
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';
    const query = getQuery(event);

    // Get authorization header from client
    const authHeader = getHeader(event, 'authorization');

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'Authorization header is required',
      });
    }

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Health book ID is required',
      });
    }

    // Build query string
    const queryString = new URLSearchParams();
    if (query.date) queryString.append('date', String(query.date));
    if (query.startDate) queryString.append('startDate', String(query.startDate));
    if (query.endDate) queryString.append('endDate', String(query.endDate));
    if (query.page) queryString.append('page', String(query.page));
    if (query.limit) queryString.append('limit', String(query.limit));

    const queryStr = queryString.toString();
    const targetUrl = `${apiHost}/api/u/healthbooks/${id}/records${queryStr ? `?${queryStr}` : ''}`;

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    return response;
  } catch (error: any) {
    const id = getRouterParam(event, 'id');

    // If it's a 404, return empty data
    if (error.statusCode === 404 || error.status === 404) {
      return { data: null };
    }

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get health records',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get health records',
    });
  }
});
