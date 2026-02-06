<template>
  <div class="dashboard-container">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Tổng quan hệ thống Vạn Phúc Care</p>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="refreshData" :loading="loading">
          <template #icon>
            <ReloadOutlined />
          </template>
          Làm mới
        </a-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <!-- Total Courses (thay thế Total Orders) -->
      <div class="stat-card stat-card-blue">
        <div class="stat-icon">
          <BookOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng khóa học đã bán được</p>
          <p class="stat-value">{{ formatNumber(stats.totalCoursesSold) }}</p>
          <p class="stat-change positive">
            <ArrowUpOutlined /> Cập nhật theo thời gian thực
          </p>
        </div>
      </div>

      <!-- Sổ SKĐT (thay thế Total Revenue) -->
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <FileTextOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng Sổ SKĐT</p>
          <p class="stat-value">{{ formatNumber(stats.totalHealthBooks) }}</p>
          <p class="stat-change positive">
            <ArrowUpOutlined /> {{ stats.activeHealthBooks || 0 }} đang hoạt động
          </p>
        </div>
      </div>

      <!-- Giao dịch (thay thế Pending Orders) -->
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <ClockCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Giao dịch</p>
          <p class="stat-value">{{ formatNumber(stats.pendingOrders) }}</p>
          <p class="stat-change" :class="stats.pendingOrders > 0 ? 'warning' : 'positive'">
            <InfoCircleOutlined /> 
            {{ stats.pendingOrders > 0 ? 'Cần xử lý' : 'Tất cả đã xử lý' }}
          </p>
        </div>
      </div>

      <!-- Total Customers -->
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <UserOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng người dùng</p>
          <p class="stat-value">{{ formatNumber(stats.totalUsers) }}</p>
          <p class="stat-change positive">
            <ArrowUpOutlined /> Đang tăng trưởng
          </p>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Recent Courses (thay thế Recent Orders) -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Khóa học gần đây</h3>
          <NuxtLink to="/elearning/courses" class="view-all-link">
            Xem tất cả <RightOutlined />
          </NuxtLink>
        </div>
        <div v-if="loading" class="loading-container">
          <a-spin size="large" />
        </div>
        <div v-else-if="recentCourses.length === 0" class="empty-container">
          <a-empty description="Chưa có khóa học nào" />
        </div>
        <div v-else class="orders-list">
          <div
            v-for="course in recentCourses"
            :key="course._id"
            class="order-item"
          >
            <div class="order-info">
              <div class="order-id">{{ course.title || 'Chưa có tiêu đề' }}</div>
              <div class="order-customer">{{ course.category || course.categoryName || 'Chưa phân loại' }}</div>
            </div>
            <div class="order-details">
              <div class="order-amount">{{ formatCurrency(course.price || course.originalPrice || 0) }}</div>
              <a-tag :color="course.status === 'active' ? 'green' : 'default'">
                {{ course.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng' }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Thao tác nhanh</h3>
        </div>
        <div class="quick-actions-grid">
          <NuxtLink to="/elearning/courses" class="quick-action-item">
            <div class="quick-action-icon blue">
              <BookOutlined />
            </div>
            <p class="quick-action-label">Quản lý khóa học</p>
          </NuxtLink>
          <NuxtLink to="/my/so-skdt" class="quick-action-item">
            <div class="quick-action-icon green">
              <FileTextOutlined />
            </div>
            <p class="quick-action-label">Quản lý Sổ SKĐT</p>
          </NuxtLink>
          <NuxtLink to="/products" class="quick-action-item">
            <div class="quick-action-icon orange">
              <AppstoreOutlined />
            </div>
            <p class="quick-action-label">Quản lý sản phẩm</p>
          </NuxtLink>
          <NuxtLink to="/admin/users" class="quick-action-item">
            <div class="quick-action-icon purple">
              <TeamOutlined />
            </div>
            <p class="quick-action-label">Quản lý người dùng</p>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Báo cáo phân tích -->
    <div class="content-grid">
      <!-- Biểu đồ doanh thu theo tháng -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Biểu đồ doanh thu theo tháng</h3>
        </div>
        <RevenueChart :data="revenueChartData" :loading="revenueChartLoading" />
      </div>

      <!-- Tỷ lệ hoàn thành khóa học -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Tỷ lệ hoàn thành khóa học</h3>
        </div>
        <CompletionRateChart
          :completion-rate="completionRate"
          :completed-courses="completedCourses"
          :total-purchased-courses="totalPurchasedCourses"
          :top-courses="topCourses"
          :loading="completionRateLoading"
        />
      </div>
    </div>

    <!-- Additional Stats -->
    <div class="content-grid">
      <!-- Order Status Chart -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Trạng thái đơn hàng</h3>
        </div>
        <div class="status-stats">
          <div class="status-item">
            <div class="status-bar completed" :style="{ width: `${stats.completedPercentage}%` }"></div>
            <div class="status-info">
              <span class="status-label">Hoàn thành</span>
              <span class="status-value">{{ stats.completedOrders }}</span>
            </div>
          </div>
          <div class="status-item">
            <div class="status-bar pending" :style="{ width: `${stats.pendingPercentage}%` }"></div>
            <div class="status-info">
              <span class="status-label">Chờ xử lý</span>
              <span class="status-value">{{ stats.pendingOrders }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Thông tin hệ thống</h3>
        </div>
        <div class="system-info">
          <div class="info-item">
            <span class="info-label">Người dùng hiện tại:</span>
            <span class="info-value">{{ authStore.user?.fullname || authStore.user?.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Vai trò:</span>
            <a-tag :color="getRoleColor(authStore.user?.role)">
              {{ getRoleText(authStore.user?.role) }}
            </a-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  DollarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined,
  RightOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,  // Thêm icon này
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useCustomersApi } from '~/composables/api/useCustomersApi'
import { useUsersApi } from '~/composables/api/useUsersApi'
import { useCoursesApi } from '~/composables/api/useCoursesApi'
import { useHealthBooksApi } from '~/composables/api/useHealthBooksApi'  // Thêm import này
import { useOrdersApi } from '~/composables/api/useOrdersApi'  // Thêm import này
import { useProgressApi } from '~/composables/api/useProgressApi'  // Thêm import này
import RevenueChart from '~/components/charts/RevenueChart.vue'
import CompletionRateChart from '~/components/charts/CompletionRateChart.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Dashboard - Vạn Phúc Care Admin'
})

const authStore = useAuthStore()
const customersApi = useCustomersApi()
const usersApi = useUsersApi()
const coursesApi = useCoursesApi()
const healthBooksApi = useHealthBooksApi()  // Thêm instance này
const ordersApi = useOrdersApi()  // Thêm instance này
const progressApi = useProgressApi()  // Thêm instance này

// State
const loading = ref(false)
const stats = reactive({
  totalOrders: 0,
  completedOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,  // Có thể giữ lại hoặc xóa
  completionRate: 0,
  totalUsers: 0,
  totalCourses: 0,
  activeCourses: 0,
  completedPercentage: 0,
  pendingPercentage: 0,
  totalHealthBooks: 0,  // Thêm field này
  activeHealthBooks: 0,  // Thêm field này
  totalCoursesSold: 0,  // Số khóa học đã bán được
})
const recentCourses = ref<any[]>([]) // Thêm state này

// Chart data states
const revenueChartData = ref<any[]>([])
const revenueChartLoading = ref(false)
const completionRate = ref(0)
const completedCourses = ref(0)
const totalPurchasedCourses = ref(0)
const topCourses = ref<any[]>([])
const completionRateLoading = ref(false)

// Format number
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

// Get status color
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: 'green',
    pending: 'orange',
    processing: 'blue',
    cancelled: 'red',
    refunded: 'default',
  }
  return colors[status] || 'default'
}

