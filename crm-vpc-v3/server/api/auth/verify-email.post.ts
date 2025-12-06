/**
 * POST /api/auth/verify-email
 * Verify email with OTP after registration
 * Proxies to: POST /api/u/sessions/verify_email
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

    const response = await $fetch(`${apiHost}/api/u/sessions/verify_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: body.email,
        otp: body.otp,
        origin: body.origin || 'vanphuccare.gensi.vn',
      },
    });

    return response;
  } catch (error: any) {
    // Forward error from backend
    const statusCode = error.statusCode || error.status || 500;
    const message = error.data?.message || error.data?.error || error.message || 'Xác minh email thất bại';

    throw createError({
      statusCode,
      message,
      data: error.data,
    });
  }
});
