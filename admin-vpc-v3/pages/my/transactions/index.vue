<template>
  <div class="transactions-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý giao dịch</h1>
        <p class="page-subtitle">Quản lý đơn hàng và giao dịch</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showManualActivationModal">
            <template #icon>
              <PlusOutlined />
            </template>
            Kích hoạt thủ công
          </a-button>
          <a-button @click="refreshData" :loading="loading">
            <template #icon>
              <ReloadOutlined />
            </template>
            Làm mới
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-card-blue">
        <div class="stat-icon">
          <ShoppingCartOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng đơn hàng</p>
          <p class="stat-value">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đã hoàn thành</p>
          <p class="stat-value">{{ formatNumber(stats.completed) }}</p>
        </div>
      </div>
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <ClockCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đang xử lý</p>
          <p class="stat-value">{{ formatNumber(stats.pending) }}</p>
        </div>
      </div>
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <DollarOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng doanh thu</p>
          <p class="stat-value">{{ formatCurrency(stats.revenue) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        
        <a-select
          v-model:value="filterStatus"
          placeholder="Trạng thái đơn hàng"
          style="width: 200px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="pending">Đang chờ</a-select-option>
          <a-select-option value="processing">Đang xử lý</a-select-option>
          <a-select-option value="completed">Hoàn thành</a-select-option>
          <a-select-option value="cancelled">Đã hủy</a-select-option>
          <a-select-option value="refunded">Đã hoàn tiền</a-select-option>
        </a-select>

        <a-select
          v-model:value="filterPaymentStatus"
          placeholder="Trạng thái thanh toán"
          style="width: 200px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="pending">Chưa thanh toán</a-select-option>
          <a-select-option value="completed">Đã thanh toán</a-select-option>
          <a-select-option value="failed">Thanh toán thất bại</a-select-option>
          <a-select-option value="cancelled">Đã hủy</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- Orders Table -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách đơn hàng</span>
      </template>
      
      <!-- Desktop Table -->
      <div class="desktop-table">
        <a-table
          :columns="columns"
          :data-source="orders"
          :loading="loading"
          :pagination="paginationConfig"
          :scroll="{ x: 1400 }"
          @change="handleTableChange"
          row-key="_id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'orderId'">
              <div class="order-id">
                <a-typography-text strong>{{ record.orderId }}</a-typography-text>
                <div class="order-date">{{ formatDate(record.createdAt) }}</div>
              </div>
            </template>
            
            <template v-else-if="column.key === 'customer'">
              <div class="customer-info">
                <div class="customer-name">{{ record.customerInfo?.fullName || 'N/A' }}</div>
                <div class="customer-email">{{ record.customerInfo?.email || '' }}</div>
              </div>
            </template>

            <template v-else-if="column.key === 'items'">
              <div class="order-items">
                <div v-for="(item, index) in record.items" :key="index" class="order-item">
                  {{ item.course?.title || 'Khóa học' }} - {{ formatCurrency(item.price || 0) }}
                </div>
              </div>
            </template>

            <template v-else-if="column.key === 'totalAmount'">
              <a-typography-text strong>{{ formatCurrency(record.totalAmount || 0) }}</a-typography-text>
            </template>

            <template v-else-if="column.key === 'paymentMethod'">
              <a-tag :color="getPaymentMethodColor(record.paymentMethod)">
                {{ getPaymentMethodText(record.paymentMethod) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'paymentStatus'">
              <a-tag :color="getPaymentStatusColor(record.paymentStatus)">
                {{ getPaymentStatusText(record.paymentStatus) }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">
                {{ getStatusText(record.status) }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>

      <!-- Mobile Stack Cards -->
      <div class="mobile-cards">
        <div v-for="order in orders" :key="order._id" class="order-card">
          <div class="order-card-header">
            <div>
              <div class="order-id-mobile">{{ order.orderId }}</div>
              <div class="order-date-mobile">{{ formatDate(order.createdAt) }}</div>
            </div>
            <a-tag :color="getStatusColor(order.status)">
              {{ getStatusText(order.status) }}
            </a-tag>
          </div>
          
          <div class="order-card-body">
            <div class="order-info-row">
              <span class="label">Khách hàng:</span>
              <span class="value">{{ order.customerInfo?.fullName || 'N/A' }}</span>
            </div>
            <div class="order-info-row">
              <span class="label">Email:</span>
              <span class="value">{{ order.customerInfo?.email || 'N/A' }}</span>
            </div>
            <div class="order-info-row">
              <span class="label">Số lượng:</span>
              <span class="value">{{ order.items?.length || 0 }} khóa học</span>
            </div>
            <div class="order-info-row">
              <span class="label">Tổng tiền:</span>
              <span class="value amount">{{ formatCurrency(order.totalAmount || 0) }}</span>
            </div>
            <div class="order-info-row">
              <span class="label">Phương thức:</span>
              <a-tag :color="getPaymentMethodColor(order.paymentMethod)" size="small">
                {{ getPaymentMethodText(order.paymentMethod) }}
              </a-tag>
            </div>
            <div class="order-info-row">
              <span class="label">Thanh toán:</span>
              <a-tag :color="getPaymentStatusColor(order.paymentStatus)" size="small">
                {{ getPaymentStatusText(order.paymentStatus) }}
              </a-tag>
            </div>
          </div>

          <!-- Xóa toàn bộ div.order-card-actions -->
        </div>
      </div>
    </a-card>

    <!-- View Order Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      title="Chi tiết đơn hàng"
      width="800px"
      :footer="null"
    >
      <a-descriptions v-if="selectedOrder" bordered :column="2">
        <a-descriptions-item label="Mã đơn hàng" :span="2">
          {{ selectedOrder.orderId }}
        </a-descriptions-item>
        <a-descriptions-item label="Khách hàng">
          {{ selectedOrder.customerInfo?.fullName || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Email">
          {{ selectedOrder.customerInfo?.email || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Số điện thoại">
          {{ selectedOrder.customerInfo?.phone || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Địa chỉ">
          {{ selectedOrder.customerInfo?.address || 'N/A' }}
        </a-descriptions-item>
        <a-descriptions-item label="Trạng thái">
          <a-tag :color="getStatusColor(selectedOrder.status)">
            {{ getStatusText(selectedOrder.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Trạng thái thanh toán">
          <a-tag :color="getPaymentStatusColor(selectedOrder.paymentStatus)">
            {{ getPaymentStatusText(selectedOrder.paymentStatus) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Phương thức thanh toán">
          <a-tag :color="getPaymentMethodColor(selectedOrder.paymentMethod)">
            {{ getPaymentMethodText(selectedOrder.paymentMethod) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Tổng tiền" :span="2">
          <a-typography-text strong style="font-size: 18px; color: #1890ff">
            {{ formatCurrency(selectedOrder.totalAmount || 0) }}
          </a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item label="Khóa học" :span="2">
          <div v-for="(item, index) in selectedOrder.items" :key="index" class="order-item-detail">
            <div class="item-name">{{ item.course?.title || 'Khóa học' }}</div>
            <div class="item-price">{{ formatCurrency(item.price || 0) }}</div>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="Ghi chú" :span="2">
          {{ selectedOrder.notes || 'Không có' }}
        </a-descriptions-item>
        <a-descriptions-item label="Ngày tạo">
          {{ formatDate(selectedOrder.createdAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="Ngày cập nhật">
          {{ formatDate(selectedOrder.updatedAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <!-- Update Status Modal -->
    <a-modal
      v-model:open="updateModalVisible"
      title="Cập nhật trạng thái đơn hàng"
      @ok="handleUpdateStatus"
      @cancel="updateModalVisible = false"
    >
      <a-form :model="updateForm" layout="vertical">
        <a-form-item label="Trạng thái đơn hàng">
          <a-select v-model:value="updateForm.status">
            <a-select-option value="pending">Đang chờ</a-select-option>
            <a-select-option value="processing">Đang xử lý</a-select-option>
            <a-select-option value="completed">Hoàn thành</a-select-option>
            <a-select-option value="cancelled">Đã hủy</a-select-option>
            <a-select-option value="refunded">Đã hoàn tiền</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Trạng thái thanh toán">
          <a-select v-model:value="updateForm.paymentStatus">
            <a-select-option value="pending">Chưa thanh toán</a-select-option>
            <a-select-option value="completed">Đã thanh toán</a-select-option>
            <a-select-option value="failed">Thanh toán thất bại</a-select-option>
            <a-select-option value="cancelled">Đã hủy</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Ghi chú">
          <a-textarea v-model:value="updateForm.notes" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Manual Activation Modal -->
    <a-modal
      v-model:open="manualActivationModalVisible"
      title="Kích hoạt thủ công"
      width="700px"
      :confirm-loading="manualActivationLoading"
      @ok="handleManualActivation"
      @cancel="handleCancelManualActivation"
    >
      <a-form :model="manualActivationForm" layout="vertical" :rules="manualActivationRules" ref="manualActivationFormRef">
        <a-form-item label="Email tài khoản người dùng" name="userEmail" required>
          <a-select
            v-model:value="manualActivationForm.userEmail"
            show-search
            placeholder="Tìm kiếm người dùng theo tên hoặc email"
            :filter-option="false"
            :not-found-content="userSearchLoading ? undefined : null"
            :loading="userSearchLoading"
            size="large"
            @search="handleUserSearch"
            @change="handleUserSelect"
            allow-clear
          >
            <template v-if="userSearchResults.length > 0">
              <a-select-option 
                v-for="user in userSearchResults" 
                :key="user._id || user.email" 
                :value="user.email"
              >
                <div class="user-option">
                  <div class="user-name">
                    {{ user.fullname || user.name || user.email }}
                  </div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </a-select-option>
            </template>
            <template v-else-if="!userSearchLoading">
              <a-select-option disabled value="">
                Không tìm thấy người dùng
              </a-select-option>
            </template>
          </a-select>
          <div class="form-help-text">
            Nhập email hoặc tên để tìm kiếm người dùng
          </div>
        </a-form-item>

        <a-form-item label="Khóa học" name="courseIds" required>
          <a-select
            v-model:value="manualActivationForm.courseIds"
            mode="multiple"
            placeholder="Chọn khóa học"
            :loading="loadingCourses"
            size="large"
            show-search
            :filter-option="(input: string, option: any) => {
              const label = option?.label || option?.children || ''
              return String(label).toLowerCase().includes(input.toLowerCase())
            }"
            :not-found-content="loadingCourses ? undefined : (courses.length === 0 ? 'Không có khóa học nào' : 'Không tìm thấy khóa học')"
          >
            <a-select-option 
              v-for="course in courses" 
              :key="course._id || course.id" 
              :value="course._id || course.id"
              :label="course.name || course.title || course.code || 'N/A'"
            >
              {{ course.name || course.title || course.code || 'N/A' }}
            </a-select-option>
          </a-select>
          <div class="form-help-text">
            Chọn một hoặc nhiều khóa học để kích hoạt ({{ courses.length }} khóa học có sẵn)
          </div>
        </a-form-item>

        <a-form-item label="Ghi chú" name="notes">
          <a-textarea 
            v-model:value="manualActivationForm.notes" 
            :rows="3" 
            placeholder="VD: User chuyển khoản lỗi, đóng tiền mặt..."
            :maxlength="500"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  ReloadOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Order } from '~/composables/api/useOrdersApi'
import { useOrdersApi } from '~/composables/api/useOrdersApi'
import { useCustomersApi } from '~/composables/api/useCustomersApi'
import { useCoursesApi } from '~/composables/api/useCoursesApi'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  requiredRole: ['admin', 'manager']
})

const ordersApi = useOrdersApi()
const customersApi = useCustomersApi()
const coursesApi = useCoursesApi()
const loading = ref(false)
const orders = ref<Order[]>([])
const searchQuery = ref('')
const filterStatus = ref<string | undefined>()
const filterPaymentStatus = ref<string | undefined>()

// Manual activation state
const manualActivationModalVisible = ref(false)
const manualActivationLoading = ref(false)
const manualActivationFormRef = ref<any>(null)
const userSearchLoading = ref(false)
const userSearchResults = ref<any[]>([])
const loadingCourses = ref(false)
const courses = ref<any[]>([])

const manualActivationForm = ref({
  userEmail: '',
  courseIds: [] as string[],
  notes: ''
})

const manualActivationRules = {
  userEmail: [
    { required: true, message: 'Vui lòng chọn người dùng', trigger: 'change' }
  ],
  courseIds: [
    { required: true, message: 'Vui lòng chọn ít nhất một khóa học', trigger: 'change' },
    { type: 'array', min: 1, message: 'Vui lòng chọn ít nhất một khóa học', trigger: 'change' }
  ]
}

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const stats = reactive({
  total: 0,
  completed: 0,
  pending: 0,  // Đổi lại từ transactions thành pending
  revenue: 0
})

const viewModalVisible = ref(false)
const updateModalVisible = ref(false)
const selectedOrder = ref<Order | null>(null)

const updateForm = reactive({
  status: '',
  paymentStatus: '',
  notes: ''
})

const columns = [
  { title: 'Mã đơn', key: 'orderId', dataIndex: 'orderId', width: 180, fixed: 'left' },
  { title: 'Khách hàng', key: 'customer', dataIndex: 'customerInfo', width: 200 },
  { title: 'Khóa học', key: 'items', dataIndex: 'items', width: 250 },
  { title: 'Tổng tiền', key: 'totalAmount', dataIndex: 'totalAmount', width: 150 },
  { title: 'Phương thức', key: 'paymentMethod', dataIndex: 'paymentMethod', width: 120 },
  { title: 'Thanh toán', key: 'paymentStatus', dataIndex: 'paymentStatus', width: 120 },
  { title: 'Trạng thái', key: 'status', dataIndex: 'status', width: 120 }
]

const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} đơn hàng`,
  pageSizeOptions: ['10', '20', '50', '100']
}))

// Format functions
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    completed: 'green',
    cancelled: 'red',
    refunded: 'purple'
  }
  return colors[status || ''] || 'default'
}

const getStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    pending: 'Đang chờ',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền'
  }
  return texts[status || ''] || status || 'N/A'
}

const getPaymentStatusColor = (status?: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    completed: 'green',
    failed: 'red',
    cancelled: 'red'
  }
  return colors[status || ''] || 'default'
}

const getPaymentStatusText = (status?: string) => {
  const texts: Record<string, string> = {
    pending: 'Chưa thanh toán',
    completed: 'Đã thanh toán',
    failed: 'Thất bại',
    cancelled: 'Đã hủy'
  }
  return texts[status || ''] || status || 'N/A'
}

const getPaymentMethodColor = (method?: string) => {
  const colors: Record<string, string> = {
    vnpay: 'blue',
    momo: 'purple',
    qr: 'cyan',
    bank_transfer: 'green',
    bypass: 'orange'
  }
  return colors[method || ''] || 'default'
}

const getPaymentMethodText = (method?: string) => {
  const texts: Record<string, string> = {
    vnpay: 'VNPay',
    momo: 'MoMo',
    qr: 'QR Code',
    bank_transfer: 'Chuyển khoản',
    bypass: 'Bypass'
  }
  return texts[method || ''] || method || 'N/A'
}

// Fetch data
const fetchOrders = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (filterStatus.value) {
      params.status = filterStatus.value
    }

    if (filterPaymentStatus.value) {
      params.paymentStatus = filterPaymentStatus.value
    }

    const response = await ordersApi.getOrders(params)

    if (response.status && response.data) {
      const responseData = response.data as any
      const data = responseData.data || responseData
      const ordersArray = Array.isArray(data?.data) 
        ? data.data 
        : Array.isArray(data) 
          ? data 
          : Array.isArray(responseData?.data)
            ? responseData.data
            : []
      
      orders.value = ordersArray as Order[]
      
      const paginationData = (data?.pagination || responseData?.pagination || {}) as any
      pagination.total = paginationData.total || ordersArray.length

      // Calculate stats từ ordersArray
      stats.total = pagination.total
      stats.completed = ordersArray.filter((o: Order) => o.status === 'completed').length
      stats.pending = ordersArray.filter((o: Order) => 
        o.status === 'pending' || o.status === 'processing'
      ).length
      stats.revenue = ordersArray
        .filter((o: Order) => o.status === 'completed' && o.paymentStatus === 'completed')
        .reduce((sum: number, o: Order) => sum + (o.totalAmount || 0), 0)
    } else {
      orders.value = []
      pagination.total = 0
    }
  } catch (error: any) {
    console.error('Failed to fetch orders:', error)
    message.error('Không thể tải danh sách đơn hàng')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchOrders()
}

const handleFilter = () => {
  pagination.current = 1
  fetchOrders()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchOrders()
}

const refreshData = () => {
  fetchOrders()
  // Xóa dòng: fetchStats()
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
  viewModalVisible.value = true
}

const updateOrderStatus = (order: Order) => {
  selectedOrder.value = order
  updateForm.status = order.status || ''
  updateForm.paymentStatus = order.paymentStatus || ''
  updateForm.notes = order.notes || ''
  updateModalVisible.value = true
}

const handleUpdateStatus = async () => {
  if (!selectedOrder.value?._id) return

  try {
    await ordersApi.updateOrderStatus(selectedOrder.value._id, {
      status: updateForm.status,
      paymentStatus: updateForm.paymentStatus,
      notes: updateForm.notes
    })
    message.success('Cập nhật trạng thái thành công')
    updateModalVisible.value = false
    fetchOrders()
  } catch (error: any) {
    console.error('Failed to update order status:', error)
    message.error('Không thể cập nhật trạng thái')
  }
}

// User search handler (debounced)
const handleUserSearch = debounce(async (searchValue: string) => {
  if (!searchValue || searchValue.length < 2) {
    userSearchResults.value = []
    return
  }
  
  userSearchLoading.value = true
  try {
    const params = {
      searchKey: searchValue,
      limit: 20,
      page: 1
    }
    
    const response = await customersApi.getCustomers(params)
    
    if (response.status && response.data) {
      const responseData = response.data as any
      let users: any[] = []
      
      if (responseData.data) {
        if (Array.isArray(responseData.data)) {
          users = responseData.data
        } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
          users = responseData.data.data
        } else if (responseData.data.customers && Array.isArray(responseData.data.customers)) {
          users = responseData.data.customers
        }
      } else if (responseData.items && Array.isArray(responseData.items)) {
        users = responseData.items
      } else if (Array.isArray(responseData)) {
        users = responseData
      } else if (responseData.customers && Array.isArray(responseData.customers)) {
        users = responseData.customers
      }
      
      userSearchResults.value = Array.isArray(users) ? users : []
    } else {
      userSearchResults.value = []
    }
  } catch (error) {
    console.error('❌ Error searching users:', error)
    userSearchResults.value = []
  } finally {
    userSearchLoading.value = false
  }
}, 300)

const handleUserSelect = (email: string) => {
  if (!email) {
    return
  }
  const user = userSearchResults.value.find(u => u.email === email)
  if (user) {
    manualActivationForm.value.userEmail = email
  }
}

const filterCourseOption = (input: string, option: any) => {
  if (!input || input.trim() === '') return true
  const course = courses.value.find(c => {
    const id = c._id?.toString() || c.id?.toString()
    return id === option.value?.toString()
  })
  if (!course) return false
  const name = (course.name || course.title || course.code || '').toLowerCase()
  const searchTerm = input.toLowerCase().trim()
  return name.includes(searchTerm)
}

const loadCourses = async () => {
  try {
    loadingCourses.value = true
    const response = await coursesApi.getCourses({ limit: 1000 })
    
    console.log('📚 Load courses response:', response)
    
    if (response.status && response.data) {
      const responseData = response.data as any
      console.log('📚 responseData:', responseData)
      console.log('📚 responseData.data:', responseData.data)
      console.log('📚 responseData.data?.data:', responseData.data?.data)
      console.log('📚 responseData.data?.data?.courses:', responseData.data?.data?.courses)
      
      // Parse nested structure: data.data.data.courses
      let coursesList: any[] = []
      
      if (responseData.data?.data?.courses && Array.isArray(responseData.data.data.courses)) {
        coursesList = responseData.data.data.courses
        console.log('✅ Found courses in responseData.data.data.courses')
      } else if (responseData.data?.courses && Array.isArray(responseData.data.courses)) {
        coursesList = responseData.data.courses
        console.log('✅ Found courses in responseData.data.courses')
      } else if (responseData.data?.data && Array.isArray(responseData.data.data)) {
        coursesList = responseData.data.data
        console.log('✅ Found courses in responseData.data.data (array)')
      } else if (responseData.courses && Array.isArray(responseData.courses)) {
        coursesList = responseData.courses
        console.log('✅ Found courses in responseData.courses')
      } else if (Array.isArray(responseData.data)) {
        coursesList = responseData.data
        console.log('✅ Found courses in responseData.data (array)')
      } else if (Array.isArray(responseData)) {
        coursesList = responseData
        console.log('✅ Found courses in responseData (array)')
      }
      
      courses.value = coursesList
      console.log('✅ Loaded courses:', courses.value.length)
      console.log('✅ Courses data:', courses.value)
    } else {
      console.warn('⚠️ No courses data in response')
      courses.value = []
    }
  } catch (error: any) {
    console.error('❌ Load courses failed:', error)
    courses.value = []
    message.error('Không thể tải danh sách khóa học')
  } finally {
    loadingCourses.value = false
  }
}

const showManualActivationModal = () => {
  manualActivationForm.value = {
    userEmail: '',
    courseIds: [],
    notes: ''
  }
  userSearchResults.value = []
  manualActivationModalVisible.value = true
  loadCourses()
}

const handleCancelManualActivation = () => {
  manualActivationFormRef.value?.resetFields()
  userSearchResults.value = []
}

const handleManualActivation = async () => {
  try {
    await manualActivationFormRef.value?.validate()
    
    manualActivationLoading.value = true
    
    const response = await ordersApi.manualActivation({
      userEmail: manualActivationForm.value.userEmail,
      courseIds: manualActivationForm.value.courseIds,
      notes: manualActivationForm.value.notes
    })
    
    if (response.status && response.data) {
      message.success('Kích hoạt thủ công thành công')
      manualActivationModalVisible.value = false
      manualActivationFormRef.value?.resetFields()
      userSearchResults.value = []
      await fetchOrders()
    } else {
      throw new Error(response.message || 'Failed to activate')
    }
  } catch (error: any) {
    console.error('❌ Manual activation failed:', error)
    if (error.errorFields) {
      return
    }
    message.error(error.message || 'Không thể kích hoạt thủ công')
  } finally {
    manualActivationLoading.value = false
  }
}

// Debounce helper
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

onMounted(() => {
  fetchOrders()
  // Xóa dòng: fetchStats()
})
</script>

<style scoped>
.transactions-management-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 4px 0 0 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-card-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card-green {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card-orange {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card-purple {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.table-card {
  margin-bottom: 24px;
}

.order-id {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-date {
  font-size: 12px;
  color: #8c8c8c;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-weight: 500;
}

.customer-email {
  font-size: 12px;
  color: #8c8c8c;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-item {
  font-size: 13px;
}

.order-item-detail {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.item-name {
  flex: 1;
}

.item-price {
  font-weight: 500;
  color: #1890ff;
}

/* Mobile Cards */
.mobile-cards {
  display: none;
}

.order-card {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-id-mobile {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.order-date-mobile {
  font-size: 12px;
  color: #8c8c8c;
}

.order-card-body {
  margin-bottom: 16px;
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #fafafa;
}

.order-info-row .label {
  color: #8c8c8c;
  font-size: 14px;
}

.order-info-row .value {
  font-weight: 500;
  text-align: right;
}

  .order-info-row .value.amount {
    color: #1890ff;
    font-size: 16px;
  }

.user-option {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #1a1a1a;
}

.user-email {
  font-size: 12px;
  color: #8c8c8c;
}

.form-help-text {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* Fix dropdown options visibility */
:deep(.ant-select-dropdown) {
  z-index: 1050 !important;
}

:deep(.ant-select-item) {
  color: #1a1a1a !important;
  background-color: #ffffff !important;
}

:deep(.ant-select-item:hover) {
  background-color: #f5f5f5 !important;
}

:deep(.ant-select-item-option-selected) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}

:deep(.ant-select-item-option-active) {
  background-color: #f5f5f5 !important;
}

.order-card-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  .filters-container {
    flex-direction: column;
  }

  .filters-container > * {
    width: 100% !important;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
