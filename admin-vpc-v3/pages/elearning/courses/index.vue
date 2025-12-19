<template>
  <div class="courses-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý khóa học</h1>
        <p class="page-subtitle">Quản lý tất cả khóa học trong hệ thống</p>
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
          <BookOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng khóa học</p>
          <p class="stat-value">{{ formatNumber(stats.total) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-green">
        <div class="stat-icon">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đang hoạt động</p>
          <p class="stat-value">{{ formatNumber(stats.active) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-orange">
        <div class="stat-icon">
          <PauseCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tạm dừng</p>
          <p class="stat-value">{{ formatNumber(stats.inactive) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo tên, mã khóa học..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
        
        <a-select
          v-model:value="filterStatus"
          placeholder="Trạng thái"
          style="width: 150px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="">Tất cả</a-select-option>
          <a-select-option value="active">Hoạt động</a-select-option>
          <a-select-option value="inactive">Tạm dừng</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- Courses Table -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách khóa học</span>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="courses"
        :loading="loading"
        :pagination="paginationConfig"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
        row-key="_id"
      >
        <!-- Thumbnail Column -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'thumbnail'">
            <a-avatar 
              :src="record.thumbnail" 
              :size="60"
              shape="square"
              :style="{ backgroundColor: '#f0f0f0' }"
            >
              <template v-if="!record.thumbnail">
                <BookOutlined />
              </template>
            </a-avatar>
          </template>
          
          <!-- Title Column -->
          <template v-else-if="column.key === 'title'">
            <div class="course-info">
              <div class="course-title">{{ record.title || record.name || 'Chưa có tiêu đề' }}</div>
              <div class="course-code">{{ record.code || 'N/A' }}</div>
            </div>
          </template>
          
          <!-- Description Column -->
          <template v-else-if="column.key === 'description'">
            <div class="course-description">
              {{ record.shortDescription || record.description || 'Chưa có mô tả' }}
            </div>
          </template>
          
          <!-- Price Column -->
          <template v-else-if="column.key === 'price'">
            <div>
              <div class="price-current">{{ formatCurrency(record.price || 0) }}</div>
              <div v-if="record.originalPrice && record.originalPrice > record.price" class="price-original">
                {{ formatCurrency(record.originalPrice) }}
              </div>
            </div>
          </template>
          
          <!-- Status Column -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'success' : 'default'">
              {{ record.status === 'active' ? 'Hoạt động' : 'Tạm dừng' }}
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
                @click="viewCourse(record)"
              >
                <EyeOutlined /> Xem
              </a-button>
              <a-button 
                type="link" 
                size="small"
                @click="editCourse(record)"
              >
                <EditOutlined /> Sửa
              </a-button>
              <a-button 
                type="link" 
                size="small"
                :danger="record.status === 'active'"
                @click="toggleCourseStatus(record)"
              >
                <template v-if="record.status === 'active'">
                  <PauseCircleOutlined /> Tạm dừng
                </template>
                <template v-else>
                  <PlayCircleOutlined /> Kích hoạt
                </template>
              </a-button>
              <a-popconfirm
                title="Bạn có chắc muốn xóa khóa học này?"
                ok-text="Xóa"
                cancel-text="Hủy"
                ok-type="danger"
                @confirm="deleteCourse(record)"
              >
                <a-button type="link" size="small" danger>
                  <DeleteOutlined /> Xóa
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="800"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="Tên khóa học" name="title">
          <a-input v-model:value="formData.title" placeholder="Nhập tên khóa học" />
        </a-form-item>
        
        <a-form-item label="Mã khóa học" name="code">
          <a-input v-model:value="formData.code" placeholder="Nhập mã khóa học" />
        </a-form-item>
        
        <a-form-item label="Mô tả ngắn" name="shortDescription">
          <a-textarea 
            v-model:value="formData.shortDescription" 
            placeholder="Nhập mô tả ngắn"
            :rows="3"
          />
        </a-form-item>
        
        <a-form-item label="Mô tả chi tiết" name="description">
          <a-textarea 
            v-model:value="formData.description" 
            placeholder="Nhập mô tả chi tiết"
            :rows="5"
          />
        </a-form-item>
        
        <a-form-item label="Giá" name="price">
          <a-input-number 
            v-model:value="formData.price" 
            placeholder="Nhập giá"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
            style="width: 100%"
          />
        </a-form-item>
        
        <a-form-item label="Giá gốc" name="originalPrice">
          <a-input-number 
            v-model:value="formData.originalPrice" 
            placeholder="Nhập giá gốc (nếu có)"
            :min="0"
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value!.replace(/\$\s?|(,*)/g, '')"
            style="width: 100%"
          />
        </a-form-item>
        
        <a-form-item label="Thứ tự" name="order">
          <a-input-number 
            v-model:value="formData.order" 
            placeholder="Nhập thứ tự hiển thị"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>
        
        <a-form-item label="Trạng thái" name="status">
          <a-select v-model:value="formData.status" placeholder="Chọn trạng thái">
            <a-select-option value="active">Hoạt động</a-select-option>
            <a-select-option value="inactive">Tạm dừng</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="Ghi chú" name="notes">
          <a-textarea 
            v-model:value="formData.notes" 
            placeholder="Nhập ghi chú (nếu có)"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  PlusOutlined,
  ReloadOutlined,
  BookOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Course } from '~/types/api'
import { useCoursesApi } from '~/composables/api/useCoursesApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Quản lý khóa học - Vạn Phúc Care Admin'
})

const coursesApi = useCoursesApi()

// State
const loading = ref(false)
const courses = ref<Course[]>([])
const stats = reactive({
  total: 0,
  active: 0,
  inactive: 0,
})

// Search & Filter
const searchQuery = ref('')
const filterStatus = ref('')

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// Modal
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalTitle = computed(() => editingCourse.value ? 'Sửa khóa học' : 'Tạo khóa học mới')
const editingCourse = ref<Course | null>(null)
const formRef = ref()

const formData = reactive({
  title: '',
  code: '',
  shortDescription: '',
  description: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  order: 0,
  status: 'active' as 'active' | 'inactive',
  notes: '',
})

const formRules = {
  title: [{ required: true, message: 'Vui lòng nhập tên khóa học', trigger: 'blur' }],
  code: [{ required: true, message: 'Vui lòng nhập mã khóa học', trigger: 'blur' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }],
}

// Table columns
const columns = [
  {
    title: 'Ảnh',
    key: 'thumbnail',
    width: 80,
    fixed: 'left',
  },
  {
    title: 'Tên khóa học',
    key: 'title',
    width: 250,
    fixed: 'left',
  },
  {
    title: 'Mô tả',
    key: 'description',
    width: 300,
  },
  {
    title: 'Giá',
    key: 'price',
    width: 150,
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 120,
  },
  {
    title: 'Ngày tạo',
    key: 'createdAt',
    width: 150,
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 200,
    fixed: 'right',
  },
]

const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} khóa học`,
  pageSizeOptions: ['10', '20', '50', '100'],
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

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Fetch data
const fetchCourses = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.current,
      limit: pagination.pageSize,
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    
    const response = await coursesApi.getCourses(params)
    
    if (response.status && response.data) {
      // Structure: response.data.data.data.courses
      // Backend trả về: { message: "", data: { data: { courses: [], pagination: {} } } }
      const nestedData = response.data.data?.data || response.data.data || response.data
      
      // Đảm bảo courses là array
      const coursesArray = Array.isArray(nestedData?.courses) 
        ? nestedData.courses 
        : Array.isArray(nestedData) 
          ? nestedData 
          : []
      
      courses.value = coursesArray
      
      // Lấy pagination
      const paginationData = nestedData?.pagination || {}
      pagination.total = paginationData.total || coursesArray.length
      
      // Calculate stats - đảm bảo courses.value là array trước khi filter
      if (Array.isArray(courses.value)) {
        stats.total = pagination.total
        stats.active = courses.value.filter(c => c.status === 'active').length
        stats.inactive = courses.value.filter(c => c.status === 'inactive').length
      } else {
        // Fallback nếu không phải array
        stats.total = 0
        stats.active = 0
        stats.inactive = 0
        courses.value = []
      }
    } else {
      // Nếu response không hợp lệ, set về mảng rỗng
      courses.value = []
      pagination.total = 0
      stats.total = 0
      stats.active = 0
      stats.inactive = 0
    }
  } catch (error: any) {
    console.error('Failed to fetch courses:', error)
    message.error('Không thể tải danh sách khóa học')
    // Đảm bảo courses luôn là array khi có lỗi
    courses.value = []
    pagination.total = 0
    stats.total = 0
    stats.active = 0
    stats.inactive = 0
  } finally {
    loading.value = false
  }
}

// Handlers
const handleSearch = () => {
  pagination.current = 1
  fetchCourses()
}

const handleFilter = () => {
  pagination.current = 1
  fetchCourses()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchCourses()
}

const refreshData = () => {
  fetchCourses()
}

// Modal handlers
const showCreateModal = () => {
  editingCourse.value = null
  resetForm()
  modalVisible.value = true
}

const editCourse = (course: Course) => {
  editingCourse.value = course
  Object.assign(formData, {
    title: course.title || course.name || '',
    code: course.code || '',
    shortDescription: course.shortDescription || '',
    description: course.description || '',
    price: (course as any).price || 0,
    originalPrice: (course as any).originalPrice,
    order: course.order || 0,
    status: course.status || 'active',
    notes: course.notes || '',
  })
  modalVisible.value = true
}

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    code: '',
    shortDescription: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    order: 0,
    status: 'active',
    notes: '',
  })
  formRef.value?.resetFields()
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true
    
    const payload: any = {
      title: formData.title,
      code: formData.code,
      shortDescription: formData.shortDescription,
      description: formData.description,
      price: formData.price,
      order: formData.order,
      status: formData.status,
    }
    
    if (formData.originalPrice) {
      payload.originalPrice = formData.originalPrice
    }
    
    if (formData.notes) {
      payload.notes = formData.notes
    }
    
    if (editingCourse.value) {
      // Update
      const response = await coursesApi.updateCourse(editingCourse.value._id, payload)
      if (response.status) {
        message.success('Cập nhật khóa học thành công')
        modalVisible.value = false
        fetchCourses()
      }
    } else {
      // Create
      const response = await coursesApi.createCourse(payload)
      if (response.status) {
        message.success('Tạo khóa học thành công')
        modalVisible.value = false
        fetchCourses()
      }
    }
  } catch (error: any) {
    console.error('Modal error:', error)
    if (error.errorFields) {
      // Validation error
      return
    }
    message.error('Có lỗi xảy ra')
  } finally {
    modalLoading.value = false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  resetForm()
}

// Actions
const viewCourse = (course: Course) => {
  // TODO: Navigate to course detail page
  message.info(`Xem chi tiết khóa học: ${course.title || course.name}`)
}

const toggleCourseStatus = async (course: Course) => {
  try {
    const response = await coursesApi.toggleCourseStatus(course._id)
    if (response.status) {
      message.success('Thay đổi trạng thái thành công')
      fetchCourses()
    }
  } catch (error: any) {
    console.error('Toggle status error:', error)
    message.error('Không thể thay đổi trạng thái')
  }
}

const deleteCourse = async (course: Course) => {
  try {
    const response = await coursesApi.deleteCourse(course._id)
    if (response.status) {
      message.success('Xóa khóa học thành công')
      fetchCourses()
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    message.error('Không thể xóa khóa học')
  }
}

// Lifecycle
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-management-page {
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
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.stat-card-blue .stat-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.stat-card-green .stat-icon {
  background: #f6ffed;
  color: #52c41a;
}

.stat-card-orange .stat-icon {
  background: #fff7e6;
  color: #fa8c16;
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
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.course-title {
  font-weight: 600;
  color: #1a1a1a;
}

.course-code {
  font-size: 12px;
  color: #8c8c8c;
}

.course-description {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #595959;
}

.price-current {
  font-weight: 600;
  color: #1a1a1a;
}

.price-original {
  font-size: 12px;
  color: #8c8c8c;
  text-decoration: line-through;
}
</style>
