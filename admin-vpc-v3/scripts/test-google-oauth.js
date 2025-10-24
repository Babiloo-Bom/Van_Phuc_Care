/**
 * Google OAuth Test Script
 * Tests the complete Google OAuth flow
 */

const testGoogleOAuth = async () => {
  console.log('🧪 Testing Google OAuth Flow...\n')

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connection...')
    const serverResponse = await fetch('http://localhost:3100')
    if (serverResponse.ok) {
      console.log('✅ Server is running')
    } else {
      throw new Error('Server is not running')
    }

    // Test 2: Test Google OAuth config
    console.log('\n2️⃣ Testing Google OAuth configuration...')
    const configResponse = await fetch('http://localhost:3100/api/auth/google/config')
    if (configResponse.ok) {
      const config = await configResponse.json()
      console.log('✅ Google OAuth config loaded:', config)
    } else {
      console.log('⚠️ Google OAuth config not available (expected if not configured)')
    }

    // Test 3: Test user creation API
    console.log('\n3️⃣ Testing user creation API...')
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google',
      googleId: 'test-google-id-123'
    }

    const userResponse = await fetch('http://localhost:3100/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    })

    if (userResponse.ok) {
      const userData = await userResponse.json()
      console.log('✅ User creation API working:', userData)
    } else {
      const error = await userResponse.text()
      console.log('❌ User creation failed:', error)
    }

    // Test 4: Test user stats API
    console.log('\n4️⃣ Testing user statistics API...')
    const statsResponse = await fetch('http://localhost:3100/api/users/stats')
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ User stats API working:', stats)
    } else {
      const error = await statsResponse.text()
      console.log('❌ User stats failed:', error)
    }

    console.log('\n🎉 Google OAuth test completed!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

// Run the test
testGoogleOAuth()
