<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Customers</h1>
        <p class="text-gray-600 mt-2">Manage customer relationships</p>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Customer
      </button>
    </div>

    <div class="card overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="i in 10" :key="i" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                  C{{ i }}
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">Customer {{ i }}</div>
                  <div class="text-sm text-gray-500">ID: #CU-{{ 3000 + i }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">customer{{ i }}@example.com</td>
            <td class="px-6 py-4 text-sm text-gray-900">+84 90 123 45{{ i }}0</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
            </td>
            <td class="px-6 py-4 text-right text-sm">
              <button class="text-primary-600 hover:text-primary-900 mr-3">View</button>
              <button class="text-blue-600 hover:text-blue-900">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useHead({ title: 'Customers' })
</script>

