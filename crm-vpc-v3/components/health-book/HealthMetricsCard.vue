<template>
  <div class="bg-blue-50 rounded-lg p-4 border-b border-gray-200 lg:border-0">
    <div class="grid grid-cols-3 gap-2 md:gap-4">
      <!-- Weight -->
      <div class="flex flex-col items-center justify-between">
        <h4 class="text-[#1A75BB] font-semibold mb-2 text-sm">Cân nặng</h4>
        <div class="text-center">
          <span class="text-3xl lg:text-3xl font-bold text-gray-800">
            {{ healthBook.weight || "--" }}
          </span>
          <span class="text-sm font-medium text-gray-600 ml-1">kg</span>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="flex flex-col items-center justify-between relative before:absolute before:w-px before:h-3/4 before:left-0 before:bg-gray-300 after:absolute after:w-px after:h-3/4 after:right-0 after:bg-gray-300"
      >
        <h4 class="text-[#1A75BB] font-semibold mb-2 text-sm">Chiều cao</h4>
        <div class="text-center">
          <span class="text-3xl lg:text-3xl font-bold text-gray-800">
            {{ healthBook.height || "--" }}
          </span>
          <span class="text-sm font-medium text-gray-600 ml-1">cm</span>
        </div>
      </div>

      <!-- Gender -->
      <div class="flex flex-col items-center justify-between">
        <h4 class="text-[#1A75BB] font-semibold mb-2 text-sm">Giới tính</h4>
        <div class="flex items-center justify-center h-10">
          <!-- Male icon - circle with arrow -->
          <svg
            v-if="healthBook.gender === 'male'"
            class="w-8 h-8"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="14" r="6" stroke="#1A75BB" stroke-width="2" fill="none"/>
            <path d="M14.5 9.5L20 4M20 4V9M20 4H15" stroke="#1A75BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Female icon - circle with cross -->
          <svg
            v-else-if="healthBook.gender === 'female'"
            class="w-8 h-8"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="9" r="6" stroke="#E91E8C" stroke-width="2" fill="none"/>
            <path d="M12 15V22M9 19H15" stroke="#E91E8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span v-else class="text-gray-500">--</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from "~/types/api";

interface Props {
  healthBook: HealthBook;
}

defineProps<Props>();
</script>
