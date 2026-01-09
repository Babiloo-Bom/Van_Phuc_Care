<template>
  <div class="bg-blue-50 rounded-lg p-6 border-b border-gray-200 lg:border-0">
    <ul class="space-y-4">
      <!-- Skin Condition -->
      <li class="border-b border-gray-200 pb-3 last:border-0">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-[#1A75BB] font-bold text-base mb-0">
            Tình trạng da:
          </h4>
          <span class="font-semibold text-[#4A4A4A] text-sm text-right ml-4">
            {{ getHealthRecordOptionLabel(healthBook.skinConditions || '', skinConditionOptions) || 'Đang cập nhật' }}
          </span>
        </div>
        <div class="text-sm text-[#4A4A4A] mt-1">
          {{ healthBook.skinConditionNote ? getHealthRecordOptionLabel(healthBook.skinConditionNote, skinConditionNoteOptions) : 'Ghi chú tình trạng da' }}
        </div>
      </li>

      <!-- Dental Health -->
      <li class="border-b border-gray-200 pb-3 last:border-0">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-[#1A75BB] font-bold text-base mb-0">
            Sức khỏe răng miệng:
          </h4>
          <span class="font-semibold text-[#4A4A4A] text-sm text-right ml-4">
            {{ healthBook.tooth?.descriptions ? getHealthRecordOptionLabel(healthBook.tooth.descriptions, oralHealthOptions) : 'Đang cập nhật' }}
          </span>
        </div>
        <div class="text-sm text-[#4A4A4A] mt-1">
          {{ healthBook.oralHealthNote ? getHealthRecordOptionLabel(healthBook.oralHealthNote, oralHealthNoteOptions) : 'Ghi chú sức khỏe răng miệng' }}
        </div>
      </li>

      <!-- Nutrition -->
      <li class="border-b border-gray-200 pb-3 last:border-0">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-[#1A75BB] font-bold text-base mb-0">
            Dinh dưỡng:
          </h4>
          <span class="font-semibold text-[#4A4A4A] text-sm text-right ml-4">
            {{ healthBook.nutrition?.descriptions ? getHealthRecordOptionLabel(healthBook.nutrition.descriptions, nutritionOptions) : 'Đang cập nhật' }}
          </span>
        </div>
        <div class="text-sm text-[#4A4A4A] mt-1">
          {{ healthBook.nutritionNote ? getHealthRecordOptionLabel(healthBook.nutritionNote, nutritionNoteOptions) : 'Ghi chú dinh dưỡng' }}
        </div>
      </li>

      <!-- Sleep -->
      <li class="last:border-0">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-[#1A75BB] font-bold text-base mb-0">
            Giấc ngủ:
          </h4>
          <span class="font-semibold text-[#4A4A4A] text-sm text-right ml-4">
            {{ healthBook.sleep?.descriptions ? getHealthRecordOptionLabel(healthBook.sleep.descriptions, sleepOptions) : 'Đang cập nhật' }}
          </span>
        </div>
        <div class="text-sm text-[#4A4A4A] mt-1">
          {{ healthBook.sleepNote ? getHealthRecordOptionLabel(healthBook.sleepNote, sleepNoteOptions) : 'Ghi chú giấc ngủ' }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { HealthBook } from '~/types/api'

import {
  skinConditionOptions,
  skinConditionNoteOptions,
  oralHealthOptions,
  oralHealthNoteOptions,
  nutritionOptions,
  nutritionNoteOptions,
  sleepOptions,
  sleepNoteOptions,
} from '~/constants/healthRecordOptions'
import { getHealthRecordOptionLabel } from '~/utils/healthbook'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()
</script>
