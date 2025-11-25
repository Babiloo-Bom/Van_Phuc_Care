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

    <!-- Request List - Desktop Table View -->
    <div v-else class="request-list-container">
      <!-- Header with Create Button -->
      <div class="list-header">
        <a-button type="primary" class="create-btn" @click="handleCreateRequest">
          <template #icon>
            <PlusOutlined />
          </template>
          Tạo phiếu mới
        </a-button>
      </div>

      <!-- Desktop Table View -->
      <div class="desktop-table">
        <a-table
          :columns="columns"
          :data-source="requests"
          :pagination="tablePagination"
          :row-key="(record: SupportRequest) => record.id"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'ticketNumber'">
              <span class="ticket-number">{{ formatTicketNumber(record.ticketNumber) }}</span>
            </template>
            <template v-else-if="column.key === 'category'">
              <span class="category-text">{{ getCategoryLabel(record.category) }}</span>
            </template>
            <template v-else-if="column.key === 'title'">
              <span class="request-title">{{ record.title }}</span>
            </template>
            <template v-else-if="column.key === 'detail'">
              <a class="detail-link" @click="handleViewDetail(record.id)">Chi tiết</a>
            </template>
            <template v-else-if="column.key === 'createdAt'">
              <span class="date-text">{{ formatDate(record.createdAt) }}</span>
            </template>
            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)" class="status-tag">
                {{ getStatusLabel(record.status) }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-cards">
        <h2 class="mobile-title">DANH SÁCH PHIẾU HỖ TRỢ</h2>
        
        <a-button type="default" class="mobile-create-btn" block @click="handleCreateRequest">
          <template #icon>
            <PlusOutlined />
          </template>
          Tạo phiếu mới
        </a-button>

        <div class="card-list">
          <div 
            v-for="request in requests" 
            :key="request.id" 
            class="request-card"
          >
            <div class="card-header">
              <h3 class="card-title">{{ request.title }}</h3>
              <a-tag :color="getStatusColor(request.status)" class="status-tag">
                {{ getStatusLabel(request.status) }}
              </a-tag>
            </div>
            <div class="card-divider"></div>
            <div class="card-body">
              <div class="card-info">
                <span class="info-text">{{ getCategoryLabel(request.category) }}</span>
                <span class="info-divider">|</span>
                <span class="info-text">{{ formatDate(request.createdAt) }}</span>
              </div>
              <div class="card-footer">
                <span class="ticket-id">ID: #{{ formatTicketNumber(request.ticketNumber) }}</span>
                <a class="detail-link" @click="handleViewDetail(request.id)">Chi tiết</a>
              </div>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableProps } from 'ant-design-vue'
import { useSupportRequestsApi } from '~/composables/api/useSupportRequestsApi'
import type { SupportRequest, SupportRequestCategory, SupportRequestStatus } from '~/composables/api/useSupportRequestsApi'
import CreateSupportRequestModal from '~/components/health-book/CreateSupportRequestModal.vue'

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
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// API
const { getSupportRequests } = useSupportRequestsApi()

// Table columns
const columns = [
  {
    title: 'ID',
    key: 'ticketNumber',
    dataIndex: 'ticketNumber',
    width: 100,
  },
  {
    title: 'LOẠI',
    key: 'category',
    dataIndex: 'category',
    width: 120,
  },
  {
    title: 'NỘI DUNG YÊU CẦU',
    key: 'title',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: 'CHI TIẾT',
    key: 'detail',
    width: 80,
    align: 'center' as const,
  },
  {
    title: 'THỜI GIAN',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 120,
  },
  {
    title: 'TRẠNG THÁI',
    key: 'status',
    dataIndex: 'status',
    width: 120,
    align: 'center' as const,
  },
]

// Pagination
const tablePagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: false,
  showQuickJumper: true,
  showTotal: (t: number) => `Tổng ${t} phiếu`,
}))

// Helpers
const formatTicketNumber = (ticketNumber: string): string => {
  // Extract number from "TK000053" -> "00053"
  const num = ticketNumber?.replace(/\D/g, '') || '00000'
  return num.slice(-5).padStart(5, '0')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getCategoryLabel = (category: SupportRequestCategory): string => {
  const labels: Record<SupportRequestCategory, string> = {
    parent_support: 'Hỗ trợ cha mẹ',
    health_issue: 'Vấn đề sức khỏe',
    service: 'Dịch vụ',
    course: 'Khóa học',
    other: 'Khác',
  }
  return labels[category] || category
}

const getStatusLabel = (status: SupportRequestStatus): string => {
  const labels: Record<SupportRequestStatus, string> = {
    pending: 'Đang xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn tất',
  }
  return labels[status] || status
}

const getStatusColor = (status: SupportRequestStatus): string => {
  const colors: Record<SupportRequestStatus, string> = {
    pending: 'orange',
    processing: 'orange',
    completed: 'green',
  }
  return colors[status] || 'default'
}

// Fetch requests
const fetchRequests = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getSupportRequests({
      limit: 100,
      sort: '-createdAt',
    })

    requests.value = response.data
    total.value = response.pagination.total
  } catch (err: any) {
    console.error('Error fetching support requests:', err)
    error.value = err.message || 'Không thể tải danh sách yêu cầu hỗ trợ'
    message.error('Không thể tải danh sách yêu cầu hỗ trợ')
  } finally {
    loading.value = false
  }
}

// Handlers
const handleTableChange: TableProps['onChange'] = (pagination) => {
  currentPage.value = pagination?.current || 1
  pageSize.value = pagination?.pageSize || 10
}

const handleCreateRequest = () => {
  showCreateModal.value = true
}

const handleRequestCreated = async () => {
  showCreateModal.value = false
  message.success('Yêu cầu hỗ trợ đã được tạo thành công!')
  await fetchRequests()
}

const handleViewDetail = (requestId: string) => {
  // Navigate to detail page
  navigateTo(`/health-book/support-requests/${requestId}`)
}

// Lifecycle
onMounted(() => {
  fetchRequests()
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

/* Request List Container */
.request-list-container {
  padding: 0;
}

/* Header */
.list-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.create-btn {
  border-radius: 8px;
  height: 40px;
  padding: 0 20px;
  font-weight: 500;
}

/* Desktop Table */
.desktop-table {
  display: block;
}

.desktop-table :deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
}

.desktop-table :deep(.ant-table-thead > tr > th) {
  background: #f5f5f5;
  font-weight: 600;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.desktop-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.desktop-table :deep(.ant-table-tbody > tr:hover > td) {
  background: #fafafa;
}

.ticket-number {
  font-weight: 500;
  color: #333;
}

.category-text {
  color: #666;
}

.request-title {
  color: #333;
}

.detail-link {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}

.detail-link:hover {
  color: #40a9ff;
}

.date-text {
  color: #666;
}

.status-tag {
  border-radius: 4px;
  font-weight: 500;
  padding: 2px 12px;
  border: none;
}

.status-tag :deep(.ant-tag) {
  margin: 0;
}

/* Mobile Cards - Hidden by default on desktop */
.mobile-cards {
  display: none;
}

.mobile-title {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
  text-align: center;
  margin: 0 0 16px;
  letter-spacing: 0.5px;
}

.mobile-create-btn {
  margin-bottom: 20px;
  height: 44px;
  border-radius: 20px;
  border: 1px solid #1890ff;
  color: #1890ff;
  font-weight: 500;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.card-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 12px 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.info-divider {
  color: #d9d9d9;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-id {
  font-size: 13px;
  color: #999;
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

  /* Hide desktop table, show mobile cards */
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .list-header {
    display: none;
  }
}
</style>
