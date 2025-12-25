<template>
  <div class="support-tickets-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý CSKH Support Tickets</h1>
        <p class="page-subtitle">Quản lý và xử lý các yêu cầu hỗ trợ từ khách hàng</p>
      </div>
      <div class="header-actions">
        <a-button @click="refreshData" :loading="loading">
          <template #icon>
            <ReloadOutlined />
          </template>
          Làm mới
        </a-button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="statistics-cards" v-if="statistics">
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-label">Tổng tickets</div>
        </div>
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value text-blue-600">{{ statistics.active }}</div>
          <div class="stat-label">Đang xử lý</div>
        </div>
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value text-yellow-600">{{ statistics.pending }}</div>
          <div class="stat-label">Chờ xử lý</div>
        </div>
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value text-green-600">{{ statistics.resolved }}</div>
          <div class="stat-label">Đã giải quyết</div>
        </div>
      </a-card>
      <a-card class="stat-card">
        <div class="stat-content">
          <div class="stat-value text-gray-600">{{ statistics.closed }}</div>
          <div class="stat-label">Đã đóng</div>
        </div>
      </a-card>
    </div>

    <!-- Filters -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo số ticket, tiêu đề, mô tả..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        <a-select
          v-model:value="statusFilter"
          placeholder="Trạng thái"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="open">Mở</a-select-option>
          <a-select-option value="pending">Chờ xử lý</a-select-option>
          <a-select-option value="in_progress">Đang xử lý</a-select-option>
          <a-select-option value="resolved">Đã giải quyết</a-select-option>
          <a-select-option value="closed">Đã đóng</a-select-option>
        </a-select>
        <a-select
          v-model:value="priorityFilter"
          placeholder="Độ ưu tiên"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="low">Thấp</a-select-option>
          <a-select-option value="medium">Trung bình</a-select-option>
          <a-select-option value="high">Cao</a-select-option>
          <a-select-option value="urgent">Khẩn cấp</a-select-option>
        </a-select>
        <a-select
          v-model:value="categoryFilter"
          placeholder="Danh mục"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="technical">Kỹ thuật</a-select-option>
          <a-select-option value="billing">Thanh toán</a-select-option>
          <a-select-option value="general">Chung</a-select-option>
          <a-select-option value="complaint">Khiếu nại</a-select-option>
          <a-select-option value="feature_request">Yêu cầu tính năng</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleSearch">
          <template #icon>
            <SearchOutlined />
          </template>
          Tìm kiếm
        </a-button>
      </div>
    </a-card>

    <!-- Tickets Table -->
    <a-card class="table-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="tickets"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1400 }"
        @change="handleTableChange"
        class="desktop-table"
        row-key="_id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'ticketNumber'">
            <div class="ticket-number">
              <a-tag color="blue">{{ record.ticketNumber }}</a-tag>
            </div>
          </template>
          <template v-else-if="column.key === 'title'">
            <div class="ticket-title">
              <div class="font-medium">{{ record.title }}</div>
              <div class="text-xs text-gray-500">{{ getCategoryText(record.category) }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'customer'">
            <div class="customer-info">
              <div class="font-medium">{{ getCustomerName(record) }}</div>
              <div class="text-xs text-gray-500">{{ getCustomerEmail(record) }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'priority'">
            <a-tag :color="getPriorityColor(record.priority)">
              {{ getPriorityText(record.priority) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'assignedTo'">
            <span v-if="getAssignedAdmin(record)">{{ getAssignedAdmin(record) }}</span>
            <a-tag v-else color="default">Chưa phân công</a-tag>
          </template>
          <template v-else-if="column.key === 'createdAt'">
            <span>{{ formatDate(record.createdAt) }}</span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa ticket này?"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" size="small" danger>
                <DeleteOutlined /> Xóa
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <!-- Mobile Cards -->
      <div class="mobile-cards">
        <a-card
          v-for="item in tickets"
          :key="item._id"
          class="mobile-card"
          :bordered="false"
        >
          <div class="card-header">
            <div class="card-title-row">
              <div>
                <a-tag color="blue" class="mb-2">{{ item.ticketNumber }}</a-tag>
                <h3 class="card-title">{{ item.title }}</h3>
              </div>
              <div class="flex flex-col gap-2">
                <a-tag :color="getPriorityColor(item.priority)">
                  {{ getPriorityText(item.priority) }}
                </a-tag>
                <a-tag :color="getStatusColor(item.status)">
                  {{ getStatusText(item.status) }}
                </a-tag>
              </div>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-row">
              <span class="card-label">Khách hàng:</span>
              <span>{{ getCustomerName(item) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Email:</span>
              <span>{{ getCustomerEmail(item) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Danh mục:</span>
              <span>{{ getCategoryText(item.category) }}</span>
            </div>
            <div class="card-row" v-if="getAssignedAdmin(item)">
              <span class="card-label">Người phụ trách:</span>
              <span>{{ getAssignedAdmin(item) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Ngày tạo:</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>

          <div class="card-actions">
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa ticket này?"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="handleDelete(item)"
            >
              <a-button type="link" size="small" danger>
                <DeleteOutlined /> Xóa
              </a-button>
            </a-popconfirm>
          </div>
        </a-card>
      </div>
    </a-card>

  </div>
</template>

<script setup lang="ts">
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useTicketsApi, type Ticket } from '~/composables/api/useTicketsApi'
import dayjs from 'dayjs'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})

useHead({
  title: 'Quản lý CSKH Support Tickets - Vạn Phúc Care Admin'
})

const ticketsApi = useTicketsApi()

// State
const loading = ref(false)
const tickets = ref<Ticket[]>([])
const statistics = ref<any>(null)
const searchQuery = ref('')
const statusFilter = ref<string | undefined>(undefined)
const priorityFilter = ref<string | undefined>(undefined)
const categoryFilter = ref<string | undefined>(undefined)

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} tickets`,
  pageSizeOptions: ['10', '20', '50', '100'],
})

// Table columns
const columns = [
  {
    title: 'Số ticket',
    key: 'ticketNumber',
    dataIndex: 'ticketNumber',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Tiêu đề',
    key: 'title',
    dataIndex: 'title',
    width: 250,
  },
  {
    title: 'Khách hàng',
    key: 'customer',
    dataIndex: 'userId',
    width: 200,
  },
  {
    title: 'Độ ưu tiên',
    key: 'priority',
    dataIndex: 'priority',
    width: 120,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'Người phụ trách',
    key: 'assignedTo',
    dataIndex: 'assignedTo',
    width: 150,
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 150,
  },
  {
    title: 'Thao tác',
    key: 'actions',
    fixed: 'right',
    width: 180,
  },
]

// Methods
const fetchTickets = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize,
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    if (priorityFilter.value) {
      params.priority = priorityFilter.value
    }

    if (categoryFilter.value) {
      params.category = categoryFilter.value
    }

    const response = await ticketsApi.getTickets(params)
    
    let responseData = response.data as any
    
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      const innerData = responseData.data
      if (innerData && typeof innerData === 'object' && 'data' in innerData && Array.isArray(innerData.data)) {
        tickets.value = innerData.data as Ticket[]
        if (innerData.pagination) {
          pagination.total = innerData.pagination.total || 0
          pagination.current = innerData.pagination.page || pagination.current
        }
      } else if (Array.isArray(innerData)) {
        tickets.value = innerData as Ticket[]
      } else {
        tickets.value = []
      }
    } else if (Array.isArray(responseData)) {
      tickets.value = responseData as Ticket[]
    } else {
      tickets.value = []
    }
  } catch (error: any) {
    console.error('Error fetching tickets:', error)
    message.error('Không thể tải danh sách tickets')
    tickets.value = []
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const response = await ticketsApi.getTicketStatistics()
    if (response.data && response.data.statistics) {
      statistics.value = response.data.statistics
    }
  } catch (error: any) {
    console.error('Error fetching statistics:', error)
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchTickets()
}

const handleFilter = () => {
  pagination.current = 1
  fetchTickets()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchTickets()
}

const refreshData = () => {
  fetchTickets()
  fetchStatistics()
}

const handleDelete = async (record: Ticket) => {
  try {
    await ticketsApi.deleteTicket(record._id)
    message.success('Xóa ticket thành công')
    fetchTickets()
    fetchStatistics()
  } catch (error: any) {
    message.error('Không thể xóa ticket')
  }
}

// Helper functions
const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const getCustomerName = (record: any) => {
  if (typeof record.userId === 'object' && record.userId) {
    return record.userId.fullname || record.userId.email || 'N/A'
  }
  return 'N/A'
}

const getCustomerEmail = (record: any) => {
  if (typeof record.userId === 'object' && record.userId) {
    return record.userId.email || 'N/A'
  }
  return 'N/A'
}

const getAssignedAdmin = (record: any) => {
  if (typeof record.assignedTo === 'object' && record.assignedTo) {
    return record.assignedTo.fullname || record.assignedTo.email || null
  }
  return null
}

const getStatusText = (status: string | undefined) => {
  const map: Record<string, string> = {
    open: 'Mở',
    pending: 'Chờ xử lý',
    in_progress: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng',
  }
  return map[status || ''] || status || 'N/A'
}

const getStatusColor = (status: string | undefined) => {
  const map: Record<string, string> = {
    open: 'blue',
    pending: 'orange',
    in_progress: 'processing',
    resolved: 'success',
    closed: 'default',
  }
  return map[status || ''] || 'default'
}

const getPriorityText = (priority: string | undefined) => {
  const map: Record<string, string> = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    urgent: 'Khẩn cấp',
  }
  return map[priority || ''] || priority || 'N/A'
}

const getPriorityColor = (priority: string | undefined) => {
  const map: Record<string, string> = {
    low: 'default',
    medium: 'blue',
    high: 'orange',
    urgent: 'red',
  }
  return map[priority || ''] || 'default'
}

const getCategoryText = (category: string | undefined) => {
  const map: Record<string, string> = {
    technical: 'Kỹ thuật',
    billing: 'Thanh toán',
    general: 'Chung',
    complaint: 'Khiếu nại',
    feature_request: 'Yêu cầu tính năng',
  }
  return map[category || ''] || category || 'N/A'
}

// Lifecycle
onMounted(() => {
  fetchTickets()
  fetchStatistics()
})
</script>

<style scoped>
.support-tickets-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.filters-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.filters-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.table-card {
  border-radius: 8px;
}

.desktop-table {
  display: block;
}

.mobile-cards {
  display: none;
}

.ticket-number {
  display: flex;
  align-items: center;
}

.ticket-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .mobile-card {
    margin-bottom: 16px;
    border-radius: 8px;
  }

  .card-header {
    margin-bottom: 16px;
  }

  .card-title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #1f2937;
  }

  .card-content {
    margin-bottom: 16px;
  }

  .card-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .card-row:last-child {
    border-bottom: none;
  }

  .card-label {
    font-weight: 500;
    color: #6b7280;
  }

  .card-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-container > * {
    width: 100% !important;
  }
}
</style>

