<template>
  <div class="bg-blue-50 rounded-lg p-6">
    <ul class="space-y-4">
      <!-- Skin Condition -->
      <li class="border-b border-gray-200 pb-3">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-blue-600 font-semibold text-sm">
            Tình trạng da:
          </h4>
          <span class="font-semibold text-gray-800 text-sm">
            {{ healthBook.skinConditions || 'Đang cập nhật' }}
          </span>
        </div>
      </li>

      <!-- Dental Health -->
      <li class="border-b border-gray-200 pb-3">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-blue-600 font-semibold text-sm">
            Sức khỏe răng miệng:
          </h4>
          <span class="font-semibold text-gray-800 text-sm">
            {{ healthBook.tooth?.count ? `${healthBook.tooth.count} răng` : 'Đang cập nhật' }}
          </span>
        </div>
        <div v-if="healthBook.tooth?.descriptions" class="text-sm text-gray-600" v-html="healthBook.tooth.descriptions" />
      </li>

      <!-- Nutrition -->
      <li class="border-b border-gray-200 pb-3">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-blue-600 font-semibold text-sm">
            Dinh dưỡng:
          </h4>
          <span class="font-semibold text-gray-800 text-sm">
            {{ healthBook.nutrition?.count ? `${healthBook.nutrition.count} bữa/ngày` : 'Đang cập nhật' }}
          </span>
        </div>
        <div v-if="healthBook.nutrition?.descriptions" class="text-sm text-gray-600" v-html="healthBook.nutrition.descriptions" />
      </li>

      <!-- Sleep -->
      <li>
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-blue-600 font-semibold text-sm">
            Giấc ngủ:
          </h4>
          <span class="font-semibold text-gray-800 text-sm">
            {{ healthBook.sleep?.time || 'Đang cập nhật' }}
          </span>
        </div>
        <div v-if="healthBook.sleep?.descriptions" class="text-sm text-gray-600" v-html="healthBook.sleep.descriptions" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from '~/types/api'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()
</script>
