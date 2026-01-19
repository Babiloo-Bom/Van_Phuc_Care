/**
 * POST /api/feedbacks
 * Submit user feedback
 * Proxies to backend: POST /api/u/feedbacks
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get authorization header from client (optional for feedback)
    const authHeader = getHeader(event, 'authorization');

    // Get request body
    const body = await readBody(event);

    const targetUrl = `${apiHost}/api/u/feedbacks`;
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
      body,
    });
    return response;
  } catch (error: any) {
    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to submit feedback',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to submit feedback',
    });
  }
});
