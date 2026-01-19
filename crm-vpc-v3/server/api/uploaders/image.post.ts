/**
 * POST /api/uploaders/image
 * Upload image file
 * Proxies to backend: POST /api/uploaders/image
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get authorization header from client
    const authHeader = getHeader(event, 'authorization');
    const contentType = getHeader(event, 'content-type') || '';

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'Authorization header is required',
      });
    }

    const targetUrl = `${apiHost}/api/uploaders/image`;

    // Always read raw body for multipart/form-data
    const rawBody = await readRawBody(event, false);
    
    if (!rawBody) {
      throw createError({
        statusCode: 400,
        message: 'Request body is required',
      });
    }
    // Forward multipart request to backend using native fetch
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': contentType,
      },
      body: rawBody as any,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw createError({
        statusCode: response.status,
        message: errorData.message || `Backend returned ${response.status}`,
        data: errorData,
      });
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to upload image',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to upload image',
    });
  }
});

