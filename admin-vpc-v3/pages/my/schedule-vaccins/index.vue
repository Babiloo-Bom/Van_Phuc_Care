<template>
  <div class="schedule-vaccins-management-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Lịch tiêm</h1>
        <p class="page-subtitle">Quản lý lịch tiêm chủng</p>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="handleCreate">
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
      </div>
    </div>

    <!-- Filters and Search -->
    <a-card class="filters-card" :bordered="false">
      <div class="filters-container">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Tìm kiếm theo tiêu đề, nội dung, thời gian..."
          style="width: 300px"
          allow-clear
          @search="handleSearch"
          @pressEnter="handleSearch"
        />
      </div>
    </a-card>

    <!-- Schedule Vaccins Table -->
    <a-card class="table-card" :bordered="false">
      <a-table
        :columns="columns"
        :data-source="scheduleVaccins"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
        class="desktop-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'thumbnail'">
            <a-image
              v-if="record.thumbnail"
              :src="record.thumbnail"
              :width="60"
              :height="60"
              :preview="false"
              style="object-fit: cover; border-radius: 4px;"
            />
            <span v-else class="text-gray-400">Không có ảnh</span>
          </template>
          <template v-else-if="column.key === 'title'">
            {{ record.title || (record as any).name || 'Không có tiêu đề' }}
          </template>
          <template v-else-if="column.key === 'age'">
            {{ record.age || (record as any).time || '' }}
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <EditOutlined /> Sửa
              </a-button>
              <a-popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                ok-text="Xóa"
                cancel-text="Hủy"
                @confirm="handleDelete(record._id)"
              >
                <a-button type="link" danger size="small">
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
          v-for="item in scheduleVaccins"
          :key="item._id"
          class="mobile-card"
          :bordered="false"
        >
          <div class="card-header">
            <div class="card-title-row">
              <h3 class="card-title">{{ item.title || 'Không có tiêu đề' }}</h3>
              <a-tag :color="getStatusColor(item.status)">
                {{ getStatusText(item.status) }}
              </a-tag>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-row" v-if="item.thumbnail">
              <span class="card-label">Ảnh:</span>
              <a-image
                :src="item.thumbnail"
                :width="80"
                :height="80"
                :preview="false"
                style="object-fit: cover; border-radius: 4px;"
              />
            </div>
            <div class="card-row" v-if="item.age || (item as any).time">
              <span class="card-label">Thời gian:</span>
              <span>{{ item.age || (item as any).time }}</span>
            </div>
            <div class="card-row" v-if="item.numberOfInjections">
              <span class="card-label">Số mũi tiêm:</span>
              <span>{{ item.numberOfInjections }}</span>
            </div>
            <div class="card-row" v-if="item.content">
              <span class="card-label">Nội dung:</span>
              <span class="card-content-text">{{ item.content }}</span>
            </div>
            <div class="card-row" v-if="item.detailLink">
              <span class="card-label">Link chi tiết:</span>
              <a :href="item.detailLink" target="_blank" class="text-blue-500">
                Xem chi tiết
              </a>
            </div>
            <div class="card-row" v-if="item.createdAt">
              <span class="card-label">Ngày tạo:</span>
              <span>{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>

          <div class="card-actions">
            <a-button type="link" size="small" @click="handleEdit(item)">
              <EditOutlined /> Sửa
            </a-button>
            <a-popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              ok-text="Xóa"
              cancel-text="Hủy"
              @confirm="handleDelete(item._id)"
            >
              <a-button type="link" danger size="small">
                <DeleteOutlined /> Xóa
              </a-button>
            </a-popconfirm>
          </div>
        </a-card>
      </div>
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
        :model="formData"
        :rules="formRules"
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="Tiêu đề" name="title">
          <a-input v-model:value="formData.title" placeholder="Nhập tiêu đề" />
        </a-form-item>

    <a-form-item label="Mô tả" name="description">
      <a-textarea
        v-model:value="formData.description"
        :rows="3"
        placeholder="Nhập mô tả ngắn cho lịch tiêm"
      />
    </a-form-item>

    <a-form-item label="Thời gian tiêm" name="age">
          <a-select v-model:value="formData.age" placeholder="Chọn thời gian tiêm">
            <a-select-option value="0 ngày">0 ngày</a-select-option>
            <a-select-option value="1 tháng">1 tháng</a-select-option>
            <a-select-option value="2 tháng">2 tháng</a-select-option>
            <a-select-option value="3 tháng">3 tháng</a-select-option>
            <a-select-option value="4 tháng">4 tháng</a-select-option>
            <a-select-option value="9 tháng">9 tháng</a-select-option>
            <a-select-option value="12 tháng">12 tháng</a-select-option>
            <a-select-option value="18 tháng">18 tháng</a-select-option>
          </a-select>
        </a-form-item>

    <a-form-item label="Ngày dự kiến tiêm" name="scheduledDate">
      <a-date-picker
        v-model:value="formData.scheduledDate"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 100%"
        placeholder="Chọn ngày dự kiến tiêm mũi này"
      />
    </a-form-item>

        <a-form-item label="Số mũi tiêm" name="numberOfInjections">
          <a-input v-model:value="formData.numberOfInjections" placeholder="Ví dụ: 1" />
        </a-form-item>

        <a-form-item label="Ảnh đại diện" name="thumbnail">
          <a-upload
            v-model:file-list="thumbnailFileList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeUpload"
            @change="handleThumbnailChange"
            @remove="handleRemoveThumbnail"
            accept="image/*"
          >
            <div v-if="thumbnailFileList.length < 1">
              <PlusOutlined />
              <div style="margin-top: 8px">Upload</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="Nội dung" name="content">
          <a-textarea
            v-model:value="formData.content"
            :rows="4"
            placeholder="Nhập nội dung mô tả"
          />
        </a-form-item>

        <a-form-item label="Trạng thái" name="status">
          <a-select v-model:value="formData.status" placeholder="Chọn trạng thái">
            <a-select-option value="active">Hoạt động</a-select-option>
            <a-select-option value="inactive">Không hoạt động</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Link chi tiết" name="detailLink">
          <a-input v-model:value="formData.detailLink" placeholder="URL bài viết chi tiết" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue'
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { useScheduleVaccinsApi, type ScheduleVaccin } from '~/composables/api/useScheduleVaccinsApi'
import { useUploadsApi } from '~/composables/api/useUploadsApi'
import dayjs from 'dayjs'

definePageMeta({
  middleware: ['auth', 'role'],
  requiredRole: ['admin', 'manager']
})

const scheduleVaccinsApi = useScheduleVaccinsApi()
const uploadsApi = useUploadsApi()

// State
const loading = ref(false)
const scheduleVaccins = ref<ScheduleVaccin[]>([])
const searchQuery = ref('')
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalTitle = computed(() => editingId.value ? 'Sửa Lịch tiêm' : 'Tạo mới Lịch tiêm')
const editingId = ref<string | null>(null)
const formRef = ref<FormInstance>()
const uploading = ref(false)
const thumbnailFileList = ref<UploadFile[]>([])

// Pagination
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `Tổng ${total} lịch tiêm`
})

