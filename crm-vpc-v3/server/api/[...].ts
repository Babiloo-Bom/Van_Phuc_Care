/**
 * Catch-all proxy for API requests
 * Forwards requests to the backend API server
 * 
 * Handles paths:
 * - /api/u/* -> http://api:3000/api/u/*
 * - /api/a/* -> http://api:3000/api/a/*
 * 
 * Uses proxyRequest for proper handling of all content types including multipart/form-data
 */
export default defineEventHandler(async (event) => {
  const path = event.path;
  
  // Check if this is an API path we should proxy
  if (!path.startsWith('/api/u/') && !path.startsWith('/api/a/')) {
    // Let other handlers deal with it or return 404
    return;
  }
  
  const config = useRuntimeConfig();
  
  // Get internal API host (accessible within Docker network)
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  const targetUrl = `${apiHost}${path}`;
  
  console.log(`[API Proxy] ${event.method} ${path} -> ${targetUrl}`);
  
  // Use proxyRequest for proper streaming of all content types (including multipart/form-data)
  return proxyRequest(event, targetUrl, {
    // Forward all headers except host
    headers: {
      ...Object.fromEntries(
        Object.entries(getHeaders(event)).filter(([key]) => 
          key.toLowerCase() !== 'host'
        )
      ),
    },
    // Fetch options
    fetchOptions: {
      // Preserve original method
      method: event.method,
    },
  });
});
