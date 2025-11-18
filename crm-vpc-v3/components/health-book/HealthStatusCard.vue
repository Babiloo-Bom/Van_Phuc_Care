<template>
  <div class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm p-6 border-b border-gray-200 lg:border-0">
    <!-- Health Condition -->
    <div v-if="healthBook.healthCondition" class="mb-6">
      <div class="flex items-start justify-between">
        <h4 class="font-medium text-gray-600 text-sm">
          Tình trạng sức khỏe:
        </h4>
        <span class="font-semibold text-gray-800 text-sm text-right ml-4">
          {{ healthBook.healthCondition }}
        </span>
      </div>
    </div>

    <!-- Vaccination -->
    <div v-if="healthBook.vaccination" class="mb-6 pb-6 border-b border-gray-200 last:border-0">
      <div class="flex items-start justify-between mb-3">
        <h4 class="font-medium text-gray-600 text-sm">
          Tiêm chủng:
        </h4>
        <span class="font-semibold text-gray-800 text-sm text-right ml-4">
          {{ healthBook.vaccination }}
        </span>
      </div>
      
      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-gray-500">Ngày tiêm:</span>
          <span class="font-medium text-gray-800">
            {{ healthBook.vaccinationDate ? formatDate(healthBook.vaccinationDate) : '--' }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-500">Mũi tiêm:</span>
          <span class="font-medium text-gray-800">
            {{ healthBook.vaccinationContent || '--' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Note -->
    <div v-if="healthBook.note" class="bg-blue-50 rounded-lg p-4">
      <h4 class="font-semibold text-gray-700 text-sm mb-2">
        Lưu ý:
      </h4>
      <div class="text-sm text-gray-600 leading-relaxed" v-html="healthBook.note" />
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { HealthBook } from '~/types/api'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()

const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}
</script>
