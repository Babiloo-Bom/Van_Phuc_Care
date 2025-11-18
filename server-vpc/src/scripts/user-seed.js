/**
 * Seed users by calling the seed API
 * Run: node scripts/user-seed.js
 */
const fetch = require('node-fetch');

async function seedUsers() {
  try {
    console.log('👥 Calling seed users API...\n');
    
    const response = await fetch('http://localhost:3000/api/a/seed/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result.message);
      
      if (result.data && result.data.count) {
        console.log(`\n📊 Total users seeded: ${result.data.count}\n`);
        console.log('👥 Users:');
        
        result.data.users.forEach((user, index) => {
          console.log(`\n${index + 1}. ${user.fullname}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Phone: ${user.phoneNumber}`);
          console.log(`   Status: ${user.status}`);
          console.log(`   Type: ${user.type}`);
          console.log(`   ID: ${user._id}`);
        });
        
        console.log("\n✅ All users seeded successfully!");
        console.log("\n🔐 Login credentials:");
        console.log("   Email: nguyenvana@example.com");
        console.log("   Password: user123");
      } else {
        console.log('📊 Response:', JSON.stringify(result, null, 2));
      }
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
      console.log('Status:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the API server is running on http://localhost:3000');
  }
}

seedUsers();
