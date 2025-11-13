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
    <div v-else-if="healthBook" class="container mx-auto px-4 py-6">
      <!-- Header with Baby Info (Mobile) -->
      <div class="lg:hidden mb-6">
        <HealthProfileCard :health-book="healthBook" />
      </div>

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <a-button class="hidden lg:inline-flex" @click="navigateTo('/customers')">
              <template #icon>
                <ArrowLeftOutlined />
              </template>
              Quay lại
            </a-button>
            <h1 class="text-2xl font-bold text-gray-800 mb-0 hidden lg:block">
              Sổ sức khỏe điện tử
            </h1>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Add Health Record Button -->
            <a-button
              type="primary"
              @click="showCreateModal = true"
              class="hidden lg:inline-flex"
            >
              <template #icon>
                <PlusOutlined />
              </template>
              Nhập thông tin
            </a-button>

            <!-- Date Picker (Desktop only) -->
            <a-date-picker
              v-if="activeTab === 'overview'"
              v-model:value="selectedDate"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              @change="handleDateChange"
              class="w-48 hidden lg:block"
            />
          </div>
        </div>

        <!-- Tabs -->
        <a-tabs v-model:activeKey="activeTab" class="health-book-tabs">
          <a-tab-pane key="overview" tab="Tổng quan">
            <!-- Overview Content -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Column: Baby Profile + Health Metrics -->
              <div class="lg:col-span-4 space-y-6">
                <!-- Baby Profile Card (Desktop only - shown above tabs on mobile) -->
                <div class="hidden lg:block">
                  <HealthProfileCard :health-book="healthBook" />
                </div>

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
          </a-tab-pane>

          <!-- Vaccination Schedule Tab -->
          <a-tab-pane key="vaccination" tab="Lịch tiêm">
            <VaccinationSchedule />
          </a-tab-pane>

          <!-- Support Request Tab -->
          <a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
            <SupportRequestList :customer-id="customerId" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen px-4">
      <a-empty description="Không có dữ liệu sổ sức khỏe">
        <a-button type="primary" @click="navigateTo('/customers')">
          Quay lại danh sách khách hàng
        </a-button>
      </a-empty>
    </div>

    <!-- Create Health Record Modal -->
    <CreateHealthRecordModal
      v-model:visible="showCreateModal"
      :customer-id="customerId"
      @success="handleRecordCreated"
    />

    <!-- Floating Action Button (Mobile) -->
    <a-button
      type="primary"
      shape="circle"
      size="large"
      class="floating-add-button lg:hidden"
      @click="showCreateModal = true"
    >
      <template #icon>
        <PlusOutlined :style="{ fontSize: '24px' }" />
      </template>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import type { HealthBook } from '~/types/api'
import { useHealthBooksApi } from '~/composables/api/useHealthBooksApi'

// Define page meta
definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// Get route params
const route = useRoute()
const customerId = computed(() => route.params.id as string)

// API composable
const { getHealthBook, getHealthBookByDate } = useHealthBooksApi()

// State
const healthBook = ref<HealthBook | null>(null)
const loading = ref(true)
const error = ref('')
const selectedDate = ref<Dayjs>(dayjs())
const activeTab = ref('overview')
const showCreateModal = ref(false)

// Fetch health book data
const fetchHealthBook = async (date?: string) => {
  try {
    loading.value = true
    error.value = ''

    let response
    if (date) {
      response = await getHealthBookByDate(customerId.value, date)
    } else {
      response = await getHealthBook(customerId.value)
    }

    // Response format: HealthBookResponse = { message?: string, data: HealthBook | Record<string, never> }
    // Type guard: check if data has HealthBook properties
    if (
      response?.data &&
      typeof response.data === 'object' &&
      '_id' in response.data &&
      'customerId' in response.data
    ) {
      healthBook.value = response.data as unknown as HealthBook
    } else {
      error.value = 'Không tìm thấy dữ liệu sổ sức khỏe'
    }
  } catch (err: unknown) {
    console.error('Error fetching health book:', err)
    const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu'
    error.value = errorMessage
  } finally {
    loading.value = false
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
  // Reload health book data
  fetchHealthBook()
}

// Initial load
onMounted(() => {
  fetchHealthBook()
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
