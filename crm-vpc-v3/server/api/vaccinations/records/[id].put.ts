/**
 * PUT /api/vaccinations/records/:id
 * Update a vaccination record
 * Proxies to backend: PUT /api/u/vaccination-records/:id
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
        message: 'Record ID is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/vaccination-records/${id}`;

    console.log(`[PUT /api/vaccinations/records/${id}] -> ${targetUrl}`);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log(`[PUT /api/vaccinations/records/${id}] Success`);
    return response;
  } catch (error: any) {
    const id = getRouterParam(event, 'id');
    console.error(`[PUT /api/vaccinations/records/${id}] Error:`, error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to update vaccination record',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update vaccination record',
    });
  }
});
