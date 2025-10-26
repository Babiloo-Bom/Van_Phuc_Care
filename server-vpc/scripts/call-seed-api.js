/**
 * Script to call seed courses API
 * Run with: node scripts/call-seed-api.js
 */

const fetch = require('node-fetch');

async function seedCourses() {
  try {
    console.log('🚀 Calling seed courses API...');
    
    const response = await fetch('http://localhost:3000/api/a/seed/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result.message);
      if (result.courses && result.courses.length > 0) {
        console.log('📚 Courses added:', result.courses.length);
        result.courses.forEach((course, index) => {
          console.log(`${index + 1}. ${course.title} - ${course.price.toLocaleString('vi-VN')} VNĐ`);
        });
      } else {
        console.log('📚 Response:', JSON.stringify(result, null, 2));
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

seedCourses();
