<template>
  <div class="support-request-card">
    <div class="card-header">
      <h3 class="card-title">{{ request.title }}</h3>
      <a-tag :color="statusColor" class="status-tag">
        {{ statusText }}
      </a-tag>
    </div>

    <div class="card-body">
      <div class="card-meta">
        <span class="meta-item">{{ getCategoryText(request.category) }}</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">{{ formatDate(request.createdAt) }}</span>
      </div>
      <div class="card-id">ID: #{{ request.ticketNumber }}</div>
    </div>

    <div class="card-footer">
      <a @click="handleViewDetail" class="detail-link">
        Chi tiết
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { SupportRequest, SupportRequestCategory } from '~/composables/api/useSupportRequestsApi'

interface Props {
  request: SupportRequest
  customerId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  viewDetail: [requestId: string]
}>()

// Status config
const statusConfig = {
  pending: {
    color: 'default',
    text: 'CHỜ XỬ LÝ'
  },
  processing: {
    color: 'warning',
    text: 'ĐANG XỬ LÝ'
  },
  completed: {
    color: 'success',
    text: 'HOÀN TẤT'
  }
}

// Category mapping
const categoryMapping: Record<SupportRequestCategory, string> = {
  parent_support: 'Hỗ trợ cha mẹ',
  health_issue: 'Vấn đề sức khỏe',
  service: 'Dịch vụ',
  course: 'Khóa học',
  other: 'Khác'
}

const statusColor = computed(() => statusConfig[props.request.status].color)
const statusText = computed(() => statusConfig[props.request.status].text)

const getCategoryText = (category: SupportRequestCategory): string => {
  return categoryMapping[category] || category
}

const formatDate = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY')
}

const handleViewDetail = () => {
  // Navigate to detail page with customerId
  navigateTo(`/support-requests/${props.request.id}?customerId=${props.customerId}`)
}
</script>

<style scoped>
.support-request-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.support-request-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
  flex: 1;
  line-height: 1.5;
}

.status-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 4px;
  margin: 0;
  white-space: nowrap;
}

.card-body {
  margin-bottom: 16px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.meta-item {
  color: #666;
}

.meta-divider {
  color: #d9d9d9;
}

.card-id {
  font-size: 13px;
  color: #999;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.detail-link {
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.detail-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .support-request-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-title {
    font-size: 15px;
  }

  .status-tag {
    align-self: flex-start;
  }

  .card-meta {
    font-size: 13px;
  }
}
</style>
