<template>
  <div class="bg-white rounded-none lg:rounded-lg">
    <h4 class="font-bold text-[#1A75BB] mb-4 text-sm">
      Sức khỏe tiêu hóa:
    </h4>
    
    <div :style="containerStyle">
      <!-- Frequency of Defecation -->
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <img 
            src="/images/home/tieu-tien.png" 
            alt="Đại tiện" 
            class="w-8 h-8 object-contain"
          />
        </div>
        <div class="w-[131px]">
          <h5 class="font-semibold text-[#4A4A4A] text-sm mb-1 h-[30px] flex items-center">
            Tần suất đại tiện:
          </h5>
          <div v-if="healthBook.frequencyOfDefecation" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.frequencyOfDefecation, stoolFrequencyOptions) }}
          </div>
          <p v-else class="text-sm text-[#4A4A4A] opacity-60">Đang cập nhật</p>
        </div>
      </div>

      <!-- Fecal Condition -->
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <img 
            src="/images/home/phan.png" 
            alt="Phân" 
            class="w-8 h-8 object-contain"
          />
        </div>
        <div class="w-[131px]">
          <h5 class="font-semibold text-[#4A4A4A] text-sm mb-1 h-[30px] flex items-center">
            Tình trạng phân:
          </h5>
          <div v-if="healthBook.fecalCondition" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.fecalCondition, stoolConditionOptions) }}
          </div>
          <p v-else class="text-sm text-[#4A4A4A] opacity-60">Đang cập nhật</p>
        </div>
      </div>

      <!-- Digestive Problems -->
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <img 
            src="/images/home/da-day.png" 
            alt="Vấn đề tiêu hóa" 
            class="w-8 h-8 object-contain"
          />
        </div>
        <div class="w-[131px]">
          <h5 class="font-semibold text-[#4A4A4A] text-sm mb-1 h-[30px] flex items-center">
            Vấn đề tiêu hóa:
          </h5>
          <div v-if="healthBook.digestiveProblems" class="text-sm text-[#4A4A4A]">
            {{ getHealthRecordOptionLabel(healthBook.digestiveProblems, digestiveIssuesOptions) }}
          </div>
          <p v-else class="text-sm text-[#4A4A4A] opacity-60">Đang cập nhật</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { HealthBook } from '~/types/api'

import {
  stoolFrequencyOptions,
  stoolConditionOptions,
  digestiveIssuesOptions,
} from '~/constants/healthRecordOptions'
import { getHealthRecordOptionLabel } from '~/utils/healthbook'

interface Props {
  healthBook: HealthBook
}

defineProps<Props>()

const isDesktop = ref(false)

const checkScreenSize = () => {
  isDesktop.value = window.innerWidth >= 1280
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

const containerStyle = computed(() => ({
  display: 'flex',
  flexDirection: isDesktop.value ? 'row' : 'column' as const,
  alignItems: isDesktop.value ? 'flex-start' : 'stretch',
  gap: isDesktop.value ? '25px' : '16px',
} as const))
</script>
