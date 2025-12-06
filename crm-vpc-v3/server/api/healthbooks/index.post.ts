/**
 * POST /api/healthbooks
 * Create a new health book for the current user (supports file upload for avatar)
 * Proxies to backend: POST /api/u/healthbooks
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

    const targetUrl = `${apiHost}/api/u/healthbooks`;

    // Check if it's multipart form data (file upload)
    if (contentType.includes('multipart/form-data')) {
      // For file uploads, read raw body and forward it
      const rawBody = await readRawBody(event, false);
      
      if (!rawBody) {
        throw createError({
          statusCode: 400,
          message: 'Request body is required',
        });
      }

      console.log(`[POST /api/healthbooks] Forwarding multipart, size: ${rawBody.length} bytes`);

      // Forward multipart request to backend using native fetch
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': contentType,
        },
        body: rawBody,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`[POST /api/healthbooks] Backend error:`, response.status, errorData);
        throw createError({
          statusCode: response.status,
          message: errorData.message || `Backend returned ${response.status}`,
          data: errorData,
        });
      }

      const data = await response.json();
      console.log(`[POST /api/healthbooks] Success`);
      return data;
    } else {
      // For JSON requests, use $fetch
      const body = await readBody(event);

      console.log('[POST /api/healthbooks] -> /api/u/healthbooks', { name: body.name });

      const response = await $fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: {
          name: body.name,
          dob: body.dob,
          gender: body.gender,
        },
      });

      console.log('[POST /api/healthbooks] Success');
      return response;
    }
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
