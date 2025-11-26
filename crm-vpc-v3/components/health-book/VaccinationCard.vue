<template>
  <div class="vaccination-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex gap-4 flex-col sm:flex-row items-start sm:items-center">
      <!-- Vaccine Image -->
      <div class="flex-shrink-0 self-center sm:self-auto">
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
      <div class="flex-1 w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
          <!-- Name + Category -->
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-blue-600 mb-1 sm:mb-0">
              {{ vaccine.name }}
              <span v-if="vaccine.category" class="text-xs text-gray-500 font-normal ml-2">({{ vaccine.category }})</span>
            </h3>
            <div v-if="vaccine.description" class="text-sm text-gray-500 mb-2 sm:mb-0 line-clamp-2">
              {{ vaccine.description }}
            </div>
          </div>
          <!-- Status (desktop right, mobile below date) -->
          <div class="hidden sm:flex items-center gap-2">
            <a-tag :color="statusColor" class="font-medium text-base">
              {{ statusText }}
              <template v-if="statusColor === 'success'">
                <span class="ml-1">✔️</span>
              </template>
            </a-tag>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
          <!-- Date + Số mũi -->
          <div class="flex items-center gap-4 text-sm text-gray-600 mb-2 sm:mb-0">
            <div class="flex items-center gap-1">
              <CalendarOutlined />
              <span>Thời gian: {{ formattedDate }}</span>
            </div>
            <div v-if="vaccine.numberOfInjections">
              Số mũi tiêm: {{ vaccine.numberOfInjections }}
            </div>
          </div>
          <!-- Status (mobile only) -->
          <div class="flex sm:hidden items-center gap-2 mt-1">
            <a-tag :color="statusColor" class="font-medium text-base">
              {{ statusText }}
              <template v-if="statusColor === 'success'">
                <span class="ml-1">✔️</span>
              </template>
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
  border-color: #317BC4;
}

@media (max-width: 640px) {
  .vaccination-card {
    padding: 12px !important;
  }
  .vaccination-card h3 {
    font-size: 1rem !important;
    margin-bottom: 0.25rem !important;
  }
  .vaccination-card .ant-tag {
    font-size: 1rem !important;
    padding: 0 8px !important;
    height: 28px !important;
    display: flex;
    align-items: center;
  }
  .vaccination-card .anticon {
    font-size: 1.1rem !important;
  }
}
</style>
