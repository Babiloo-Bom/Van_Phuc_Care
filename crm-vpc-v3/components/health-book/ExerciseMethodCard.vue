<template>
  <div class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm p-6 border-b border-gray-200 lg:border-0 last:border-0">
    <div class="space-y-6">
      <!-- Exercise & Skills -->
      <div>
        <h4 class="font-semibold text-gray-800 text-base mb-3">
          Tập vận động và kỹ năng:
        </h4>
        <div v-if="healthBook.exerciseAndSkills" class="text-sm text-gray-600 leading-relaxed" v-html="healthBook.exerciseAndSkills" />
        <p v-else class="text-sm text-gray-400">Đang cập nhật</p>
      </div>

      <!-- Method -->
      <div>
        <h4 class="font-semibold text-gray-800 text-base mb-3">
          Phương pháp:
        </h4>
        <div v-if="healthBook.method">
          <div v-if="healthBook.method.status" class="mb-2">
            <span class="font-medium text-gray-600">Trạng thái:</span>
            <span class="ml-2 text-gray-800">{{ healthBook.method.status }}</span>
          </div>
          <div v-if="healthBook.method.descriptions" class="text-sm text-gray-600 leading-relaxed" v-html="healthBook.method.descriptions" />
        </div>
        <p v-else class="text-sm text-gray-400">Đang cập nhật</p>
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
