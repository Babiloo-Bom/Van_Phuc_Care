<template>
  <div class="auth-example-page p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">🔐 Auth System - Usage Examples</h1>

    <!-- Status Display -->
    <div class="bg-blue-50 p-6 rounded-lg mb-8">
      <h2 class="text-xl font-semibold mb-4">Current Status</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-gray-600">Authenticated:</p>
          <p class="font-bold">{{ isAuthenticated ? '✅ Yes' : '❌ No' }}</p>
        </div>
        <div>
          <p class="text-gray-600">User:</p>
          <p class="font-bold">{{ user?.fullname || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Role:</p>
          <p class="font-bold">{{ user?.role || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Token Expires In:</p>
          <p class="font-bold">{{ tokenExpiresIn || 'N/A' }}</p>
        </div>
      </div>
      <div v-if="isTokenExpiringSoon" class="mt-4 p-3 bg-yellow-100 rounded">
        ⚠️ Token expiring soon!
      </div>
    </div>

    <!-- Example 1: Login -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 1: Login</h3>
      <div class="space-y-4">
        <input 
          v-model="loginForm.username" 
          type="text" 
          placeholder="Email or Phone"
          class="w-full border p-2 rounded"
        >
        <input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="Password"
          class="w-full border p-2 rounded"
        >
        <label class="flex items-center">
          <input v-model="loginForm.remindAccount" type="checkbox" class="mr-2">
          Remember Me
        </label>
        <button 
          @click="handleLogin" 
          :disabled="loginLoading"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loginLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="loginError" class="text-red-500">{{ loginError }}</p>
      </div>
      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono">const { login } = useAuth()</p>
        <p class="font-mono">await login(username, password, remindAccount)</p>
      </div>
    </div>

    <!-- Example 2: Logout -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 2: Logout</h3>
      <button 
        @click="handleLogout" 
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono">const { logout } = useAuth()</p>
        <p class="font-mono">await logout()</p>
      </div>
    </div>

    <!-- Example 3: Permission Check -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 3: Permission Check</h3>
      <div class="space-y-2">
        <p>Has 'delete' permission: {{ hasPermission('delete') ? '✅' : '❌' }}</p>
        <p>Has 'write' permission: {{ hasPermission('write') ? '✅' : '❌' }}</p>
        <p>Is Admin role: {{ hasRole('admin') ? '✅' : '❌' }}</p>
      </div>
      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono">const { hasPermission, hasRole } = useAuth()</p>
        <p class="font-mono">hasPermission('delete')</p>
        <p class="font-mono">hasRole('admin')</p>
      </div>
    </div>

    <!-- Example 4: Renew Token -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 4: Manual Token Renewal</h3>
      <button 
        @click="handleRenewToken" 
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Renew Token
      </button>
      <p v-if="renewResult" :class="renewResult.success ? 'text-green-500' : 'text-red-500'" class="mt-2">
        {{ renewResult.message }}
      </p>
      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono">const { renewToken } = useAuth()</p>
        <p class="font-mono">const success = await renewToken()</p>
      </div>
    </div>

    <!-- Example 5: Refresh User Data -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 5: Refresh User Data</h3>
      <button 
        @click="handleRefreshUser" 
        class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Refresh User
      </button>
      <div class="mt-4 bg-gray-50 p-3 rounded text-sm">
        <p class="font-mono">const { refreshUser } = useAuth()</p>
        <p class="font-mono">await refreshUser()</p>
      </div>
    </div>

    <!-- Code Reference -->
    <div class="bg-gray-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">📚 Full Documentation</h2>
      <p class="mb-2">Xem chi tiết tại: <code class="bg-white px-2 py-1 rounded">AUTH_SYSTEM_GUIDE.md</code></p>
      <p>Hoặc visit: <a href="/docs/auth-system" class="text-blue-500 underline">Auth System Docs</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import useAuth composable
const { 
  isAuthenticated, 
  user, 
  tokenExpiresIn, 
  isTokenExpiringSoon,
  login,
  logout,
  hasPermission,
  hasRole,
  renewToken,
  refreshUser
} = useAuth()

// Login form
const loginForm = reactive({
  username: 'admin001@gmail.com',
  password: 'admin001',
  remindAccount: true
})

const loginLoading = ref(false)
const loginError = ref('')

const handleLogin = async () => {
  loginLoading.value = true
  loginError.value = ''
  
  const result = await login(
    loginForm.username,
    loginForm.password,
    loginForm.remindAccount
  )
  
  if (!result.success) {
    loginError.value = result.error || 'Login failed'
  }
  
  loginLoading.value = false
}

// Logout
const handleLogout = async () => {
  await logout()
}

// Renew token
const renewResult = ref<{success: boolean, message: string} | null>(null)

const handleRenewToken = async () => {
  const success = await renewToken()
  renewResult.value = {
    success,
    message: success ? 'Token renewed successfully!' : 'Token renewal failed. Please login again.'
  }
  
  setTimeout(() => {
    renewResult.value = null
  }, 3000)
}

// Refresh user
const handleRefreshUser = async () => {
  const result = await refreshUser()
  if (result.success) {
    alert('User data refreshed!')
  } else {
    alert('Failed to refresh user data')
  }
}

// Page meta
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Custom styles if needed */
</style>

