<template>
  <div>
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="text-gray-600 mt-2">Manage your product catalog</p>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card hover:shadow-xl transition-shadow">
        <div class="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <span class="text-4xl">📦</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Product {{ i }}</h3>
        <p class="text-gray-600 text-sm mb-4">Sample product description goes here</p>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold text-primary-500">$99.99</span>
          <div class="flex gap-2">
            <button class="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button class="p-2 text-red-600 hover:bg-red-50 rounded">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Products'
})
</script>

