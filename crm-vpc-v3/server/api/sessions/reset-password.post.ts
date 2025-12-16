/**
 * POST /api/sessions/reset-password
 * Proxy to backend: POST /api/u/sessions/reset_password
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';

    // Get request body
    const body = await readBody(event);

    const targetUrl = `${apiHost}/api/u/sessions/reset_password`;
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
        message: error.data?.message || error.message || 'Đặt lại mật khẩu thất bại',
        data: error.data,
      });
    }
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Đặt lại mật khẩu thất bại',
    });
  }
});
