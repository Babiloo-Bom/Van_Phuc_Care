/**
 * Google OAuth Redirect Endpoint
 * Redirects browser to backend Google OAuth flow
 * 
 * GET /api/auth/google?redirect_uri=xxx&frontend_url=xxx
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  
  // Get query parameters
  const redirectUri = query.redirect_uri as string;
  const frontendUrl = query.frontend_url as string;
  
  if (!redirectUri || !frontendUrl) {
    throw createError({
      statusCode: 400,
      message: 'Missing redirect_uri or frontend_url parameter',
    });
  }
  
  // Backend API host (internal Docker network or localhost)
  const apiHost = config.apiHostInternal || 'http://localhost:3000';
  
  // Build backend OAuth URL - use /api/u for user endpoints
  const backendOAuthUrl = `${apiHost}/api/u/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&frontend_url=${encodeURIComponent(frontendUrl)}`;
  
  // Redirect browser to backend OAuth endpoint
  // Backend will then redirect to Google OAuth
  return sendRedirect(event, backendOAuthUrl);
});
