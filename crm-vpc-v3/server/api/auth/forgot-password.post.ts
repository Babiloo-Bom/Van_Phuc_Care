/**
 * POST /api/auth/forgot-password
 * Send forgot password email
 * Proxies to: POST /api/u/sessions/forgot_password
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';

  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.email) {
      throw createError({
        statusCode: 400,
        message: 'Email là bắt buộc',
      });
    }

    const response = await $fetch(`${apiHost}/api/u/sessions/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: body.email,
        source: body.source || 'crm',
      },
    });

    return response;
  } catch (error: any) {
    // Forward error from backend
    const statusCode = error.statusCode || error.status || 500;
    const message = error.data?.message || error.data?.error || error.message || 'Không thể gửi email khôi phục mật khẩu';

    throw createError({
      statusCode,
      message,
      data: error.data,
    });
  }
});
