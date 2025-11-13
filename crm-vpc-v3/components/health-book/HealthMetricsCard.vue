<template>
  <div class="bg-blue-50 rounded-lg p-6">
    <div class="grid grid-cols-3 gap-4">
      <!-- Weight -->
      <div class="flex flex-col items-center justify-center">
        <h4 class="text-blue-600 font-semibold mb-2 text-sm">
          Cân nặng
        </h4>
        <div class="text-center">
          <span class="text-3xl font-bold text-gray-800">
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
          <span class="text-3xl font-bold text-gray-800">
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
          <img
            v-if="healthBook.gender === 'male'"
            src="/images/male-icon.png"
            alt="Nam"
            class="w-8 h-8 object-contain"
          />
          <img
            v-else-if="healthBook.gender === 'female'"
            src="/images/female-icon.png"
            alt="Nữ"
            class="w-8 h-8 object-contain"
          />
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
