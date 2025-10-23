<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">Sign In</h2>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="input-field"
          placeholder="admin@vanphuccare.com"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="input-field"
          placeholder="••••••••"
        />
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input type="checkbox" class="rounded border-gray-300 text-primary-500 focus:ring-primary-500">
          <span class="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" class="text-sm text-primary-500 hover:text-primary-600">
          Forgot password?
        </a>
      </div>

      <button type="submit" class="btn-primary w-full">
        Sign In
      </button>
    </form>

    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Demo: admin@test.com / password123
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page setup
definePageMeta({
  layout: 'auth'
})

useHead({
  title: 'Login'
})

// Form state
const form = ref({
  email: '',
  password: ''
})

const error = ref('')

// Handle login
const handleLogin = async () => {
  error.value = ''
  
  try {
    // TODO: Implement actual login logic
    console.log('Login attempt:', form.value)
    
    // Demo: Redirect to dashboard
    setTimeout(() => {
      navigateTo('/')
    }, 500)
  } catch (e) {
    error.value = 'Invalid email or password'
  }
}
</script>

