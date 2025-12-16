export default defineEventHandler(async event => {
  const method = getMethod(event);
  const query = getQuery(event);
  
  try {
    if (method === 'GET') {
      // Get user's progress
      const response = await $fetch(`${process.env.API_BASE_URL}/api/a/progress`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')}`,
        },
      });
      
      return response;
    } else if (method === 'POST') {
      // Save user's progress
      const body = await readBody(event);
      
      const response = await $fetch(`${process.env.API_BASE_URL}/api/a/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      
      return response;
    } else if (method === 'PUT') {
      // Mark lesson as completed
      const body = await readBody(event);
      
      const response = await $fetch(`${process.env.API_BASE_URL}/api/u/progress/lesson-completed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')}`,
          'Content-Type': 'application/json',
        },
        body,
      });
      
      return response;
    } else if (method === 'DELETE') {
      // Reset progress for a course (user scope)
      const courseId = query.courseId as string;
      
      if (!courseId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Course ID is required',
        });
      }
      
      const response = await $fetch(`${process.env.API_BASE_URL}/api/u/progress/course/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')}`,
        },
      });
      
      return response;
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    });
  } catch (error: any) {
    // Surface backend status code/message to make debugging easier
    const statusFromResponse = error?.response?.status;
    const messageFromResponse =
      error?.response?._data?.message ||
      error?.response?._data?.statusMessage ||
      error?.response?._data?.error;

    throw createError({
      statusCode: statusFromResponse || error.statusCode || 500,
      statusMessage:
        messageFromResponse ||
        error.statusMessage ||
        error.message ||
        'Internal server error',
    });
  }
});
