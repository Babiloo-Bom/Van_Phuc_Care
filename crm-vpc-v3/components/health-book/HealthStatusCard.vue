<template>
  <div class="bg-white rounded-none lg:rounded-lg shadow-none lg:shadow-sm py-6">
    <!-- Health Condition -->
    <div v-if="healthBook.healthCondition" class="mb-2">
      <div class="flex items-start justify-between">
        <h4 class="font-bold text-[#1A75BB] text-sm mb-0">
          Tình trạng sức khỏe:
        </h4>
        <span class="font-bold text-gray-800 text-base text-left">
          {{ healthBook.healthCondition }}
        </span>
      </div>
    </div>

    <!-- Vaccination -->
    <div v-if="healthBook.vaccination" class="pb-2">
      <div class="flex items-start justify-between mb-3">
        <h4 class="font-bold text-[#1A75BB] text-sm">
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
            {{ healthBook.vaccinationDate ?? '--' }}
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
    <div v-if="healthBook.note" class="block lg:hidden bg-blue-50 rounded-lg p-4 mt-2">
      <h4 class="font-bold text-[#1A75BB] text-sm mb-2">
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