// Form data
const formData = reactive({
  title: '',
  age: '',  // Đổi từ time sang age
  ageInMonths: 0,
  numberOfInjections: '',
  thumbnail: '',
  content: '',
  status: 'active',
  detailLink: '',
  description: '',  // Thêm mô tả ngắn
  scheduledDate: '' // Ngày dự kiến tiêm mũi đó (yyyy-MM-dd)
})

// Helper function to convert age string to ageInMonths (khớp với seed data format)
const ageToAgeInMonths = (age: string): number => {
  const ageMap: Record<string, number> = {
    '0 ngày': 0,
    '1 tháng': 1,
    '2 tháng': 2,
    '3 tháng': 3,
    '4 tháng': 4,
    '9 tháng': 9,
    '12 tháng': 12,
    '18 tháng': 18,
  }
  return ageMap[age] || 0
}

// Watch age changes to update ageInMonths
watch(() => formData.age, (newAge) => {
  if (newAge) {
    formData.ageInMonths = ageToAgeInMonths(newAge)
  }
})

// Form rules
const formRules = {
  title: [{ required: true, message: 'Vui lòng nhập tiêu đề', trigger: 'blur' }],
  age: [{ required: true, message: 'Vui lòng nhập thời gian', trigger: 'blur' }],
  description: [{ required: true, message: 'Vui lòng nhập mô tả', trigger: 'blur' }],
  scheduledDate: [{ required: false, message: 'Vui lòng chọn ngày dự kiến', trigger: 'change' }]
}

