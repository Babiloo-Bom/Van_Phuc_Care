<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h4 class="font-semibold text-blue-600 mb-4 text-base">
      Sức khỏe tiêu hóa:
    </h4>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Frequency of Defecation -->
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
          <img 
            src="/images/home/tieu-tien.png" 
            alt="Đại tiện" 
            class="w-8 h-8 object-contain"
          />
        </div>
        <div class="flex-1">
          <h5 class="font-semibold text-gray-800 text-sm mb-1">
            Tần suất đại tiện:
          </h5>
          <div v-if="healthBook.frequencyOfDefecation" class="text-sm text-gray-600" v-html="healthBook.frequencyOfDefecation" />
          <p v-else class="text-sm text-gray-500">Đang cập nhật</p>
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
        <div class="flex-1">
          <h5 class="font-semibold text-gray-800 text-sm mb-1">
            Tình trạng phân:
          </h5>
          <div v-if="healthBook.fecalCondition" class="text-sm text-gray-600" v-html="healthBook.fecalCondition" />
          <p v-else class="text-sm text-gray-500">Đang cập nhật</p>
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
        <div class="flex-1">
          <h5 class="font-semibold text-gray-800 text-sm mb-1">
            Vấn đề tiêu hóa:
          </h5>
          <div v-if="healthBook.digestiveProblems" class="text-sm text-gray-600" v-html="healthBook.digestiveProblems" />
          <p v-else class="text-sm text-gray-500">Đang cập nhật</p>
        </div>
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
