/**
 * POST /api/tickets
 * Create new ticket with optional file attachments
 * Proxies to: POST /api/u/tickets
 * 
 * Supports multipart/form-data for file uploads
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  // Get authorization header
  const headers = getRequestHeaders(event);
  const authorization = headers.authorization;
  const contentType = headers['content-type'] || '';
  
  if (!authorization) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  try {
    let body: any;
    const fetchHeaders: Record<string, string> = {
      Authorization: authorization,
    };

    // Check if this is a multipart/form-data request (file upload)
    if (contentType.includes('multipart/form-data')) {
      // For multipart/form-data, we need to read raw body and pass through
      // with the original content-type header (including boundary)
      const rawBody = await readRawBody(event, false);
      body = rawBody;
      fetchHeaders['Content-Type'] = contentType;
    } else {
      // For regular JSON requests
      body = await readBody(event);
      fetchHeaders['Content-Type'] = 'application/json';
    }

    const response = await $fetch(`${apiHost}/api/u/tickets`, {
      method: 'POST',
      headers: fetchHeaders,
      body,
    });
    
    return response;
  } catch (error: any) {
    console.error('[tickets] POST error:', error.message || error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create ticket',
    });
  }
});
