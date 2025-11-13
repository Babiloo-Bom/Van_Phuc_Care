<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Exercise & Skills -->
      <div>
        <h4 class="font-semibold text-blue-600 text-base mb-3">
          Tập vận động và kỹ năng:
        </h4>
        <div v-if="healthBook.exerciseAndSkills" class="text-sm text-gray-700" v-html="healthBook.exerciseAndSkills" />
        <p v-else class="text-sm text-gray-500">Đang cập nhật</p>
      </div>

      <!-- Method -->
      <div>
        <h4 class="font-semibold text-blue-600 text-base mb-3">
          Phương pháp:
        </h4>
        <div v-if="healthBook.method">
          <div v-if="healthBook.method.status" class="mb-2">
            <span class="font-medium text-gray-800">Trạng thái:</span>
            <span class="ml-2 text-gray-700">{{ healthBook.method.status }}</span>
          </div>
          <div v-if="healthBook.method.descriptions" class="text-sm text-gray-700" v-html="healthBook.method.descriptions" />
        </div>
        <p v-else class="text-sm text-gray-500">Đang cập nhật</p>
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
