import { proxyRequest } from 'h3';

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

  console.log(`[API Proxy /a] ${event.method} ${path} -> ${targetUrl}`);

  // proxyRequest automatically handles method, headers, and body
  return proxyRequest(event, targetUrl);
});
