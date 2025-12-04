import { proxyRequest } from 'h3';

/**
 * Catch-all proxy for API requests
 * Forwards requests to the backend API server
 *
 * Handles paths:
 * - /api/u/* -> http://api:3000/api/u/*
 * - /api/a/* -> http://api:3000/api/a/*
 */
export default defineEventHandler(async (event) => {
  const path = event.path;

  // Check if this is an API path we should proxy
  if (!path.startsWith('/api/u/') && !path.startsWith('/api/a/')) {
    return;
  }

  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  const targetUrl = `${apiHost}${path}`;

  console.log(`[API Proxy] ${event.method} ${path} -> ${targetUrl}`);

  // proxyRequest automatically handles method, headers, and body
  return proxyRequest(event, targetUrl);
});
