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
      <!-- Desktop Table View -->
      <div class="desktop-view">
        <!-- Header with Title and Create Button -->
        <div class="list-header">
          <h2 class="list-title">DANH SÁCH PHIẾU HỖ TRỢ</h2>
          <a-button class="create-btn" @click="handleCreateRequest">
            <template #icon>
              <PlusOutlined />
            </template>
            Tạo phiếu mới
          </a-button>
        </div>

        <a-table
          :columns="columns"
          :data-source="requests"
          :pagination="tablePagination"
          :row-key="(record: SupportRequest) => record.id"
          @change="handleTableChange"
          class="support-table"
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
              <button class="detail-btn" @click="handleViewDetail(record.id)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_244_9744)">
                    <path d="M14 0.666992H2C1.46957 0.666992 0.960859 0.877706 0.585786 1.25278C0.210714 1.62785 0 2.13656 0 2.66699L0 15.3337H16V2.66699C16 2.13656 15.7893 1.62785 15.4142 1.25278C15.0391 0.877706 14.5304 0.666992 14 0.666992ZM2 2.00033H14C14.1768 2.00033 14.3464 2.07056 14.4714 2.19559C14.5964 2.32061 14.6667 2.49018 14.6667 2.66699V4.66699H1.33333V2.66699C1.33333 2.49018 1.40357 2.32061 1.5286 2.19559C1.65362 2.07056 1.82319 2.00033 2 2.00033ZM1.33333 14.0003V6.00033H14.6667V14.0003H1.33333ZM3.33333 8.00033H12.6667V9.33366H3.33333V8.00033ZM3.33333 10.667H10V12.0003H3.33333V10.667ZM2 3.33366C2 3.2018 2.0391 3.07291 2.11235 2.96328C2.18561 2.85365 2.28973 2.7682 2.41154 2.71774C2.53336 2.66728 2.66741 2.65408 2.79673 2.6798C2.92605 2.70553 3.04484 2.76902 3.13807 2.86225C3.23131 2.95549 3.2948 3.07428 3.32052 3.2036C3.34625 3.33292 3.33305 3.46696 3.28259 3.58878C3.23213 3.7106 3.14668 3.81472 3.03705 3.88797C2.92741 3.96123 2.79852 4.00033 2.66667 4.00033C2.48986 4.00033 2.32029 3.93009 2.19526 3.80506C2.07024 3.68004 2 3.51047 2 3.33366ZM4 3.33366C4 3.2018 4.0391 3.07291 4.11235 2.96328C4.18561 2.85365 4.28973 2.7682 4.41154 2.71774C4.53336 2.66728 4.66741 2.65408 4.79673 2.6798C4.92605 2.70553 5.04484 2.76902 5.13807 2.86225C5.23131 2.95549 5.2948 3.07428 5.32052 3.2036C5.34625 3.33292 5.33305 3.46696 5.28259 3.58878C5.23213 3.7106 5.14668 3.81472 5.03705 3.88797C4.92741 3.96123 4.79852 4.00033 4.66667 4.00033C4.48986 4.00033 4.32029 3.93009 4.19526 3.80506C4.07024 3.68004 4 3.51047 4 3.33366ZM6 3.33366C6 3.2018 6.0391 3.07291 6.11235 2.96328C6.18561 2.85365 6.28973 2.7682 6.41154 2.71774C6.53336 2.66728 6.66741 2.65408 6.79673 2.6798C6.92605 2.70553 7.04484 2.76902 7.13807 2.86225C7.23131 2.95549 7.2948 3.07428 7.32052 3.2036C7.34625 3.33292 7.33305 3.46696 7.28259 3.58878C7.23213 3.7106 7.14668 3.81472 7.03705 3.88797C6.92741 3.96123 6.79852 4.00033 6.66667 4.00033C6.48986 4.00033 6.32029 3.93009 6.19526 3.80506C6.07024 3.68004 6 3.51047 6 3.33366Z" fill="#317BC4"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_244_9744">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </template>
            <template v-else-if="column.key === 'createdAt'">
              <span class="date-text">{{ formatDate(record.createdAt) }}</span>
            </template>
            <template v-else-if="column.key === 'status'">
              <span 
                class="status-badge"
                :class="getStatusClass(record.status)"
              >
                {{ getStatusLabel(record.status) }}
              </span>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <h2 class="mobile-title">DANH SÁCH PHIẾU HỖ TRỢ</h2>
        
        <a-button class="mobile-create-btn" block @click="handleCreateRequest">
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
              <span 
                class="status-badge"
                :class="getStatusClass(request.status)"
              >
                {{ getStatusLabel(request.status) }}
              </span>
            </div>
            <div class="card-divider"></div>
            <div class="card-body">
              <div class="card-row">
                <div class="card-info">
                  <span class="info-text">{{ getCategoryLabel(request.category) }}</span>
                  <span class="info-divider">|</span>
                  <span class="info-text">{{ formatDate(request.createdAt) }}</span>
                </div>
                <a class="detail-link" @click="handleViewDetail(request.id)">Chi tiết</a>
              </div>
              <div class="ticket-id">ID: #{{ formatTicketNumber(request.ticketNumber) }}</div>
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
    width: 100,
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

