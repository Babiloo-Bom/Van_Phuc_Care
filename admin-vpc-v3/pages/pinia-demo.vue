<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Pinia State Management Demo</h1>
      <p class="text-gray-600 mt-2">Examples of using Pinia stores</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Auth Store Demo -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">🔐 Auth Store</h2>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">Status:</p>
            <p class="text-lg font-semibold" :class="authStore.isAuthenticated ? 'text-green-600' : 'text-red-600'">
              {{ authStore.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated' }}
            </p>
          </div>

          <div v-if="authStore.user" class="p-4 bg-blue-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700 mb-2">Current User:</p>
            <p class="text-sm"><strong>Name:</strong> {{ authStore.userName }}</p>
            <p class="text-sm"><strong>Email:</strong> {{ authStore.user.email }}</p>
            <p class="text-sm"><strong>Role:</strong> {{ authStore.userRole }}</p>
          </div>

          <div class="space-y-2">
            <button 
              @click="handleLogin" 
              class="btn-primary w-full"
              :disabled="authStore.isLoading || authStore.isAuthenticated"
            >
              {{ authStore.isLoading ? 'Loading...' : 'Demo Login' }}
            </button>
            
            <button 
              @click="authStore.logout()" 
              class="btn-secondary w-full"
              :disabled="!authStore.isAuthenticated"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <!-- App Store Demo -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">⚙️ App Store</h2>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">Sidebar:</p>
            <p class="text-lg font-semibold" :class="appStore.sidebarOpen ? 'text-green-600' : 'text-gray-600'">
              {{ appStore.sidebarOpen ? '📂 Open' : '📁 Closed' }}
            </p>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">Notifications:</p>
            <p class="text-lg font-semibold text-primary-600">
              {{ appStore.unreadCount }} unread
            </p>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700">Dark Mode:</p>
            <p class="text-lg font-semibold">
              {{ appStore.darkMode ? '🌙 Enabled' : '☀️ Disabled' }}
            </p>
          </div>

          <div class="space-y-2">
            <button 
              @click="appStore.toggleSidebar()" 
              class="btn-primary w-full"
            >
              Toggle Sidebar
            </button>
            
            <button 
              @click="addNotification('success')" 
              class="btn-secondary w-full"
            >
              Add Success Notification
            </button>

            <button 
              @click="appStore.toggleDarkMode()" 
              class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Toggle Dark Mode
            </button>
          </div>
        </div>
      </div>

      <!-- User Store Demo -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">👤 User Store</h2>
        
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700 mb-2">Preferences:</p>
            <p class="text-sm"><strong>Language:</strong> {{ userStore.preferences.language }}</p>
            <p class="text-sm"><strong>Timezone:</strong> {{ userStore.preferences.timezone }}</p>
            <p class="text-sm"><strong>Notifications:</strong> {{ userStore.preferences.notifications ? 'On' : 'Off' }}</p>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm font-medium text-gray-700 mb-2">Recent Activities:</p>
            <p class="text-lg font-semibold text-primary-600">
              {{ userStore.recentActivities.length }} activities
            </p>
          </div>

          <div class="space-y-2">
            <button 
              @click="updateLanguage" 
              class="btn-primary w-full"
            >
              Change Language
            </button>
            
            <button 
              @click="addActivity" 
              class="btn-secondary w-full"
            >
              Add Activity
            </button>

            <button 
              @click="userStore.clearActivities()" 
              class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Clear Activities
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Display -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">🔔 Notifications</h2>
        
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div 
            v-for="notif in appStore.notifications" 
            :key="notif.id"
            class="p-3 rounded-lg border-l-4"
            :class="{
              'bg-green-50 border-green-500': notif.type === 'success',
              'bg-red-50 border-red-500': notif.type === 'error',
              'bg-yellow-50 border-yellow-500': notif.type === 'warning',
              'bg-blue-50 border-blue-500': notif.type === 'info'
            }"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="font-semibold text-sm text-gray-900">{{ notif.title }}</p>
                <p class="text-sm text-gray-600">{{ notif.message }}</p>
              </div>
              <button 
                @click="appStore.removeNotification(notif.id)"
                class="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div v-if="appStore.notifications.length === 0" class="text-center text-gray-500 py-8">
            No notifications
          </div>
        </div>

        <div v-if="appStore.notifications.length > 0" class="mt-4 flex gap-2">
          <button 
            @click="appStore.markAllAsRead()" 
            class="btn-secondary flex-1"
          >
            Mark All Read
          </button>
          <button 
            @click="appStore.clearNotifications()" 
            class="btn-secondary flex-1"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Activities List -->
    <div class="card mt-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">📋 Recent Activities</h2>
      
      <div class="space-y-2">
        <div 
          v-for="activity in userStore.recentActivitiesList" 
          :key="activity.id"
          class="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
        >
          <div>
            <p class="font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-sm text-gray-600">{{ activity.description }}</p>
          </div>
          <span class="text-xs text-gray-500">
            {{ formatTime(activity.timestamp) }}
          </span>
        </div>

        <div v-if="userStore.recentActivities.length === 0" class="text-center text-gray-500 py-8">
          No activities yet
        </div>
      </div>
    </div>

    <!-- Code Examples -->
    <div class="card mt-6 bg-gray-900 text-gray-100">
      <h2 class="text-xl font-semibold mb-4">💻 Code Example</h2>
      <pre class="text-sm overflow-x-auto"><code>{{ codeExample }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Pinia Demo'
})

