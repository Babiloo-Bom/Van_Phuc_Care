/**
 * GET /api/vaccinations/schedule
 * Get vaccination schedule (optionally merged with records)
 * Proxies to backend: GET /api/u/schedule-vaccins
 */

export default defineEventHandler(async (event) => {
  try {
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

    // Build query string
    const queryString = new URLSearchParams();
    if (query.healthBookId) queryString.append('healthBookId', String(query.healthBookId));
    if (query.customerId) queryString.append('customerId', String(query.customerId));

    const queryStr = queryString.toString();
    const targetUrl = `${apiHost}/api/u/schedule-vaccins${queryStr ? `?${queryStr}` : ''}`;
    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });
    return response;
  } catch (error: any) {
    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get vaccination schedule',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get vaccination schedule',
    });
  }
});
