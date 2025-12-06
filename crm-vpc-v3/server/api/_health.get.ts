/**
 * GET /api/_health
 * Health check endpoint for Nuxt server
 * Returns 200 OK if server is running
 * Updated: 2025-12-06 - Trigger rebuild with new server endpoints
 */

export default defineEventHandler(async (event) => {
  // Set explicit 200 status
  setResponseStatus(event, 200);
  console.log('[GET /api/_health] Health check OK!');
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'nuxt-nitro',
    environment: process.env.NODE_ENV || 'unknown',
    version: '1.1.0', // Added to track deployment
  };
});