// Import stores
const authStore = useAuthStore()
const appStore = useAppStore()
const userStore = useUserStore()

// Initialize stores on mount
onMounted(() => {
  authStore.initAuth()
  appStore.initApp()
  userStore.initUser()
})

// Demo login
const handleLogin = async () => {
  // Simulate login with demo credentials
  authStore.user = {
    id: 1,
    email: 'admin@vanphuccare.com',
    name: 'Admin User',
    role: 'admin'
  }
  authStore.token = 'demo-token-123'
  authStore.isAuthenticated = true
  
  if (process.client) {
    localStorage.setItem('auth_token', 'demo-token-123')
    localStorage.setItem('user', JSON.stringify(authStore.user))
  }
  
  appStore.addNotification({
    title: 'Success',
    message: 'Logged in successfully!',
    type: 'success'
  })
}

// Add notification
const addNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
  const messages = {
    success: { title: 'Success', message: 'Operation completed successfully!' },
    error: { title: 'Error', message: 'Something went wrong!' },
    warning: { title: 'Warning', message: 'Please check your input!' },
    info: { title: 'Info', message: 'This is an informational message.' }
  }
  
  appStore.addNotification({
    ...messages[type],
    type
  })
}

// Update language
const updateLanguage = () => {
  const lang = userStore.preferences.language === 'en' ? 'vi' : 'en'
  userStore.updatePreferences({ language: lang })
  
  appStore.addNotification({
    title: 'Language Updated',
    message: `Language changed to ${lang.toUpperCase()}`,
    type: 'info'
  })
}

// Add activity
const addActivity = () => {
  userStore.addActivity({
    type: 'action',
    title: 'Demo Action',
    description: `Action performed at ${new Date().toLocaleTimeString()}`
  })
  
  appStore.addNotification({
    title: 'Activity Added',
    message: 'New activity recorded!',
    type: 'success'
  })
}

// Format time
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
  
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// Code example
const codeExample = `// Using Pinia stores in components
<script setup lang="ts">
const authStore = useAuthStore()
const appStore = useAppStore()

// Login
await authStore.login('email@example.com', 'password')

// Add notification
appStore.addNotification({
  title: 'Success',
  message: 'Action completed!',
  type: 'success'
})

// Access state
const user = authStore.currentUser
const isAuthenticated = authStore.isAuthenticated
</script>`
</script>

