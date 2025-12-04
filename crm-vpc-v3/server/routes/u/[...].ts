import { proxyRequest } from 'h3';

/**
 * Catch-all proxy for /u/* requests (without /api prefix)
 * Forwards requests to the backend API server as /api/u/*
 *
 * Example: /u/sessions/login -> http://api:3000/api/u/sessions/login
 */
export default defineEventHandler(async (event) => {
  const path = event.path;

  // Only handle /u/* paths
  if (!path.startsWith('/u/')) {
    return;
  }

  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  // Convert /u/* to /api/u/*
  const targetPath = '/api' + path;
  const targetUrl = `${apiHost}${targetPath}`;

  console.log(`[API Proxy /u] ${event.method} ${path} -> ${targetUrl}`);

  // proxyRequest automatically handles method, headers, and body
  return proxyRequest(event, targetUrl);
});
