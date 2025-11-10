/**
 * Simple script to add courses directly to MongoDB
 * Run with: node scripts/seed-courses-simple.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/vanphuccare';

// Sample courses data
const sampleCourses = [
  {
    title: "Lập Trình Web Frontend với React.js",
    slug: "lap-trinh-web-frontend-voi-reactjs",
    description: "Khóa học toàn diện về lập trình web frontend sử dụng React.js, từ cơ bản đến nâng cao. Bạn sẽ học được cách xây dựng các ứng dụng web hiện đại, tương tác và responsive.",
    shortDescription: "Học React.js từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại",
    thumbnail: "/images/courses/react-course.jpg",
    price: 299000,
    originalPrice: 599000,
    discount: 50,
    instructor: {
      name: "Nguyễn Văn A",
      avatar: "/images/instructors/instructor-1.jpg",
      bio: "Senior Frontend Developer với 5+ năm kinh nghiệm"
    },
    category: "Lập Trình",
    level: "beginner",
    duration: 1200,
    lessons: 45,
    students: 1250,
    rating: {
      average: 4.8,
      count: 320
    },
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    isPublished: true,
    isFeatured: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Thiết Kế UI/UX với Figma",
    slug: "thiet-ke-ui-ux-voi-figma",
    description: "Khóa học thiết kế giao diện người dùng và trải nghiệm người dùng chuyên nghiệp với Figma. Từ wireframe đến prototype hoàn chỉnh.",
    shortDescription: "Học thiết kế UI/UX chuyên nghiệp với Figma",
    thumbnail: "/images/courses/figma-course.jpg",
    price: 199000,
    originalPrice: 399000,
    discount: 50,
    instructor: {
      name: "Trần Thị B",
      avatar: "/images/instructors/instructor-2.jpg",
      bio: "UI/UX Designer với 6+ năm kinh nghiệm tại các công ty lớn"
    },
    category: "Thiết Kế",
    level: "beginner",
    duration: 900,
    lessons: 32,
    students: 890,
    rating: {
      average: 4.7,
      count: 156
    },
    tags: ["Figma", "UI Design", "UX Design", "Prototype"],
    isPublished: true,
    isFeatured: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Phân Tích Dữ Liệu với Python",
    slug: "phan-tich-du-lieu-voi-python",
    description: "Khóa học phân tích dữ liệu và machine learning với Python. Sử dụng pandas, numpy, matplotlib và scikit-learn để xử lý và phân tích dữ liệu thực tế.",
    shortDescription: "Học phân tích dữ liệu và ML với Python",
    thumbnail: "/images/courses/python-course.jpg",
    price: 399000,
    originalPrice: 799000,
    discount: 50,
    instructor: {
      name: "Lê Văn C",
      avatar: "/images/instructors/instructor-3.jpg",
      bio: "Data Scientist với 7+ năm kinh nghiệm trong lĩnh vực AI/ML"
    },
    category: "Khoa Học Dữ Liệu",
    level: "intermediate",
    duration: 1500,
    lessons: 58,
    students: 2100,
    rating: {
      average: 4.9,
      count: 445
    },
    tags: ["Python", "Data Analysis", "Machine Learning", "Pandas", "NumPy"],
    isPublished: true,
    isFeatured: false,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Marketing Digital Toàn Diện",
    slug: "marketing-digital-toan-dien",
    description: "Khóa học marketing digital từ A-Z, bao gồm SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing. Phù hợp cho người mới bắt đầu và muốn nâng cao kỹ năng.",
    shortDescription: "Học marketing digital từ cơ bản đến nâng cao",
    thumbnail: "/images/courses/marketing-course.jpg",
    price: 249000,
    originalPrice: 499000,
    discount: 50,
    instructor: {
      name: "Phạm Thị D",
      avatar: "/images/instructors/instructor-4.jpg",
      bio: "Digital Marketing Manager với 8+ năm kinh nghiệm"
    },
    category: "Marketing",
    level: "beginner",
    duration: 1800,
    lessons: 67,
    students: 3200,
    rating: {
      average: 4.6,
      count: 678
    },
    tags: ["Digital Marketing", "SEO", "Google Ads", "Facebook Ads", "Content Marketing"],
    isPublished: true,
    isFeatured: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedCourses() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('vanphuccare');
    const coursesCollection = db.collection('courses');
    
    // Clear existing courses
    await coursesCollection.deleteMany({});
    
    // Insert sample courses
    const result = await coursesCollection.insertMany(sampleCourses);
    
  } catch (error) {
  } finally {
    await client.close();
  }
}

// Run the seeding function
seedCourses();
