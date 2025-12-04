/* eslint-disable no-console */

/**
 * Catch-all proxy for /a/* requests (without /api prefix)
 * Forwards requests to the backend API server as /api/a/*
 *
 * Example: /a/some/path -> http://api:3000/api/a/some/path
 */
export default defineEventHandler(async (event) => {
  const path = event.path;

  // Only handle /a/* paths
  if (!path.startsWith('/a/')) {
    return;
  }

  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  // Convert /a/* to /api/a/*
  const targetPath = '/api' + path;
  const targetUrl = `${apiHost}${targetPath}`;
  const method = getMethod(event);

  console.log(`[API Proxy /a] ${method} ${path} -> ${targetUrl}`);

  // Get original headers, forward important ones
  const originalHeaders = getRequestHeaders(event);
  const headers: Record<string, string> = {};
  
  // Forward authorization and content-type headers
  if (originalHeaders.authorization) {
    headers.authorization = originalHeaders.authorization;
  }
  if (originalHeaders['content-type']) {
    headers['content-type'] = originalHeaders['content-type'];
  }
  if (originalHeaders.accept) {
    headers.accept = originalHeaders.accept;
  }

  try {
    // Read body for methods that have body
    let body: any;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      body = await readBody(event).catch(() => undefined);
    }

    const response = await $fetch.raw(targetUrl, {
      method: method as any,
      headers,
      body,
      // Don't throw on error status codes
      ignoreResponseError: true,
    });

    // Set response status
    event.node.res.statusCode = response.status;

    // Forward response headers
    const responseHeaders = response.headers;
    responseHeaders.forEach((value, key) => {
      if (!['transfer-encoding', 'content-encoding', 'content-length'].includes(key.toLowerCase())) {
        event.node.res.setHeader(key, value);
      }
    });

    return response._data;
  } catch (error: any) {
    console.error(`[API Proxy /a] Error:`, error.message || error);
    
    // If it's a fetch error with response, forward it
    if (error.response) {
      event.node.res.statusCode = error.response.status || 500;
      return error.response._data || { error: error.message };
    }
    
    throw createError({
      statusCode: 502,
      message: `Proxy error: ${error.message}`,
    });
  }
});
