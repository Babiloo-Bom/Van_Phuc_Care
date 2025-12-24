<template>
  <div class="customers-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Khách hàng</h1>
        <p class="page-subtitle">Quản lý thông tin khách hàng trong hệ thống</p>
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

    <!-- Filters -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        <a-select
          v-model:value="statusFilter"
          placeholder="Trạng thái"
          style="width: 200px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="active">Hoạt động</a-select-option>
          <a-select-option value="inactive">Không hoạt động</a-select-option>
        </a-select>
        <a-select
          v-model:value="genderFilter"
          placeholder="Giới tính"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="male">Nam</a-select-option>
          <a-select-option value="female">Nữ</a-select-option>
          <a-select-option value="other">Khác</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleSearch">
          <template #icon>
            <SearchOutlined />
          </template>
          Tìm kiếm
        </a-button>
      </div>
    </a-card>

    <!-- Customers Table -->
    <a-card class="table-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="customers"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
        class="desktop-table"
        row-key="_id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fullname'">
            <div class="customer-name">
              <div class="font-medium">{{ getFullName(record) }}</div>
              <div class="text-xs text-gray-500">{{ record.email }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'phone'">
            <span>{{ record.phone || record.phoneNumber || 'N/A' }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' || record.isActive ? 'green' : 'red'">
              {{ record.status === 'active' || record.isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'gender'">
            <span>{{ getGenderText(record.gender) }}</span>
          </template>
          <template v-else-if="column.key === 'createdAt'">
            <span>{{ formatDate(record.createdAt) }}</span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <EyeOutlined /> Xem
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined /> Sửa
              </a-button>
              <a-popconfirm
                title="Bạn có chắc chắn muốn xóa khách hàng này?"
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
          v-for="item in customers"
          :key="item._id"
          class="mobile-card"
          :bordered="false"
        >
          <div class="card-header">
            <div class="card-title-row">
              <h3 class="card-title">{{ getFullName(item) }}</h3>
              <a-tag :color="item.status === 'active' || item.isActive ? 'green' : 'red'">
                {{ item.status === 'active' || item.isActive ? 'Hoạt động' : 'Không hoạt động' }}
              </a-tag>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-row">
              <span class="card-label">Email:</span>
              <span>{{ item.email || 'N/A' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Số điện thoại:</span>
              <span>{{ item.phone || item.phoneNumber || 'N/A' }}</span>
            </div>
            <div class="card-row" v-if="item.address || item.fullAddress">
              <span class="card-label">Địa chỉ:</span>
              <span>{{ item.address || item.fullAddress || 'N/A' }}</span>
            </div>
            <div class="card-row" v-if="item.gender">
              <span class="card-label">Giới tính:</span>
              <span>{{ getGenderText(item.gender) }}</span>
            </div>
            <div class="card-row" v-if="item.city">
              <span class="card-label">Thành phố:</span>
              <span>{{ item.city }}</span>
            </div>
            <div class="card-row" v-if="item.createdAt">
              <span class="card-label">Ngày tạo:</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>

          <div class="card-actions">
            <a-button type="link" size="small" @click="handleView(item)">
              <EyeOutlined /> Xem
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(item)">
              <EditOutlined /> Sửa
            </a-button>
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa khách hàng này?"
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

    <!-- View/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalMode === 'view' ? 'Chi tiết khách hàng' : 'Chỉnh sửa khách hàng'"
      :width="700"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form :model="formData" layout="vertical" v-if="formData">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Họ" required>
              <a-input 
                v-model:value="formData.firstname" 
                placeholder="Nhập họ"
                :disabled="modalMode === 'view'"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Tên" required>
              <a-input 
                v-model:value="formData.lastname" 
                placeholder="Nhập tên"
                :disabled="modalMode === 'view'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Email" required>
          <a-input 
            v-model:value="formData.email" 
            placeholder="Nhập email"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>
        <a-form-item label="Số điện thoại">
          <a-input 
            v-model:value="formData.phone" 
            placeholder="Nhập số điện thoại"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Giới tính">
              <a-select 
                v-model:value="formData.gender" 
                placeholder="Chọn giới tính"
                :disabled="modalMode === 'view'"
              >
                <a-select-option value="male">Nam</a-select-option>
                <a-select-option value="female">Nữ</a-select-option>
                <a-select-option value="other">Khác</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái">
              <a-select 
                v-model:value="formData.status" 
                placeholder="Chọn trạng thái"
                :disabled="modalMode === 'view'"
              >
                <a-select-option value="active">Hoạt động</a-select-option>
                <a-select-option value="inactive">Không hoạt động</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Địa chỉ">
          <a-textarea 
            v-model:value="formData.address" 
            placeholder="Nhập địa chỉ"
            :rows="3"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>
        <a-form-item label="Thành phố">
          <a-input 
            v-model:value="formData.city" 
            placeholder="Nhập thành phố"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>
        <a-form-item label="Ngày sinh" v-if="formData.dob">
          <a-input 
            :value="formData.dob" 
            disabled
          />
        </a-form-item>
        <a-form-item label="Ngày tạo" v-if="formData.createdAt">
          <a-input 
            :value="formatDate(formData.createdAt)" 
            disabled
          />
        </a-form-item>
      </a-form>
      <template #footer v-if="modalMode === 'view'">
        <a-button @click="handleModalCancel">Đóng</a-button>
        <a-button type="primary" @click="handleEditFromView">Chỉnh sửa</a-button>
      </template>
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
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useCustomersApi } from '~/composables/api/useCustomersApi'
import type { Customer } from '~/types/api'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Quản lý Khách hàng - Vạn Phúc Care Admin'
})

const customersApi = useCustomersApi()

// State
const loading = ref(false)
const customers = ref<Customer[]>([])
const searchQuery = ref('')
const statusFilter = ref<string | undefined>(undefined)
const genderFilter = ref<string | undefined>(undefined)
const modalVisible = ref(false)
const modalMode = ref<'view' | 'edit'>('view')
const formData = ref<Partial<Customer>>({})
const currentCustomerId = ref<string | null>(null)

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} khách hàng`,
  pageSizeOptions: ['10', '20', '50', '100'],
})

// Table columns
const columns = [
  {
    title: 'Họ tên',
    key: 'fullname',
    dataIndex: ['firstname', 'lastname', 'fullname'],
    width: 200,
  },
  {
    title: 'Email',
    key: 'email',
    dataIndex: 'email',
    width: 200,
  },
  {
    title: 'Số điện thoại',
    key: 'phone',
    dataIndex: ['phone', 'phoneNumber'],
    width: 150,
  },
  {
    title: 'Giới tính',
    key: 'gender',
    dataIndex: 'gender',
    width: 100,
  },
  {
    title: 'Thành phố',
    key: 'city',
    dataIndex: 'city',
    width: 150,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    dataIndex: ['status', 'isActive'],
    width: 120,
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
const fetchCustomers = async () => {
  try {
    loading.value = true
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize,
    }

    if (searchQuery.value) {
      params.searchKey = searchQuery.value
    }

    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    if (genderFilter.value) {
      params.gender = genderFilter.value
    }

    const response = await customersApi.getCustomers(params)
    
    console.log('📥 Customers API Response:', response)
    console.log('📥 Response.data:', response.data)
    
    // Backend sendSuccess trả về: { message: "", data: { data: [...], pagination: {...} } }
    // $fetch trả về trực tiếp object từ JSON response
    // apiClient.get wrap lại: { status: true, data: <response từ $fetch> }
    
    let responseData = response.data
    
    // Case 1: responseData có structure { message: "", data: { data: [...], pagination: {...} } }
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      const innerData = responseData.data
      // Check nếu innerData có array 'data' và 'pagination'
      if (innerData && typeof innerData === 'object' && 'data' in innerData && Array.isArray(innerData.data)) {
        customers.value = innerData.data
        if (innerData.pagination) {
          pagination.total = innerData.pagination.total || 0
          pagination.current = innerData.pagination.page || pagination.current
        }
      } else if (Array.isArray(innerData)) {
        // Nếu innerData là array trực tiếp
        customers.value = innerData
      } else {
        customers.value = []
      }
    } 
    // Case 2: responseData có structure { data: [...], pagination: {...} } (đã unwrap)
    else if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
      customers.value = responseData.data
      if (responseData.pagination) {
        pagination.total = responseData.pagination.total || 0
        pagination.current = responseData.pagination.page || pagination.current
      }
    }
    // Case 3: responseData là array trực tiếp
    else if (Array.isArray(responseData)) {
      customers.value = responseData
    }
    // Case 4: Không có dữ liệu
    else {
      customers.value = []
    }
    
    console.log('✅ Parsed customers:', customers.value.length, 'Total:', pagination.total)
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    message.error('Không thể tải danh sách khách hàng')
    customers.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchCustomers()
}

const handleFilter = () => {
  pagination.current = 1
  fetchCustomers()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchCustomers()
}

const refreshData = () => {
  fetchCustomers()
}

const getFullName = (record: any): string => {
  if (record.fullname) return record.fullname
  if (record.firstname && record.lastname) {
    return `${record.firstname} ${record.lastname}`
  }
  if (record.firstname) return record.firstname
  if (record.lastname) return record.lastname
  if (record.name) return record.name
  return 'N/A'
}

const getGenderText = (gender?: string): string => {
  if (!gender) return 'N/A'
  const genderMap: Record<string, string> = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
  }
  return genderMap[gender] || gender
}

const formatDate = (date?: string): string => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return 'N/A'
  }
}

const handleView = (record: Customer) => {
  modalMode.value = 'view'
  currentCustomerId.value = record._id
  formData.value = { ...record }
  modalVisible.value = true
}

const handleEdit = (record: Customer) => {
  modalMode.value = 'edit'
  currentCustomerId.value = record._id
  formData.value = { ...record }
  modalVisible.value = true
}

const handleEditFromView = () => {
  modalMode.value = 'edit'
}

const handleModalOk = async () => {
  if (modalMode.value === 'view') {
    handleModalCancel()
    return
  }

  try {
    if (!currentCustomerId.value) {
      message.error('Không tìm thấy ID khách hàng')
      return
    }

    loading.value = true
    await customersApi.updateCustomer(currentCustomerId.value, formData.value)
    message.success('Cập nhật khách hàng thành công')
    handleModalCancel()
    fetchCustomers()
  } catch (error: any) {
    console.error('Error updating customer:', error)
    message.error('Không thể cập nhật khách hàng')
  } finally {
    loading.value = false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  modalMode.value = 'view'
  formData.value = {}
  currentCustomerId.value = null
}

const handleDelete = async (record: Customer) => {
  try {
    loading.value = true
    await customersApi.deleteCustomer(record._id)
    message.success('Xóa khách hàng thành công')
    fetchCustomers()
  } catch (error: any) {
    console.error('Error deleting customer:', error)
    message.error('Không thể xóa khách hàng')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchCustomers()
})
</script>

<style scoped lang="css">
.customers-management-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filters-card {
  margin-bottom: 24px;
}

.filters-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.table-card {
  margin-bottom: 24px;
}

.desktop-table {
  display: block;
}

.mobile-cards {
  display: none;
}

.mobile-card {
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 16px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-label {
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.customer-name {
  display: flex;
  flex-direction: column;
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

  .page-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
