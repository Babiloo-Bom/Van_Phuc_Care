/**
 * DELETE /api/vaccinations/records/:id
 * Delete a vaccination record
 * Proxies to backend: DELETE /api/u/vaccination-records/:id
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
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
        message: 'Record ID is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/vaccination-records/${id}`;

    console.log(`[DELETE /api/vaccinations/records/${id}] -> ${targetUrl}`);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    console.log(`[DELETE /api/vaccinations/records/${id}] Success`);
    return response;
  } catch (error: any) {
    const id = getRouterParam(event, 'id');
    console.error(`[DELETE /api/vaccinations/records/${id}] Error:`, error.message || error);

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