// Table columns
const columns = [
  {
    title: 'Ảnh',
    key: 'thumbnail',
    width: 100,
    fixed: 'left'
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
    width: 200
  },
  {
    title: 'Thời gian',
    dataIndex: 'age',  // Đổi từ time sang age
    key: 'age',
    width: 150
  },
  {
    title: 'Số mũi tiêm',
    dataIndex: 'numberOfInjections',
    key: 'numberOfInjections',
    width: 120
  },
  {
    title: 'Trạng thái',
    key: 'status',
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
    width: 150,
    fixed: 'right'
  }
]

// Methods
const fetchScheduleVaccins = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      searchKey: searchQuery.value || undefined
    }
    
    const response = await scheduleVaccinsApi.getScheduleVaccins(params)
    
    if (response.status) {
      // response.data có thể đã ở dạng PaginatedResponse, hoặc bọc thêm .data
      const responseData = (response as any).data?.data || (response as any).data || response
      const list = responseData.scheduleVaccin || []
      // Chuẩn hóa để tránh thiếu tiêu đề / thời gian / ảnh cho seed cũ
      scheduleVaccins.value = list.map((item: any) => ({
        ...item,
        title: item.title || item.name || '',
        age: item.age || item.time || '',
        thumbnail: item.thumbnail || ''
      }))
      pagination.total = responseData.pagination?.total || 0
    }
  } catch (error) {
    console.error('❌ Failed to fetch schedule vaccins:', error)
    message.error('Không thể tải danh sách lịch tiêm')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchScheduleVaccins()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchScheduleVaccins()
}

const refreshData = () => {
  fetchScheduleVaccins()
}

const handleCreate = () => {
  editingId.value = null
  Object.assign(formData, {
    title: '',
    age: '',
    ageInMonths: 0,
    numberOfInjections: '',
    thumbnail: '',
    content: '',
    status: 'active',
    detailLink: ''
  })
  thumbnailFileList.value = []
  modalVisible.value = true
}

