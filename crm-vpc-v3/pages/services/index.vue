<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Services</h1>
        <p class="text-gray-600 mt-2">Manage service offerings</p>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Service
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="card hover:shadow-xl transition-shadow">
        <div class="aspect-video bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg mb-4 flex items-center justify-center">
          <span class="text-5xl">💼</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Service Package {{ i }}</h3>
        <p class="text-gray-600 text-sm mb-4">Comprehensive service description and benefits</p>
        <div class="flex justify-between items-center mb-4">
          <span class="text-2xl font-bold text-primary-500">${{ (i * 100) + 99 }}/mo</span>
          <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
        </div>
        <div class="space-y-2 text-sm text-gray-600 mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>Feature {{ i }} included</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
        <button class="btn-secondary w-full">Manage Service</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Services' })
</script>
