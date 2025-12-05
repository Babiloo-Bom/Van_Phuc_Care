/**
 * POST /api/healthbooks
 * Create a new health book for the current user
 * Proxies to backend: POST /api/u/healthbooks
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

    console.log('[POST /api/healthbooks] -> /api/u/healthbooks', { name: body.name });

    // Forward request to backend
    const response = await $fetch(`${apiHost}/api/u/healthbooks`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: {
        name: body.name,
        dob: body.dob,
        gender: body.gender,
        avatar: body.avatar,
      },
    });

    console.log('[POST /api/healthbooks] Success');
    return response;
  } catch (error: any) {
    console.error('[POST /api/healthbooks] Error:', error.message || error);

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to create health book',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create health book',
    });
  }
});
