/**
 * DELETE /api/vaccinations/records/by-vaccine/:vaccineId
 * Delete a vaccination record by vaccineId and healthBookId
 * Proxies to backend: DELETE /api/u/vaccination-records/by-vaccine/:vaccineId
 */

export default defineEventHandler(async (event) => {
  try {
    const vaccineId = getRouterParam(event, 'vaccineId');
    const query = getQuery(event);
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

    if (!vaccineId) {
      throw createError({
        statusCode: 400,
        message: 'Vaccine ID is required',
      });
    }

    if (!query.healthBookId) {
      throw createError({
        statusCode: 400,
        message: 'healthBookId is required',
      });
    }

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('healthBookId', String(query.healthBookId));
    if (query.injectionNumber) {
      queryParams.append('injectionNumber', String(query.injectionNumber));
    }

    const targetUrl = `${apiHost}/api/u/vaccination-records/by-vaccine/${vaccineId}?${queryParams.toString()}`;

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    return response;
  } catch (error: any) {
    const vaccineId = getRouterParam(event, 'vaccineId');

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to delete vaccination record',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete vaccination record',
    });
  }
});

