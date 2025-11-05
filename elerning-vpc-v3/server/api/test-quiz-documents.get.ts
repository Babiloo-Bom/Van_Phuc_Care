export default defineEventHandler(async event => {
  try {
    console.log('🧪 Testing Quiz and Document APIs...');
    
    // Test quiz seeding
    console.log('📝 Testing quiz seeding...');
    const quizResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/seed`, {
      method: 'POST',
    });
    console.log('✅ Quiz seeding result:', quizResponse.message);
    
    // Test document seeding
    console.log('📄 Testing document seeding...');
    const documentResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/seed`, {
      method: 'POST',
    });
    console.log('✅ Document seeding result:', documentResponse.message);
    
    // Test getting quiz
    console.log('🔍 Testing get quiz...');
    const getQuizResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/quizzes/course/68fcdc39f681bccec39c8ef0/chapter/0/lesson/0`, {
      method: 'GET',
    });
    console.log('✅ Get quiz result:', getQuizResponse.success ? 'Quiz found' : 'No quiz');
    
    // Test getting documents
    console.log('🔍 Testing get documents...');
    const getDocsResponse = await $fetch(`${process.env.API_BASE_URL}/api/a/documents/course/68fcdc39f681bccec39c8ef0/chapter/0/lesson/0`, {
      method: 'GET',
    });
    console.log('✅ Get documents result:', getDocsResponse.success ? `${getDocsResponse.data.documents.length} documents found` : 'No documents');
    
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
    console.error('❌ API test error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'API test failed',
    });
  }
});
