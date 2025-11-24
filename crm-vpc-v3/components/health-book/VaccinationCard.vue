<template>
  <div class="vaccination-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex gap-4">
      <!-- Vaccine Image -->
      <div class="flex-shrink-0">
        <img
          v-if="vaccine.thumbnail"
          :src="vaccine.thumbnail"
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
        <!-- Vaccine Name -->
        <h3 class="text-base font-semibold text-blue-600 mb-1">
          {{ vaccine.name }}
        </h3>

        <!-- Category -->
        <div v-if="vaccine.category" class="text-xs text-gray-500 mb-2">
          ({{ vaccine.category }})
        </div>

        <!-- Description -->
        <div v-if="vaccine.description" class="text-sm text-gray-500 mb-3 line-clamp-2">
          {{ vaccine.description }}
        </div>

        <!-- Bottom Info Row -->
        <div class="flex items-center justify-between flex-wrap gap-2">
          <!-- Left: Date + Số mũi -->
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <!-- Injection Date -->
            <div class="flex items-center gap-1">
              <CalendarOutlined />
              <span>Thời gian: {{ formattedDate }}</span>
            </div>

            <!-- Number of Injections -->
            <div v-if="vaccine.numberOfInjections">
              Số mũi tiêm: {{ vaccine.numberOfInjections }}
            </div>
          </div>

          <!-- Right: Status -->
          <div class="flex items-center gap-2">
            <a-tag 
              :color="statusColor" 
              class="font-medium"
            >
              {{ statusText }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  CalendarOutlined, 
  MedicineBoxOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { VaccinationScheduleItem } from '~/types/api'

interface Props {
  vaccine: VaccinationScheduleItem
}

const props = defineProps<Props>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}

// Format injection date
const formattedDate = computed(() => {
  if (props.vaccine.injectionDate) {
    return dayjs(props.vaccine.injectionDate).format('DD/MM/YYYY')
  }
  if (props.vaccine.scheduledDate) {
    return dayjs(props.vaccine.scheduledDate).format('DD/MM/YYYY')
  }
  return '--'
})

// Status text and color
const statusText = computed(() => {
  const status = props.vaccine.injectionStatus || 'pending'
  switch (status) {
    case 'completed':
      return 'ĐÃ TIÊM PHÒNG'
    case 'scheduled':
      return 'ĐÃ ĐẶT LỊCH'
    case 'skipped':
      return 'BỎ QUA'
    case 'pending':
    default:
      return 'CHƯA TIÊM PHÒNG'
  }
})

const statusColor = computed(() => {
  const status = props.vaccine.injectionStatus || 'pending'
  switch (status) {
    case 'completed':
      return 'success'
    case 'scheduled':
      return 'processing'
    case 'skipped':
      return 'warning'
    case 'pending':
    default:
      return 'default'
  }
})
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
