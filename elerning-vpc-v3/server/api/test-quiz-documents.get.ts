export default defineEventHandler(async event => {
  try {
    
    // Test quiz seeding
    const quizResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/seed`, {
      method: 'POST'
    })
    
    // Test document seeding
    const documentResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/seed`, {
      method: 'POST'
    })
    
    // Test getting quiz
    const getQuizResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/course/68fcdc39f681bccec39c8ef0/chapter/0/lesson/0`, {
      method: 'GET'
    })
    
    // Test getting documents
    const getDocsResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/course/68fcdc39f681bccec39c8ef0/chapter/0/lesson/0`, {
      method: 'GET'
    })
    
    return {
      success: true,
      message: 'All API tests completed successfully',
      results: {
        quizSeeding: quizResponse.message,
        documentSeeding: documentResponse.message,
        quizFound: getQuizResponse.success,
        documentsFound: getDocsResponse.data.documents.length,
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'API test failed',
    });
  }
});
