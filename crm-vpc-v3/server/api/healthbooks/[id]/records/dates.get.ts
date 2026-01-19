/**
 * GET /api/healthbooks/:id/records/dates
 * Proxy to backend: GET /api/u/healthbooks/:id/records/dates?start=YYYY-MM-DD&end=YYYY-MM-DD
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
    if (query.start) queryString.append('start', String(query.start));
    if (query.end) queryString.append('end', String(query.end));

    const queryStr = queryString.toString();
    const targetUrl = `${apiHost}/api/u/healthbooks/${id}/records/dates${queryStr ? `?${queryStr}` : ''}`;

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

    if (error.statusCode === 404 || error.status === 404) {
      return { data: { dates: [] } };
    }

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get record dates',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get record dates',
    });
  }
});