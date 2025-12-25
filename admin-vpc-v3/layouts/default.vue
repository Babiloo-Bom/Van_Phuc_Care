<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle lg:hidden fixed top-4 left-4 z-50">
      <a-button 
        type="primary" 
        @click="sidebarOpen = !sidebarOpen"
        class="!flex items-center justify-center"
      >
        <MenuOutlined />
      </a-button>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      class="mobile-overlay lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'w-64 bg-white shadow-lg fixed left-0 top-0 bottom-0 overflow-y-auto z-50 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-gray-200">
        <NuxtLink to="/" class="flex items-center">
          <img 
            src="/images/logo-vanphuc-new.png" 
            alt="Vạn Phúc Care" 
            class="h-10 object-contain"
          />
        </NuxtLink>
      </div>

      <!-- User Info -->
      <div class="p-4 border-b border-gray-200">
        <a-dropdown :trigger="['click']" placement="bottomLeft">
          <div class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
            <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {{ getUserInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">{{ userDisplayName }}</div>
              <div class="text-xs text-gray-500">{{ userRoleText }}</div>
            </div>
            <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile" disabled>
                <div class="px-2 py-1">
                  <div class="text-sm font-medium text-gray-900">{{ userDisplayName }}</div>
                  <div class="text-xs text-gray-500">{{ authStore.user?.email }}</div>
                </div>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <div class="flex items-center">
                  <LogoutOutlined class="mr-2" />
                  <span>Đăng xuất</span>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4">
        <a-menu mode="inline" :selected-keys="selectedKeys" :open-keys="openKeys" class="border-0">
          <a-menu-item key="dashboard">
            <NuxtLink to="/" class="flex items-center">
              <DashboardOutlined class="mr-3 text-lg" />
              <span>Dashboard</span>
            </NuxtLink>
          </a-menu-item>
          
          <!-- Xóa menu item "Khách hàng" này -->
          
          <a-menu-item v-if="isAdmin" key="users">
            <NuxtLink to="/admin/users" class="flex items-center">
              <TeamOutlined class="mr-3 text-lg" />
              <span>Quản lý người dùng</span>
            </NuxtLink>
          </a-menu-item>

          <!-- Quản lý khách hàng Menu - Ngang hàng với My và Elearning -->
          <a-menu-item key="customers">
            <NuxtLink to="/customers" class="flex items-center">
              <UsergroupAddOutlined class="mr-3 text-lg" />
              <span>Quản lý khách hàng</span>
            </NuxtLink>
          </a-menu-item>

          <!-- Elearning Menu với Submenu - Chỉ Admin và Manager -->
          <a-sub-menu v-if="isAdminOrManager" key="elearning" :title="null">
            <template #title>
              <span class="flex items-center">
                <BookOutlined class="mr-3 text-lg" />
                <span>Elearning</span>
              </span>
            </template>
            <a-menu-item key="courses">
              <NuxtLink to="/elearning/courses" class="flex items-center">
                <span>Quản lý khóa học</span>
              </NuxtLink>
            </a-menu-item>
          </a-sub-menu>

          <!-- My Menu với Submenu - Admin, Manager, Worker -->
          <a-sub-menu v-if="isAdminManagerOrWorker" key="my" :title="null">
            <template #title>
              <span class="flex items-center">
                <UserOutlined class="mr-3 text-lg" />
                <span>My</span>
              </span>
            </template>
            <a-menu-item key="so-skdt">
              <NuxtLink to="/my/so-skdt" class="flex items-center">
                <FileTextOutlined class="mr-3 text-lg" />
                <span>Quản lý Sổ SKĐT</span>
              </NuxtLink>
            </a-menu-item>
            <!-- Thêm menu item Quản lý giao dịch - Chỉ Admin và Manager -->
            <a-menu-item v-if="isAdminOrManager" key="transactions">
              <NuxtLink to="/my/transactions" class="flex items-center">
                <ShoppingCartOutlined class="mr-3 text-lg" />
                <span>Quản lý giao dịch</span>
              </NuxtLink>
            </a-menu-item>
            <!-- Thêm menu item Quản lý Lịch tiêm - Chỉ Admin và Manager -->
            <a-menu-item v-if="isAdminOrManager" key="schedule-vaccins">
              <NuxtLink to="/my/schedule-vaccins" class="flex items-center">
                <MedicineBoxOutlined class="mr-3 text-lg" />
                <span>Quản lý Lịch tiêm</span>
              </NuxtLink>
            </a-menu-item>
            <!-- Thêm menu item Quản lý Dịch vụ và Đơn hàng khoá học - Chỉ Admin và Manager -->
            <a-menu-item v-if="isAdminOrManager" key="services-and-orders">
              <NuxtLink to="/my/services-and-orders" class="flex items-center">
                <AppstoreAddOutlined class="mr-3 text-lg" />
                <span>Dịch vụ và Đơn hàng khoá học</span>
              </NuxtLink>
            </a-menu-item>
            <!-- Thêm menu item Quản lý CSKH Support Tickets - Admin, Manager, Worker -->
            <a-menu-item key="support-tickets">
              <NuxtLink to="/my/support-tickets" class="flex items-center">
                <CustomerServiceOutlined class="mr-3 text-lg" />
                <span>Quản lý CSKH Support Tickets</span>
              </NuxtLink>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-divider />

          <a-menu-item key="faqs">
            <NuxtLink to="/faqs" class="flex items-center">
              <InfoCircleOutlined class="mr-3 text-lg" />
              <span>FAQs</span>
            </NuxtLink>
          </a-menu-item>
        </a-menu>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64">
      <main class="p-4 lg:p-6 pt-16 lg:pt-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  LogoutOutlined, 
  TeamOutlined, 
  InfoCircleOutlined, 
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuOutlined,
  BookOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,  // Thêm icon này
  MedicineBoxOutlined,
  AppstoreAddOutlined,  // Icon cho Dịch vụ và Đơn hàng khoá học
  UsergroupAddOutlined,  // Icon cho Khách hàng
  CustomerServiceOutlined  // Icon cho Support Tickets
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

// Close sidebar when route changes (mobile)
watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
})

