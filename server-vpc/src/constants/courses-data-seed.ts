export const coursesData = [
    {
      title: 'Lập Trình Web Frontend với React.js',
      slug: 'lap-trinh-web-frontend-voi-reactjs',
      description: 'Khóa học toàn diện về lập trình web frontend sử dụng React.js, từ cơ bản đến nâng cao. Bạn sẽ học được cách xây dựng các ứng dụng web hiện đại, tương tác và responsive. Khóa học bao gồm các khái niệm cơ bản về React, hooks, state management, routing, và nhiều hơn nữa.',
      shortDescription: 'Học React.js từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại',
      thumbnail: '/images/courses/react-course.jpg',
      price: 299000,
      originalPrice: 599000,
      discount: 50,
      instructor: {
        name: 'Nguyễn Văn A',
        avatar: '/images/instructors/instructor-1.jpg',
        bio: 'Senior Frontend Developer với 5+ năm kinh nghiệm tại các công ty công nghệ hàng đầu'
      },
      //
      category: 'Lập Trình',
      level: 'beginner',
      duration: 1200,
      lessons: 45,
      students: 1250,
      rating: {
        average: 4.8,
        count: 320
      },
      tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
      isPublished: true,
      isFeatured: true,
      status: 'active',
      chapters: [
        {
          title: 'Giới thiệu về React',
          description: 'Tìm hiểu về React và cách thiết lập môi trường phát triển',
          lessons: [
            {
              title: 'React là gì?',
              description: 'Tìm hiểu về React và lịch sử phát triển',
              content: '<p>React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook...</p>',
              type: 'video',
              isPreview: true,
              videos: [{
                title: 'Giới thiệu React',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/react-intro.jpg',
                duration: 600,
                fileSize: 50000000,
                quality: '720',
                index: 0
              }],
              documents: [{
                title: 'Tài liệu React',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              duration: 600
            },
            {
              title: 'Cài đặt React và môi trường',
              description: 'Hướng dẫn cài đặt React và các công cụ cần thiết',
              content: '<p>Trong bài này, chúng ta sẽ học cách cài đặt React...</p>',
              type: 'video',
              isPreview: false,
              videos: [{
                title: 'Cài đặt React',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/react-setup.jpg',
                duration: 900,
                fileSize: 75000000,
                quality: '720',
                index: 0
              }],
              duration: 900
            },
            {
              title: 'Quiz: Kiến thức cơ bản về React',
              description: 'Kiểm tra kiến thức về React',
              content: '',
              type: 'quiz',
              isPreview: false,
              quiz: {
                title: 'Quiz: Kiến thức cơ bản về React',
                description: 'Kiểm tra hiểu biết về React',
                passingScore: 80,
                timeLimit: 15,
                attempts: 3,
                questions: [
                  {
                    id: 'q1',
                    question: 'React được phát triển bởi công ty nào?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Google', isCorrect: false },
                      { id: 'opt2', text: 'Facebook', isCorrect: true },
                      { id: 'opt3', text: 'Microsoft', isCorrect: false },
                      { id: 'opt4', text: 'Apple', isCorrect: false }
                    ],
                    correctAnswer: 'opt2',
                    explanation: 'React được phát triển bởi Facebook và được phát hành vào năm 2013.',
                    points: 1
                  },
                  {
                    id: 'q2',
                    question: 'React là một framework hay thư viện?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Framework', isCorrect: false },
                      { id: 'opt2', text: 'Thư viện', isCorrect: true },
                      { id: 'opt3', text: 'Cả hai', isCorrect: false }
                    ],
                    correctAnswer: 'opt2',
                    explanation: 'React là một thư viện JavaScript, không phải framework.',
                    points: 1
                  },
                  {
                    id: 'q3',
                    question: 'React sử dụng Virtual DOM?',
                    type: 'true-false',
                    options: [
                      { id: 'opt1', text: 'Đúng', isCorrect: true },
                      { id: 'opt2', text: 'Sai', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'React sử dụng Virtual DOM để tối ưu hóa hiệu suất rendering.',
                    points: 1
                  }
                ]
              }
            }
          ]
        },
        {
          title: 'Components và Props',
          description: 'Học về Components và cách truyền dữ liệu với Props',
          lessons: [
            {
              title: 'Tạo Component đầu tiên',
              description: 'Học cách tạo component trong React',
              content: '<p>Components là các khối xây dựng cơ bản của React...</p>',
              type: 'video',
              isPreview: false,
              videos: [{
                title: 'Tạo Component',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/react-component.jpg',
                duration: 1200,
                fileSize: 100000000,
                quality: '720',
                index: 0
              }],
              documents: [{
                title: 'Tài liệu Component',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              duration: 1200
            },
            {
              title: 'Props trong React',
              description: 'Học cách sử dụng Props để truyền dữ liệu',
              content: '<p>Props cho phép truyền dữ liệu từ component cha sang component con...</p>',
              type: 'video',
              isPreview: false,
              videos: [{
                title: 'Props trong React',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/react-props.jpg',
                duration: 1100,
                fileSize: 95000000,
                quality: '720',
                index: 0
              }],
              documents: [{
                title: 'Tài liệu Props trong React',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              duration: 1100
            },
            {
              title: 'Tài liệu tham khảo: Components',
              description: 'Tài liệu chi tiết về Components',
              content: '',
              type: 'document',
              isPreview: false,
              documents: [{
                title: 'Tài liệu Components',
                fileUrl: '/documents/react-components.pdf',
                fileName: 'react-components.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }]
            }
          ]
        }
      ]
    },
    {
      title: 'Thiết Kế UI/UX với Figma',
      slug: 'thiet-ke-ui-ux-voi-figma',
      description: 'Khóa học thiết kế giao diện người dùng và trải nghiệm người dùng chuyên nghiệp với Figma. Từ wireframe đến prototype hoàn chỉnh. Bạn sẽ học được các nguyên tắc thiết kế, cách sử dụng Figma hiệu quả, và tạo ra các sản phẩm thiết kế chuyên nghiệp.',
      shortDescription: 'Học thiết kế UI/UX chuyên nghiệp với Figma',
      thumbnail: '/images/courses/figma-course.jpg',
      price: 199000,
      originalPrice: 399000,
      discount: 50,
      instructor: {
        name: 'Trần Thị B',
        avatar: '/images/instructors/instructor-2.jpg',
        bio: 'UI/UX Designer với 6+ năm kinh nghiệm tại các công ty lớn như Google, Facebook'
      },
      category: 'Thiết Kế',
      level: 'beginner',
      duration: 900,
      lessons: 32,
      students: 890,
      rating: {
        average: 4.7,
        count: 156
      },
      tags: ['Figma', 'UI Design', 'UX Design', 'Prototype'],
      isPublished: true,
      isFeatured: true,
      status: 'active',
      chapters: [
        {
          title: 'Giới thiệu về Figma',
          description: 'Làm quen với Figma và các công cụ cơ bản',
          lessons: [
            {
              title: 'Figma là gì?',
              description: 'Tìm hiểu về Figma và các tính năng chính',
              content: '<p>Figma là một công cụ thiết kế giao diện dựa trên web...</p>',
              type: 'video',
              isPreview: true,
              videos: [{
                title: 'Giới thiệu Figma',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/figma-intro.jpg',
                duration: 500,
                fileSize: 40000000,
                quality: '720',
                index: 0
              }],
              documents: [{
                title: 'Tài liệu Figma',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              duration: 500
            },
            {
              title: 'Quiz: Kiến thức cơ bản Figma',
              description: 'Kiểm tra kiến thức về Figma',
              content: '',
              type: 'quiz',
              isPreview: false,
              quiz: {
                title: 'Quiz: Kiến thức cơ bản Figma',
                description: 'Kiểm tra hiểu biết về Figma',
                passingScore: 75,
                timeLimit: 10,
                attempts: 3,
                questions: [
                  {
                    id: 'q1',
                    question: 'Figma là công cụ thiết kế dựa trên gì?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Desktop App', isCorrect: false },
                      { id: 'opt2', text: 'Web Browser', isCorrect: true },
                      { id: 'opt3', text: 'Mobile App', isCorrect: false }
                    ],
                    correctAnswer: 'opt2',
                    explanation: 'Figma là công cụ thiết kế dựa trên web browser, không cần cài đặt.',
                    points: 1
                  },
                  {
                    id: 'q2',
                    question: 'Figma hỗ trợ collaboration real-time?',
                    type: 'true-false',
                    options: [
                      { id: 'opt1', text: 'Đúng', isCorrect: true },
                      { id: 'opt2', text: 'Sai', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'Figma hỗ trợ làm việc nhóm real-time, nhiều người có thể chỉnh sửa cùng lúc.',
                    points: 1
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      title: 'Phân Tích Dữ Liệu với Python',
      slug: 'phan-tich-du-lieu-voi-python',
      description: 'Khóa học phân tích dữ liệu và machine learning với Python. Sử dụng pandas, numpy, matplotlib và scikit-learn để xử lý và phân tích dữ liệu thực tế. Bạn sẽ học được cách làm việc với dữ liệu, trực quan hóa dữ liệu, và xây dựng các mô hình machine learning.',
      shortDescription: 'Học phân tích dữ liệu và ML với Python',
      thumbnail: '/images/courses/python-course.jpg',
      price: 399000,
      originalPrice: 799000,
      discount: 50,
      instructor: {
        name: 'Lê Văn C',
        avatar: '/images/instructors/instructor-3.jpg',
        bio: 'Data Scientist với 7+ năm kinh nghiệm trong lĩnh vực AI/ML, từng làm việc tại các công ty lớn'
      },
      category: 'Khoa Học Dữ Liệu',
      level: 'intermediate',
      duration: 1500,
      lessons: 58,
      students: 2100,
      rating: {
        average: 4.9,
        count: 445
      },
      tags: ['Python', 'Data Analysis', 'Machine Learning', 'Pandas', 'NumPy'],
      isPublished: true,
      isFeatured: false,
      status: 'active',
        chapters: [
        {
          title: 'Giới thiệu Python cho Data Science',
          description: 'Làm quen với Python và các thư viện cần thiết',
          lessons: [
            {
              title: 'Cài đặt môi trường Python',
              description: 'Hướng dẫn cài đặt Python và các thư viện',
              content: '<p>Trong bài này, chúng ta sẽ cài đặt Python và các thư viện cần thiết...</p>',
              type: 'video',
              isPreview: true,
              videos: [{
                title: 'Cài đặt Python',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/python-setup.jpg',
                duration: 700,
                fileSize: 60000000,
                quality: '720',
                index: 0
              }],
              documents: [{
                title: 'Tài liệu Python',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              duration: 700
            },
            {
              title: 'Quiz: Python và Pandas',
              description: 'Kiểm tra kiến thức về Python và Pandas',
              content: '',
              type: 'quiz',
              isPreview: false,
              quiz: {
                title: 'Quiz: Python và Pandas',
                description: 'Kiểm tra hiểu biết về Python và Pandas',
                passingScore: 80,
                timeLimit: 20,
                attempts: 3,
                questions: [
                  {
                    id: 'q1',
                    question: 'Pandas được sử dụng để làm gì?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Xử lý dữ liệu', isCorrect: true },
                      { id: 'opt2', text: 'Thiết kế web', isCorrect: false },
                      { id: 'opt3', text: 'Lập trình game', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'Pandas là thư viện Python chuyên dụng để xử lý và phân tích dữ liệu.',
                    points: 1
                  },
                  {
                    id: 'q2',
                    question: 'DataFrame trong Pandas là gì?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Cấu trúc dữ liệu 2 chiều', isCorrect: true },
                      { id: 'opt2', text: 'Cấu trúc dữ liệu 1 chiều', isCorrect: false },
                      { id: 'opt3', text: 'Cấu trúc dữ liệu 3 chiều', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'DataFrame là cấu trúc dữ liệu 2 chiều giống như bảng trong Excel.',
                    points: 1
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      title: 'Marketing Digital Toàn Diện',
      slug: 'marketing-digital-toan-dien',
      description: 'Khóa học marketing digital từ A-Z, bao gồm SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing. Phù hợp cho người mới bắt đầu và muốn nâng cao kỹ năng. Bạn sẽ học được cách tạo chiến lược marketing hiệu quả và đo lường kết quả.',
      shortDescription: 'Học marketing digital từ cơ bản đến nâng cao',
      thumbnail: '/images/courses/marketing-course.jpg',
      price: 249000,
      originalPrice: 499000,
      discount: 50,
      instructor: {
        name: 'Phạm Thị D',
        avatar: '/images/instructors/instructor-4.jpg',
        bio: 'Digital Marketing Manager với 8+ năm kinh nghiệm, từng quản lý ngân sách quảng cáo hàng triệu đô'
      },
      category: 'Marketing',
      level: 'beginner',
      duration: 1800,
      lessons: 67,
      students: 3200,
      rating: {
        average: 4.6,
        count: 678
      },
      tags: ['Digital Marketing', 'SEO', 'Google Ads', 'Facebook Ads', 'Content Marketing'],
      isPublished: true,
      isFeatured: true,
      status: 'active',
      chapters: [
        {
          title: 'Giới thiệu Marketing Digital',
          description: 'Tìm hiểu về marketing digital và các kênh chính',
          lessons: [
            {
              title: 'Marketing Digital là gì?',
              description: 'Tìm hiểu về marketing digital',
              content: '<p>Marketing digital là hình thức marketing sử dụng internet và công nghệ số...</p>',
              type: 'video',
              isPreview: true,
              documents: [{
                title: 'Tài liệu Marketing Digital',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              videos: [{
                title: 'Giới thiệu Marketing Digital',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/marketing-intro.jpg',
                duration: 600,
                fileSize: 50000000,
                quality: '720',
                index: 0
              }],
              duration: 600
            },
            {
              title: 'Quiz: Kiến thức Marketing Digital',
              description: 'Kiểm tra kiến thức về marketing digital',
              content: '',
              type: 'quiz',
              isPreview: false,
              quiz: {
                title: 'Quiz: Kiến thức Marketing Digital',
                description: 'Kiểm tra hiểu biết về marketing digital',
                passingScore: 70,
                timeLimit: 15,
                attempts: 3,
                questions: [
                  {
                    id: 'q1',
                    question: 'SEO là viết tắt của gì?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Search Engine Optimization', isCorrect: true },
                      { id: 'opt2', text: 'Social Engine Optimization', isCorrect: false },
                      { id: 'opt3', text: 'Simple Engine Optimization', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'SEO là Search Engine Optimization - tối ưu hóa công cụ tìm kiếm.',
                    points: 1
                  },
                  {
                    id: 'q2',
                    question: 'CPC trong Google Ads là gì?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Cost Per Click', isCorrect: true },
                      { id: 'opt2', text: 'Cost Per Conversion', isCorrect: false },
                      { id: 'opt3', text: 'Cost Per Campaign', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'CPC là Cost Per Click - chi phí mỗi lần click.',
                    points: 1
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      title: 'Lập Trình Backend với Node.js',
      slug: 'lap-trinh-backend-voi-nodejs',
      description: 'Khóa học lập trình backend với Node.js từ cơ bản đến nâng cao. Bạn sẽ học được cách xây dựng RESTful API, làm việc với database, authentication, và deploy ứng dụng. Khóa học bao gồm Express.js, MongoDB, JWT, và nhiều công nghệ khác.',
      shortDescription: 'Học lập trình backend với Node.js và Express',
      thumbnail: '/images/courses/nodejs-course.jpg',
      price: 349000,
      originalPrice: 699000,
      discount: 50,
      instructor: {
        name: 'Hoàng Văn E',
        avatar: '/images/instructors/instructor-5.jpg',
        bio: 'Full-stack Developer với 6+ năm kinh nghiệm, chuyên về Node.js và microservices'
      },
      category: 'Lập Trình',
      level: 'intermediate',
      duration: 1400,
      lessons: 52,
      students: 1850,
      rating: {
        average: 4.7,
        count: 412
      },
      tags: ['Node.js', 'Express', 'Backend', 'API', 'MongoDB'],
      isPublished: true,
      isFeatured: false,
      status: 'active',
      chapters: [
        {
          title: 'Giới thiệu Node.js',
          description: 'Làm quen với Node.js và môi trường runtime',
          lessons: [
            {
              title: 'Node.js là gì?',
              description: 'Tìm hiểu về Node.js và JavaScript runtime',
              content: '<p>Node.js là một JavaScript runtime được xây dựng trên Chrome V8 engine...</p>',
              type: 'video',
              isPreview: true,
              videos: [{
                title: 'Giới thiệu Node.js',
                videoUrl: 'https://videos.pexels.com/video-files/5752729/5752729-uhd_2560_1440_30fps.mp4',
                thumbnail: '/images/thumbnails/nodejs-intro.jpg',
                duration: 550,
                fileSize: 45000000,
                quality: '720',
                index: 0
              }],
              documents: [{
                title: 'Tài liệu NodeJS',
                fileUrl: 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
                fileName: 'c4611_sample_explain.pdf',
                fileSize: 1024000,
                fileType: 'application/pdf',
                index: 0
              }],
              duration: 550
            },
            {
              title: 'Quiz: Kiến thức Node.js',
              description: 'Kiểm tra kiến thức về Node.js',
              content: '',
              type: 'quiz',
              isPreview: false,
              quiz: {
                title: 'Quiz: Kiến thức Node.js',
                description: 'Kiểm tra hiểu biết về Node.js',
                passingScore: 80,
                timeLimit: 15,
                attempts: 3,
                questions: [
                  {
                    id: 'q1',
                    question: 'Node.js chạy trên môi trường nào?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Browser', isCorrect: false },
                      { id: 'opt2', text: 'Server', isCorrect: true },
                      { id: 'opt3', text: 'Mobile', isCorrect: false }
                    ],
                    correctAnswer: 'opt2',
                    explanation: 'Node.js chạy trên server-side, không phải browser.',
                    points: 1
                  },
                  {
                    id: 'q2',
                    question: 'NPM là gì?',
                    type: 'multiple-choice',
                    options: [
                      { id: 'opt1', text: 'Node Package Manager', isCorrect: true },
                      { id: 'opt2', text: 'Node Program Manager', isCorrect: false },
                      { id: 'opt3', text: 'Node Project Manager', isCorrect: false }
                    ],
                    correctAnswer: 'opt1',
                    explanation: 'NPM là Node Package Manager - công cụ quản lý package của Node.js.',
                    points: 1
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ];