# 🗄️ Stores - Pinia State Management

## 📋 Available Stores

### 1. Auth Store (`stores/auth.ts`)
Quản lý authentication và user session.

**State:**
- `user`: Current user object
- `token`: Auth token
- `isAuthenticated`: Login status
- `isLoading`: Loading state

**Actions:**
- `login(email, password)`: Login user
- `logout()`: Logout user
- `initAuth()`: Restore session from localStorage
- `updateUser(data)`: Update user profile

**Usage:**
```vue
<script setup lang="ts">
const authStore = useAuthStore()

// Login
await authStore.login('email@example.com', 'password')

// Get user
const user = authStore.currentUser

// Logout
authStore.logout()
</script>
```

---

### 2. App Store (`stores/app.ts`)
Quản lý app-wide settings và notifications.

**State:**
- `sidebarOpen`: Sidebar state
- `loading`: Global loading
- `notifications`: Notification list
- `darkMode`: Dark mode toggle

**Actions:**
- `toggleSidebar()`: Toggle sidebar
- `setLoading(boolean)`: Set loading state
- `addNotification(notification)`: Add notification
- `toggleDarkMode()`: Toggle dark mode

**Usage:**
```vue
<script setup lang="ts">
const appStore = useAppStore()

// Add notification
appStore.addNotification({
  title: 'Success',
  message: 'Item saved!',
  type: 'success'
})

// Toggle sidebar
appStore.toggleSidebar()

// Show loading
appStore.setLoading(true)
</script>
```

---

### 3. User Store (`stores/user.ts`)
Quản lý user preferences và activities.

**State:**
- `preferences`: User preferences
- `recentActivities`: Activity history

**Actions:**
- `updatePreferences(prefs)`: Update preferences
- `addActivity(activity)`: Log activity
- `clearActivities()`: Clear activity history

**Usage:**
```vue
<script setup lang="ts">
const userStore = useUserStore()

// Update preferences
userStore.updatePreferences({
  language: 'vi',
  notifications: false
})

// Add activity
userStore.addActivity({
  type: 'create',
  title: 'Created new item',
  description: 'Item #123'
})
</script>
```

---

## 🚀 Quick Start

### 1. Use in Components

```vue
<template>
  <div>
    <p v-if="authStore.isAuthenticated">
      Welcome, {{ authStore.userName }}!
    </p>
    
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>
```

### 2. Use in Composables

```typescript
// composables/useUser.ts
export const useUser = () => {
  const authStore = useAuthStore()
  
  const isAdmin = computed(() => {
    return authStore.user?.role === 'admin'
  })
  
  return {
    user: authStore.user,
    isAdmin
  }
}
```

### 3. Use in Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

---

## 💡 Best Practices

### 1. Initialize Stores in app.vue

```vue
<script setup lang="ts">
const authStore = useAuthStore()
const appStore = useAppStore()
const userStore = useUserStore()

// Initialize on mount
onMounted(() => {
  authStore.initAuth()
  appStore.initApp()
  userStore.initUser()
})
</script>
```

### 2. Use Getters for Computed Values

```typescript
// ✅ Good - Use getter
const userName = computed(() => authStore.userName)

// ❌ Bad - Direct state access
const userName = authStore.user?.name
```

### 3. Handle Errors in Actions

```typescript
async login(email: string, password: string) {
  try {
    // API call
    const response = await $fetch(...)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 4. Persist Important Data

```typescript
// Save to localStorage
if (process.client) {
  localStorage.setItem('key', JSON.stringify(value))
}
```

---

## 📚 Creating New Stores

```typescript
// stores/products.ts
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    selectedProduct: null
  }),
  
  getters: {
    productCount: (state) => state.products.length
  },
  
  actions: {
    async fetchProducts() {
      const { apiBase } = useEnvConfig()
      this.products = await $fetch(`${apiBase}/products`)
    }
  }
})
```

---

## 🔄 Store Composition

```typescript
// Use one store inside another
export const useCartStore = defineStore('cart', {
  actions: {
    async checkout() {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated) {
        throw new Error('Please login first')
      }
      
      // Proceed with checkout
    }
  }
})
```

---

## 📖 References

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Nuxt Pinia Module](https://nuxt.com/modules/pinia)
- [TypeScript Support](https://pinia.vuejs.org/core-concepts/#typescript)

