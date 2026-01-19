<template>
  <div class="users-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý người dùng</h1>
        <p class="page-subtitle">Quản lý tất cả người dùng trong hệ thống</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            Tạo mới
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
          <TeamOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng người dùng</p>
          <p class="stat-value">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Người dùng hoạt động</p>
          <p class="stat-value">{{ formatNumber(stats.active) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <UserOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Customer</p>
          <p class="stat-value">{{ formatNumber(stats.customers) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <TeamOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Admin, Worker, Manager</p>
          <p class="stat-value">{{ formatNumber(stats.staff) }}</p>
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
          v-model:value="filterRole"
          placeholder="Vai trò"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="admin">Admin</a-select-option>
          <a-select-option value="manager">Manager</a-select-option>
          <a-select-option value="worker">Worker</a-select-option>
          <a-select-option value="customer">Customer</a-select-option>
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

    <!-- Users Table -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách người dùng</span>
      </template>
      
      <!-- Desktop Table View -->
      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="paginationConfig"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
        row-key="_id"
        class="desktop-table"
      >
        <!-- Avatar Column -->
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
          
          <!-- Name Column -->
          <template v-else-if="column.key === 'name'">
            <div class="user-info">
              <div class="user-name">{{ record.fullname || record.name || record.email || 'N/A' }}</div>
              <div class="user-email">{{ record.email }}</div>
            </div>
          </template>
          
          <!-- Provider Column -->
          <template v-else-if="column.key === 'provider'">
            <a-tag :color="getProviderColor(record.provider)">
              {{ getProviderLabel(record.provider) }}
            </a-tag>
          </template>
          
          <!-- Role Column -->
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ getRoleLabel(record.role) }}
            </a-tag>
          </template>
          
          <!-- Status Column -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="(record.isActive !== undefined ? record.isActive : record.status === 'active') ? 'success' : 'error'">
              {{ (record.isActive !== undefined ? record.isActive : record.status === 'active') ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </template>
          
          <!-- Created At Column -->
          <template v-else-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          
          <!-- Actions Column -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button 
                type="link" 
                size="small" 
                @click="viewUser(record)"
              >
                <EyeOutlined /> Xem
              </a-button>
              <a-button 
                type="link" 
                size="small"
                :danger="record.isActive"
                @click="toggleUserStatus(record)"
              >
                <template v-if="record.isActive">
                  <LockOutlined /> Khóa
                </template>
                <template v-else>
                  <UnlockOutlined /> Mở khóa
                </template>
              </a-button>
              <a-popconfirm
                title="Bạn có chắc muốn xóa người dùng này?"
                ok-text="Xóa"
                cancel-text="Hủy"
                ok-type="danger"
                @confirm="deleteUser(record)"
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
        <div v-else-if="users.length === 0" class="empty-container">
          <a-empty description="Chưa có người dùng nào" />
        </div>
        <div v-else class="users-cards">
          <div
            v-for="user in users"
            :key="user._id || user.id"
            class="user-card"
          >
            <div class="user-card-header">
              <div class="user-card-avatar">
                <a-avatar 
                  :src="user.avatar || undefined" 
                  :size="56"
                  :style="{ backgroundColor: !user.avatar ? getAvatarColor(user) : undefined }"
                >
                  {{ getUserInitial(user) }}
                </a-avatar>
              </div>
              <div class="user-card-info">
                <div class="user-card-name">{{ user.fullname || user.name || user.email || 'N/A' }}</div>
                <div class="user-card-email">{{ user.email }}</div>
              </div>
            </div>
            
            <div class="user-card-details">
              <div class="detail-item">
                <span class="detail-label">Loại đăng nhập:</span>
                <a-tag :color="getProviderColor(user.provider)" size="small">
                  {{ getProviderLabel(user.provider) }}
                </a-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">Vai trò:</span>
                <a-tag :color="getRoleColor(user.role)" size="small">
                  {{ getRoleLabel(user.role) }}
                </a-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">Trạng thái:</span>
                <a-tag :color="(user.isActive !== undefined ? user.isActive : user.status === 'active') ? 'success' : 'error'" size="small">
                  {{ (user.isActive !== undefined ? user.isActive : user.status === 'active') ? 'Hoạt động' : 'Không hoạt động' }}
                </a-tag>
              </div>
              <div class="detail-item">
                <span class="detail-label">Ngày tạo:</span>
                <span class="detail-value">{{ formatDate(user.createdAt) }}</span>
              </div>
            </div>
            
            <div class="user-card-actions">
              <a-space direction="vertical" size="small" style="width: 100%">
                <a-button 
                  type="primary" 
                  block
                  size="small"
                  @click="viewUser(user)"
                >
                  <EyeOutlined /> Xem chi tiết
                </a-button>
                <a-space size="small" style="width: 100%">
                  <a-button 
                    block
                    size="small"
                    :danger="user.isActive"
                    @click="toggleUserStatus(user)"
                    style="flex: 1"
                  >
                    <template v-if="user.isActive">
                      <LockOutlined /> Khóa
                    </template>
                    <template v-else>
                      <UnlockOutlined /> Mở khóa
                    </template>
                  </a-button>
                  <a-popconfirm
                    title="Bạn có chắc muốn xóa người dùng này?"
                    ok-text="Xóa"
                    cancel-text="Hủy"
                    ok-type="danger"
                    @confirm="deleteUser(user)"
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

    <!-- Create User Modal -->
    <a-modal
      v-model:open="showCreateUserModal"
      title="Tạo người dùng mới"
      width="700px"
      :confirm-loading="creating"
      @ok="handleCreateUser"
      @cancel="handleCancelCreate"
    >
      <a-form
        :model="createForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
        :rules="createFormRules"
        ref="createFormRef"
      >
        <a-form-item label="Avatar">
          <div class="avatar-upload-section">
            <a-avatar 
              :src="createAvatarPreview || createForm.avatar || undefined" 
              :size="80"
              :style="{ backgroundColor: !createAvatarPreview && !createForm.avatar ? getDefaultAvatarColor() : undefined }"
              class="avatar-preview"
            >
              {{ createForm.fullname ? createForm.fullname.charAt(0).toUpperCase() : 'U' }}
            </a-avatar>
            <div style="margin-top: 12px; text-align: center">
              <input
                ref="createAvatarFileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleCreateAvatarChange"
              />
              <a-button 
                type="default" 
                @click="createAvatarFileInput?.click()"
                :loading="isUploadingCreateAvatar"
                :disabled="isUploadingCreateAvatar"
                size="small"
              >
                {{ isUploadingCreateAvatar ? 'Đang tải...' : 'Tải ảnh đại diện' }}
              </a-button>
            </div>
          </div>
        </a-form-item>
        
        <a-form-item label="Họ tên" name="fullname" required>
          <a-input v-model:value="createForm.fullname" placeholder="Họ và tên" />
        </a-form-item>
        
        <a-form-item label="Email" name="email" required>
          <a-input v-model:value="createForm.email" placeholder="Email" type="email" />
        </a-form-item>
        
        <a-form-item label="Số điện thoại" name="phone">
          <a-input v-model:value="createForm.phone" placeholder="Số điện thoại" />
        </a-form-item>
        
        <a-form-item label="Loại đăng nhập" name="provider" required>
          <a-select v-model:value="createForm.provider" placeholder="Chọn loại đăng nhập">
            <a-select-option value="local">Thường (Local)</a-select-option>
            <a-select-option value="google">Google</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item 
          v-if="createForm.provider === 'local'" 
          label="Mật khẩu" 
          name="password"
          :required="createForm.provider === 'local'"
        >
          <a-input-password v-model:value="createForm.password" placeholder="Mật khẩu" />
        </a-form-item>
        
        <a-form-item label="Vai trò" name="role" required>
          <a-select v-model:value="createForm.role" placeholder="Chọn vai trò">
            <a-select-option value="admin">Admin</a-select-option>
            <a-select-option value="manager">Manager</a-select-option>
            <a-select-option value="worker">Worker</a-select-option>
            <a-select-option value="customer">Customer</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="Trạng thái" name="isActive">
          <a-switch
            v-model:checked="createForm.isActive"
            checked-children="Hoạt động"
            un-checked-children="Không hoạt động"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- User Detail/Edit Modal -->
    <a-modal
      v-model:open="showUserModal"
      :title="isEditMode ? 'Chỉnh sửa người dùng' : 'Chi tiết người dùng'"
      width="700px"
      :confirm-loading="saving"
      @ok="handleOk"
      @cancel="handleCancelEdit"
    >
      <div v-if="selectedUser" class="user-detail">
        <a-form
          v-if="isEditMode"
          :model="editForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          layout="horizontal"
        >
          <a-form-item label="Avatar">
            <div class="avatar-upload-section">
              <a-avatar 
                :src="avatarPreview || editForm.avatar || undefined" 
                :size="80"
                :style="{ backgroundColor: !avatarPreview && !editForm.avatar ? getAvatarColor(selectedUser) : undefined }"
                class="avatar-preview"
              >
                {{ getUserInitial(selectedUser) }}
              </a-avatar>
              <div style="margin-top: 12px; text-align: center">
                <input
                  ref="avatarFileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                />
                <a-button 
                  type="default" 
                  @click="avatarFileInput?.click()"
                  :loading="isUploadingAvatar"
                  :disabled="isUploadingAvatar"
                  size="small"
                >
                  {{ isUploadingAvatar ? 'Đang tải...' : 'Tải ảnh đại diện' }}
                </a-button>
              </div>
            </div>
          </a-form-item>
          
          <a-form-item label="Họ tên" required>
            <a-input v-model:value="editForm.fullname" placeholder="Họ và tên" />
          </a-form-item>
          
          <a-form-item label="Email" required>
            <a-input v-model:value="editForm.email" placeholder="Email" disabled />
          </a-form-item>
          
          <a-form-item label="Số điện thoại">
            <a-input v-model:value="editForm.phone" placeholder="Số điện thoại" />
          </a-form-item>
          
          <a-form-item label="Vai trò">
            <a-select v-model:value="editForm.role" placeholder="Chọn vai trò">
              <a-select-option value="admin">Admin</a-select-option>
              <a-select-option value="manager">Manager</a-select-option>
              <a-select-option value="worker">Worker</a-select-option>
              <a-select-option value="customer">Customer</a-select-option>
            </a-select>
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
              :src="selectedUser.avatar || undefined" 
              :size="64"
              :style="{ backgroundColor: !selectedUser.avatar ? getAvatarColor(selectedUser) : undefined }"
            >
              {{ getUserInitial(selectedUser) }}
            </a-avatar>
          </a-descriptions-item>
          <a-descriptions-item label="Họ tên">
            {{ selectedUser.fullname || selectedUser.name || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Email">
            {{ selectedUser.email }}
          </a-descriptions-item>
          <a-descriptions-item label="Số điện thoại">
            {{ selectedUser.phone || 'N/A' }}
          </a-descriptions-item>
          <a-descriptions-item label="Vai trò">
            <a-tag :color="getRoleColor(selectedUser.role)">
              {{ getRoleLabel(selectedUser.role) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Loại đăng nhập">
            <a-tag :color="getProviderColor(selectedUser.provider)">
              {{ getProviderLabel(selectedUser.provider) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Trạng thái">
            <a-tag :color="selectedUser.isActive ? 'success' : 'error'">
              {{ selectedUser.isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="Ngày tạo">
            {{ formatDate(selectedUser.createdAt) }}
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
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useUsersApi } from '~/composables/api/useUsersApi'
import { useUploadsApi } from '~/composables/api/useUploadsApi'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'admin']
})

useHead({
  title: 'Quản lý người dùng - Vạn Phúc Care Admin'
})

const usersApi = useUsersApi()
const { uploadImage } = useUploadsApi()

// ===== STATE =====
const loading = ref(false)
const users = ref<any[]>([])
const stats = ref({
  total: 0,
  active: 0,
  google: 0,
  local: 0,
  customers: 0,
  staff: 0
})

const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')

const paginationConfig = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} người dùng`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const showUserModal = ref(false)
const selectedUser = ref<any>(null)
const isEditMode = ref(false)
const saving = ref(false)
const avatarFileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string>('')
const avatarFile = ref<File | null>(null)
const isUploadingAvatar = ref(false)
const editForm = ref({
  fullname: '',
  email: '',
  phone: '',
  avatar: '',
  role: 'customer',
  isActive: true
})

// Create user state
const showCreateUserModal = ref(false)
const creating = ref(false)
const createFormRef = ref<any>(null)
const createAvatarFileInput = ref<HTMLInputElement | null>(null)
const createAvatarPreview = ref<string>('')
const createAvatarFile = ref<File | null>(null)
const isUploadingCreateAvatar = ref(false)
const createForm = ref({
  fullname: '',
  email: '',
  phone: '',
  avatar: '',
  provider: 'local',
  password: '',
  role: 'customer',
  isActive: true
})

// Form validation rules
const createFormRules = {
  fullname: [
    { required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  provider: [
    { required: true, message: 'Vui lòng chọn loại đăng nhập', trigger: 'change' }
  ],
  password: [
    { 
      validator: (_rule: any, value: string) => {
        if (createForm.value.provider === 'local' && !value) {
          return Promise.reject('Vui lòng nhập mật khẩu cho tài khoản local')
        }
        if (createForm.value.provider === 'local' && value && value.length < 6) {
          return Promise.reject('Mật khẩu phải có ít nhất 6 ký tự')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }
  ]
}

// ===== TABLE COLUMNS =====
const columns = [
  {
    title: 'Avatar',
    key: 'avatar',
    width: 80,
    fixed: 'left'
  },
  {
    title: 'Thông tin',
    key: 'name',
    width: 250,
    fixed: 'left'
  },
  {
    title: 'Loại đăng nhập',
    key: 'provider',
    width: 130
  },
  {
    title: 'Vai trò',
    key: 'role',
    width: 120
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 130
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
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
const loadUsers = async () => {
  try {
    loading.value = true
    
    const params: any = {
      page: paginationConfig.value.current,
      limit: paginationConfig.value.pageSize
    }
    
    // Backend expects 'search' not 'searchKey'  
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    // Handle status filter
    if (filterStatus.value) {
      params.isActive = filterStatus.value === 'active'
    }
    
    if (filterRole.value) {
      params.role = filterRole.value
    }
    
    const response = await usersApi.getUsers(params)
    
    if (response.status && response.data) {
      // Backend returns: { message: "", data: { users: [...], pagination: {...} } }
      // apiClient wraps it: { status: true, data: { message: "", data: { users: [...], pagination: {...} } } }
      // So we need: response.data.data.users
      const responseData = response.data.data || response.data
      
      
      // Get users array
      let usersList: any[] = []
      if (Array.isArray(responseData.users)) {
        usersList = responseData.users
      } else if (Array.isArray(responseData.data)) {
        usersList = responseData.data
      } else if (Array.isArray(responseData)) {
        usersList = responseData
      } else {
        usersList = []
      }
      
      // Normalize status field: convert 'status' (string) to 'isActive' (boolean) for consistency
      // admins collection uses 'isActive' (boolean), users collection uses 'status' (string: 'active'/'inactive')
      // Normalize role: 'user' and 'normal' both become 'customer'
      users.value = usersList.map((user: any) => ({
        ...user,
        // Normalize: if isActive exists, use it; otherwise convert status to isActive
        isActive: user.isActive !== undefined 
          ? user.isActive 
          : (user.status === 'active' || user.status === 'ACTIVE'),
        // Normalize role: 'user' and 'normal' both become 'customer'
        role: user.role === 'user' || user.role === 'normal' 
          ? 'customer' 
          : (user.role || 'customer')
      }))
      
      // Get pagination
      if (responseData.pagination) {
        paginationConfig.value.total = responseData.pagination.total || 0
        paginationConfig.value.current = responseData.pagination.page || paginationConfig.value.current
      } else if (responseData.total !== undefined) {
        paginationConfig.value.total = responseData.total
      }
      
    } else {
      users.value = []
    }
  } catch (error: any) {
    message.error('Không thể tải danh sách người dùng: ' + (error.message || 'Unknown error'))
    users.value = []
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await usersApi.getUserStats()
    
    if (response.status && response.data) {
      const statsData = response.data.data || response.data
      stats.value = {
        total: statsData?.total || 0,
        active: statsData?.active || 0,
        google: statsData?.google || 0,
        local: statsData?.local || 0,
        customers: statsData?.customers || 0,
        staff: statsData?.staff || 0
      }
    }
  } catch (error: any) {
  }
}

const handleSearch = () => {
  paginationConfig.value.current = 1
  loadUsers()
}

const handleFilter = () => {
  paginationConfig.value.current = 1
  loadUsers()
}

const handleTableChange = (pag: any) => {
  paginationConfig.value.current = pag.current
  paginationConfig.value.pageSize = pag.pageSize
  loadUsers()
}

const refreshData = () => {
  loadUsers()
  loadStats()
}

const viewUser = async (user: any) => {
  try {
    loading.value = true
    const response = await usersApi.getUser(user._id || user.id)
    
    if (response.status && response.data) {
      // Backend returns: { message: "", data: { user: {...} } }
      // apiClient.get wraps it: { status: true, data: { message: "", data: { user: {...} } } }
      const userData = response.data.data?.user || response.data.user || response.data.data || response.data
      
      if (!userData) {
        throw new Error('Không tìm thấy thông tin người dùng')
      }
      
      selectedUser.value = userData
      // Initialize edit form
      editForm.value = {
        fullname: userData.fullname || userData.name || '',
        email: userData.email || '',
        phone: userData.phone || userData.phoneNumber || '',
        avatar: userData.avatar || '',
        role: userData.role === 'user' || userData.role === 'normal' ? 'customer' : (userData.role || 'customer'),
        isActive: userData.isActive !== undefined 
          ? userData.isActive 
          : (userData.status === 'active')
      }
      // Reset avatar preview and file
      avatarPreview.value = ''
      avatarFile.value = null
      isEditMode.value = false
      showUserModal.value = true
    } else {
      throw new Error(response.message || 'Không thể tải thông tin người dùng')
    }
  } catch (error: any) {
    message.error(error.message || 'Không thể tải thông tin người dùng')
    // Fallback to show user from list
    selectedUser.value = user
    editForm.value = {
      fullname: user.fullname || user.name || '',
      email: user.email || '',
      phone: user.phone || user.phoneNumber || '',
      avatar: user.avatar || '',
      role: user.role === 'user' || user.role === 'normal' ? 'customer' : (user.role || 'customer'),
      isActive: user.isActive !== undefined ? user.isActive : (user.status === 'active')
    }
    // Reset avatar preview and file
    avatarPreview.value = ''
    avatarFile.value = null
    isEditMode.value = false
    showUserModal.value = true
  } finally {
    loading.value = false
  }
}

const enableEditMode = () => {
  isEditMode.value = true
}

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    message.error('Vui lòng chọn file ảnh')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    message.error('Kích thước ảnh tối đa là 5MB')
    return
  }

  try {
    isUploadingAvatar.value = true

    // Store file for later use
    avatarFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Upload image immediately
    const uploadResult = await uploadImage(file)
    
    // Extract avatar URL from response
    const responseData = uploadResult.data as any
    const avatarUrl = 
      responseData?.data?.fileAttributes?.[0]?.source || 
      responseData?.fileAttributes?.[0]?.source ||
      responseData?.data?.url || 
      responseData?.url || 
      responseData?.data?.urls?.[0] || 
      responseData?.urls?.[0]


    if (!avatarUrl) {
      throw new Error('Không thể tải ảnh lên')
    }

    // Update form with new avatar URL
    editForm.value.avatar = avatarUrl
    message.success('Tải ảnh đại diện thành công!')
  } catch (err: any) {
    message.error(err.message || 'Không thể tải ảnh đại diện')
    // Reset preview on error
    avatarPreview.value = ''
    avatarFile.value = null
  } finally {
    isUploadingAvatar.value = false
    // Reset input value
    if (input) {
      input.value = ''
    }
  }
}

const handleOk = () => {
  if (isEditMode.value) {
    // If in edit mode, save the changes
    handleSaveUser()
  } else {
    // If in view mode, just close the modal
    showUserModal.value = false
  }
}

const handleCancelEdit = () => {
  isEditMode.value = false
  // Reset form to original values
  if (selectedUser.value) {
    editForm.value = {
      fullname: selectedUser.value.fullname || selectedUser.value.name || '',
      email: selectedUser.value.email || '',
      phone: selectedUser.value.phone || selectedUser.value.phoneNumber || '',
      avatar: selectedUser.value.avatar || '',
      role: selectedUser.value.role === 'user' || selectedUser.value.role === 'normal' ? 'customer' : (selectedUser.value.role || 'customer'),
      isActive: selectedUser.value.isActive !== undefined 
        ? selectedUser.value.isActive 
        : (selectedUser.value.status === 'active')
    }
  }
  // Reset avatar preview and file
  avatarPreview.value = ''
  avatarFile.value = null
}

const handleSaveUser = async () => {
  if (!selectedUser.value) return
  
  try {
    saving.value = true
    
    // If there's a new avatar file, upload it first
    let avatarUrl = editForm.value.avatar
    if (avatarFile.value && !avatarUrl) {
      isUploadingAvatar.value = true
      try {
        const uploadResult = await uploadImage(avatarFile.value)
        const responseData = uploadResult.data as any
        avatarUrl = 
          responseData?.data?.fileAttributes?.[0]?.source || 
          responseData?.fileAttributes?.[0]?.source ||
          responseData?.data?.url || 
          responseData?.url || 
          responseData?.data?.urls?.[0] || 
          responseData?.urls?.[0]
        
        if (!avatarUrl) {
          throw new Error('Không thể tải ảnh lên')
        }
        editForm.value.avatar = avatarUrl
      } catch (uploadErr: any) {
        message.error(uploadErr.message || 'Không thể tải ảnh lên')
        return
      } finally {
        isUploadingAvatar.value = false
      }
    }
    
    const updateData: any = {
      fullname: editForm.value.fullname,
      phone: editForm.value.phone,
      phoneNumber: editForm.value.phone,
      avatar: avatarUrl,
      role: editForm.value.role,
      isActive: editForm.value.isActive
    }
    
    const response = await usersApi.updateUser(selectedUser.value._id || selectedUser.value.id, updateData)
    
    if (response.status && response.data) {
      message.success('Cập nhật thông tin người dùng thành công')
      
      // Reload user data from API to ensure we have the latest complete data
      try {
        const userId = selectedUser.value._id || selectedUser.value.id
        const refreshResponse = await usersApi.getUser(userId)
        
        if (refreshResponse.status && refreshResponse.data) {
          // Parse response same as viewUser
          const userData = refreshResponse.data.data?.user || refreshResponse.data.user || refreshResponse.data.data || refreshResponse.data
          
          if (userData) {
            selectedUser.value = userData
            // Update edit form to match updated user
            editForm.value = {
              fullname: userData.fullname || userData.name || '',
              email: userData.email || '',
              phone: userData.phone || userData.phoneNumber || '',
              avatar: userData.avatar || '',
              role: userData.role === 'user' || userData.role === 'normal' ? 'customer' : (userData.role || 'customer'),
              isActive: userData.isActive !== undefined 
                ? userData.isActive 
                : (userData.status === 'active')
            }
          }
        }
      } catch (refreshError) {
        // Fallback to using update response
        const userData = response.data.data?.user || response.data.user || response.data.data || response.data
        if (userData) {
          selectedUser.value = userData
        }
      }
      
      isEditMode.value = false
      // Clear avatar file and preview
      avatarFile.value = null
      avatarPreview.value = ''
      await loadUsers()
      await loadStats()
    } else {
      message.error('Không thể cập nhật thông tin người dùng')
    }
  } catch (error: any) {
    message.error('Không thể cập nhật thông tin người dùng: ' + (error.message || 'Unknown error'))
  } finally {
    saving.value = false
  }
}

const toggleUserStatus = async (user: any) => {
  try {
    loading.value = true
    const response = await usersApi.toggleUserStatus(user._id || user.id)
    
    if (response.status) {
      message.success(`Đã ${user.isActive ? 'khóa' : 'mở khóa'} người dùng thành công`)
      await loadUsers()
      await loadStats()
    } else {
      throw new Error(response.message || 'Failed to toggle status')
    }
  } catch (error: any) {
    message.error('Không thể thay đổi trạng thái người dùng')
  } finally {
    loading.value = false
  }
}

const deleteUser = async (user: any) => {
  try {
    loading.value = true
    const response = await usersApi.deleteUser(user._id || user.id)
    
    if (response.status) {
      message.success('Đã xóa người dùng thành công')
      await loadUsers()
      await loadStats()
    } else {
      throw new Error(response.message || 'Failed to delete user')
    }
  } catch (error: any) {
    message.error('Không thể xóa người dùng')
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

const getUserInitial = (user: any) => {
  const name = user.fullname || user.name || user.email || 'U'
  return name.charAt(0).toUpperCase()
}

const getAvatarUrl = (avatar: string | undefined | null): string | undefined => {
  if (!avatar) return undefined
  
  // If already a full URL (http/https), return as is
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  
  // If starts with /, it's a relative path - need to add API base URL
  if (avatar.startsWith('/')) {
    const config = useRuntimeConfig()
    let apiHost = config.public.apiHost
    if (!apiHost || apiHost.trim() === '') {
      // Nếu apiHost rỗng, dùng relative path
      return avatar
    }
    // Remove trailing slash from apiHost if exists
    const baseUrl = apiHost.replace(/\/$/, '')
    return `${baseUrl}${avatar}`
  }
  
  // Otherwise, assume it's a relative path and prepend API base URL
  const config = useRuntimeConfig()
  let apiHost = config.public.apiHost
  if (!apiHost || apiHost.trim() === '') {
    // Nếu apiHost rỗng, dùng relative path
    return `/${avatar}`
  }
  const baseUrl = apiHost.replace(/\/$/, '')
  return `${baseUrl}/${avatar}`
}

const getAvatarColor = (user: any): string => {
  // Generate consistent color based on user name/email
  const name = user?.fullname || user?.name || user?.email || 'U'
  const colors = [
    '#1890ff', // blue
    '#52c41a', // green
    '#faad14', // orange
    '#f5222d', // red
    '#722ed1', // purple
    '#13c2c2', // cyan
    '#eb2f96', // pink
    '#fa8c16', // orange
    '#2f54eb', // blue
    '#a0d911', // lime
  ]
  
  // Simple hash function to get consistent color for same name
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

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    manager: 'blue',
    worker: 'green',
    customer: 'default',
    user: 'default', // Backward compatibility
    normal: 'default' // Backward compatibility
  }
  return colors[role || ''] || 'default'
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    worker: 'Nhân viên',
    customer: 'Khách hàng',
    user: 'Khách hàng', // Backward compatibility: map old 'user' to 'Khách hàng'
    normal: 'Khách hàng' // Backward compatibility: map 'normal' to 'Khách hàng'
  }
  return labels[role || ''] || role || 'N/A'
}

// ===== CREATE USER FUNCTIONS =====
const showCreateModal = () => {
  // Reset form
  createForm.value = {
    fullname: '',
    email: '',
    phone: '',
    avatar: '',
    provider: 'local',
    password: '',
    role: 'customer',
    isActive: true
  }
  createAvatarPreview.value = ''
  createAvatarFile.value = null
  showCreateUserModal.value = true
}

const handleCancelCreate = () => {
  createFormRef.value?.resetFields()
  createAvatarPreview.value = ''
  createAvatarFile.value = null
}

const getDefaultAvatarColor = () => {
  return '#1890ff'
}

const handleCreateAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    message.error('Vui lòng chọn file ảnh')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    message.error('Kích thước ảnh tối đa là 5MB')
    return
  }

  try {
    isUploadingCreateAvatar.value = true

    // Store file for later use
    createAvatarFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      createAvatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Upload image immediately
    const uploadResult = await uploadImage(file)
    
    // Extract avatar URL from response
    const responseData = uploadResult.data as any
    const avatarUrl = 
      responseData?.data?.fileAttributes?.[0]?.source || 
      responseData?.fileAttributes?.[0]?.source ||
      responseData?.data?.url || 
      responseData?.url || 
      responseData?.data?.urls?.[0] || 
      responseData?.urls?.[0]


    if (!avatarUrl) {
      throw new Error('Không thể tải ảnh lên')
    }

    // Update form with new avatar URL
    createForm.value.avatar = avatarUrl
    message.success('Tải ảnh đại diện thành công!')
  } catch (err: any) {
    message.error(err.message || 'Không thể tải ảnh đại diện')
    // Reset preview on error
    createAvatarPreview.value = ''
    createAvatarFile.value = null
  } finally {
    isUploadingCreateAvatar.value = false
    // Reset input value
    if (input) {
      input.value = ''
    }
  }
}

const handleCreateUser = async () => {
  try {
    // Validate form
    await createFormRef.value?.validate()
    
    creating.value = true
    
    // Prepare data for API
    const createData: any = {
      email: createForm.value.email,
      name: createForm.value.fullname,
      fullname: createForm.value.fullname,
      provider: createForm.value.provider,
      role: createForm.value.role,
      isActive: createForm.value.isActive
    }
    
    // Add optional fields
    if (createForm.value.phone) {
      createData.phone = createForm.value.phone
      createData.phoneNumber = createForm.value.phone
    }
    
    if (createForm.value.avatar) {
      createData.avatar = createForm.value.avatar
    }
    
    // For local provider, add password if provided
    if (createForm.value.provider === 'local' && createForm.value.password) {
      createData.password = createForm.value.password
    }
    
    const response = await usersApi.createUser(createData)
    
    if (response.status && response.data) {
      message.success('Tạo người dùng mới thành công')
      showCreateUserModal.value = false
      createFormRef.value?.resetFields()
      createAvatarPreview.value = ''
      createAvatarFile.value = null
      
      // Reload users list and stats
      await loadUsers()
      await loadStats()
    } else {
      throw new Error(response.message || 'Không thể tạo người dùng')
    }
  } catch (error: any) {
    if (error.errorFields) {
      // Validation errors
      return
    }
    message.error(error.message || 'Không thể tạo người dùng')
  } finally {
    creating.value = false
  }
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadUsers()
  loadStats()
})
</script>

<style scoped>
.users-management-page {
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

.user-avatar {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
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
  .users-management-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .ant-btn {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .users-management-page {
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

  .page-subtitle {
    font-size: 13px;
  }

  .table-card {
    overflow-x: auto;
  }

  :deep(.ant-table) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr > th) {
    padding: 8px 4px;
    font-size: 12px;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 8px 4px;
    font-size: 12px;
  }

  :deep(.ant-space) {
    flex-wrap: wrap;
  }

  :deep(.ant-btn-link) {
    padding: 0 4px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .users-management-page {
    padding: 8px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .filters-card,
  .table-card {
    margin-bottom: 16px;
  }

  :deep(.ant-modal) {
    max-width: 95vw;
    margin: 10px auto;
  }

  :deep(.ant-modal-content) {
    padding: 16px;
  }

  :deep(.ant-form-item-label) {
    padding-bottom: 4px;
  }

  :deep(.ant-descriptions-item-label) {
    width: 100px;
    font-size: 12px;
  }

  :deep(.ant-descriptions-item-content) {
    font-size: 12px;
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
    transition: all 0.3s;
  }

  .user-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-card-email {
    font-size: 13px;
    color: #8c8c8c;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.avatar-preview {
  border: 2px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar-preview:hover {
  border-color: #1890ff;
  transform: scale(1.05);
}

.hidden {
  display: none;
}
</style>
