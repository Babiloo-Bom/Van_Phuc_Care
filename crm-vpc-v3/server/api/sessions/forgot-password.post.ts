
/**
 * POST /api/sessions/forgot-password
 * Proxy to backend: POST /api/u/sessions/forgot_password
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get request body
    const body = await readBody(event);

    const targetUrl = `${apiHost}/api/u/sessions/forgot_password`;
    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    return response;
  } catch (error: any) {
    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Gửi OTP thất bại',
        data: error.data,
      });
    }
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Gửi OTP thất bại',
    });
  }
});