const handleEdit = (record: ScheduleVaccin) => {
  editingId.value = record._id || null
  Object.assign(formData, {
    title: record.title || '',
    age: record.age || (record as any).time || '',  // Ưu tiên age, fallback time
    ageInMonths: (record as any).ageInMonths || ageToAgeInMonths(record.age || (record as any).time || ''),
    numberOfInjections: record.numberOfInjections || '',
    thumbnail: record.thumbnail || '',
    content: record.content || '',
    status: record.status || 'active',
    detailLink: record.detailLink || '',
    description: (record as any).description || '',
    scheduledDate: (record as any).scheduledDate || ''
  })
  
  // Set thumbnail file list for display
  if (record.thumbnail) {
    thumbnailFileList.value = [{
      uid: '-1',
      name: 'thumbnail',
      status: 'done',
      url: record.thumbnail
    }]
  } else {
    thumbnailFileList.value = []
  }
  
  modalVisible.value = true
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    
    // Wait for upload to complete if uploading
    if (uploading.value) {
      message.warning('Đang upload ảnh, vui lòng đợi...')
      return
    }
    
    // Ensure ageInMonths is set based on age
    if (formData.age && !formData.ageInMonths) {
      formData.ageInMonths = ageToAgeInMonths(formData.age)
    }
    
    modalLoading.value = true

    // Chuẩn hóa payload: thêm time và description cho backend/CRM cũ
    const payload = {
      ...formData,
      time: formData.age,
      description: formData.description,
      scheduledDate: formData.scheduledDate
    }

    if (editingId.value) {
      const response = await scheduleVaccinsApi.updateScheduleVaccin(editingId.value, payload)
      if (response.status) {
        message.success('Cập nhật lịch tiêm thành công')
        modalVisible.value = false
        fetchScheduleVaccins()
      }
    } else {
      const response = await scheduleVaccinsApi.createScheduleVaccin(payload)
      if (response.status) {
        message.success('Tạo lịch tiêm thành công')
        modalVisible.value = false
        fetchScheduleVaccins()
      }
    }
  } catch (error) {
    console.error('❌ Form validation or API error:', error)
  } finally {
    modalLoading.value = false
  }
}

const handleModalCancel = () => {
  modalVisible.value = false
  formRef.value?.resetFields()
  thumbnailFileList.value = []
  formData.thumbnail = ''
  formData.scheduledDate = ''
}

const handleDelete = async (id: string | undefined) => {
  if (!id) return
  
  try {
    const response = await scheduleVaccinsApi.deleteScheduleVaccin(id)
    if (response.status) {
      message.success('Xóa lịch tiêm thành công')
      fetchScheduleVaccins()
    }
  } catch (error) {
    console.error('❌ Failed to delete schedule vaccin:', error)
    message.error('Không thể xóa lịch tiêm')
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return '--'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const getStatusColor = (status: string | undefined) => {
  const colorMap: Record<string, string> = {
    active: 'green',
    inactive: 'red'
  }
  return colorMap[status || ''] || 'default'
}

const getStatusText = (status: string | undefined) => {
  const textMap: Record<string, string> = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động'
  }
  return textMap[status || ''] || status || '--'
}

// Upload handlers
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('Chỉ chấp nhận file ảnh!')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('Ảnh phải nhỏ hơn 5MB!')
    return false
  }
  return false // Prevent auto upload
}

