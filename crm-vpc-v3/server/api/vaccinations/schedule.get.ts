/**
 * GET /api/vaccinations/schedule
 * Get vaccination schedule (optionally merged with records)
 * Proxies to backend: GET /api/u/schedule-vaccins
 */

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event);
    const apiHost = config.apiHostInternal || 'http://localhost:3000';
    const query = getQuery(event);

    console.log('🔍 [GET /api/vaccinations/schedule] Request received', {
      query,
      hasHealthBookId: !!query.healthBookId,
      hasCustomerId: !!query.customerId
    })

    // Get authorization header from client
    const authHeader = getHeader(event, 'authorization');

    if (!authHeader) {
      console.warn('⚠️ [GET /api/vaccinations/schedule] No authorization header')
      throw createError({
        statusCode: 401,
        message: 'Authorization header is required',
      });
    }

    // Build query string
    const queryString = new URLSearchParams();
    if (query.healthBookId) queryString.append('healthBookId', String(query.healthBookId));
    if (query.customerId) queryString.append('customerId', String(query.customerId));

    const queryStr = queryString.toString();
    const targetUrl = `${apiHost}/api/u/schedule-vaccins${queryStr ? `?${queryStr}` : ''}`;

    console.log(`📡 [GET /api/vaccinations/schedule] -> ${targetUrl}`);

    // Forward request to backend
    const response = await $fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    console.log('✅ [GET /api/vaccinations/schedule] Success', {
      hasResponse: !!response,
      responseType: typeof response,
      hasData: !!response?.data,
      scheduleVaccinLength: response?.data?.scheduleVaccin?.length
    });
    return response;
  } catch (error: any) {
    console.error('❌ [GET /api/vaccinations/schedule] Error:', error.message || error);
    console.error('❌ Error details:', {
      statusCode: error.statusCode,
      status: error.status,
      data: error.data
    });

    if (error.data) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.data?.message || error.message || 'Failed to get vaccination schedule',
        data: error.data,
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get vaccination schedule',
    });
  }
});
