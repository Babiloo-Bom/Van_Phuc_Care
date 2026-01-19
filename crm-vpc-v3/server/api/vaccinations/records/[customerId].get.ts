/**
 * GET /api/vaccinations/records/:customerId
 * Get vaccination records for a customer
 * Proxies to backend: GET /api/u/vaccination-records/:customerId
 */

export default defineEventHandler(async (event) => {
  try {
    const customerId = getRouterParam(event, 'customerId');
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

    if (!customerId) {
      throw createError({
        statusCode: 400,
        message: 'Customer ID is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/vaccination-records/${customerId}`;

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    return response;
  } catch (error: any) {
    const customerId = getRouterParam(event, 'customerId');

    if (error.statusCode === 404 || error.status === 404) {
      return { vaccinationRecords: [] };
    }

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get vaccination records',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get vaccination records',
    });
  }
});
