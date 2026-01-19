/**
 * PATCH /api/healthbooks/:id
 * Update a health book (supports file upload for avatar)
 * Proxies to backend: PATCH /api/u/healthbooks/:id
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
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

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Health book ID is required',
      });
    }

    const targetUrl = `${apiHost}/api/u/healthbooks/${id}`;
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

      // Forward multipart request to backend using native fetch
      const response = await fetch(targetUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader,
          'Content-Type': contentType,
        },
        body: rawBody,
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
    } else {
      // For JSON requests, use $fetch
      const body = await readBody(event);

      const response = await $fetch(targetUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body,
      });

      return response;
    }
  } catch (error: any) {
    const id = getRouterParam(event, 'id');

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to update health book',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update health book',
    });
  }
});
