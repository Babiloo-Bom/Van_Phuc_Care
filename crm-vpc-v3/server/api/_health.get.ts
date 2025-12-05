/**
 * GET /api/_health
 * Health check endpoint for debugging
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    server: 'nuxt-nitro',
    config: {
      apiHostInternal: config.apiHostInternal || 'not-set',
      port: process.env.PORT || 'not-set',
      host: process.env.HOST || 'not-set',
    },
    routes: {
      healthbooks: '/api/healthbooks/*',
      tickets: '/api/tickets/*',
      auth: '/api/auth/*',
      users: '/api/users/*',
    }
  };
});
