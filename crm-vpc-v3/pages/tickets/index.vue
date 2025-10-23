<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <p class="text-gray-600 mt-2">Manage customer support tickets</p>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Ticket
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="card bg-yellow-50 border-yellow-200">
        <p class="text-yellow-700 font-medium">Pending</p>
        <p class="text-3xl font-bold text-yellow-800 mt-2">24</p>
      </div>
      <div class="card bg-blue-50 border-blue-200">
        <p class="text-blue-700 font-medium">In Progress</p>
        <p class="text-3xl font-bold text-blue-800 mt-2">18</p>
      </div>
      <div class="card bg-green-50 border-green-200">
        <p class="text-green-700 font-medium">Resolved</p>
        <p class="text-3xl font-bold text-green-800 mt-2">132</p>
      </div>
    </div>

    <div class="card">
      <div class="space-y-4">
        <div v-for="i in 8" :key="i" class="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">Ticket #TK-{{ 2000 + i }}</h3>
                <span :class="i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : i % 3 === 1 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 text-xs rounded-full">
                  {{ i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'In Progress' : 'Resolved' }}
                </span>
              </div>
              <p class="text-gray-600 mb-2">Customer support request - Need help with product setup</p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>👤 Customer {{ i }}</span>
                <span>📅 {{ i }} hours ago</span>
                <span>🏷️ Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Support Tickets' })
</script>
