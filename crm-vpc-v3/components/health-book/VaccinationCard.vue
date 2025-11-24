<template>
  <div class="vaccination-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex gap-4">
      <!-- Vaccine Image -->
      <div class="flex-shrink-0">
        <img
          v-if="vaccine.image"
          :src="vaccine.image"
          :alt="vaccine.name"
          class="w-24 h-24 object-cover rounded"
          @error="handleImageError"
        />
        <div v-else class="w-24 h-24 bg-blue-50 rounded flex items-center justify-center">
          <MedicineBoxOutlined class="text-4xl text-blue-500" />
        </div>
      </div>

      <!-- Vaccine Info -->
      <div class="flex-1">
        <h3 class="text-base font-semibold text-blue-600 mb-2">
          {{ vaccine.name }}
        </h3>
        <div class="text-sm text-gray-600 mb-2">
          {{ vaccine.age || '' }}
        </div>
        <div v-if="vaccine.description" class="text-sm text-gray-500 mb-3 line-clamp-2">
          {{ vaccine.description }}
        </div>
        <div class="flex items-center justify-between">
          <!-- Scheduled/Injected Date (not available in schedule) -->
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <CalendarOutlined />
            <span>
              Thời gian: --
            </span>
          </div>
          <!-- Status: always pending for schedule -->
          <div class="flex items-center gap-2">
            <a-tag color="default" class="font-medium text-gray-600">
              CHƯA TIÊM PHÒNG
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CalendarOutlined, 
  MedicineBoxOutlined,
} from '@ant-design/icons-vue'

import type { VaccinationScheduleItem } from '~/types/api'

interface Props {
  vaccine: VaccinationScheduleItem
}

defineProps<Props>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* Standard property */
  overflow: hidden;
}

.vaccination-card:hover {
  border-color: #1890ff;
}
</style>
