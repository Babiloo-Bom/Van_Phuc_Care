<template>
  <div class="support-request-list">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <a-spin size="large" />
      <p class="loading-text">Đang tải danh sách yêu cầu hỗ trợ...</p>
    </div>

    <!-- Error State -->
    <a-result
      v-else-if="error"
      status="error"
      title="Không thể tải danh sách yêu cầu hỗ trợ"
      :sub-title="error"
    >
      <template #extra>
        <a-button type="primary" @click="fetchRequests">
          Thử lại
        </a-button>
      </template>
    </a-result>

    <!-- Empty State -->
    <div v-else-if="requests.length === 0" class="empty-state">
      <div class="mascot-container">
        <img 
          src="/images/tickets/register.png" 
          alt="Van Phuc Mascot"
          class="mascot"
        />
      </div>
      
      <p class="empty-text">
        Hiện tại cha mẹ chưa có yêu cầu hỗ trợ nào được ghi nhận. Nếu có vấn đề gì, ba mẹ
        vui lòng phản hồi tại đây để được hỗ trợ sớm nhất nhé.
      </p>
      
      <a-button type="primary" size="large" @click="handleCreateRequest">
        Tạo phiếu ngay
      </a-button>
    </div>

    <!-- Request List -->
    <div v-else class="request-list-container">
      <div class="list-header">
        <h2 class="list-title">DANH SÁCH PHIẾU HỖ TRỢ</h2>
        <a-button type="primary" @click="handleCreateRequest">
          <template #icon>
            <PlusOutlined />
          </template>
          Tạo phiếu mới
        </a-button>
      </div>

      <div class="request-cards">
        <SupportRequestCard
          v-for="request in requests"
          :key="request.id"
          :request="request"
          :customer-id="customerId"
          @view-detail="handleViewDetail"
        />
      </div>
    </div>

    <!-- Create Request Modal -->
    <CreateSupportRequestModal
      v-model:visible="showCreateModal"
      :customer-id="customerId"
      @success="handleRequestCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useSupportRequestsApi } from '~/composables/api/useSupportRequestsApi'
import type { SupportRequest } from '~/composables/api/useSupportRequestsApi'
import CreateSupportRequestModal from '~/components/health-book/CreateSupportRequestModal.vue'
import SupportRequestCard from '~/components/health-book/SupportRequestCard.vue'

// Props
interface Props {
  customerId?: string
}

const props = withDefaults(defineProps<Props>(), {
  customerId: ''
})

// State
const showCreateModal = ref(false)
const requests = ref<SupportRequest[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// API
const { getSupportRequests } = useSupportRequestsApi()

// Fetch requests
const fetchRequests = async () => {
  if (!props.customerId) {
    console.warn('No customerId provided')
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await getSupportRequests({
      customerId: props.customerId,
      limit: 100, // Get all requests for this customer
      sort: '-createdAt', // Newest first
    })

    requests.value = response.data
  } catch (err: any) {
    console.error('Error fetching support requests:', err)
    error.value = err.message || 'Không thể tải danh sách yêu cầu hỗ trợ'
    message.error('Không thể tải danh sách yêu cầu hỗ trợ')
  } finally {
    loading.value = false
  }
}

// Handlers
const handleCreateRequest = () => {
  console.log('handleCreateRequest clicked, showCreateModal before:', showCreateModal.value)
  showCreateModal.value = true
  console.log('handleCreateRequest clicked, showCreateModal after:', showCreateModal.value)
}

const handleRequestCreated = async () => {
  showCreateModal.value = false
  message.success('Yêu cầu hỗ trợ đã được tạo thành công!')
  
  // Reload requests list
  await fetchRequests()
}

const handleViewDetail = (requestId: string) => {
  // Navigation is handled in SupportRequestCard
  console.log('View detail:', requestId)
}

// Lifecycle
onMounted(() => {
  fetchRequests()
})

// Watch customerId changes
watch(() => props.customerId, (newId) => {
  if (newId) {
    fetchRequests()
  }
})
</script>

<style scoped>
.support-request-list {
  min-height: 400px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  color: #666;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px 60px;
  text-align: center;
}

.mascot-container {
  margin-bottom: -16px;
}

.mascot {
  width: 280px;
  height: auto;
  max-width: 100%;
}

.empty-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0 0 12px;
  max-width: 600px;
}

/* Request List */
.request-list-container {
  padding: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.list-title {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
  margin: 0;
  letter-spacing: 0.5px;
}

.request-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .loading-state {
    padding: 60px 16px;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .mascot {
    width: 220px;
  }

  .empty-text {
    font-size: 14px;
  }

  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .list-title {
    font-size: 18px;
    text-align: center;
  }

  .list-header .ant-btn {
    width: 100%;
  }
}
</style>
