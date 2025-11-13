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
          {{ vaccine.ageRecommended }}
        </div>

        <div v-if="vaccine.description" class="text-sm text-gray-500 mb-3 line-clamp-2">
          {{ vaccine.description }}
        </div>

        <div class="flex items-center justify-between">
          <!-- Scheduled/Injected Date -->
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <CalendarOutlined />
            <span>
              Thời gian: {{ vaccine.scheduledDate || vaccine.injectedDate || '--' }}
            </span>
          </div>

          <!-- Status -->
          <div class="flex items-center gap-2">
            <a-tag v-if="vaccine.status === 'completed'" color="success" class="font-medium">
              <CheckCircleOutlined />
              ĐÃ TIÊM PHÒNG
            </a-tag>
            <a-tag v-else color="default" class="font-medium text-gray-600">
              CHƯA TIÊM PHÒNG
            </a-tag>
          </div>
        </div>

        <!-- Dosage Info -->
        <div class="mt-2 text-xs text-gray-500">
          Số mũi tiêm: {{ vaccine.dosage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CalendarOutlined, 
  CheckCircleOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons-vue'

interface Vaccine {
  id: string
  name: string
  ageRecommended: string
  dosage: number
  scheduledDate?: string
  injectedDate?: string
  status: 'completed' | 'pending'
  description?: string
  image?: string
}

interface Props {
  vaccine: Vaccine
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
