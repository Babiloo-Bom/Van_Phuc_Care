/**
 * POST /api/auth/login
 * Login with email/phone and password
 * Proxies to: POST /api/u/sessions/login
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiHost = config.apiHostInternal || 'http://localhost:3000';

  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: 'Email/số điện thoại và mật khẩu là bắt buộc',
      });
    }

    const response = await $fetch(`${apiHost}/api/u/sessions/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username: body.username,
        password: body.password,
        remindAccount: body.remindAccount || false,
        origin: body.origin || 'vanphuccare.gensi.vn',
      },
    });

    return response;
  } catch (error: any) {
    // Forward error from backend
    const statusCode = error.statusCode || error.status || 500;
    const message = error.data?.message || error.data?.error || error.message || 'Đăng nhập thất bại';

    throw createError({
      statusCode,
      message,
      data: error.data,
    });
  }
});
