<template>
  <div class="coupons-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý mã giảm giá</h1>
        <p class="page-subtitle">Tạo và quản lý các mã giảm giá cho khách hàng</p>
      </div>
      <div class="header-actions">
        <a-space>
          <a-button type="primary" @click="showCreateModal">
            <template #icon>
              <PlusOutlined />
            </template>
            Tạo mã mới
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
          <TagOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Tổng mã giảm giá</p>
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
          <ClockCircleOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đã hết hạn</p>
          <p class="stat-value">{{ formatNumber(stats.expired) }}</p>
        </div>
      </div>
      
      <div class="stat-card stat-card-purple">
        <div class="stat-icon">
          <ShoppingCartOutlined />
        </div>
        <div class="stat-content">
          <p class="stat-label">Đã sử dụng</p>
          <p class="stat-value">{{ formatNumber(stats.used) }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo mã, tên..."
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
          <a-select-option value="all">Tất cả</a-select-option>
          <a-select-option value="active">Đang hoạt động</a-select-option>
          <a-select-option value="expired">Đã hết hạn</a-select-option>
          <a-select-option value="inactive">Không hoạt động</a-select-option>
        </a-select>
      </div>
    </a-card>

    <!-- Coupons Table -->
    <a-card class="table-card" :bordered="false">
      <template #title>
        <span>Danh sách mã giảm giá</span>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="coupons"
        :loading="loading"
        :pagination="paginationConfig"
        :scroll="{ x: 1400 }"
        @change="handleTableChange"
        row-key="_id"
      >
        <template #bodyCell="{ column, record }">
          <!-- Code Column -->
          <template v-if="column.key === 'code'">
            <div class="code-cell">
              <a-tag color="blue" class="coupon-code-tag">
                {{ record.code }}
              </a-tag>
            </div>
          </template>
          
          <!-- Name Column -->
          <template v-else-if="column.key === 'name'">
            <div class="name-cell">
              <div class="coupon-name">{{ record.name }}</div>
              <div class="coupon-description" v-if="record.description">
                {{ record.description }}
              </div>
            </div>
          </template>
          
          <!-- Type & Value Column -->
          <template v-else-if="column.key === 'discount'">
            <div>
              <a-tag :color="record.type === 'percentage' ? 'green' : 'orange'">
                {{ record.type === 'percentage' ? `${record.value}%` : `${formatCurrency(record.value)}` }}
              </a-tag>
              <div v-if="record.minOrderAmount" class="coupon-min-order">
                Tối thiểu: {{ formatCurrency(record.minOrderAmount) }}
              </div>
              <div v-if="record.maxDiscountAmount && record.type === 'percentage'" class="coupon-max-discount">
                Tối đa: {{ formatCurrency(record.maxDiscountAmount) }}
              </div>
            </div>
          </template>
          
          <!-- Usage Column -->
          <template v-else-if="column.key === 'usage'">
            <div>
              <span class="usage-text">
                {{ record.usedCount || 0 }} / {{ record.usageLimit ? record.usageLimit : '∞' }}
              </span>
              <a-progress 
                v-if="record.usageLimit"
                :percent="Math.round(((record.usedCount || 0) / record.usageLimit) * 100)"
                :stroke-color="getUsageColor(record)"
                :show-info="false"
                size="small"
                style="margin-top: 4px"
              />
            </div>
          </template>
          
          <!-- Validity Column -->
          <template v-else-if="column.key === 'validity'">
            <div>
              <div class="validity-date">
                <CalendarOutlined style="margin-right: 4px" />
                Từ: {{ formatDate(record.validFrom) }}
              </div>
              <div class="validity-date">
                <CalendarOutlined style="margin-right: 4px" />
                Đến: {{ formatDate(record.validTo) }}
              </div>
            </div>
          </template>
          
          <!-- Status Column -->
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record)">
              {{ getStatusText(record) }}
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
                @click="viewCoupon(record)"
              >
                <EyeOutlined /> Xem
              </a-button>
              <a-button 
                type="link" 
                size="small"
                @click="editCoupon(record)"
              >
                <EditOutlined /> Sửa
              </a-button>
              <a-popconfirm
                title="Bạn có chắc muốn xóa mã giảm giá này?"
                ok-text="Xóa"
                cancel-text="Hủy"
                ok-type="danger"
                @confirm="deleteCoupon(record)"
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

    <!-- Create/Edit Coupon Modal -->
    <a-modal
      v-model:open="showCouponModal"
      :title="isEditMode ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'"
      width="800px"
      :confirm-loading="saving"
      @ok="handleSaveCoupon"
      @cancel="handleCancel"
    >
      <a-form
        :model="couponForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        layout="horizontal"
        :rules="formRules"
        ref="couponFormRef"
      >
        <a-form-item label="Mã giảm giá" name="code" required>
          <a-input 
            v-model:value="couponForm.code" 
            placeholder="VD: WELCOME10"
            :disabled="isEditMode"
            style="text-transform: uppercase"
            @input="couponForm.code = couponForm.code.toUpperCase()"
          />
          <div class="form-help-text">
            Mã sẽ được tự động chuyển thành chữ in hoa
          </div>
        </a-form-item>
        
        <a-form-item label="Tên mã" name="name" required>
          <a-input v-model:value="couponForm.name" placeholder="VD: Chào mừng khách hàng mới" />
        </a-form-item>
        
        <a-form-item label="Mô tả" name="description">
          <a-textarea 
            v-model:value="couponForm.description" 
            placeholder="Mô tả về mã giảm giá"
            :rows="3"
          />
        </a-form-item>
        
        <a-form-item label="Loại giảm giá" name="type" required>
          <a-radio-group v-model:value="couponForm.type">
            <a-radio value="percentage">Phần trăm (%)</a-radio>
            <a-radio value="fixed">Số tiền cố định (VND)</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="Giá trị" name="value" required>
          <a-input-number
            v-model:value="couponForm.value"
            :min="0"
            :max="couponForm.type === 'percentage' ? 100 : undefined"
            :precision="couponForm.type === 'percentage' ? 0 : 0"
            style="width: 100%"
            :placeholder="couponForm.type === 'percentage' ? 'VD: 10 (tức 10%)' : 'VD: 50000 (tức 50,000 VND)'"
          />
        </a-form-item>
        
        <a-form-item label="Đơn hàng tối thiểu" name="minOrderAmount">
          <a-input-number
            v-model:value="couponForm.minOrderAmount"
            :min="0"
            :precision="0"
            style="width: 100%"
            placeholder="0 = Không giới hạn"
          />
          <div class="form-help-text">
            Đơn hàng phải đạt mức tối thiểu này mới được áp dụng mã
          </div>
        </a-form-item>
        
        <a-form-item 
          v-if="couponForm.type === 'percentage'"
          label="Giảm tối đa" 
          name="maxDiscountAmount"
        >
          <a-input-number
            v-model:value="couponForm.maxDiscountAmount"
            :min="0"
            :precision="0"
            style="width: 100%"
            placeholder="0 = Không giới hạn"
          />
          <div class="form-help-text">
            Số tiền giảm tối đa (chỉ áp dụng cho giảm theo phần trăm)
          </div>
        </a-form-item>
        
        <a-form-item label="Giới hạn sử dụng" name="usageLimit">
          <a-input-number
            v-model:value="couponForm.usageLimit"
            :min="1"
            :precision="0"
            style="width: 100%"
            placeholder="Để trống = Không giới hạn"
          />
          <div class="form-help-text">
            Số lần mã có thể được sử dụng. Để trống nếu không giới hạn
          </div>
        </a-form-item>
        
        <a-form-item label="Ngày bắt đầu" name="validFrom" required>
          <a-date-picker
            v-model:value="couponForm.validFrom"
            show-time
            format="DD/MM/YYYY HH:mm"
            style="width: 100%"
            placeholder="Chọn ngày bắt đầu"
          />
        </a-form-item>
        
        <a-form-item label="Ngày kết thúc" name="validTo" required>
          <a-date-picker
            v-model:value="couponForm.validTo"
            show-time
            format="DD/MM/YYYY HH:mm"
            style="width: 100%"
            placeholder="Chọn ngày kết thúc"
          />
        </a-form-item>
        
        <a-form-item label="Áp dụng cho khóa học" name="applicableCourses">
          <a-select
            v-model:value="couponForm.applicableCourses"
            mode="multiple"
            placeholder="Chọn khóa học (để trống = áp dụng cho tất cả)"
            :loading="loadingCourses"
            style="width: 100%"
            :filter-option="filterCourseOption"
            show-search
          >
            <a-select-option 
              v-for="course in courses" 
              :key="course._id" 
              :value="course._id"
            >
              {{ course.name || course.title }}
            </a-select-option>
          </a-select>
          <div class="form-help-text">
            Chọn các khóa học cụ thể. Để trống nếu áp dụng cho tất cả khóa học
          </div>
        </a-form-item>
        
        <a-form-item label="Trạng thái" name="isActive">
          <a-switch
            v-model:checked="couponForm.isActive"
            checked-children="Hoạt động"
            un-checked-children="Không hoạt động"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- View Coupon Modal -->
    <a-modal
      v-model:open="showViewModal"
      title="Chi tiết mã giảm giá"
      width="700px"
      :footer="null"
    >
      <a-descriptions v-if="selectedCoupon" :column="1" bordered>
        <a-descriptions-item label="Mã giảm giá">
          <a-tag color="blue" style="font-size: 16px; font-weight: 600">
            {{ selectedCoupon.code }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Tên mã">
          {{ selectedCoupon.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Mô tả">
          {{ selectedCoupon.description || 'Không có mô tả' }}
        </a-descriptions-item>
        <a-descriptions-item label="Loại giảm giá">
          <a-tag :color="selectedCoupon.type === 'percentage' ? 'green' : 'orange'">
            {{ selectedCoupon.type === 'percentage' ? 'Phần trăm' : 'Số tiền cố định' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Giá trị">
          {{ selectedCoupon.type === 'percentage' ? `${selectedCoupon.value}%` : formatCurrency(selectedCoupon.value) }}
        </a-descriptions-item>
        <a-descriptions-item label="Đơn hàng tối thiểu">
          {{ selectedCoupon.minOrderAmount ? formatCurrency(selectedCoupon.minOrderAmount) : 'Không giới hạn' }}
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedCoupon.type === 'percentage'" label="Giảm tối đa">
          {{ selectedCoupon.maxDiscountAmount ? formatCurrency(selectedCoupon.maxDiscountAmount) : 'Không giới hạn' }}
        </a-descriptions-item>
        <a-descriptions-item label="Giới hạn sử dụng">
          {{ selectedCoupon.usageLimit ? `${selectedCoupon.usedCount || 0} / ${selectedCoupon.usageLimit}` : 'Không giới hạn' }}
        </a-descriptions-item>
        <a-descriptions-item label="Ngày bắt đầu">
          {{ formatDate(selectedCoupon.validFrom) }}
        </a-descriptions-item>
        <a-descriptions-item label="Ngày kết thúc">
          {{ formatDate(selectedCoupon.validTo) }}
        </a-descriptions-item>
        <a-descriptions-item label="Trạng thái">
          <a-tag :color="getStatusColor(selectedCoupon)">
            {{ getStatusText(selectedCoupon) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="Ngày tạo">
          {{ formatDate(selectedCoupon.createdAt) }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  TagOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useCouponsApi } from '~/composables/api/useCouponsApi'
import { useCoursesApi } from '~/composables/api/useCoursesApi'
import dayjs, { type Dayjs } from 'dayjs'

definePageMeta({
  layout: 'default',
  middleware: ['auth', 'role'],
  requiredRole: ['admin', 'manager']
})

useHead({
  title: 'Quản lý mã giảm giá - Vạn Phúc Care Admin'
})

const couponsApi = useCouponsApi()
const coursesApi = useCoursesApi()

// ===== STATE =====
const loading = ref(false)
const loadingCourses = ref(false)
const coupons = ref<any[]>([])
const courses = ref<any[]>([])
const stats = ref({
  total: 0,
  active: 0,
  expired: 0,
  used: 0
})

const searchQuery = ref('')
const filterStatus = ref('all')

const paginationConfig = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} mã giảm giá`,
  pageSizeOptions: ['10', '20', '50', '100']
})

const showCouponModal = ref(false)
const showViewModal = ref(false)
const selectedCoupon = ref<any>(null)
const isEditMode = ref(false)
const saving = ref(false)
const couponFormRef = ref<any>(null)

const couponForm = ref({
  code: '',
  name: '',
  description: '',
  type: 'percentage' as 'percentage' | 'fixed',
  value: 0,
  minOrderAmount: 0,
  maxDiscountAmount: null as number | null,
  usageLimit: null as number | null,
  validFrom: null as Dayjs | null,
  validTo: null as Dayjs | null,
  applicableCourses: [] as string[],
  isActive: true
})

// Form validation rules
const formRules = {
  code: [
    { required: true, message: 'Vui lòng nhập mã giảm giá', trigger: 'blur' },
    { min: 3, message: 'Mã giảm giá phải có ít nhất 3 ký tự', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Vui lòng nhập tên mã giảm giá', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Vui lòng chọn loại giảm giá', trigger: 'change' }
  ],
  value: [
    { required: true, message: 'Vui lòng nhập giá trị', trigger: 'blur' },
    { 
      validator: (_rule: any, value: number) => {
        if (couponForm.value.type === 'percentage' && (value < 0 || value > 100)) {
          return Promise.reject('Phần trăm phải từ 0 đến 100')
        }
        if (couponForm.value.type === 'fixed' && value < 0) {
          return Promise.reject('Số tiền phải lớn hơn 0')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ],
  validFrom: [
    { required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'change' }
  ],
  validTo: [
    { required: true, message: 'Vui lòng chọn ngày kết thúc', trigger: 'change' },
    {
      validator: (_rule: any, value: Dayjs) => {
        if (couponForm.value.validFrom && value && value.isBefore(couponForm.value.validFrom)) {
          return Promise.reject('Ngày kết thúc phải sau ngày bắt đầu')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

// ===== TABLE COLUMNS =====
const columns = [
  {
    title: 'Mã',
    key: 'code',
    width: 180,
    fixed: 'left',
    align: 'center'
  },
  {
    title: 'Tên mã',
    key: 'name',
    width: 300
  },
  {
    title: 'Giảm giá',
    key: 'discount',
    width: 200
  },
  {
    title: 'Sử dụng',
    key: 'usage',
    width: 150
  },
  {
    title: 'Thời hạn',
    key: 'validity',
    width: 250
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 120
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
const loadCoupons = async () => {
  try {
    loading.value = true
    
    const params: any = {
      page: paginationConfig.value.current,
      limit: paginationConfig.value.pageSize
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (filterStatus.value && filterStatus.value !== 'all') {
      params.status = filterStatus.value
    }
    
    const response = await couponsApi.getCoupons(params)
    
    if (response.status && response.data) {
      const responseData = response.data.data || response.data
      
      coupons.value = responseData.coupons || []
      
      if (responseData.pagination) {
        paginationConfig.value.total = responseData.pagination.total || 0
        paginationConfig.value.current = responseData.pagination.page || paginationConfig.value.current
      }
      
      // Calculate stats
      calculateStats()
    }
  } catch (error: any) {
    console.error('❌ Load coupons failed:', error)
    message.error('Không thể tải danh sách mã giảm giá')
    coupons.value = []
  } finally {
    loading.value = false
  }
}

const loadCourses = async () => {
  try {
    loadingCourses.value = true
    const response = await coursesApi.getCourses({ limit: 1000 })
    
    if (response.status && response.data) {
      const responseData = response.data.data || response.data
      courses.value = responseData.courses || responseData.data || []
    }
  } catch (error: any) {
    console.error('❌ Load courses failed:', error)
  } finally {
    loadingCourses.value = false
  }
}

const calculateStats = () => {
  const now = new Date()
  stats.value = {
    total: coupons.value.length,
    active: coupons.value.filter(c => {
      return c.isActive && 
             new Date(c.validFrom) <= now && 
             new Date(c.validTo) >= now
    }).length,
    expired: coupons.value.filter(c => new Date(c.validTo) < now).length,
    used: coupons.value.reduce((sum, c) => sum + (c.usedCount || 0), 0)
  }
}

const handleSearch = () => {
  paginationConfig.value.current = 1
  loadCoupons()
}

const handleFilter = () => {
  paginationConfig.value.current = 1
  loadCoupons()
}

const handleTableChange = (pag: any) => {
  paginationConfig.value.current = pag.current
  paginationConfig.value.pageSize = pag.pageSize
  loadCoupons()
}

const refreshData = () => {
  loadCoupons()
}

const showCreateModal = () => {
  isEditMode.value = false
  selectedCoupon.value = null
  couponForm.value = {
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    usageLimit: null,
    validFrom: null,
    validTo: null,
    applicableCourses: [],
    isActive: true
  }
  showCouponModal.value = true
}

const viewCoupon = (coupon: any) => {
  selectedCoupon.value = coupon
  showViewModal.value = true
}

const editCoupon = (coupon: any) => {
  isEditMode.value = true
  selectedCoupon.value = coupon
  couponForm.value = {
    code: coupon.code,
    name: coupon.name,
    description: coupon.description || '',
    type: coupon.type,
    value: coupon.value,
    minOrderAmount: coupon.minOrderAmount || 0,
    maxDiscountAmount: coupon.maxDiscountAmount || null,
    usageLimit: coupon.usageLimit || null,
    validFrom: coupon.validFrom ? dayjs(coupon.validFrom) : null,
    validTo: coupon.validTo ? dayjs(coupon.validTo) : null,
    applicableCourses: coupon.applicableCourses?.map((c: any) => typeof c === 'string' ? c : c._id || c) || [],
    isActive: coupon.isActive !== undefined ? coupon.isActive : true
  }
  showCouponModal.value = true
}

const handleSaveCoupon = async () => {
  try {
    await couponFormRef.value?.validate()
    
    saving.value = true
    
    const authStore = useAuthStore()
    const createdBy = authStore.user?.username || authStore.user?.email || 'admin'
    
    const data: any = {
      code: couponForm.value.code.toUpperCase(),
      name: couponForm.value.name,
      description: couponForm.value.description,
      type: couponForm.value.type,
      value: couponForm.value.value,
      minOrderAmount: couponForm.value.minOrderAmount || 0,
      maxDiscountAmount: couponForm.value.maxDiscountAmount || null,
      usageLimit: couponForm.value.usageLimit || null,
      validFrom: couponForm.value.validFrom?.toDate() || new Date(),
      validTo: couponForm.value.validTo?.toDate() || new Date(),
      applicableCourses: couponForm.value.applicableCourses,
      isActive: couponForm.value.isActive,
      createdBy
    }
    
    let response
    if (isEditMode.value && selectedCoupon.value) {
      response = await couponsApi.updateCoupon(selectedCoupon.value._id, data)
    } else {
      response = await couponsApi.createCoupon(data)
    }
    
    if (response.status && response.data) {
      message.success(isEditMode.value ? 'Cập nhật mã giảm giá thành công' : 'Tạo mã giảm giá thành công')
      showCouponModal.value = false
      couponFormRef.value?.resetFields()
      await loadCoupons()
    } else {
      throw new Error(response.message || 'Failed to save coupon')
    }
  } catch (error: any) {
    console.error('❌ Save coupon failed:', error)
    if (error.errorFields) {
      return
    }
    message.error(error.message || 'Không thể lưu mã giảm giá')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  couponFormRef.value?.resetFields()
}

const deleteCoupon = async (coupon: any) => {
  try {
    loading.value = true
    const response = await couponsApi.deleteCoupon(coupon._id)
    
    if (response.status) {
      message.success('Đã xóa mã giảm giá thành công')
      await loadCoupons()
    } else {
      throw new Error(response.message || 'Failed to delete coupon')
    }
  } catch (error: any) {
    console.error('❌ Delete coupon failed:', error)
    message.error('Không thể xóa mã giảm giá')
  } finally {
    loading.value = false
  }
}

const filterCourseOption = (input: string, option: any) => {
  const course = courses.value.find(c => c._id === option.value)
  if (!course) return false
  const name = (course.name || course.title || '').toLowerCase()
  return name.includes(input.toLowerCase())
}

// ===== HELPER FUNCTIONS =====
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const getStatusColor = (coupon: any) => {
  const now = new Date()
  if (!coupon.isActive) return 'default'
  if (new Date(coupon.validTo) < now) return 'error'
  if (new Date(coupon.validFrom) > now) return 'warning'
  if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return 'error'
  return 'success'
}

const getStatusText = (coupon: any) => {
  const now = new Date()
  if (!coupon.isActive) return 'Không hoạt động'
  if (new Date(coupon.validTo) < now) return 'Đã hết hạn'
  if (new Date(coupon.validFrom) > now) return 'Chưa bắt đầu'
  if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return 'Hết lượt'
  return 'Đang hoạt động'
}

const getUsageColor = (coupon: any) => {
  if (!coupon.usageLimit) return '#52c41a'
  const percent = ((coupon.usedCount || 0) / coupon.usageLimit) * 100
  if (percent >= 90) return '#f5222d'
  if (percent >= 70) return '#faad14'
  return '#52c41a'
}

// ===== LIFECYCLE =====
onMounted(() => {
  loadCoupons()
  loadCourses()
})
</script>

<style scoped>
.coupons-management-page {
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

.code-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.coupon-code-tag {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coupon-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.4;
}

.coupon-description {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

.coupon-min-order,
.coupon-max-discount {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.usage-text {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.validity-date {
  font-size: 13px;
  color: #595959;
  margin-bottom: 4px;
}

.form-help-text {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
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
}
</style>

