<template>
  <div class="middleware-example-page p-8 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">🛡️ Middleware System - Usage Examples</h1>

    <!-- Current User Info -->
    <div class="bg-blue-50 p-6 rounded-lg mb-8">
      <h2 class="text-xl font-semibold mb-4">Current User</h2>
      <div v-if="isAuthenticated" class="space-y-2">
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Role:</strong> <span class="px-2 py-1 bg-blue-200 rounded">{{ user?.role }}</span></p>
        <p><strong>Permissions:</strong> 
          <span v-for="perm in user?.permissions" :key="perm" class="px-2 py-1 bg-green-200 rounded mr-2">
            {{ perm }}
          </span>
        </p>
      </div>
      <p v-else class="text-gray-600">Not authenticated</p>
    </div>

    <!-- Example 1: Basic Auth Middleware -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 1: Basic Auth Protection</h3>
      <p class="text-gray-600 mb-4">Protect a page that requires login</p>
      
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-mono mb-2">pages/profile.vue</p>
        <pre class="text-xs"><code>&lt;script setup&gt;
definePageMeta({
  middleware: 'auth' // Require authentication
})
&lt;/script&gt;

&lt;template&gt;
  &lt;div&gt;
    &lt;h1&gt;My Profile&lt;/h1&gt;
    &lt;!-- Only authenticated users can see this --&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
      </div>
      
      <button 
        @click="navigateWithAuth('/profile')" 
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Try Navigate to Protected Page
      </button>
    </div>

    <!-- Example 2: Role-based Protection -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 2: Role-based Protection</h3>
      <p class="text-gray-600 mb-4">Only admins can access</p>
      
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-mono mb-2">pages/admin/settings.vue</p>
        <pre class="text-xs"><code>&lt;script setup&gt;
definePageMeta({
  middleware: ['auth', 'role'],
  requiredRole: 'admin'
})
&lt;/script&gt;</code></pre>
      </div>

      <button 
        @click="testRoleAccess" 
        class="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Test Admin Access (Role: {{ user?.role }})
      </button>
    </div>

    <!-- Example 3: Permission-based Protection -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 3: Permission-based Protection</h3>
      <p class="text-gray-600 mb-4">Requires specific permissions</p>
      
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-mono mb-2">pages/users/manage.vue</p>
        <pre class="text-xs"><code>&lt;script setup&gt;
definePageMeta({
  middleware: ['auth', 'permission'],
  requiredPermissions: ['users.write', 'users.delete']
})
&lt;/script&gt;</code></pre>
      </div>

      <button 
        @click="testPermissionAccess" 
        class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Test Permission Access
      </button>
    </div>

    <!-- Example 4: Admin Shortcut -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 4: Admin Shortcut Middleware</h3>
      <p class="text-gray-600 mb-4">Quick way to protect admin pages</p>
      
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-mono mb-2">pages/admin/dashboard.vue</p>
        <pre class="text-xs"><code>&lt;script setup&gt;
definePageMeta({
  middleware: 'admin' // Shortcut for admin-only
})
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <!-- Example 5: Guest Middleware -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 5: Guest-only Pages</h3>
      <p class="text-gray-600 mb-4">Redirect authenticated users</p>
      
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-mono mb-2">pages/login.vue</p>
        <pre class="text-xs"><code>&lt;script setup&gt;
definePageMeta({
  middleware: 'guest' // Only for non-authenticated users
})
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <!-- Example 6: Multiple Middleware -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 6: Multiple Middleware</h3>
      <p class="text-gray-600 mb-4">Chain multiple middleware checks</p>
      
      <div class="bg-gray-50 p-4 rounded">
        <p class="text-sm font-mono mb-2">pages/admin/users.vue</p>
        <pre class="text-xs"><code>&lt;script setup&gt;
definePageMeta({
  middleware: ['auth', 'verified', 'admin'],
  // All middleware run in sequence
})
&lt;/script&gt;</code></pre>
      </div>
    </div>

    <!-- Example 7: useMiddleware Composable -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Example 7: useMiddleware() Composable</h3>
      <p class="text-gray-600 mb-4">Programmatic access control</p>
      
      <div class="bg-gray-50 p-4 rounded mb-4">
        <pre class="text-xs"><code>const { canAccessRoute, navigateWithAuth, withAuthGuard } = useMiddleware()

// Check if can access route
if (canAccessRoute('admin-settings')) {
  navigateTo('/admin/settings')
}

// Navigate with auth check
await navigateWithAuth('/users', {
  requireAuth: true,
  requiredRole: 'admin'
})

// Guard a function
const deleteUser = withAuthGuard(
  async (userId) => {
    await api.deleteUser(userId)
  },
  { requiredPermissions: ['users.delete'] }
)</code></pre>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button 
          @click="testCanAccessRoute" 
          class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Test canAccessRoute()
        </button>
        <button 
          @click="testWithAuthGuard" 
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Test withAuthGuard()
        </button>
      </div>
    </div>

    <!-- Documentation Link -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">📚 Complete Documentation</h2>
      <p class="mb-4">Xem chi tiết tại: <code class="bg-white px-2 py-1 rounded">MIDDLEWARE_GUIDE.md</code></p>
      <ul class="list-disc list-inside space-y-2 text-sm">
        <li>7 middleware types (auth, guest, role, permission, admin, verified, global)</li>
        <li>useMiddleware() composable with helper functions</li>
        <li>Automatic redirects and error messages</li>
        <li>Type-safe with TypeScript</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const { isAuthenticated, user } = useAuth()
const { canAccessRoute, navigateWithAuth, withAuthGuard } = useMiddleware()

// Example functions
const testRoleAccess = () => {
  if (user.value?.role === 'admin') {
    message.success('✅ You have admin role! Access granted.')
  } else {
    message.error('❌ You need admin role. Current role: ' + (user.value?.role || 'none'))
  }
}

const testPermissionAccess = () => {
  const requiredPerms = ['users.write', 'users.delete']
  const userPerms = user.value?.permissions || []
  
  const hasAll = requiredPerms.every(p => userPerms.includes(p))
  
  if (hasAll) {
    message.success('✅ You have all required permissions!')
  } else {
    message.error('❌ Missing permissions: ' + requiredPerms.filter(p => !userPerms.includes(p)).join(', '))
  }
}

const testCanAccessRoute = () => {
  const canAccess = canAccessRoute('dashboard')
  
  if (canAccess) {
    message.success('✅ You can access dashboard route!')
  } else {
    message.error('❌ Cannot access dashboard route')
  }
}

const testWithAuthGuard = () => {
  // Create a guarded function
  const guardedAction = withAuthGuard(
    () => {
      message.success('✅ Action executed! (you have required permissions)')
    },
    {
      requireAuth: true,
      requiredPermissions: ['users.write']
    }
  )
  
  // Try to execute
  guardedAction()
}
</script>

