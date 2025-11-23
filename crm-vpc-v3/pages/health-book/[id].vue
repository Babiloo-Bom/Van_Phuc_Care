<template>
  <div class="health-book-page min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <a-spin size="large" tip="Đang tải dữ liệu sổ sức khỏe..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen px-4">
      <a-result
        status="error"
        title="Không thể tải dữ liệu"
        :sub-title="error"
      >
        <template #extra>
          <a-button type="primary" @click="navigateTo('/customers')">
            Quay lại danh sách khách hàng
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-6">
      <!-- Page Title (Mobile only) -->
      <div class="lg:hidden mb-4">
        <h1 class="text-xl font-bold text-blue-600 text-center">
          Sổ sức khỏe điện tử
        </h1>
      </div>

      <!-- Profile Header Section - Always visible -->
      <div class="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
        <!-- Mobile Layout -->
        <div class="lg:hidden">
          <!-- Date Picker (Mobile - Top) -->
          <div class="flex justify-center mb-4">
            <a-date-picker
              v-model:value="selectedDate"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              @change="handleDateChange"
              class="w-full max-w-xs"
              size="large"
            />
          </div>

          <!-- Profile Info (Mobile) -->
          <div class="flex flex-col items-center">
            <!-- Avatar -->
            <div class="relative mb-3">
              <img
                v-if="userAvatar"
                :src="userAvatar"
                :alt="userName"
                class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
              <div
                v-else
                class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200"
              >
                <UserOutlined class="text-4xl text-blue-500" />
              </div>
              <CameraOutlined class="absolute bottom-0 right-0 bg-white rounded-full p-1 text-gray-500 text-sm shadow" />
            </div>

            <!-- Name -->
            <h2 class="text-2xl font-bold text-blue-600 mb-1 text-center">
              {{ userName }}
            </h2>

            <!-- Date of Birth & Age -->
            <div v-if="userDob" class="text-gray-600 text-sm mb-3">
              <span>Ngày sinh: {{ formatDate(userDob) }}</span>
              <span class="mx-2">—</span>
              <span>{{ calculateAge(userDob) }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden lg:flex items-center justify-between">
          <!-- Left: Profile Info -->
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="relative">
              <img
                v-if="userAvatar"
                :src="userAvatar"
                :alt="userName"
                class="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              />
              <div
                v-else
                class="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200"
              >
                <UserOutlined class="text-5xl text-blue-500" />
              </div>
              <CameraOutlined class="absolute bottom-1 right-1 bg-white rounded-full p-2 text-gray-500 shadow cursor-pointer hover:bg-gray-50" />
            </div>

            <!-- Info -->
            <div>
              <h2 class="text-3xl font-bold text-blue-600 mb-2">
                {{ userName }}
              </h2>
              <div v-if="userDob" class="text-gray-600 flex items-center gap-2">
                <span>Ngày sinh: {{ formatDate(userDob) }}</span>
                <span>—</span>
                <span>{{ calculateAge(userDob) }}</span>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-3">
            <!-- Date Picker -->
            <a-date-picker
              v-model:value="selectedDate"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              @change="handleDateChange"
              class="w-48"
              size="large"
            >
              <template #suffixIcon>
                <CalendarOutlined class="text-blue-500" />
              </template>
            </a-date-picker>

            <!-- Create Button -->
            <a-button
              type="primary"
              @click="showCreateModal = true"
              size="large"
            >
              <template #icon>
                <EditOutlined />
              </template>
              Tạo bản ghi
            </a-button>
          </div>
        </div>
      </div>

      <!-- Tabs - Always visible -->
      <div class="mb-6">
        <a-tabs v-model:activeKey="activeTab" class="health-book-tabs">
          <a-tab-pane key="overview" tab="Tổng quan">
            <!-- DEBUG: Check if this renders -->
            <div v-if="healthBook" class="p-4 mb-4 bg-green-100 border border-green-500">
              <h3 class="font-bold">DEBUG: Health Book Data Found!</h3>
              <p>ID: {{ healthBook._id }}</p>
              <p>Weight: {{ healthBook.weight }}</p>
              <p>Height: {{ healthBook.height }}</p>
            </div>
            
            <!-- Overview Content -->
            <div v-if="healthBook" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Column: Health Metrics -->
              <div class="lg:col-span-4 space-y-6">
                <!-- Health Metrics Card -->
                <HealthMetricsCard :health-book="healthBook" />

                <!-- Health Conditions -->
                <HealthConditionsCard :health-book="healthBook" />
              </div>

              <!-- Right Column: Charts + Additional Info -->
              <div class="lg:col-span-8 space-y-6">
                <!-- Digestive Health -->
                <DigestiveHealthCard :health-book="healthBook" />

                <!-- Temperature Chart -->
                <TemperatureChartCard :health-book="healthBook" />

                <!-- Health Status & Vaccination -->
                <HealthStatusCard :health-book="healthBook" />

                <!-- Exercise & Method -->
                <ExerciseMethodCard :health-book="healthBook" />
              </div>
            </div>

            <!-- Empty State when no health book data in Overview tab -->
            <div v-else class="flex flex-col items-center justify-center min-h-[50vh] px-4">
              <a-empty description="Không có dữ liệu sổ sức khỏe cho ngày này">
                <a-button type="primary" size="large" @click="showCreateModal = true">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  Tạo bản ghi
                </a-button>
              </a-empty>
            </div>
          </a-tab-pane>

          <!-- Vaccination Schedule Tab -->
          <a-tab-pane key="vaccination" tab="Lịch tiêm">
            <VaccinationSchedule :customer-id="customerId" />
          </a-tab-pane>

          <!-- Support Request Tab -->
          <a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
            <SupportRequestList :customer-id="customerId" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- Create Health Record Modal -->
    <CreateHealthRecordModal
      v-model:visible="showCreateModal"
      :customer-id="customerId"
      :selected-date="selectedDate"
      @success="handleRecordCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, CalendarOutlined, CameraOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import type { HealthBook } from '~/types/api'
import { useHealthRecordsApi } from '~/composables/api/useHealthRecordsApi'
import { useHealthBooksApi } from '~/composables/api/useHealthBooksApi'
import { useAuthStore } from '~/stores/auth'
import CreateHealthRecordModal from '~/components/health-book/CreateHealthRecordModal.vue'
import HealthMetricsCard from '~/components/health-book/HealthMetricsCard.vue'
import HealthConditionsCard from '~/components/health-book/HealthConditionsCard.vue'
import DigestiveHealthCard from '~/components/health-book/DigestiveHealthCard.vue'
import TemperatureChartCard from '~/components/health-book/TemperatureChartCard.vue'
import HealthStatusCard from '~/components/health-book/HealthStatusCard.vue'
import ExerciseMethodCard from '~/components/health-book/ExerciseMethodCard.vue'
import VaccinationSchedule from '~/components/health-book/VaccinationSchedule.vue'
import SupportRequestList from '~/components/health-book/SupportRequestList.vue'

// Define page meta
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Get route params
const route = useRoute()
const authStore = useAuthStore()

// Get healthBookId from route, default to 'me' since 1 user = 1 healthbook
const healthBookId = computed(() => (route.params.id as string) || 'me')

// Get customerId from healthBook (needed for child components)
const customerId = computed(() => healthBook.value?.customerId || '')

// API composables
const { getHealthRecordByDate, getHealthRecords } = useHealthRecordsApi()
const { getHealthBook, getHealthBooks } = useHealthBooksApi()

// State
const healthBook = ref<HealthBook | null>(null)
const loading = ref(true)
const error = ref('')
const selectedDate = ref<Dayjs>(dayjs())
const activeTab = ref('overview')
const showCreateModal = ref(false)
const profileInfo = ref<{ name?: string; dob?: string; gender?: string; avatar?: string }>({})

// Baby profile info - from health book
const userName = computed(() => {
  // Prioritize: profile info -> health book -> user name
  return profileInfo.value?.name || healthBook.value?.name || authStore.user?.fullname || authStore.user?.name || 'Chưa cập nhật'
})
const userAvatar = computed(() => {
  // Get avatar from profile info or user
  return profileInfo.value?.avatar || authStore.user?.avatar || ''
})
const userDob = computed(() => {
  // Get dob from profile info or health book
  return profileInfo.value?.dob || healthBook.value?.dob || ''
})
const userGender = computed(() => profileInfo.value?.gender || healthBook.value?.gender || 'male')

// Fetch profile info from health book
const fetchProfileInfo = async () => {
  try {
    // Use 'me' endpoint for current user's healthbook
    const bookId = healthBookId.value
    
    const response = await getHealthBook(bookId)
    const book: any = response?.data?.data || response?.data
    
    if (book) {
      profileInfo.value = {
        name: book.name || '',
        dob: book.dob || '',
        gender: book.gender || 'male',
        avatar: book.avatar || ''
      }
    }
  } catch (err) {
    console.error('Error fetching profile info:', err)
  }
}

// Helper functions
const formatDate = (date: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const calculateAge = (dob: string) => {
  const birthDate = dayjs(dob)
  const now = dayjs()
  const months = now.diff(birthDate, 'month')
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years > 0) {
    return remainingMonths > 0 
      ? `${years} tuổi ${remainingMonths} tháng`
      : `${years} tuổi`
  }
  return `${months} tháng tuổi`
}

// Fetch health records for current logged-in user
const fetchHealthBook = async (date?: string) => {
  try {
    loading.value = true
    error.value = ''

    // Format date to YYYY-MM-DD for API
    const selectedDateObj = date ? dayjs(date, 'DD/MM/YYYY') : dayjs()
    const formattedDate = selectedDateObj.format('YYYY-MM-DD')

    // Get health record by date (healthBookId defaults to 'me')
    const response = await getHealthRecordByDate(healthBookId.value, formattedDate)

    // Response format: { status: true, data: { data: record } }
    const record = response?.data?.data || response?.data
    
    console.log('=== DEBUG HEALTH BOOK ===')
    console.log('Response:', response)
    console.log('Record:', record)
    
    if (record && record._id) {
      console.log('Mapping record to healthBook:', record)
      
      // Map health record to health book format for display
      healthBook.value = {
        _id: record._id,
        customerId: record.customerId,
        name: profileInfo.value?.name || authStore.user?.fullname || authStore.user?.name || 'Chưa cập nhật',
        dob: profileInfo.value?.dob || '',
        gender: profileInfo.value?.gender || 'male',
        avatar: profileInfo.value?.avatar || authStore.user?.avatar || '',
        weight: record.weight?.toString() || '',
        height: record.height?.toString() || '',
        temperature: record.temperature?.toString() || '',
        skinConditions: record.skinCondition || '',
        tooth: {
          count: '',
          descriptions: record.oralHealth || ''
        },
        nutrition: {
          count: '',
          descriptions: record.nutrition || ''
        },
        sleep: {
          time: '',
          descriptions: record.sleep || ''
        },
        frequencyOfDefecation: record.stoolFrequency || '',
        fecalCondition: record.stoolCondition || '',
        digestiveProblems: record.digestiveIssues || '',
        healthCondition: record.healthStatus || '',
        vaccination: record.vaccination?.dose || '',
        vaccinationDate: record.vaccination?.date ? dayjs(record.vaccination.date).format('DD/MM/YYYY') : '',
        method: {
          status: record.method || '',
          descriptions: ''
        },
        exerciseAndSkills: record.motorSkills || '',
        note: record.notes || '',
        recordedAt: formattedDate,
        domain: '',
        origin: '',
        createdAt: record.createdAt || '',
        updatedAt: record.updatedAt || ''
      } as HealthBook
      
      console.log('HealthBook value set to:', healthBook.value)
      console.log('HealthBook is null?', healthBook.value === null)
    } else {
      // No data found for this date - show empty state
      console.log('No records found, setting healthBook to null')
      healthBook.value = null
      error.value = ''
    }
  } catch (err: unknown) {
    console.error('Error fetching health records:', err)
    const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu'
    error.value = errorMessage
  } finally {
    loading.value = false
    console.log('=== FINAL STATE ===')
    console.log('loading:', loading.value)
    console.log('error:', error.value)
    console.log('healthBook:', healthBook.value)
    console.log('healthBook truthy?', !!healthBook.value)
  }
}

// Handle date change
const handleDateChange = (date: Dayjs | null) => {
  if (date) {
    const formattedDate = date.format('DD/MM/YYYY') // Backend expects DD/MM/YYYY format
    fetchHealthBook(formattedDate)
  }
}

// Handle record created
const handleRecordCreated = () => {
  showCreateModal.value = false
  // Reload health book data for the selected date
  const formattedDate = selectedDate.value.format('DD/MM/YYYY')
  fetchHealthBook(formattedDate)
}

// Initial load
onMounted(async () => {
  await fetchProfileInfo()
  await fetchHealthBook()
})
</script>

<style scoped>
.health-book-page {
  background-color: #f5f5f5;
}

/* Tabs styling */
:deep(.health-book-tabs .ant-tabs-nav) {
  margin-bottom: 24px;
}

:deep(.health-book-tabs .ant-tabs-tab) {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
}

:deep(.health-book-tabs .ant-tabs-tab-active) {
  color: #1890ff;
}

:deep(.health-book-tabs .ant-tabs-ink-bar) {
  background-color: #1890ff;
  height: 3px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  :deep(.health-book-tabs .ant-tabs-tab) {
    padding: 10px 16px;
    font-size: 14px;
  }
}

/* Floating Action Button */
.floating-add-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-add-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.5);
  transition: all 0.3s ease;
}
</style>
