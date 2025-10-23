<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">Student Sign In</h2>
    
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
          placeholder="student@vanphuccare.com"
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

      <button type="submit" class="btn-primary w-full">
        Sign In to Learn
      </button>
    </form>

    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Login' })
const form = ref({ email: '', password: '' })
const error = ref('')
const handleLogin = async () => {
  error.value = ''
  console.log('E-Learning Login:', form.value)
  setTimeout(() => navigateTo('/'), 500)
}
</script>