// Get status text
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    cancelled: 'Đã hủy',
    refunded: 'Đã hoàn tiền',
  }
  return texts[status] || status
}

// Get role color
const getRoleColor = (role?: string) => {
  const colors: Record<string, string> = {
    admin: 'red',
    manager: 'blue',
    worker: 'green',
  }
  return colors[role || ''] || 'default'
}

// Get role text
const getRoleText = (role?: string) => {
  const texts: Record<string, string> = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    worker: 'Nhân viên',
  }
  return texts[role || ''] || role || 'N/A'
}

// Fetch dashboard data
const fetchDashboardData = async () => {
  loading.value = true
  try {
    // Fetch order statistics để lấy số lượng giao dịch thực tế
    try {
      const orderStatsRes = await ordersApi.getOrderStats()
      if (orderStatsRes.status && orderStatsRes.data) {
        // Backend trả về: { message: "", data: { stats: { pendingOrders: 11, ... } } }
        // orderStatsRes.data = { message: "", data: { stats: {...} } }
        const responseData = orderStatsRes.data.data || orderStatsRes.data
        const orderStats = responseData?.stats || responseData
        
        stats.totalOrders = orderStats?.totalOrders || 0
        stats.completedOrders = orderStats?.completedOrders || 0
        stats.pendingOrders = orderStats?.pendingOrders || 0  // Số lượng giao dịch chờ xử lý
        stats.totalRevenue = orderStats?.totalRevenue || 0
        stats.completionRate = parseFloat(orderStats?.completionRate || '0')
        stats.totalCoursesSold = orderStats?.totalCoursesSold || 0  // Số khóa học đã bán được
        
        // Calculate percentages
        if (stats.totalOrders > 0) {
          stats.completedPercentage = (stats.completedOrders / stats.totalOrders) * 100
          stats.pendingPercentage = (stats.pendingOrders / stats.totalOrders) * 100
        }
      }
    } catch (error) {
      // Không hiển thị error để không làm phiền user
    }

    // Fetch courses statistics
    try {
      const coursesRes = await coursesApi.getCourses({ limit: 1000 })
      
      if (coursesRes.status && coursesRes.data) {
        // Structure thực tế: coursesRes.data.data.data.pagination.total
        // coursesRes.data = { message: "", data: { data: { courses: [], pagination: {} } } }
        const responseData = coursesRes.data.data?.data
        
        if (responseData) {
          // Lấy pagination
          if (responseData.pagination?.total !== undefined) {
            stats.totalCourses = responseData.pagination.total
          }
          
          // Lấy courses để đếm active
          const courses = responseData.courses || []
          if (Array.isArray(courses) && courses.length > 0) {
            stats.activeCourses = courses.filter((c: any) => c.status === 'active').length
            
            // Fallback nếu không có pagination.total
            if (stats.totalCourses === 0) {
              stats.totalCourses = courses.length
            }
          }
        }
      }
    } catch (error) {
    }

    // Fetch user statistics (users, not customers)
    try {
      const userStatsRes = await usersApi.getUserStats()
      if (userStatsRes.status && userStatsRes.data) {
        const statsData = userStatsRes.data.data || userStatsRes.data
        stats.totalUsers = statsData?.total ?? 0
      }
    } catch (error) {
      // Fallback: try to get total from users list if stats endpoint fails
      try {
        const usersRes = await usersApi.getUsers({ limit: 1 })
        if (usersRes.status && usersRes.data) {
          // Try to get total from response
          const total = (usersRes.data as any).pagination?.total || (usersRes.data as any).total || (usersRes.data as any).data?.length || 0
          stats.totalUsers = total
        }
      } catch (fallbackError) {
      }
    }

    // Fetch health books statistics
    try {
      const healthBooksRes = await healthBooksApi.getHealthBooks({ limit: 1000 })
      
      if (healthBooksRes.status && healthBooksRes.data) {
        const responseData = healthBooksRes.data.data || healthBooksRes.data
        
        if (responseData) {
          // Lấy pagination
          if (responseData.pagination?.total !== undefined) {
            stats.totalHealthBooks = responseData.pagination.total
          }
          
          // Lấy health books để đếm active
          const healthBooks = responseData.healthBooks || []
          if (Array.isArray(healthBooks) && healthBooks.length > 0) {
            // Có thể filter theo status nếu có
            stats.activeHealthBooks = healthBooks.length
            
            // Fallback nếu không có pagination.total
            if (stats.totalHealthBooks === 0) {
              stats.totalHealthBooks = healthBooks.length
            }
          }
        }
      }
    } catch (error) {
    }

    // Fetch recent courses (thay thế recent orders)
    try {
      const coursesRes = await coursesApi.getCourses({ limit: 5, sort: 'createdAt', order: 'desc' })
      if (coursesRes.status && coursesRes.data) {
        // Structure: response.data.data.data.courses
        // Backend trả về: { message: "", data: { data: { courses: [], pagination: {} } } }
        const nestedData = coursesRes.data.data?.data || coursesRes.data.data || coursesRes.data
        
        // Đảm bảo courses là array
        const coursesArray = Array.isArray(nestedData?.courses) 
          ? nestedData.courses 
          : Array.isArray(nestedData) 
            ? nestedData 
            : []
        
        recentCourses.value = coursesArray
      } else {
        recentCourses.value = []
      }
    } catch (error) {
      recentCourses.value = []
    }

    // Fetch revenue by month (for chart)
    try {
      revenueChartLoading.value = true
      const revenueRes = await ordersApi.getRevenueByMonth(12)
      if (revenueRes.status && revenueRes.data) {
        // Backend trả về: { message: "", data: { data: [...], months: 12 } }
        const responseData = revenueRes.data.data || revenueRes.data
        const chartData = responseData?.data || responseData || []
        revenueChartData.value = Array.isArray(chartData) ? chartData : []
      }
    } catch (error) {
      revenueChartData.value = []
    } finally {
      revenueChartLoading.value = false
    }

    // Fetch completion rate statistics
    try {
      completionRateLoading.value = true
      const completionRes = await progressApi.getCompletionRate()
      if (completionRes.status && completionRes.data) {
        const responseData = completionRes.data.data || completionRes.data
        completionRate.value = responseData?.completionRate || 0
        completedCourses.value = responseData?.completedCourses || 0
        totalPurchasedCourses.value = responseData?.totalPurchasedCourses || 0
        topCourses.value = responseData?.topCourses || []
      }
    } catch (error) {
      completionRate.value = 0
      completedCourses.value = 0
      totalPurchasedCourses.value = 0
      topCourses.value = []
    } finally {
      completionRateLoading.value = false
    }
  } catch (error: any) {
    message.error('Không thể tải dữ liệu dashboard')
  } finally {
    loading.value = false
  }
}

