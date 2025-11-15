/**
 * Script to update course chapters via API
 * Run with: node scripts/update-chapters.js
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api/a';

// Chapters data
const chaptersData = {
  chapters: [
    {
      title: "Chương 1: Giới thiệu về Python và Data Science",
      description: "Tìm hiểu cơ bản về Python và các thư viện quan trọng",
      lessons: [
        { title: "Bài 1: Cài đặt Python và Jupyter Notebook", duration: 30, type: "video" },
        { title: "Bài 2: Cú pháp cơ bản Python", duration: 45, type: "video" },
        { title: "Bài 3: Cấu trúc dữ liệu trong Python", duration: 60, type: "video" },
        { title: "Bài 4: Quiz - Kiểm tra kiến thức chương 1", duration: 15, type: "quiz" }
      ]
    },
    {
      title: "Chương 2: Thư viện Pandas cho xử lý dữ liệu",
      description: "Học cách sử dụng Pandas để đọc, xử lý và phân tích dữ liệu",
      lessons: [
        { title: "Bài 5: Giới thiệu Pandas và DataFrame", duration: 40, type: "video" },
        { title: "Bài 6: Đọc và ghi dữ liệu với Pandas", duration: 50, type: "video" },
        { title: "Bài 7: Làm sạch dữ liệu (Data Cleaning)", duration: 70, type: "video" },
        { title: "Bài 8: Thực hành với dataset thực tế", duration: 90, type: "video" },
        { title: "Bài 9: Quiz - Pandas cơ bản", duration: 20, type: "quiz" }
      ]
    },
    {
      title: "Chương 3: Trực quan hóa dữ liệu với Matplotlib và Seaborn",
      description: "Tạo các biểu đồ và đồ thị để hiển thị dữ liệu",
      lessons: [
        { title: "Bài 10: Giới thiệu Matplotlib", duration: 35, type: "video" },
        { title: "Bài 11: Vẽ biểu đồ cơ bản", duration: 45, type: "video" },
        { title: "Bài 12: Seaborn cho visualization nâng cao", duration: 55, type: "video" },
        { title: "Bài 13: Tạo dashboard đơn giản", duration: 80, type: "video" }
      ]
    },
    {
      title: "Chương 4: Machine Learning cơ bản với Scikit-learn",
      description: "Áp dụng các thuật toán ML để dự đoán và phân loại",
      lessons: [
        { title: "Bài 14: Giới thiệu Machine Learning", duration: 40, type: "video" },
        { title: "Bài 15: Linear Regression", duration: 60, type: "video" },
        { title: "Bài 16: Classification với Random Forest", duration: 70, type: "video" },
        { title: "Bài 17: Đánh giá mô hình ML", duration: 50, type: "video" },
        { title: "Bài 18: Dự án cuối khóa", duration: 120, type: "project" }
      ]
    }
  ]
};

async function updateCourseChapters() {
  try {
    
    const response = await fetch(`${API_BASE}/courses/phan-tich-du-lieu-voi-python/chapters`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chaptersData)
    });

    const result = await response.json();
  } catch (error) {
    console.error('❌ Error updating course chapters:', error);
  }
}

// Run the script
updateCourseChapters();