const handleThumbnailChange = async (info: any) => {
  const { fileList } = info
  if (fileList.length > 0) {
    const file = fileList[0]
    if (file.originFileObj) {
      // New file selected, upload it
      uploading.value = true
      try {
        const response = await uploadsApi.uploadImage(file.originFileObj)
        
        console.log('🔍 Upload response (full):', JSON.stringify(response, null, 2))
        console.log('🔍 Upload response structure:', {
          hasData: !!response.data,
          hasDataData: !!response.data?.data,
          responseKeys: response.data ? Object.keys(response.data) : [],
          dataKeys: response.data?.data ? Object.keys(response.data.data) : []
        })
        
        // Parse response to get URL - try multiple structures
        const responseData = response.data as any
        
        // Try multiple response structures
        let imageUrl: string | undefined
        
        // Structure 1: response.data.data.fileAttributes[0].source
        if (responseData?.data?.fileAttributes?.[0]?.source) {
          imageUrl = responseData.data.fileAttributes[0].source
          console.log('✅ Found URL in response.data.data.fileAttributes[0].source')
        }
        // Structure 2: response.data.fileAttributes[0].source
        else if (responseData?.fileAttributes?.[0]?.source) {
          imageUrl = responseData.fileAttributes[0].source
          console.log('✅ Found URL in response.data.fileAttributes[0].source')
        }
        // Structure 3: response.data.data.files[0].url
        else if (responseData?.data?.files?.[0]?.url) {
          imageUrl = responseData.data.files[0].url
          console.log('✅ Found URL in response.data.data.files[0].url')
        }
        // Structure 4: response.data.files[0].url
        else if (responseData?.files?.[0]?.url) {
          imageUrl = responseData.files[0].url
          console.log('✅ Found URL in response.data.files[0].url')
        }
        // Structure 5: response.data.data.url
        else if (responseData?.data?.url) {
          imageUrl = responseData.data.url
          console.log('✅ Found URL in response.data.data.url')
        }
        // Structure 6: response.data.url
        else if (responseData?.url) {
          imageUrl = responseData.url
          console.log('✅ Found URL in response.data.url')
        }
        // Structure 7: response.data.data.urls[0]
        else if (responseData?.data?.urls?.[0]) {
          imageUrl = responseData.data.urls[0]
          console.log('✅ Found URL in response.data.data.urls[0]')
        }
        // Structure 8: response.data.urls[0]
        else if (responseData?.urls?.[0]) {
          imageUrl = responseData.urls[0]
          console.log('✅ Found URL in response.data.urls[0]')
        }
        
        console.log('🔍 Extracted image URL:', imageUrl)
        
        if (imageUrl) {
          formData.thumbnail = imageUrl
          
          // Update thumbnailFileList to show the uploaded image
          thumbnailFileList.value = [{
            uid: file.uid || '-1',
            name: file.name || 'thumbnail',
            status: 'done',
            url: imageUrl
          }]
          
          message.success('Upload ảnh thành công')
        } else {
          console.error('❌ No URL found in response. Full response:', response)
          throw new Error('Không thể lấy URL ảnh từ response. Vui lòng thử lại.')
        }
      } catch (error: any) {
        console.error('❌ Upload error:', error)
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response,
          data: error.data
        })
        message.error(error.message || 'Upload ảnh thất bại')
        thumbnailFileList.value = []
        formData.thumbnail = ''
      } finally {
        uploading.value = false
      }
    } else if (file.url) {
      // Existing file (when editing)
      formData.thumbnail = file.url
    }
  } else {
    formData.thumbnail = ''
    thumbnailFileList.value = []
  }
}

const handleRemoveThumbnail = () => {
  formData.thumbnail = ''
  thumbnailFileList.value = []
  formRef.value?.clearValidate('thumbnail')
}

// Lifecycle
onMounted(() => {
  fetchScheduleVaccins()
})
</script>

<style scoped>
.schedule-vaccins-management-page .page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.schedule-vaccins-management-page .page-header .page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.schedule-vaccins-management-page .page-header .page-subtitle {
  color: #666;
  margin: 4px 0 0 0;
}

.schedule-vaccins-management-page .page-header .header-actions {
  display: flex;
  gap: 12px;
}

.schedule-vaccins-management-page .filters-card {
  margin-bottom: 24px;
}

.schedule-vaccins-management-page .filters-card .filters-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.schedule-vaccins-management-page .table-card .desktop-table {
  display: block;
}

.schedule-vaccins-management-page .table-card .mobile-cards {
  display: none;
}

.schedule-vaccins-management-page .table-card .mobile-card {
  margin-bottom: 16px;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-header {
  margin-bottom: 12px;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-header .card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-header .card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-content .card-row {
  display: flex;
  margin-bottom: 8px;
  gap: 8px;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-content .card-label {
  font-weight: 500;
  min-width: 100px;
  color: #666;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-content .card-content-text {
  flex: 1;
  word-break: break-word;
}

.schedule-vaccins-management-page .table-card .mobile-card .card-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .schedule-vaccins-management-page .table-card .desktop-table {
    display: none;
  }

  .schedule-vaccins-management-page .table-card .mobile-cards {
    display: block;
  }

  .schedule-vaccins-management-page .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .schedule-vaccins-management-page .page-header .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .schedule-vaccins-management-page .page-header .header-actions :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
