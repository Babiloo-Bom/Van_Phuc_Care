export default defineEventHandler(async (event) => {
  try {
    
    const quizResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/seed`, {
      method: 'POST'
    })
    
    
    const documentResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/seed`, {
      method: 'POST'
    })
    
    
    return {
      success: true,
      message: 'Quiz and document data seeded successfully',
      data: {
        quizzes: quizResponse.data,
        documents: documentResponse.data
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to seed data'
    })
  }
})
