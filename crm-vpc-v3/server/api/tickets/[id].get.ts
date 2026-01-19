/**
 * GET /api/tickets/:id
 * Get ticket details by ID
 * Proxies to: GET /api/u/tickets/:id
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

  const ticketId = event.context.params?.id;
  if (!ticketId) {
    throw createError({
      statusCode: 400,
      message: 'Ticket ID is required',
    });
  }

  try {
    const response = await $fetch(`${apiHost}/api/u/tickets/${ticketId}`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    });
    
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get ticket',
    });
  }
});
