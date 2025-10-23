<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome to Van Phuc Care Admin Portal</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Total Users</p>
            <p class="text-3xl font-bold mt-2">1,234</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <p class="text-blue-100 text-sm mt-4">↑ 12% from last month</p>
      </div>

      <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-100 text-sm font-medium">Revenue</p>
            <p class="text-3xl font-bold mt-2">$45.2K</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-green-100 text-sm mt-4">↑ 8% from last month</p>
      </div>

      <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm font-medium">Orders</p>
            <p class="text-3xl font-bold mt-2">567</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <p class="text-purple-100 text-sm mt-4">↑ 23% from last month</p>
      </div>

      <div class="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-100 text-sm font-medium">Products</p>
            <p class="text-3xl font-bold mt-2">89</p>
          </div>
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <p class="text-orange-100 text-sm mt-4">↑ 5% from last month</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span class="text-primary-500 font-semibold">{{ i }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">New order #{{ 1000 + i }}</p>
              <p class="text-sm text-gray-500">Customer placed an order</p>
              <p class="text-xs text-gray-400 mt-1">{{ i }} minutes ago</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/faqs" class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
            <div class="text-3xl mb-2">❓</div>
            <p class="font-medium text-gray-900">Manage FAQs</p>
          </NuxtLink>
          <NuxtLink to="/products" class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
            <div class="text-3xl mb-2">📦</div>
            <p class="font-medium text-gray-900">Products</p>
          </NuxtLink>
          <NuxtLink to="/customers" class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
            <div class="text-3xl mb-2">👥</div>
            <p class="font-medium text-gray-900">Customers</p>
          </NuxtLink>
          <button class="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center">
            <div class="text-3xl mb-2">⚙️</div>
            <p class="font-medium text-gray-900">Settings</p>
          </button>
        </div>
      </div>
    </div>

    <!-- API Test Section -->
    <div class="card mt-6 bg-blue-50 border-2 border-blue-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">🔌 API Configuration</h3>
      <div class="space-y-2 font-mono text-sm">
        <p><strong>API Host:</strong> {{ apiHost }}</p>
        <p><strong>API Base:</strong> {{ apiBase }}</p>
        <p><strong>Environment:</strong> 
          <span class="px-2 py-1 rounded text-white text-xs" :class="isDevelopment ? 'bg-yellow-500' : 'bg-green-500'">
            {{ isDevelopment ? 'Development' : 'Production' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page setup
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Dashboard'
})

// Get config
const { apiHost, apiBase, isDevelopment } = useEnvConfig()
</script>

