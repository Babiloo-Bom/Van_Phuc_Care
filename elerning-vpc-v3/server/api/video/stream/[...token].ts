/**
 * Nuxt server route để proxy video stream requests đến backend
 * Điều này giải quyết CORS issue và đảm bảo request đến được backend
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const backendUrl = config.apiHostInternal || process.env.NUXT_API_HOST_INTERNAL || 'http://localhost:3000';
  
  // Handle OPTIONS request for CORS preflight
  if (getMethod(event) === 'OPTIONS') {
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');
    return '';
  }
  
  // Get token from path params
  const params = getRouterParams(event);
  const token = params.token || '';
  
  // Get query parameters
  const query = getQuery(event);
  const queryString = new URLSearchParams(query as Record<string, string>).toString();
  
  // Construct backend URL
  const backendPath = `/api/u/video/stream/${token}${queryString ? `?${queryString}` : ''}`;
  const backendFullUrl = `${backendUrl}${backendPath}`;
  
  
  try {
    // Get request headers (filter out problematic ones)
    const requestHeaders: Record<string, string> = {};
    const headers = getHeaders(event);
    
    // Get frontend hostname from request
    const frontendHost = headers.host || headers['x-forwarded-host'] || 'localhost:3102';
    const frontendProtocol = headers['x-forwarded-proto'] || (headers['x-forwarded-ssl'] === 'on' ? 'https' : 'http');
    
    Object.entries(headers).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (!['host', 'connection', 'content-length'].includes(lowerKey) && value) {
        requestHeaders[key] = value;
      }
    });
    
    // Forward frontend hostname và protocol to backend để backend tạo đúng segment URLs
    // Backend sẽ dùng X-Forwarded-Host để tạo segment URLs với frontend hostname
    requestHeaders['X-Forwarded-Host'] = frontendHost;
    requestHeaders['X-Forwarded-Proto'] = frontendProtocol;
    
    
    // Proxy request to backend using $fetch.raw for streaming
    const response = await $fetch.raw(backendFullUrl, {
      method: getMethod(event) as any,
      headers: requestHeaders,
    });
    
    // Set response headers from backend
    response.headers.forEach((value, key) => {
      setHeader(event, key, value);
    });
    
    // Set CORS headers
    setHeader(event, 'Access-Control-Allow-Origin', '*');
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS');
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type');
    
    // Return response body (stream)
    return response._data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to proxy video stream request',
    });
  }
});

