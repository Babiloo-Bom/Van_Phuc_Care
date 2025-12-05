/**
 * POST /api/healthbooks/:id/records
 * Create or update (upsert) a health record
 * Proxies to backend: POST /api/u/healthbooks/:id/records
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
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

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Health book ID is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/healthbooks/${id}/records`;
    console.log(`[POST /api/healthbooks/${id}/records] -> ${targetUrl}`);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log(`[POST /api/healthbooks/${id}/records] Success`);
    return response;
  } catch (error: any) {
    const id = getRouterParam(event, 'id');
    console.error(`[POST /api/healthbooks/${id}/records] Error:`, error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to save health record',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to save health record',
    });
  }
});