const getStatusClass = (status: SupportRequestStatus): string => {
  const classes: Record<SupportRequestStatus, string> = {
    pending: 'status-processing',
    processing: 'status-processing',
    completed: 'status-completed',
  }
  return classes[status] || 'status-default'
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

/* Desktop View */
.desktop-view {
  display: block;
}

/* Header */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-title {
  font-size: 16px;
  font-weight: 700;
  color: #317BC4;
  margin: 0;
  letter-spacing: 0.5px;
}

.create-btn {
  border-radius: 20px;
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #317BC4;
  color: #317BC4;
  background: #fff;
}

.create-btn:hover {
  background: #317BC4;
  color: #fff;
  border-color: #317BC4;
}

/* Desktop Table */
.support-table :deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.support-table :deep(.ant-table-thead > tr > th) {
  background: #E8F4FC;
  font-weight: 600;
  font-size: 12px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 16px;
  border-bottom: 1px solid #d4e8f7;
}

.support-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.support-table :deep(.ant-table-tbody > tr:hover > td) {
  background: #fafafa;
}

.support-table :deep(.ant-pagination) {
  margin: 16px 0;
  padding: 0 16px;
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

/* Desktop Detail Button */
.detail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #E8F4FC;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.detail-btn:hover {
  background: #d4e8f7;
}

.detail-btn svg {
  width: 20px;
  height: 20px;
}

/* Mobile Detail Link */
.detail-link {
  color: #317BC4;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
}

.detail-link:hover {
  color: #1d5a9e;
}

.date-text {
  color: #666;
}

/* Status Badge - Desktop */
.status-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.status-completed {
  background: #E6F7EC;
  color: #52c41a;
}

.status-processing {
  background: #FFF2E8;
  color: #fa541c;
}

.status-default {
  background: #f5f5f5;
  color: #666;
}

/* Mobile View - Hidden by default on desktop */
.mobile-view {
  display: none;
}

.mobile-title {
  font-size: 16px;
  font-weight: 700;
  color: #317BC4;
  text-align: center;
  margin: 0 0 16px;
  letter-spacing: 0.5px;
}

.mobile-create-btn {
  margin-bottom: 16px;
  height: 44px;
  border-radius: 24px;
  border: 1px solid #317BC4;
  color: #317BC4;
  background: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mobile-create-btn:hover {
  background: #317BC4;
  color: #fff;
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
  color: #317BC4;
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
  gap: 6px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.info-text {
  color: #666;
}

.info-divider {
  color: #d9d9d9;
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

  /* Hide desktop view, show mobile view */
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }

  /* Mobile status badge - text only, no background */
  .status-badge {
    padding: 0;
    background: transparent;
    border-radius: 0;
  }

  .status-completed {
    background: transparent;
    color: #52c41a;
  }

  .status-processing {
    background: transparent;
    color: #fa8c16;
  }

  .status-default {
    background: transparent;
    color: #666;
  }
}
</style>
