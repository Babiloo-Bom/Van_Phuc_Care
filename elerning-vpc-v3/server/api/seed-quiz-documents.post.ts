export default defineEventHandler(async (event) => {
  try {
    console.log('🌱 Starting to seed quiz and document data...')
    
    // Seed quizzes
    const quizResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/seed`, {
      method: 'POST'
    })
    
    console.log('✅ Quizzes seeded:', quizResponse.message)
    
    // Seed documents
    const documentResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/seed`, {
      method: 'POST'
    })
    
    console.log('✅ Documents seeded:', documentResponse.message)
    
    return {
      success: true,
      message: 'Quiz and document data seeded successfully',
      data: {
        quizzes: quizResponse.data,
        documents: documentResponse.data
      }
    }
  } catch (error: any) {
    console.error('❌ Error seeding data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to seed data'
    })
  }
})
