/**
 * GET /api/tickets
 * Get user's tickets
 * Proxies to: GET /api/u/tickets
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  // Get authorization header
  const headers = getRequestHeaders(event);
  const authorization = headers.authorization;
  
  if (!authorization) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Get query params
  const query = getQuery(event);
  
  try {
    const response = await $fetch(`${apiHost}/api/u/tickets`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      query,
    });
    
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get tickets',
    });
  }
});
