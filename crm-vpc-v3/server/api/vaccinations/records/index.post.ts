/**
 * POST /api/vaccinations/records
 * Create a new vaccination record
 * Proxies to backend: POST /api/u/vaccination-records
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
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

    const targetUrl = `${apiHost}/api/u/vaccination-records`;

    console.log('[POST /api/vaccinations/records] -> ', targetUrl);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log('[POST /api/vaccinations/records] Success');
    return response;
  } catch (error: any) {
    console.error('[POST /api/vaccinations/records] Error:', error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to create vaccination record',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create vaccination record',
    });
  }
});
