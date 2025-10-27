export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const url = getRequestURL(event)
  
  try {
    if (method === 'GET') {
      // Extract path parameters from URL
      const pathMatch = url.pathname.match(/\/api\/documents\/course\/([^\/]+)\/chapter\/([^\/]+)\/lesson\/([^\/]+)/)
      
      if (!pathMatch) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid URL format. Expected: /api/documents/course/{courseId}/chapter/{chapterIndex}/lesson/{lessonIndex}'
        })
      }
      
      const [, courseId, chapterIndex, lessonIndex] = pathMatch
      
      console.log('🔍 Documents API Proxy:', { courseId, chapterIndex, lessonIndex })
      
      const response = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/course/${courseId}/chapter/${chapterIndex}/lesson/${lessonIndex}`, {
        method: 'GET'
      })
      
      console.log('✅ Documents API Response:', response)
      return response
    }
    
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  } catch (error: any) {
    console.error('❌ Documents API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
