/**
 * Script to call seed courses API
 * Run with: node scripts/call-seed-api.js
 */
///
const fetch = require('node-fetch');

async function seedCourses() {
  try {
    
    const response = await fetch('http://localhost:3000/api/a/seed/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
    } else {
      const error = await response.text();
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

seedCourses();
