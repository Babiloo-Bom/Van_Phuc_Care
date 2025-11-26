<template>
  <div class="vaccination-card">
    <!-- Desktop Layout -->
    <div class="desktop-layout">
      <div class="card-content">
        <!-- Vaccine Image -->
        <div class="vaccine-image">
          <img
            v-if="vaccine.thumbnail"
            :src="vaccine.thumbnail"
            :alt="vaccine.name"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            <MedicineBoxOutlined />
          </div>
        </div>

        <!-- Vaccine Info -->
        <div class="vaccine-info">
          <div class="info-header">
            <div class="title-section">
              <h3 class="vaccine-name">
                {{ vaccine.name }}
                <a class="view-detail-link" @click.stop="$emit('viewDetail', vaccine)">(Xem chi tiết)</a>
              </h3>
              <p v-if="vaccine.description" class="vaccine-description">
                {{ vaccine.description }}
              </p>
            </div>
            <div class="date-status-section">
              <div class="date-info">
                <CalendarOutlined />
                <span>Thời gian: {{ formattedDate }}</span>
              </div>
              <div class="status-wrapper">
                <span :class="['status-text', statusClass]">{{ statusText }}</span>
                <a-checkbox 
                  :checked="isCompleted" 
                  :disabled="isCompleted"
                  @change="handleStatusChange"
                />
              </div>
            </div>
          </div>
          <div class="info-footer">
            <span class="injection-count">Số mũi tiêm: {{ vaccine.numberOfInjections || 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div class="mobile-layout">
      <div class="card-content">
        <!-- Vaccine Image -->
        <div class="vaccine-image">
          <img
            v-if="vaccine.thumbnail"
            :src="vaccine.thumbnail"
            :alt="vaccine.name"
            @error="handleImageError"
          />
          <div v-else class="image-placeholder">
            <MedicineBoxOutlined />
          </div>
        </div>

        <!-- Vaccine Info -->
        <div class="vaccine-info">
          <h3 class="vaccine-name">{{ vaccine.name }}</h3>
          <div class="date-info">
            <CalendarOutlined />
            <span>Thời gian: {{ formattedDate }}</span>
          </div>
          <div class="status-wrapper">
            <span :class="['status-text', statusClass]">{{ statusText }}</span>
            <a-checkbox 
              :checked="isCompleted" 
              :disabled="isCompleted"
              @change="handleStatusChange"
            />
          </div>
          <div class="injection-count">
            Số mũi tiêm: {{ vaccine.numberOfInjections || 1 }}
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

const emit = defineEmits<{
  viewDetail: [vaccine: VaccinationScheduleItem]
  statusChange: [vaccine: VaccinationScheduleItem, completed: boolean]
}>()

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = '/images/vaccines/default.png'
}

// Format injection date
const formattedDate = computed(() => {
  if (props.vaccine.injectionDate) {
    return dayjs(props.vaccine.injectionDate).format('DD/MM/YYYY')
  }
  if (props.vaccine.scheduledDate) {
    return dayjs(props.vaccine.scheduledDate).format('DD/MM/YYYY')
  }
  return '--/--/----'
})

// Check if completed
const isCompleted = computed(() => {
  return props.vaccine.injectionStatus === 'completed'
})

// Status text
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

// Status class
const statusClass = computed(() => {
  const status = props.vaccine.injectionStatus || 'pending'
  switch (status) {
    case 'completed':
      return 'status-completed'
    case 'scheduled':
      return 'status-scheduled'
    case 'skipped':
      return 'status-skipped'
    case 'pending':
    default:
      return 'status-pending'
  }
})

// Handle status change
const handleStatusChange = (e: any) => {
  emit('statusChange', props.vaccine, e.target.checked)
}
</script>

<style scoped>
.vaccination-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.vaccination-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

/* Desktop Layout */
.desktop-layout {
  display: block;
}

.mobile-layout {
  display: none;
}

.card-content {
  display: flex;
  gap: 16px;
}

/* Vaccine Image */
.vaccine-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.vaccine-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #1890ff;
}

/* Vaccine Info */
.vaccine-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section {
  flex: 1;
}

.vaccine-name {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin: 0 0 8px;
  line-height: 1.4;
}

.view-detail-link {
  font-size: 13px;
  font-weight: 400;
  color: #ff7875;
  margin-left: 8px;
  cursor: pointer;
}

.view-detail-link:hover {
  text-decoration: underline;
}

.vaccine-description {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.date-status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.date-info :deep(.anticon) {
  color: #1890ff;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-completed {
  color: #52c41a;
}

.status-pending {
  color: #999;
}

.status-scheduled {
  color: #1890ff;
}

.status-skipped {
  color: #faad14;
}

.info-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.injection-count {
  font-size: 13px;
  color: #ff7875;
  font-weight: 500;
}

/* Checkbox styling */
:deep(.ant-checkbox-wrapper) {
  margin: 0;
}

:deep(.ant-checkbox-inner) {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #52c41a;
  border-color: #52c41a;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner::after) {
  width: 6px;
  height: 10px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    display: block;
  }

  .vaccination-card {
    padding: 12px;
    background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
    border-radius: 16px;
  }

  .vaccine-image {
    width: 80px;
    height: 80px;
    border-radius: 12px;
  }

  .vaccine-info {
    gap: 4px;
  }

  .vaccine-name {
    font-size: 15px;
    margin-bottom: 4px;
  }

  .date-info {
    font-size: 12px;
    margin-bottom: 4px;
  }

  .status-wrapper {
    margin-bottom: 4px;
  }

  .status-text {
    font-size: 13px;
  }

  .injection-count {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }

  :deep(.ant-checkbox-inner) {
    width: 18px;
    height: 18px;
  }
}
</style>