// Refresh data
const refreshData = () => {
  fetchDashboardData()
}

// Auto-refresh interval (30 giây)
let autoRefreshInterval: ReturnType<typeof setInterval> | null = null

// Fetch on mount
onMounted(() => {
  fetchDashboardData()
  
  // Bắt đầu auto-refresh mỗi 30 giây
  autoRefreshInterval = setInterval(() => {
    fetchDashboardData()
  }, 30000) // 30 giây
})

// Cleanup interval khi component unmount
onUnmounted(() => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
    autoRefreshInterval = null
  }
})
// Build
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
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
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 4px 0 0 0;
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
  margin: 0 0 8px 0;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.warning {
  color: #fa8c16;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.content-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.view-all-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #40a9ff;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  transition: background 0.2s;
}

.order-item:hover {
  background: #f0f0f0;
}

.order-info {
  flex: 1;
}

.order-id {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.order-customer {
  font-size: 14px;
  color: #8c8c8c;
}

.order-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-amount {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 16px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.quick-action-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.quick-action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 12px;
}

.quick-action-icon.blue {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.quick-action-icon.green {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.quick-action-icon.orange {
  background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%);
}

.quick-action-icon.purple {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}

.quick-action-label {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
}

.status-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-bar {
  height: 8px;
  border-radius: 4px;
  transition: width 0.3s;
}

.status-bar.completed {
  background: linear-gradient(90deg, #52c41a 0%, #73d13d 100%);
}

.status-bar.pending {
  background: linear-gradient(90deg, #fa8c16 0%, #ffa940 100%);
}

.status-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 14px;
  color: #8c8c8c;
}

.status-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #8c8c8c;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
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

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .content-card {
    padding: 16px;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .quick-action-item {
    padding: 16px;
  }

  .quick-action-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-details {
    width: 100%;
    justify-content: space-between;
  }

  .page-title {
    font-size: 24px;
  }

  .card-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 8px;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-bottom: 8px;
  }
}
</style>
