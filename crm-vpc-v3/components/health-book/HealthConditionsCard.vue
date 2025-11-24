<template>
  <div class="bg-white rounded-none lg:rounded-lg p-6 lg:bg-blue-50 border-b border-gray-200 lg:border-0">
    <ul class="space-y-4">
      <!-- Skin Condition -->
      <li class="border-b border-gray-200 pb-3 last:border-0">
        <div class="flex items-start justify-between mb-1">
          <h4 class="text-gray-600 font-medium text-sm">
            Tình trạng da:
          </h4>
          <span class="font-semibold text-gray-800 text-sm text-right ml-4">
            {{ getHealthRecordOptionLabel(healthBook.skinConditions || '', skinConditionOptions) || 'Đang cập nhật' }}
          </span>
        </div>
      </li>

      <!-- Dental Health -->
      <li class="border-b border-gray-200 pb-3 last:border-0">
        <div class="flex items-start justify-between mb-1">
          <h4 class="text-gray-600 font-medium text-sm">
            Sức khỏe răng miệng:
          </h4>
          <span class="font-semibold text-gray-800 text-sm text-right ml-4">
            {{ healthBook.tooth?.count ? `${healthBook.tooth.count} răng` : 'Đang cập nhật' }}
          </span>
        </div>
        <div v-if="healthBook.tooth?.descriptions" class="text-xs text-gray-500 mt-1">
          {{ getHealthRecordOptionLabel(healthBook.tooth.descriptions || '', oralHealthOptions) }}
        </div>
      </li>

      <!-- Nutrition -->
      <li class="border-b border-gray-200 pb-3 last:border-0">
        <div class="flex items-start justify-between mb-1">
          <h4 class="text-gray-600 font-medium text-sm">
            Dinh dưỡng:
          </h4>
          <span class="font-semibold text-gray-800 text-sm text-right ml-4">
            {{ healthBook.nutrition?.count ? `${healthBook.nutrition.count} cữ ăn` : 'Đang cập nhật' }}
          </span>
        </div>
        <div v-if="healthBook.nutrition?.descriptions" class="text-xs text-gray-500 mt-1">
          {{ getHealthRecordOptionLabel(healthBook.nutrition.descriptions || '', nutritionOptions) }}
        </div>
      </li>

      <!-- Sleep -->
      <li class="last:border-0">
        <div class="flex items-start justify-between mb-1">
          <h4 class="text-gray-600 font-medium text-sm">
            Giấc ngủ:
          </h4>
          <span class="font-semibold text-gray-800 text-sm text-right ml-4">
            {{ healthBook.sleep?.time || 'Đang cập nhật' }}
          </span>
        </div>
        <div v-if="healthBook.sleep?.descriptions" class="text-xs text-gray-500 mt-1">
          {{ getHealthRecordOptionLabel(healthBook.sleep.descriptions || '', sleepOptions) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from '~/types/api'

import {
  skinConditionOptions,
  oralHealthOptions,
  nutritionOptions,
  sleepOptions,
} from '~/constants/healthRecordOptions'
import { getHealthRecordOptionLabel } from '~/utils/healthbook'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()
</script>
