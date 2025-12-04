/**
 * Catch-all proxy for /u/* requests (without /api prefix)
 * Forwards requests to the backend API server as /api/u/*
 * 
 * Example: /u/sessions/login -> http://api:3000/api/u/sessions/login
 * 
 * Uses proxyRequest for proper handling of all content types including multipart/form-data
 */
export default defineEventHandler(async (event) => {
  const path = event.path;
  
  // Only handle /u/* paths
  if (!path.startsWith('/u/')) {
    return;
  }
  
  const config = useRuntimeConfig();
  
  // Get internal API host (accessible within Docker network)
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  // Convert /u/* to /api/u/*
  const targetPath = '/api' + path;
  const targetUrl = `${apiHost}${targetPath}`;
  
  console.log(`[API Proxy /u] ${event.method} ${path} -> ${targetUrl}`);
  
  // Use proxyRequest for proper streaming of all content types (including multipart/form-data)
  return proxyRequest(event, targetUrl, {
    headers: {
      ...Object.fromEntries(
        Object.entries(getHeaders(event)).filter(([key]) => 
          key.toLowerCase() !== 'host'
        )
      ),
    },
    fetchOptions: {
      method: event.method,
    },
  });
});
