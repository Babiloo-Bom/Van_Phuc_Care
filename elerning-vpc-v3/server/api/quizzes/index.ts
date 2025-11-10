export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const url = getRequestURL(event)
  
  try {
    if (method === 'GET') {
      // Extract path parameters from URL
      const pathMatch = url.pathname.match(/\/api\/quizzes\/course\/([^\/]+)\/chapter\/([^\/]+)\/lesson\/([^\/]+)/)
      
      if (!pathMatch) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid URL format. Expected: /api/quizzes/course/{courseId}/chapter/{chapterId}/lesson/{lessonId}'
        })
      }
      
      const [, courseId, chapterId, lessonId] = pathMatch
      
      
      const response = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/course/${courseId}/chapter/${chapterId}/lesson/${lessonId}`, {
        method: 'GET'
      })
      
      return response
    } else if (method === 'POST') {
      // Submit quiz attempt
      const body = await readBody(event)
      
      const response = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')}`,
          'Content-Type': 'application/json'
        },
        body
      })
      
      return response
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
