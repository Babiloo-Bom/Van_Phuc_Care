/**
 * POST /api/auth/reset-password
 * Reset password with OTP token
 * Proxies to: POST /api/u/sessions/reset_password
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';

  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.email || !body.token || !body.newPassword) {
      throw createError({
        statusCode: 400,
        message: 'Email, mã OTP và mật khẩu mới là bắt buộc',
      });
    }

    const response = await $fetch(`${apiHost}/api/u/sessions/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: body.email,
        token: body.token,
        newPassword: body.newPassword,
        confirmPassword: body.confirmPassword || body.newPassword,
      },
    });

    return response;
  } catch (error: any) {
    // Forward error from backend
    const statusCode = error.statusCode || error.status || 500;
    const message = error.data?.message || error.data?.error || error.message || 'Không thể đặt lại mật khẩu';

    throw createError({
      statusCode,
      message,
      data: error.data,
    });
  }
});