// Get selected menu keys based on current route
const selectedKeys = computed(() => {
  const path = route.path
  if (path === '/') return ['dashboard']
  if (path.startsWith('/admin/users')) return ['users']
  if (path.startsWith('/customers')) return ['customers']
  if (path.startsWith('/elearning/courses')) return ['courses']
  if (path.startsWith('/my/so-skdt')) return ['so-skdt']
  if (path.startsWith('/my/transactions')) return ['transactions']  // Thêm dòng này
  if (path.startsWith('/my/schedule-vaccins')) return ['schedule-vaccins']
  if (path.startsWith('/my/services-and-orders')) return ['services-and-orders']
  if (path.startsWith('/my/support-tickets')) return ['support-tickets']
  if (path.startsWith('/faqs')) return ['faqs']
  return []
})

// Get open submenu keys based on current route
const openKeys = computed(() => {
  const path = route.path
  if (path.startsWith('/elearning')) return ['elearning']
  if (path.startsWith('/my')) return ['my']
  return []
})

// Computed properties for user display
const userDisplayName = computed(() => {
  return authStore.user?.fullname || authStore.user?.name || authStore.user?.email || 'Admin'
})

const getUserInitials = computed(() => {
  const name = userDisplayName.value
  if (!name) return 'A'
  
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] || ''
    const last = parts[parts.length - 1]?.[0] || ''
    return (first + last).toUpperCase()
  }
  return name[0]?.toUpperCase() || 'A'
})

const userRoleText = computed(() => {
  const role = authStore.user?.role
  const roleMap: Record<string, string> = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    worker: 'Nhân viên'
  }
  return roleMap[role || ''] || role || 'Người dùng'
})

// Check if current user is admin
const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
})

// Check if current user is admin or manager
const isAdminOrManager = computed(() => {
  const role = authStore.user?.role
  return role === 'admin' || role === 'manager'
})

// Check if current user is admin, manager, or worker
const isAdminManagerOrWorker = computed(() => {
  const role = authStore.user?.role
  return role === 'admin' || role === 'manager' || role === 'worker'
})

// Logout handler
const handleLogout = async () => {
  try {
    await authStore.logout()
    message.success('Đăng xuất thành công')
  } catch (error: any) {
    console.error('Logout error:', error)
    message.error('Đăng xuất thất bại')
  }
}
</script>

<style scoped>
/* Custom styles for sidebar menu */
:deep(.ant-menu-item) {
  margin: 4px 0 !important;
  border-radius: 6px;
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff !important;
}

:deep(.ant-menu-item-selected a) {
  color: #1890ff !important;
}

:deep(.ant-sub-menu-title) {
  border-radius: 6px;
  margin: 4px 0 !important;
}

:deep(.ant-menu-submenu-selected > .ant-sub-menu-title) {
  color: #1890ff !important;
}

.mobile-menu-toggle {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 60;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

@media (min-width: 1024px) {
  .mobile-menu-toggle,
  .mobile-overlay {
    display: none;
  }
}
</style>