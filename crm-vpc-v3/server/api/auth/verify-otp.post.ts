/**
 * POST /api/auth/verify-otp
 * Verify OTP for password reset
 * Proxies to: POST /api/u/sessions/verify_otp
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';

  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.email || !body.otp) {
      throw createError({
        statusCode: 400,
        message: 'Email và mã OTP là bắt buộc',
      });
    }

    const response = await $fetch(`${apiHost}/api/u/sessions/verify_otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: body.email,
        otp: body.otp,
      },
    });

    return response;
  } catch (error: any) {
    // Forward error from backend
    const statusCode = error.statusCode || error.status || 500;
    const message = error.data?.message || error.data?.error || error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';

    throw createError({
      statusCode,
      message,
      data: error.data,
    });
  }
});
