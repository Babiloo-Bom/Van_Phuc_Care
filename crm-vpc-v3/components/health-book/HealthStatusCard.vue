<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <!-- Health Condition -->
    <div v-if="healthBook.healthCondition" class="mb-6">
      <div class="flex items-center justify-between">
        <h4 class="font-semibold text-blue-600 text-base">
          Tình trạng sức khỏe:
        </h4>
        <h3 class="font-bold text-lg text-gray-800">
          {{ healthBook.healthCondition }}
        </h3>
      </div>
    </div>

    <!-- Vaccination -->
    <div v-if="healthBook.vaccination" class="mb-6 pb-6 border-b border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-blue-600 text-base">
          Tiêm chủng:
        </h4>
        <h3 class="font-bold text-lg text-gray-800">
          {{ healthBook.vaccination }}
        </h3>
      </div>
      
      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Ngày tiêm:</span>
          <span class="font-semibold text-gray-800">
            {{ healthBook.vaccinationDate ? formatDate(healthBook.vaccinationDate) : '--' }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-600">Mũi tiêm:</span>
          <span class="font-semibold text-gray-800">
            {{ healthBook.vaccinationContent || '--' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Note -->
    <div v-if="healthBook.note" class="bg-blue-50 rounded-lg p-4">
      <h4 class="font-semibold text-blue-600 text-sm mb-2">
        Lưu ý:
      </h4>
      <div class="text-sm text-gray-700" v-html="healthBook.note" />
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
