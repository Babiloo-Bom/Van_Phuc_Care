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
            <a-space>
              <a-button type="link" size="small" @click="viewTicket(record)">
                <EyeOutlined /> Xem
              </a-button>
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
            </a-space>
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
            <a-space>
              <a-button type="link" size="small" @click="viewTicket(item)">
                <EyeOutlined /> Xem
              </a-button>
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
            </a-space>
          </div>
        </a-card>
      </div>
    </a-card>

    <!-- Ticket Detail Modal -->
    <a-modal
      v-model:open="showDetailModal"
      :title="`Chi tiết Ticket: ${selectedTicket?.ticketNumber || ''}`"
      width="900px"
      :footer="null"
      @cancel="closeDetailModal"
    >
      <div v-if="selectedTicket" class="ticket-detail">
        <!-- Ticket Info -->
        <a-descriptions :column="2" bordered class="mb-4">
          <a-descriptions-item label="Số ticket">
            <a-tag color="blue">{{ selectedTicket.ticketNumber }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái">
            <a-tag :color="getStatusColor(selectedTicket.status)">
              {{ getStatusText(selectedTicket.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Độ ưu tiên">
            <a-tag :color="getPriorityColor(selectedTicket.priority)">
              {{ getPriorityText(selectedTicket.priority) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Danh mục">
            {{ getCategoryText(selectedTicket.category) }}
          </a-descriptions-item>
          <a-descriptions-item label="Khách hàng" :span="2">
            <div>
              <div><strong>{{ getCustomerName(selectedTicket) }}</strong></div>
              <div class="text-gray-500">{{ getCustomerEmail(selectedTicket) }}</div>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="Người phụ trách" :span="2">
            <div v-if="getAssignedAdmin(selectedTicket)" class="flex items-center gap-2">
              <span>{{ getAssignedAdmin(selectedTicket) }}</span>
              <a-button 
                v-if="canAssign" 
                type="link" 
                size="small" 
                @click="openAssignModal"
              >
                Thay đổi
              </a-button>
            </div>
            <div v-else>
              <a-tag color="default">Chưa phân công</a-tag>
              <a-button 
                v-if="canAssign" 
                type="link" 
                size="small" 
                @click="openAssignModal"
                class="ml-2"
              >
                Phân công
              </a-button>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="Tiêu đề" :span="2">
            {{ selectedTicket.title }}
          </a-descriptions-item>
          <a-descriptions-item label="Mô tả" :span="2">
            <div class="whitespace-pre-wrap">{{ selectedTicket.description }}</div>
          </a-descriptions-item>
          <a-descriptions-item label="Ngày tạo">
            {{ formatDate(selectedTicket.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item label="Cập nhật lần cuối">
            {{ formatDate(selectedTicket.updatedAt) }}
          </a-descriptions-item>
        </a-descriptions>

        <!-- Comments Section -->
        <a-divider>Bình luận / Trả lời</a-divider>
        
        <div ref="commentsContainerRef" class="comments-section">
          <div v-if="loadingComments" class="text-center py-4">
            <a-spin />
          </div>
          <div v-else-if="comments.length === 0" class="text-center py-4 text-gray-500">
            Chưa có bình luận nào
          </div>
          <div v-else class="comments-list">
            <div 
              v-for="comment in comments" 
              :key="comment._id" 
              class="comment-item"
              :class="{ 'comment-admin': comment.isAdmin }"
            >
              <div class="comment-header">
                <div class="flex items-center gap-2">
                  <a-avatar 
                    v-if="comment.adminId && typeof comment.adminId === 'object' && comment.adminId.avatar"
                    :src="comment.adminId.avatar"
                    size="small"
                  >
                    {{ getCommentAuthorName(comment).charAt(0).toUpperCase() }}
                  </a-avatar>
                  <a-avatar v-else size="small">
                    {{ getCommentAuthorName(comment).charAt(0).toUpperCase() }}
                  </a-avatar>
                  <div>
                    <div class="font-medium">
                      {{ getCommentAuthorName(comment) }}
                      <a-tag v-if="comment.isAdmin" color="blue" size="small">Admin</a-tag>
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ formatDate(comment.createdAt) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="comment-content">
                <div class="whitespace-pre-wrap">{{ comment.content }}</div>
                
                <!-- Comment Attachments -->
                <div
                  v-if="comment.attachments && comment.attachments.length > 0"
                  class="comment-attachments"
                >
                  <div
                    v-for="(attachment, attIndex) in comment.attachments"
                    :key="attIndex"
                    class="comment-attachment-item"
                    @click="previewAttachment(attachment.url)"
                  >
                    <img
                      v-if="isImage(attachment.url)"
                      :src="attachment.url"
                      :alt="attachment.filename"
                      class="attachment-image"
                      loading="lazy"
                    />
                    <div v-else class="attachment-file">
                      <FileOutlined />
                      <span class="attachment-filename">{{ attachment.filename }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Form -->
        <a-divider>Trả lời</a-divider>
        <a-form :model="replyForm" @finish="handleAddComment">
          <a-form-item name="content" :rules="[{ required: true, message: 'Vui lòng nhập nội dung trả lời' }]">
            <a-textarea
              v-model:value="replyForm.content"
              :rows="4"
              placeholder="Nhập nội dung trả lời..."
            />
          </a-form-item>
          
          <!-- File Upload -->
          <a-form-item label="Tệp đính kèm (Tùy chọn)" name="attachments">
            <!-- Preview selected files -->
            <div v-if="replyFileList && replyFileList.length > 0" class="selected-files">
              <div v-for="file in replyFileList" :key="file.uid" class="file-preview-item">
                <img
                  v-if="getFilePreviewUrl(file)"
                  :src="getFilePreviewUrl(file)"
                  alt="preview"
                  class="file-preview-image"
                />
                <div v-else class="file-preview-icon">
                  <FileOutlined />
                  <span class="file-name">{{ file.name }}</span>
                </div>
                <a-button
                  type="text"
                  size="small"
                  danger
                  class="remove-file-btn"
                  @click="removeFile(file)"
                >
                  <CloseOutlined />
                </a-button>
              </div>
            </div>
            
            <!-- Upload button -->
            <a-upload
              v-model:file-list="replyFileList"
              :before-upload="beforeUpload"
              :show-upload-list="false"
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
              :multiple="true"
              :max-count="5"
            >
              <a-button>
                <template #icon>
                  <PaperClipOutlined />
                </template>
                Thêm ảnh, video hoặc file (Tối đa 5)
              </a-button>
            </a-upload>
            <div class="text-sm text-gray-500 mt-2">
              Hỗ trợ: Ảnh, Video, PDF, Word, Excel (Tối đa 10MB/file)
            </div>
          </a-form-item>
          
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="submittingComment">
              Gửi trả lời
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- Assign Ticket Modal -->
    <a-modal
      v-model:open="showAssignModal"
      title="Phân công người xử lý"
      width="500px"
      @ok="handleAssignTicket"
      @cancel="handleCancelAssign"
      :confirm-loading="assigning"
    >
      <a-form :model="assignForm">
        <a-form-item label="Người xử lý" name="assignedTo">
          <a-select
            v-model:value="assignForm.assignedTo"
            placeholder="Nhập tên để tìm kiếm (Admin, Manager, Worker)..."
            show-search
            :filter-option="filterAdminOption"
            :loading="loadingAssignableAdmins"
            allow-clear
            style="width: 100%"
            :not-found-content="loadingAssignableAdmins ? 'Đang tải...' : assignableAdmins.length === 0 ? 'Chưa có dữ liệu' : 'Không tìm thấy'"
            @search="(value: string) => {}"
            @dropdown-visible-change="(open: boolean) => { if (open && assignableAdmins.length === 0) { loadAssignableAdmins() } }"
          >
            <a-select-option 
              v-for="admin in assignableAdmins" 
              :key="admin._id" 
              :value="admin._id"
            >
              <div class="admin-option">
                <a-avatar 
                  v-if="admin.avatar" 
                  :src="admin.avatar" 
                  size="small"
                  class="admin-avatar"
                >
                  {{ (admin.fullname || admin.email || 'A').charAt(0).toUpperCase() }}
                </a-avatar>
                <a-avatar 
                  v-else 
                  size="small"
                  class="admin-avatar"
                >
                  {{ (admin.fullname || admin.email || 'A').charAt(0).toUpperCase() }}
                </a-avatar>
                <span class="admin-name">{{ admin.fullname || admin.email || 'N/A' }}</span>
                <a-tag 
                  :color="admin.role === 'admin' ? 'red' : admin.role === 'manager' ? 'orange' : 'blue'" 
                  size="small"
                  class="admin-role-tag"
                >
                  {{ admin.role === 'admin' ? 'Admin' : admin.role === 'manager' ? 'Manager' : 'Worker' }}
                </a-tag>
              </div>
            </a-select-option>
          </a-select>
          <div class="text-sm text-gray-500 mt-2">
            Để trống để bỏ phân công. Nhập tên hoặc email để tìm kiếm.
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script setup lang="ts">
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PaperClipOutlined,
  CloseOutlined,
  FileOutlined,
} from '@ant-design/icons-vue'
import type { UploadFile, UploadProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { useTicketsApi, type Ticket } from '~/composables/api/useTicketsApi'
import { useAuthStore } from '~/stores/auth'
import dayjs from 'dayjs'
import { io } from 'socket.io-client'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role']
})

useHead({
  title: 'Quản lý CSKH Support Tickets - Vạn Phúc Care Admin'
})

const ticketsApi = useTicketsApi()
const authStore = useAuthStore()

// State
const loading = ref(false)
const tickets = ref<Ticket[]>([])
const statistics = ref<any>(null)
const searchQuery = ref('')
const statusFilter = ref<string | undefined>(undefined)
const priorityFilter = ref<string | undefined>(undefined)
const categoryFilter = ref<string | undefined>(undefined)

// Detail Modal State
const showDetailModal = ref(false)
const selectedTicket = ref<Ticket | null>(null)
const comments = ref<any[]>([])
const loadingComments = ref(false)
const submittingComment = ref(false)
const replyForm = ref({
  content: ''
})
const replyFileList = ref<UploadFile[]>([])

// Assign Modal State
const showAssignModal = ref(false)
const assigning = ref(false)
const loadingAssignableAdmins = ref(false)
const assignableAdmins = ref<any[]>([])
const assignForm = ref({
  assignedTo: null as string | null
})

// Socket.io for realtime comments
const ticketSocket = ref<any | null>(null)
const commentsContainerRef = ref<HTMLElement | null>(null)

// Check if user can assign tickets
const canAssign = computed(() => {
  const userRole = authStore.user?.role
  return userRole === 'admin' || userRole === 'manager'
})

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

// View Ticket Detail
const viewTicket = async (ticket: Ticket) => {
  selectedTicket.value = ticket
  showDetailModal.value = true
  replyForm.value.content = ''
  await loadComments(ticket._id)
  
  // Kết nối Socket.IO để nhận comment realtime cho ticket này
  try {
    if (ticketSocket.value) {
      ticketSocket.value.disconnect()
      ticketSocket.value = null
    }

    const apiHost = process.env.API_HOST || 'http://localhost:3000'
    ticketSocket.value = io(`${apiHost}/tickets`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    ticketSocket.value.emit('join', { ticketId: String(ticket._id) })

    ticketSocket.value.on('ticket:comment:new', (payload: any) => {
      if (!payload || !selectedTicket.value) return
      if (payload.ticketId !== selectedTicket.value._id) return

      const c = payload.comment
      if (!c) return

      const normalized: any = { ...c }

      // Nếu backend gửi dạng đã format (có name/avatar) mà không có userId/adminId,
      // tạo userId giả để getCommentAuthorName() không trả về Unknown
      if (!normalized.userId && !normalized.adminId && normalized.name) {
        normalized.userId = {
          fullname: normalized.name,
          email: normalized.email || '',
          avatar: normalized.avatar || undefined,
        }
      }

      comments.value.push(normalized)
      nextTickScrollToBottom()
    })
  } catch (e) {
    // Nếu socket lỗi thì bỏ qua, vẫn dùng HTTP như cũ
  }
  
  // Load assignable admins if user can assign
  if (canAssign.value) {
    await loadAssignableAdmins()
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedTicket.value = null
  comments.value = []
  replyForm.value.content = ''

  if (ticketSocket.value) {
    ticketSocket.value.disconnect()
    ticketSocket.value = null
  }
}

const loadComments = async (ticketId: string) => {
  try {
    loadingComments.value = true
    const response = await ticketsApi.getComments(ticketId)
    
    // Handle different response structures
    // Backend returns: { success: true, data: { comments: [...] } }
    // useApiClient wraps it: { status: true, data: { success: true, data: { comments: [...] } } }
    let commentsData = null
    if (response.status && response.data) {
      const responseData = response.data as any
      
      // Try nested structure first
      if (responseData.data && responseData.data.comments) {
        commentsData = responseData.data.comments
      } else if (responseData.data && Array.isArray(responseData.data)) {
        commentsData = responseData.data
      } else if (responseData.comments) {
        commentsData = responseData.comments
      } else if (Array.isArray(responseData)) {
        commentsData = responseData
      }
    }
    
    if (commentsData && Array.isArray(commentsData)) {
      comments.value = commentsData
    } else {
      comments.value = []
    }

    // Scroll xuống cuối danh sách sau khi load comments
    nextTickScrollToBottom()
  } catch (error: any) {
    message.error('Không thể tải bình luận')
    comments.value = []
  } finally {
    loadingComments.value = false
  }
}

const nextTickScrollToBottom = () => {
  nextTick(() => {
    setTimeout(() => {
      const el = commentsContainerRef.value
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }, 0)
  })
}

// File upload handlers
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('File phải nhỏ hơn 10MB!')
    return false
  }
  return false // Prevent auto upload
}

const getFilePreviewUrl = (file: UploadFile): string | undefined => {
  if (file.url) {
    return file.url
  }
  if (file.thumbUrl) {
    return file.thumbUrl
  }
  if (file.originFileObj) {
    return URL.createObjectURL(file.originFileObj)
  }
  return undefined
}

const removeFile = (file: UploadFile) => {
  const index = replyFileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    replyFileList.value.splice(index, 1)
  }
}

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url) || /^data:image\//.test(url)
}

const previewAttachment = (url: string) => {
  if (isImage(url)) {
    // Open image in new window or modal
    window.open(url, '_blank')
  } else {
    // Download file
    window.open(url, '_blank')
  }
}

const handleAddComment = async () => {
  if (!selectedTicket.value || !replyForm.value.content.trim()) {
    return
  }

  try {
    submittingComment.value = true
    let response: any
    
    // If there are files, use FormData
    if (replyFileList.value && replyFileList.value.length > 0) {
      const formData = new FormData()
      formData.append('content', replyForm.value.content.trim())
      
      replyFileList.value.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj)
        }
      })
      
      response = await ticketsApi.addCommentWithFiles(
        selectedTicket.value._id,
        formData
      )
    } else {
      // No files, use regular JSON request
      response = await ticketsApi.addComment(selectedTicket.value._id, {
        content: replyForm.value.content.trim()
      })
    }
    
    
    // Optionally add the new comment immediately to the list
    // Backend returns: { success: true, data: { comment: {...} } }
    // useApiClient wraps it: { status: true, data: { success: true, data: { comment: {...} } } }
    if (response.status && response.data) {
      const responseData = response.data as any
      let newComment = null
      
      if (responseData.data && responseData.data.comment) {
        newComment = responseData.data.comment
      } else if (responseData.comment) {
        newComment = responseData.comment
      } else if (responseData.data && !responseData.data.comment) {
        // Sometimes comment is directly in data
        newComment = responseData.data
      }
      
      if (newComment) {
        // Add to comments list immediately
        comments.value.push(newComment)
      }
    }
    
    message.success('Đã gửi trả lời thành công')
    replyForm.value.content = ''
    replyFileList.value = [] // Clear file list
    
    // Reload comments to ensure we have the latest data (with a small delay to ensure DB is updated)
    if (selectedTicket.value) {
      setTimeout(async () => {
        await loadComments(selectedTicket.value!._id)
      }, 500)
    }
    
    // Refresh ticket detail to update status and other fields
    if (selectedTicket.value) {
      const ticketResponse = await ticketsApi.getTicket(selectedTicket.value._id)
      
      if (ticketResponse.status && ticketResponse.data) {
        const ticketData = ticketResponse.data as any
        let refreshedTicket = null
        
        if (ticketData.data && ticketData.data.ticket) {
          refreshedTicket = ticketData.data.ticket
        } else if (ticketData.ticket) {
          refreshedTicket = ticketData.ticket
        }
        
        if (refreshedTicket) {
          selectedTicket.value = refreshedTicket
        }
      }
    }
    
    // Refresh ticket list to update status
    await fetchTickets()
  } catch (error: any) {
    message.error(error.message || 'Không thể gửi trả lời')
  } finally {
    submittingComment.value = false
  }
}

const getCommentAuthorName = (comment: any) => {
  if (comment.isAdmin && comment.adminId) {
    if (typeof comment.adminId === 'object') {
      return comment.adminId.fullname || comment.adminId.email || 'Admin'
    }
  }
  if (comment.userId && typeof comment.userId === 'object') {
    return comment.userId.fullname || comment.userId.email || 'User'
  }
  return 'Unknown'
}

// Assign Ticket
const loadAssignableAdmins = async () => {
  try {
    loadingAssignableAdmins.value = true
    const response = await ticketsApi.getAssignableAdmins()
    
    // Handle different response structures
    // Backend returns: { success: true, data: { admins: [...] } }
    // useApiClient wraps it: { status: true, data: { success: true, data: { admins: [...] } } }
    let adminsData = null
    if (response.status && response.data) {
      const responseData = response.data as any
      
      // Try nested structure first
      if (responseData.data && responseData.data.admins) {
        adminsData = responseData.data.admins
      } else if (responseData.admins) {
        adminsData = responseData.admins
      } else if (Array.isArray(responseData.data)) {
        adminsData = responseData.data
      } else if (Array.isArray(responseData)) {
        adminsData = responseData
      }
    }
    
    if (adminsData && Array.isArray(adminsData)) {
      assignableAdmins.value = adminsData
    } else {
      assignableAdmins.value = []
    }
  } catch (error: any) {
    message.error('Không thể tải danh sách người xử lý')
    assignableAdmins.value = []
  } finally {
    loadingAssignableAdmins.value = false
  }
}

const filterAdminOption = (input: string, option: any) => {
  if (!input || !input.trim()) {
    return true
  }
  
  const admin = assignableAdmins.value.find(a => {
    const adminId = a._id?.toString() || a.id?.toString()
    const optionValue = option.value?.toString()
    return adminId === optionValue
  })
  
  if (!admin) {
    return false
  }
  
  const searchText = input.toLowerCase().trim()
  const name = (admin.fullname || '').toLowerCase()
  const email = (admin.email || '').toLowerCase()
  const role = (admin.role || '').toLowerCase()
  
  const matches = name.includes(searchText) || 
                  email.includes(searchText) || 
                  role.includes(searchText)
  
  if (matches) {
  }
  
  return matches
}

const openAssignModal = async () => {
  
  // Set current assigned value if exists
  if (selectedTicket.value) {
    const assignedTo = typeof selectedTicket.value.assignedTo === 'object' 
      ? selectedTicket.value.assignedTo._id 
      : selectedTicket.value.assignedTo
    assignForm.value.assignedTo = assignedTo || null
  }
  
  // Always load admins when opening modal to ensure fresh data
  await loadAssignableAdmins()
  
  showAssignModal.value = true
}

const handleCancelAssign = () => {
  showAssignModal.value = false
  assignForm.value.assignedTo = null
}

const handleAssignTicket = async () => {
  if (!selectedTicket.value) return

  try {
    assigning.value = true
    const response = await ticketsApi.assignTicket(
      selectedTicket.value._id,
      assignForm.value.assignedTo
    )
    
    
    message.success('Phân công ticket thành công')
    showAssignModal.value = false
    assignForm.value.assignedTo = null
    
    // Update ticket from response if available
    if (response.status && response.data) {
      const responseData = response.data as any
      let updatedTicket = null
      
      if (responseData.data && responseData.data.ticket) {
        updatedTicket = responseData.data.ticket
      } else if (responseData.ticket) {
        updatedTicket = responseData.ticket
      }
      
      if (updatedTicket) {
        selectedTicket.value = updatedTicket
      }
    }
    
    // Always refresh ticket detail to ensure we have latest data
    if (selectedTicket.value) {
      const ticketResponse = await ticketsApi.getTicket(selectedTicket.value._id)
      
      if (ticketResponse.status && ticketResponse.data) {
        const ticketData = ticketResponse.data as any
        let refreshedTicket = null
        
        if (ticketData.data && ticketData.data.ticket) {
          refreshedTicket = ticketData.data.ticket
        } else if (ticketData.ticket) {
          refreshedTicket = ticketData.ticket
        }
        
        if (refreshedTicket) {
          selectedTicket.value = refreshedTicket
        }
      }
    }
    
    // Refresh ticket list
    await fetchTickets()
  } catch (error: any) {
    message.error(error.message || 'Không thể phân công ticket')
  } finally {
    assigning.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchTickets()
  fetchStatistics()
  
  // Load assignable admins if user can assign
  if (canAssign.value) {
    loadAssignableAdmins()
  }
})

onBeforeUnmount(() => {
  if (ticketSocket.value) {
    ticketSocket.value.disconnect()
    ticketSocket.value = null
  }
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

.ticket-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.comments-section {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.comment-item.comment-admin {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.comment-header {
  margin-bottom: 8px;
}

.comment-content {
  padding-left: 40px;
  color: #374151;
  line-height: 1.6;
}

.comment-attachments {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.comment-attachment-item {
  cursor: pointer;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.comment-attachment-item:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.attachment-image {
  max-width: 200px;
  max-height: 200px;
  display: block;
}

.attachment-file {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
}

.attachment-filename {
  font-size: 12px;
  color: #374151;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.file-preview-item {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.file-preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  display: block;
}

.file-preview-icon {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #f9fafb;
  padding: 8px;
}

.file-name {
  font-size: 10px;
  color: #6b7280;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-file-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.remove-file-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.admin-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.admin-avatar {
  flex-shrink: 0;
}

.admin-name {
  flex: 1;
  font-weight: 500;
}

.admin-role-tag {
  flex-shrink: 0;
}

/* Ensure select options are visible */
:deep(.ant-select-item-option-content) {
  display: flex;
  align-items: center;
}
</style>

