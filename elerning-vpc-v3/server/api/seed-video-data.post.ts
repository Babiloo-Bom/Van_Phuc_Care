export default defineEventHandler(async event => {
  try {
    console.log('🎬 Starting to seed video data...');
    
    // Sample video data for testing
    const videoData = {
      courses: [
        {
          courseId: '68fcdc39f681bccec39c8ef0', // Python course ID
          chapters: [
            {
              title: 'Giới thiệu Python',
              index: 0,
              lessons: [
                {
                  title: 'Python cơ bản',
                  index: 0,
                  description: 'Tìm hiểu về Python và cú pháp cơ bản',
                  videoUrl: 'https://cdn.synck.io.vn/vanphuccare/videos/python-basics.mp4',
                  thumbnail: 'https://cdn.synck.io.vn/vanphuccare/videos/python-basics-thumb.jpg',
                  fileSize: 62914560, // 60MB
                  quality: '1080',
                  duration: 2400, // 40 minutes
                  content: '<p>Python là ngôn ngữ lập trình đa năng, dễ học và mạnh mẽ...</p>',
                  videoIframe: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`,
                },
                {
                  title: 'Biến và kiểu dữ liệu',
                  index: 1,
                  description: 'Học về biến và các kiểu dữ liệu trong Python',
                  videoUrl: 'https://cdn.synck.io.vn/vanphuccare/videos/python-variables.mp4',
                  thumbnail: 'https://cdn.synck.io.vn/vanphuccare/videos/python-variables-thumb.jpg',
                  fileSize: 47185920, // 45MB
                  quality: '1080',
                  duration: 1800, // 30 minutes
                  content: '<p>Biến trong Python được khai báo đơn giản và linh hoạt...</p>',
                  videoIframe: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`,
                },
              ],
            },
            {
              title: 'Cấu trúc điều khiển',
              index: 1,
              lessons: [
                {
                  title: 'Vòng lặp và điều kiện',
                  index: 0,
                  description: 'Học về if-else, for, while trong Python',
                  videoUrl: 'https://cdn.synck.io.vn/vanphuccare/videos/python-loops.mp4',
                  thumbnail: 'https://cdn.synck.io.vn/vanphuccare/videos/python-loops-thumb.jpg',
                  fileSize: 52428800, // 50MB
                  quality: '1080',
                  duration: 2100, // 35 minutes
                  content: '<p>Vòng lặp giúp thực hiện một đoạn code nhiều lần...</p>',
                  videoIframe: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`,
                },
              ],
            },
          ],
        },
      ],
    };
    
    // Update course with video data
    const response = await $fetch(`${process.env.API_BASE_URL}/api/a/courses/68fcdc39f681bccec39c8ef0/chapters`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        chapters: videoData.courses[0].chapters,
      },
    });
    
    console.log('✅ Video data seeded:', response.message);
    
    return {
      success: true,
      message: 'Video data seeded successfully',
      data: videoData,
    };
  } catch (error: any) {
    console.error('❌ Error seeding video data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to seed video data',
    });
  }
});
