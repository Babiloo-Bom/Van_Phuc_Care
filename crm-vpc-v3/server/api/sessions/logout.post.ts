/**
 * POST /api/sessions/logout
 * Logout user session
 * Proxies to backend: POST /api/u/sessions/logout
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get authorization header from client
    const authHeader = getHeader(event, 'authorization');

    const targetUrl = `${apiHost}/api/u/sessions/logout`;
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'POST',
      headers,
    });
    return response;
  } catch (error: any) {
    // For logout, we don't want to throw errors - just return success
    // Backend might fail if session already expired, but that's OK
    return { status: true, message: 'Logged out' };
  }
});
