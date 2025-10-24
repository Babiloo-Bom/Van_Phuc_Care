<template>
  <div class="users-management">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Quản lý người dùng</h1>
      <p class="page-description">Quản lý tất cả người dùng trong hệ thống</p>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <a-card class="stat-card">
        <a-statistic
          title="Tổng người dùng"
          :value="stats.total"
          :value-style="{ color: '#1890ff' }"
        />
      </a-card>
      
      <a-card class="stat-card">
        <a-statistic
          title="Người dùng hoạt động"
          :value="stats.active"
          :value-style="{ color: '#52c41a' }"
        />
      </a-card>
      
      <a-card class="stat-card">
        <a-statistic
          title="Đăng nhập Google"
          :value="stats.google"
          :value-style="{ color: '#fa8c16' }"
        />
      </a-card>
      
      <a-card class="stat-card">
        <a-statistic
          title="Đăng nhập thường"
          :value="stats.local"
          :value-style="{ color: '#722ed1' }"
        />
      </a-card>
    </div>

    <!-- Filters -->
    <a-card class="filters-card">
      <div class="filters">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo tên hoặc email..."
          style="width: 300px"
          @search="handleSearch"
        />
        
        <a-select
          v-model:value="filterProvider"
          placeholder="Chọn loại đăng nhập"
          style="width: 200px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="local">Đăng nhập thường</a-select-option>
          <a-select-option value="google">Google</a-select-option>
        </a-select>
        
        <a-select
          v-model:value="filterRole"
          placeholder="Chọn vai trò"
          style="width: 150px"
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="user">User</a-select-option>
          <a-select-option value="admin">Admin</a-select-option>
          <a-select-option value="superadmin">Super Admin</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- Users Table -->
    <a-card class="users-table-card">
      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <!-- Avatar Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar" :size="40">
              {{ record.name.charAt(0).toUpperCase() }}
            </a-avatar>
          </template>
          
          <!-- Provider Column -->
          <template v-else-if="column.key === 'provider'">
            <a-tag :color="getProviderColor(record.provider)">
              {{ getProviderLabel(record.provider) }}
            </a-tag>
          </template>
          
          <!-- Status Column -->
          <template v-else-if="column.key === 'isActive'">
            <a-tag :color="record.isActive ? 'green' : 'red'">
              {{ record.isActive ? 'Hoạt động' : 'Không hoạt động' }}
            </a-tag>
          </template>
          
          <!-- Role Column -->
          <template v-else-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ getRoleLabel(record.role) }}
            </a-tag>
          </template>
          
          <!-- Actions Column -->
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button size="small" @click="viewUser(record)">
                Xem
              </a-button>
              <a-button 
                size="small" 
                :type="record.isActive ? 'default' : 'primary'"
                @click="toggleUserStatus(record)"
              >
                {{ record.isActive ? 'Khóa' : 'Mở khóa' }}
              </a-button>
              <a-popconfirm
                title="Bạn có chắc muốn xóa người dùng này?"
                ok-text="Xóa"
                cancel-text="Hủy"
                @confirm="deleteUser(record)"
              >
                <a-button size="small" danger>
                  Xóa
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

// ===== PAGE META =====
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// ===== STATE =====
const loading = ref(false)
const users = ref([])
const stats = ref({
  total: 0,
  active: 0,
  google: 0,
  local: 0
})

const searchQuery = ref('')
const filterProvider = ref('')
const filterRole = ref('')

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

// ===== TABLE COLUMNS =====
const columns = [
  {
    title: 'Avatar',
    key: 'avatar',
    width: 80
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Loại đăng nhập',
    key: 'provider',
    width: 120
  },
  {
    title: 'Vai trò',
    key: 'role',
    width: 100
  },
  {
    title: 'Trạng thái',
    key: 'isActive',
    width: 120
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 150
  }
]

// ===== METHODS =====
const loadUsers = async () => {
  try {
    loading.value = true
    
    const response = await $fetch('/api/users/list')
    
    if (response.success) {
      users.value = response.data.users
      pagination.value.total = response.data.total
      console.log('✅ Users loaded:', users.value)
    } else {
      throw new Error(response.error || 'Failed to load users')
    }
  } catch (error: any) {
    console.error('❌ Load users failed:', error)
    message.error('Không thể tải danh sách người dùng: ' + error.message)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await $fetch('/api/users/stats')
    
    if (response.success) {
      stats.value = response.data
      console.log('✅ User stats loaded:', stats.value)
    } else {
      console.warn('⚠️ Stats not available:', response.error)
    }
  } catch (error: any) {
    console.error('❌ Failed to load user stats:', error)
  }
}

const handleSearch = () => {
  pagination.value.current = 1
  loadUsers()
}

const handleFilter = () => {
  pagination.value.current = 1
  loadUsers()
}

const handleTableChange = (pag: any) => {
  pagination.value = pag
  loadUsers()
}

const viewUser = (user: any) => {
  console.log('View user:', user)
  // TODO: Implement user detail modal
}

const toggleUserStatus = async (user: any) => {
  try {
    const response = await $fetch('/api/users/toggle-status', {
      method: 'PATCH',
      body: {
        id: user.id,
        isActive: !user.isActive
      }
    })

    if (response.success) {
      message.success(`Đã ${!user.isActive ? 'mở khóa' : 'khóa'} người dùng`)
      await loadUsers()
    } else {
      throw new Error(response.error)
    }
  } catch (error: any) {
    console.error('❌ Toggle user status failed:', error)
    message.error('Không thể thay đổi trạng thái người dùng: ' + error.message)
  }
}

const deleteUser = async (user: any) => {
  try {
    const response = await $fetch(`/api/users/delete/${user.id}`, {
      method: 'DELETE'
    })

    if (response.success) {
      message.success('Đã xóa người dùng thành công')
      await loadUsers()
    } else {
      throw new Error(response.error)
    }
  } catch (error: any) {
    console.error('❌ Delete user failed:', error)
    message.error('Không thể xóa người dùng: ' + error.message)
  }
}

// ===== HELPER FUNCTIONS =====
const getProviderColor = (provider: string) => {
  const colors = {
    local: 'blue',
    google: 'red',
    facebook: 'blue',
    github: 'black'
  }
  return colors[provider] || 'default'
}

const getProviderLabel = (provider: string) => {
  const labels = {
    local: 'Thường',
    google: 'Google',
    facebook: 'Facebook',
    github: 'GitHub'
  }
  return labels[provider] || provider
}

const getRoleColor = (role: string) => {
  const colors = {
    user: 'green',
    admin: 'orange',
    superadmin: 'red'
  }
  return colors[role] || 'default'
}

const getRoleLabel = (role: string) => {
  const labels = {
    user: 'User',
    admin: 'Admin',
    superadmin: 'Super Admin'
  }
  return labels[role] || role
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadUsers()
  loadStats()
})
</script>

<style scoped>
.users-management {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.page-description {
  color: #6b7280;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.filters-card {
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.users-table-card {
  margin-bottom: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters > * {
    width: 100% !important;
  }
}
</style>
