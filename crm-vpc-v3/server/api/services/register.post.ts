/**
 * POST /api/services/register
 * Register for a service
 * Proxies to backend: POST /api/u/services/register
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

    // Get request body
    const body = await readBody(event);

    const targetUrl = `${apiHost}/api/u/services/register`;

    console.log(`[POST /api/services/register] -> ${targetUrl}`);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log('[POST /api/services/register] Success');
    return response;
  } catch (error: any) {
    console.error('[POST /api/services/register] Error:', error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to register service',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to register service',
    });
  }
});
