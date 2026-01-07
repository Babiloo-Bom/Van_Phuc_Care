<template>
  <div class="customers-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Khách hàng</h1>
        <p class="page-subtitle">Quản lý tất cả khách hàng trong hệ thống</p>
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
    <div class="stats-grid">
      <div class="stat-card stat-card-blue">
        <div class="stat-icon">
          <TeamOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng khách hàng</p>
          <p class="stat-value">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Khách hàng hoạt động</p>
          <p class="stat-value">{{ formatNumber(stats.active) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <GoogleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đăng nhập Google</p>
          <p class="stat-value">{{ formatNumber(stats.google) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <UserOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đăng nhập thường</p>
          <p class="stat-value">{{ formatNumber(stats.local) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo tên, email..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        
        <a-select
          v-model:value="filterProvider"
          placeholder="Loại đăng nhập"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="local">Thường (Local)</a-select-option>
          <a-select-option value="google">Google</a-select-option>
        </a-select>

        <a-select
          v-model:value="filterStatus"
          placeholder="Trạng thái"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="active">Hoạt động</a-select-option>
          <a-select-option value="inactive">Không hoạt động</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- Customers Table -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách khách hàng</span>
      </template>
      
      <!-- Desktop Table View -->
      <a-table
        :columns="columns"
        :data-source="customers"
        :loading="loading"
        :pagination="paginationConfig"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
        row-key="_id"
        class="desktop-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar 
              :src="record.avatar || undefined" 
              :size="40"
              :style="{ backgroundColor: !record.avatar ? getAvatarColor(record) : undefined }"
            >
              {{ getUserInitial(record) }}
            </a-avatar>
          </template>
          
          <template v-else-if="column.key === 'name'">
            <div class="user-info">
              <div class="user-name">{{ record.fullname || record.name || record.email || 'N/A' }}</div>
              <div class="user-email">{{ record.email }}</div>
            </div>
          </template>
          
          <template v-else-if="column.key === 'provider'">
            <a-tag :color="getProviderColor(record.provider)">
              {{ getProviderLabel(record.provider) }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'status'">
            <a-tag :color="(record.isActive !== undefined ? record.isActive : record.status === 'active') ? 'success' : 'error'">
              {{ (record.isActive !== undefined ? record.isActive : record.status === 'active') ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </template>
          
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button 
                type="link" 
                size="small" 
                @click="viewCustomer(record)"
              >
                <EyeOutlined /> Xem
              </a-button>
              <a-button 
                type="link" 
                size="small"
                :danger="record.isActive"
                @click="toggleCustomerStatus(record)"
              >
                <template v-if="record.isActive">
                  <LockOutlined /> Khóa
                </template>
                <template v-else>
                  <UnlockOutlined /> Mở khóa
                </template>
              </a-button>
              <a-popconfirm
                title="Bạn có chắc muốn xóa khách hàng này?"
                ok-text="Xóa"
                cancel-text="Hủy"
                ok-type="danger"
                @confirm="deleteCustomer(record)"
              >
                <a-button type="link" size="small" danger>
                  <DeleteOutlined /> Xóa
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <!-- Mobile Card View -->
      <div class="mobile-cards-view">
        <div v-if="loading" class="loading-container">
          <a-spin size="large" />
        </div>
        <div v-else-if="customers.length === 0" class="empty-container">
          <a-empty description="Chưa có khách hàng nào" />
        </div>
        <div v-else class="users-cards">
          <div
            v-for="customer in customers"
            :key="customer._id || customer.id"
            class="user-card"
          >
            <div class="user-card-header">
              <div class="user-card-avatar">
                <a-avatar 
                  :src="customer.avatar || undefined" 
                  :size="56"
                  :style="{ backgroundColor: !customer.avatar ? getAvatarColor(customer) : undefined }"
                >
                  {{ getUserInitial(customer) }}
                </a-avatar>
              </div>
              <div class="user-card-info">
                <div class="user-card-name">{{ customer.fullname || customer.name || customer.email || 'N/A' }}</div>
                <div class="user-card-email">{{ customer.email }}</div>
              </div>
            </div>
            
            <div class="user-card-details">
              <div class="detail-item">
                <span class="detail-label">Loại đăng nhập:</span>
                <a-tag :color="getProviderColor(customer.provider)" size="small">
                  {{ getProviderLabel(customer.provider) }}
                </a-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">Trạng thái:</span>
                <a-tag :color="(customer.isActive !== undefined ? customer.isActive : customer.status === 'active') ? 'success' : 'error'" size="small">
                  {{ (customer.isActive !== undefined ? customer.isActive : customer.status === 'active') ? 'Hoạt động' : 'Không hoạt động' }}
                </a-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">Ngày tạo:</span>
                <span class="detail-value">{{ formatDate(customer.createdAt) }}</span>
              </div>
            </div>
            
            <div class="user-card-actions">
              <a-space direction="vertical" size="small" style="width: 100%">
                <a-button 
                  type="primary" 
                  block
                  size="small"
                  @click="viewCustomer(customer)"
                >
                  <EyeOutlined /> Xem chi tiết
                </a-button>
                <a-space size="small" style="width: 100%">
                  <a-button 
                    block
                    size="small"
                    :danger="customer.isActive"
                    @click="toggleCustomerStatus(customer)"
                    style="flex: 1"
                  >
                    <template v-if="customer.isActive">
                      <LockOutlined /> Khóa
                    </template>
                    <template v-else>
                      <UnlockOutlined /> Mở khóa
                    </template>
                  </a-button>
                  <a-popconfirm
                    title="Bạn có chắc muốn xóa khách hàng này?"
                    ok-text="Xóa"
                    cancel-text="Hủy"
                    ok-type="danger"
                    @confirm="deleteCustomer(customer)"
                  >
                    <a-button type="primary" danger size="small" block>
                      <DeleteOutlined /> Xóa
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </a-space>
            </div>
          </div>
        </div>
        
        <!-- Mobile Pagination -->
        <div class="mobile-pagination">
          <a-pagination
            v-model:current="paginationConfig.current"
            v-model:page-size="paginationConfig.pageSize"
            :total="paginationConfig.total"
            :page-size-options="paginationConfig.pageSizeOptions"
            :show-total="paginationConfig.showTotal"
            :show-size-changer="true"
            size="small"
            @change="handleTableChange"
            @show-size-change="handleTableChange"
          />
        </div>
      </div>
    </a-card>

    <!-- Customer Detail Modal -->
    <a-modal
      v-model:open="showCustomerModal"
      :title="isEditMode ? 'Chỉnh sửa khách hàng' : 'Chi tiết khách hàng'"
      width="700px"
      :confirm-loading="saving"
      @ok="handleOk"
      @cancel="handleCancelEdit"
    >
      <div v-if="selectedCustomer" class="user-detail">
        <a-form
          v-if="isEditMode"
          :model="editForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          layout="horizontal"
        >
          <a-form-item label="Họ tên" required>
            <a-input v-model:value="editForm.fullname" placeholder="Họ và tên" />
          </a-form-item>
          
          <a-form-item label="Email" required>
            <a-input v-model:value="editForm.email" placeholder="Email" disabled />
          </a-form-item>
          
          <a-form-item label="Số điện thoại">
            <a-input v-model:value="editForm.phone" placeholder="Số điện thoại" />
          </a-form-item>
          
          <a-form-item label="Trạng thái">
            <a-switch
              v-model:checked="editForm.isActive"
              checked-children="Hoạt động"
              un-checked-children="Không hoạt động"
            />
          </a-form-item>
        </a-form>
        
        <a-descriptions v-else :column="1" bordered>
          <a-descriptions-item label="Avatar">
            <a-avatar 
              :src="selectedCustomer.avatar || undefined" 
              :size="64"
              :style="{ backgroundColor: !selectedCustomer.avatar ? getAvatarColor(selectedCustomer) : undefined }"
            >
              {{ getUserInitial(selectedCustomer) }}
            </a-avatar>
          </a-descriptions-item>
          <a-descriptions-item label="Họ tên">
            {{ selectedCustomer.fullname || selectedCustomer.name || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            {{ selectedCustomer.email }}
          </a-descriptions-item>
          <a-descriptions-item label="Số điện thoại">
            {{ selectedCustomer.phone || selectedCustomer.phoneNumber || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Loại đăng nhập">
            <a-tag :color="getProviderColor(selectedCustomer.provider)">
              {{ getProviderLabel(selectedCustomer.provider) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái">
            <a-tag :color="selectedCustomer.isActive ? 'success' : 'error'">
              {{ selectedCustomer.isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Ngày tạo">
            {{ formatDate(selectedCustomer.createdAt) }}
          </a-descriptions-item>
        </a-descriptions>
        
        <div v-if="!isEditMode" class="modal-actions" style="margin-top: 20px; text-align: right">
          <a-button type="primary" @click="enableEditMode">
            <template #icon>
              <EditOutlined />
            </template>
            Chỉnh sửa
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  TeamOutlined,
  CheckCircleOutlined,
  GoogleOutlined,
  UserOutlined,
  ReloadOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useCustomersApi } from '~/composables/api/useCustomersApi'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Quản lý Khách hàng - Vạn Phúc Care Admin'
})

const customersApi = useCustomersApi()

// ===== STATE =====
const loading = ref(false)
const customers = ref<any[]>([])
const stats = ref({
  total: 0,
  active: 0,
  google: 0,
  local: 0
})

const searchQuery = ref('')
const filterProvider = ref('')
const filterStatus = ref('')

const paginationConfig = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} khách hàng`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const showCustomerModal = ref(false)
const selectedCustomer = ref<any>(null)
const isEditMode = ref(false)
const saving = ref(false)
const editForm = ref({
  fullname: '',
  email: '',
  phone: '',
  isActive: true
})

// ===== TABLE COLUMNS =====
const columns = [
  {
    title: 'Avatar',
    key: 'avatar',
    dataIndex: 'avatar',
    width: 80,
    fixed: 'left'
  },
  {
    title: 'Thông tin',
    key: 'name',
    dataIndex: ['fullname', 'name', 'email'],
    width: 250,
    fixed: 'left'
  },
  {
    title: 'Loại đăng nhập',
    key: 'provider',
    dataIndex: 'provider',
    width: 130
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: ['status', 'isActive'],
    width: 130
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 150
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 200,
    fixed: 'right'
  }
]

// ===== METHODS =====
const loadCustomers = async () => {
  try {
    loading.value = true
    
    const params: any = {
      page: paginationConfig.value.current,
      limit: paginationConfig.value.pageSize
    }
    
    if (searchQuery.value) {
      params.searchKey = searchQuery.value
    }
    
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    
    if (filterProvider.value) {
      params.provider = filterProvider.value
    }
    
    const response = await customersApi.getCustomers(params)
    console.log('🔍 Customers API response:', response)
    
    if (response.status && response.data) {
      const responseData: any = response.data
      
      let customersList: any[] = []
      // Handle nested data structure
      if (responseData.data && typeof responseData.data === 'object') {
        if (Array.isArray(responseData.data.data)) {
          customersList = responseData.data.data
        } else if (Array.isArray(responseData.data)) {
          customersList = responseData.data
        }
      } else if (Array.isArray(responseData)) {
        customersList = responseData
      }
      
      // Normalize status and provider
      customers.value = customersList.map((customer: any) => ({
        ...customer,
        isActive: customer.isActive !== undefined 
          ? customer.isActive 
          : (customer.status === 'active' || customer.status === 'ACTIVE'),
        provider: customer.provider || 'local'
      }))
      
      // Get pagination
      const paginationData = responseData.data?.pagination || responseData.pagination
      if (paginationData) {
        paginationConfig.value.total = paginationData.total || 0
        paginationConfig.value.current = paginationData.page || paginationConfig.value.current
      } else if (responseData.total !== undefined) {
        paginationConfig.value.total = responseData.total
      }
      
      // Update stats after loading customers
      updateStats()
    } else {
      customers.value = []
    }
  } catch (error: any) {
    console.error('❌ Load customers failed:', error)
    message.error('Không thể tải danh sách khách hàng: ' + (error.message || 'Unknown error'))
    customers.value = []
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  const total = customers.value.length
  const active = customers.value.filter(c => c.isActive !== false && c.status !== 'inactive').length
  const google = customers.value.filter(c => c.provider === 'google').length
  const local = customers.value.filter(c => !c.provider || c.provider === 'local').length
  
  stats.value = {
    total: paginationConfig.value.total || total,
    active,
    google,
    local
  }
}

const handleSearch = () => {
  paginationConfig.value.current = 1
  loadCustomers()
}

const handleFilter = () => {
  paginationConfig.value.current = 1
  loadCustomers()
}

const handleTableChange = (pag: any) => {
  paginationConfig.value.current = pag.current
  paginationConfig.value.pageSize = pag.pageSize
  loadCustomers()
}

const refreshData = () => {
  loadCustomers()
}

const viewCustomer = async (customer: any) => {
  try {
    loading.value = true
    console.log('🔍 Viewing customer:', customer._id || customer.id)
    const response = await customersApi.getCustomer(customer._id || customer.id)
    console.log('🔍 Get customer response:', response)
    
    if (response.status && response.data) {
      const responseData: any = response.data
      console.log('🔍 Response data:', responseData)
      
      // Backend returns: { message: "", data: { customer: {...} } }
      // apiClient wraps it: { status: true, data: { message: "", data: { customer: {...} } } }
      const customerData = responseData.data?.customer || responseData.customer || responseData.data || responseData
      console.log('✅ Parsed customer data:', customerData)
      
      if (!customerData) {
        throw new Error('Không tìm thấy thông tin khách hàng')
      }
      
      selectedCustomer.value = customerData
      editForm.value = {
        fullname: customerData.fullname || customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || customerData.phoneNumber || '',
        isActive: customerData.isActive !== undefined 
          ? customerData.isActive 
          : (customerData.status === 'active')
      }
      isEditMode.value = false
      showCustomerModal.value = true
    } else {
      throw new Error(response.message || 'Không thể tải thông tin khách hàng')
    }
  } catch (error: any) {
    console.error('❌ Get customer failed:', error)
    message.error(error.message || 'Không thể tải thông tin khách hàng')
    // Fallback to show customer from list
    console.log('⚠️ Using fallback customer data from list')
    selectedCustomer.value = customer
    editForm.value = {
      fullname: customer.fullname || customer.name || '',
      email: customer.email || '',
      phone: customer.phone || customer.phoneNumber || '',
      isActive: customer.isActive !== undefined ? customer.isActive : (customer.status === 'active')
    }
    isEditMode.value = false
    showCustomerModal.value = true
  } finally {
    loading.value = false
  }
}

const enableEditMode = () => {
  isEditMode.value = true
}

const handleOk = () => {
  if (isEditMode.value) {
    handleSaveCustomer()
  } else {
    showCustomerModal.value = false
  }
}

const handleCancelEdit = () => {
  isEditMode.value = false
  if (selectedCustomer.value) {
    editForm.value = {
      fullname: selectedCustomer.value.fullname || selectedCustomer.value.name || '',
      email: selectedCustomer.value.email || '',
      phone: selectedCustomer.value.phone || selectedCustomer.value.phoneNumber || '',
      isActive: selectedCustomer.value.isActive !== undefined 
        ? selectedCustomer.value.isActive 
        : (selectedCustomer.value.status === 'active')
    }
  }
}

const handleSaveCustomer = async () => {
  if (!selectedCustomer.value) return
  
  try {
    saving.value = true
    
    const updateData: any = {
      fullname: editForm.value.fullname,
      phone: editForm.value.phone,
      phoneNumber: editForm.value.phone,
      isActive: editForm.value.isActive
    }
    
    console.log('🔍 Updating customer:', selectedCustomer.value._id || selectedCustomer.value.id, updateData)
    const response = await customersApi.updateCustomer(selectedCustomer.value._id || selectedCustomer.value.id, updateData)
    console.log('🔍 Update customer response:', response)
    
    if (response.status && response.data) {
      message.success('Cập nhật thông tin khách hàng thành công')
      
      // Parse updated customer from response
      const responseData: any = response.data
      const updatedCustomerData = responseData.data?.customer || responseData.customer || responseData.data || responseData
      console.log('✅ Updated customer data:', updatedCustomerData)
      
      if (updatedCustomerData) {
        // Update selected customer in modal
        selectedCustomer.value = updatedCustomerData
        editForm.value = {
          fullname: updatedCustomerData.fullname || updatedCustomerData.name || '',
          email: updatedCustomerData.email || '',
          phone: updatedCustomerData.phone || updatedCustomerData.phoneNumber || '',
          isActive: updatedCustomerData.isActive !== undefined 
            ? updatedCustomerData.isActive 
            : (updatedCustomerData.status === 'active')
        }
      } else {
        // Fallback: reload customer data
        try {
          const customerId = selectedCustomer.value._id || selectedCustomer.value.id
          const refreshResponse = await customersApi.getCustomer(customerId)
          
          if (refreshResponse.status && refreshResponse.data) {
            const refreshData: any = refreshResponse.data
            const customerData = refreshData.data?.customer || refreshData.customer || refreshData.data || refreshData
            
            if (customerData) {
              selectedCustomer.value = customerData
              editForm.value = {
                fullname: customerData.fullname || customerData.name || '',
                email: customerData.email || '',
                phone: customerData.phone || customerData.phoneNumber || '',
                isActive: customerData.isActive !== undefined 
                  ? customerData.isActive 
                  : (customerData.status === 'active')
              }
            }
          }
        } catch (refreshError) {
          console.warn('⚠️ Failed to refresh customer data:', refreshError)
        }
      }
      
      isEditMode.value = false
      // Reload customers list to reflect changes
      await loadCustomers()
    } else {
      message.error('Không thể cập nhật thông tin khách hàng')
    }
  } catch (error: any) {
    console.error('❌ Update customer failed:', error)
    message.error('Không thể cập nhật thông tin khách hàng: ' + (error.message || 'Unknown error'))
  } finally {
    saving.value = false
  }
}

const toggleCustomerStatus = async (customer: any) => {
  try {
    loading.value = true
    const response = await customersApi.toggleCustomerStatus(customer._id || customer.id)
    
    if (response.status) {
      message.success(`Đã ${customer.isActive ? 'khóa' : 'mở khóa'} khách hàng thành công`)
      await loadCustomers()
    } else {
      throw new Error(response.message || 'Failed to toggle status')
    }
  } catch (error: any) {
    console.error('❌ Toggle customer status failed:', error)
    message.error('Không thể thay đổi trạng thái khách hàng')
  } finally {
    loading.value = false
  }
}

const deleteCustomer = async (customer: any) => {
  try {
    loading.value = true
    const response = await customersApi.deleteCustomer(customer._id || customer.id)
    
    if (response.status) {
      message.success('Đã xóa khách hàng thành công')
      await loadCustomers()
    } else {
      throw new Error(response.message || 'Failed to delete customer')
    }
  } catch (error: any) {
    console.error('❌ Delete customer failed:', error)
    message.error('Không thể xóa khách hàng')
  } finally {
    loading.value = false
  }
}

// ===== HELPER FUNCTIONS =====
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const getUserInitial = (customer: any) => {
  const name = customer.fullname || customer.name || customer.email || 'U'
  return name.charAt(0).toUpperCase()
}

const getAvatarColor = (customer: any): string => {
  const name = customer?.fullname || customer?.name || customer?.email || 'U'
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa8c16', '#2f54eb', '#a0d911',
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length] || '#1890ff'
}

const getProviderColor = (provider: string) => {
  const colors: Record<string, string> = {
    local: 'blue',
    google: 'red',
    facebook: 'blue',
    github: 'black'
  }
  return colors[provider || ''] || 'default'
}

const getProviderLabel = (provider: string) => {
  const labels: Record<string, string> = {
    local: 'Thường',
    google: 'Google',
    facebook: 'Facebook',
    github: 'GitHub'
  }
  return labels[provider || ''] || provider || 'N/A'
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadCustomers()
})
</script>

<style scoped>
.customers-management-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-card-blue {
  border-left: 4px solid #1890ff;
}

.stat-card-green {
  border-left: 4px solid #52c41a;
}

.stat-card-orange {
  border-left: 4px solid #fa8c16;
}

.stat-card-purple {
  border-left: 4px solid #722ed1;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ffffff;
}

.stat-card-blue .stat-icon {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.stat-card-green .stat-icon {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.stat-card-orange .stat-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.stat-card-purple .stat-icon {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.filters-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.filters-container {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.table-card {
  border-radius: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: #8c8c8c;
}

.user-detail {
  padding: 8px 0;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .customers-management-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .customers-management-page {
    padding: 12px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-container > * {
    width: 100% !important;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
  }

  .page-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }
}

/* Mobile Cards View */
.mobile-cards-view {
  display: none;
}

.desktop-table {
  display: block;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cards-view {
    display: block;
  }

  .users-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .user-card {
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .user-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .user-card-avatar {
    flex-shrink: 0;
  }

  .user-card-info {
    flex: 1;
    min-width: 0;
  }

  .user-card-name {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .user-card-email {
    font-size: 13px;
    color: #8c8c8c;
  }

  .user-card-details {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .detail-label {
    font-size: 13px;
    color: #8c8c8c;
    font-weight: 500;
  }

  .detail-value {
    font-size: 13px;
    color: #1a1a1a;
  }

  .user-card-actions {
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  .mobile-pagination {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }

  .loading-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    padding: 40px 20px;
  }
}
</style>
