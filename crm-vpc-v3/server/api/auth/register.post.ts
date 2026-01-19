/**
 * POST /api/auth/register
 * Register new account
 * Proxies to: POST /api/u/sessions
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';

  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email và mật khẩu là bắt buộc',
      });
    }

    if (body.password !== body.repeat_password) {
      throw createError({
        statusCode: 400,
        message: 'Mật khẩu xác nhận không khớp',
      });
    }

    const response = await $fetch(`${apiHost}/api/u/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        email: body.email,
        password: body.password,
        repeat_password: body.repeat_password,
        fullname: body.fullname || body.email.split('@')[0],
        phoneNumber: body.phone || body.phoneNumber || '', // Map 'phone' to 'phoneNumber' for backend
        domain: body.domain || 'vanphuccare.gensi.vn',
        origin: body.origin || 'vanphuccare.gensi.vn',
        source: 'crm', // Identify this is from CRM for email verification link
      },
    });
    return response;
  } catch (error: any) {
    // Forward error from backend
    // $fetch error structure: error.data contains the response body
    // Backend returns: { error: { code, message } } or { message }
    const statusCode = error.statusCode || error.status || error.data?.error?.code || 500;
    const message = error.data?.error?.message || error.data?.message || error.message || 'Đăng ký thất bại';
    throw createError({
      statusCode,
      message,
      data: error.data?.error,
    });
  }
});
