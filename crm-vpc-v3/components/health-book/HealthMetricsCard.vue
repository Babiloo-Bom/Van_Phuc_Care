<template>
  <div class="bg-blue-50 rounded-none lg:rounded-lg p-6 border-b border-gray-200 lg:border-0">
    <div class="grid grid-cols-3 gap-4">
      <!-- Weight -->
      <div class="flex flex-col items-center justify-center">
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">
          Cân nặng
        </h4>
        <div class="text-center">
          <span class="text-3xl lg:text-3xl font-bold text-gray-800">
            {{ healthBook.weight || '--' }}
          </span>
          <span class="text-sm font-medium text-gray-600 ml-1">kg</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="flex flex-col items-center justify-center relative before:absolute before:w-px before:h-3/4 before:left-0 before:bg-gray-300 after:absolute after:w-px after:h-3/4 after:right-0 after:bg-gray-300">
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">
          Chiều cao
        </h4>
        <div class="text-center">
          <span class="text-3xl lg:text-3xl font-bold text-gray-800">
            {{ healthBook.height || '--' }}
          </span>
          <span class="text-sm font-medium text-gray-600 ml-1">cm</span>
        </div>
      </div>

      <!-- Gender -->
      <div class="flex flex-col items-center justify-center">
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">
          Giới tính
        </h4>
        <div class="flex items-center justify-center h-10">
          <svg v-if="healthBook.gender === 'male'" class="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <svg v-else-if="healthBook.gender === 'female'" class="w-10 h-10 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <span v-else class="text-gray-500">--</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from '~/types/api'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()
</script>
