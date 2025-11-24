<template>
  <div class="health-book-page min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <a-spin size="large" tip="Đang tải dữ liệu sổ sức khỏe..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen px-4">
      <a-result status="error" title="Không thể tải dữ liệu" :sub-title="error">
        <template #extra>
          <a-button type="primary" @click="navigateTo('/customers')"> Quay lại danh sách khách hàng </a-button>
        </template>
      </a-result>
    </div>

    <!-- Empty State: No Healthbook Created Yet -->
    <div v-else-if="!hasHealthBook" class="container mx-auto px-4 py-6">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left">Sổ sức khỏe điện tử</h1>
      </div>

      <!-- Profile Header Section - Empty State -->
      <div class="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
        <!-- Mobile Layout -->
        <div class="lg:hidden">
          <!-- Profile Info (Mobile) -->
          <div class="flex flex-col items-center">
            <!-- Avatar - Van Phuc Mascot -->
            <div class="relative mb-3">
              <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                <UserOutlined class="text-4xl text-blue-500" />
              </div>
            </div>

            <!-- Name -->
            <h2 class="text-2xl font-bold text-blue-600 mb-1 text-center">N/A</h2>

            <!-- Date of Birth & Age -->
            <div class="text-gray-600 text-sm mb-3">
              <span>Ngày sinh: ???</span>
              <span class="mx-2">—</span>
              <span>? tháng tuổi</span>
            </div>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden lg:flex items-center justify-between">
          <!-- Left: Profile Info -->
          <div class="flex items-center gap-4">
            <!-- Avatar - Van Phuc Mascot -->
            <div class="relative">
              <div class="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                <UserOutlined class="text-5xl text-blue-500" />
              </div>
            </div>

            <!-- Info -->
            <div>
              <h2 class="text-3xl font-bold text-blue-600 mb-2">N/A</h2>
              <div class="text-gray-600 flex items-center gap-2">
                <span>Ngày sinh: ???</span>
                <span>—</span>
                <span>? tháng tuổi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <a-tabs v-model:activeKey="activeTab" class="health-book-tabs">
          <a-tab-pane key="overview" tab="Tổng quan">
            <!-- Empty State Content -->
            <div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
              <div class="text-center max-w-2xl">
                <!-- Van Phuc Care Mascot Illustration -->
                <div class="mb-8">
                  <img src="/images/empty-healthbook.png" alt="Vạn Phúc Care" class="w-auto h-52 md:h-72 mx-auto" />
                </div>

                <!-- Message -->
                <p class="text-gray-600 mb-8 text-lg leading-relaxed">
                  Hiện chưa có thông tin của bé. Ba/mẹ vui lòng nhập<br />
                  thông tin để Vạn Phúc Care tạo hồ sơ
                </p>

                <!-- Create Button -->
                <a-button
                  type="primary"
                  size="large"
                  @click="showCreateHealthBookModal = true"
                  class="px-8 h-12 text-base font-medium"
                >
                  Tạo hồ sơ của bé
                </a-button>
              </div>
            </div>
          </a-tab-pane>

          <!-- Vaccination Schedule Tab -->
          <a-tab-pane key="vaccination" tab="Lịch tiêm">
            <div class="flex flex-col items-center justify-center min-h-[50vh] px-4">
              <a-empty description="Chưa có thông tin lịch tiêm. Vui lòng tạo hồ sơ trước.">
                <a-button type="primary" @click="showCreateHealthBookModal = true"> Tạo hồ sơ của bé </a-button>
              </a-empty>
            </div>
          </a-tab-pane>

          <!-- Support Request Tab -->
          <a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
            <div class="flex flex-col items-center justify-center min-h-[50vh] px-4">
              <a-empty description="Chưa có yêu cầu hỗ trợ. Vui lòng tạo hồ sơ trước.">
                <a-button type="primary" @click="showCreateHealthBookModal = true"> Tạo hồ sơ của bé 3 </a-button>
              </a-empty>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-6">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-xl lg:text-2xl font-bold text-blue-600 text-center lg:text-left">Sổ sức khỏe điện tử</h1>
      </div>

      <!-- Profile Header Section - Always visible -->
      <div class="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6">
        <!-- Mobile Layout -->
        <div class="lg:hidden">
          <!-- Profile Info (Mobile) -->
          <div class="flex flex-col items-center">
            <!-- Avatar -->
            <div class="relative mb-3">
              <img
                :src="profileInfo.avatar || healthBook?.avatar || '/images/baby-default.png'"
                :alt="profileInfo.name || healthBook?.name"
                class="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                @error="(e) => { const t = e.target as HTMLImageElement; if (t) t.src = '/images/baby-default.png' }"
              />
              <CameraOutlined
                class="absolute bottom-0 right-0 bg-white rounded-full p-1 text-gray-500 text-sm shadow"
              />
            </div>

            <!-- Name -->
            <h2 class="text-2xl font-bold text-blue-600 mb-1 text-center">
              {{ profileInfo.name || healthBook?.name }}
            </h2>

            <!-- Date of Birth & Age -->
            <div v-if="profileInfo.dob || healthBook?.dob" class="text-gray-600 text-sm mb-3">
              <span>Ngày sinh: {{ formatDate(profileInfo.dob || healthBook?.dob || '') }}</span>
              <span class="mx-2">—</span>
              <span>{{ calculateAge(profileInfo.dob || healthBook?.dob || '') }}</span>
            </div>

            <!-- Action Buttons (Mobile) -->
            <div class="flex flex-col gap-3 w-full px-4 mt-4">
              <!-- Date Picker Mobile -->
              <a-date-picker
                v-model:value="selectedDate"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                @change="handleDateChange"
                class="custom-date-picker-mobile w-full"
                size="large"
              >
                <template #suffixIcon>
                  <CalendarOutlined class="text-blue-500" />
                </template>
              </a-date-picker>
              
              <!-- Create Button Mobile -->
              <a-button type="primary" size="large" @click="showCreateRecordModal = true" class="custom-create-button-mobile w-full">
                <template #icon>
                  <EditOutlined />
                </template>
                Tạo bản ghi
              </a-button>
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
                :src="profileInfo.avatar || healthBook?.avatar || '/images/baby-default.png'"
                :alt="profileInfo.name || healthBook?.name"
                class="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                @error="(e) => { const t = e.target as HTMLImageElement; if (t) t.src = '/images/baby-default.png' }"
              />
              <CameraOutlined
                class="absolute bottom-1 right-1 bg-white rounded-full p-2 text-gray-500 shadow cursor-pointer hover:bg-gray-50"
              />
            </div>

            <!-- Info -->
            <div>
              <h2 class="text-3xl font-bold text-blue-600 mb-2">
                {{ profileInfo.name || healthBook?.name }}
              </h2>
              <div v-if="profileInfo.dob || healthBook?.dob" class="text-gray-600 flex items-center gap-2">
                <span>Ngày sinh: {{ formatDate(profileInfo.dob || healthBook?.dob || '') }}</span>
                <span>—</span>
                <span>{{ calculateAge(profileInfo.dob || healthBook?.dob || '') }}</span>
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
              class="custom-date-picker"
              size="large"
            >
              <template #suffixIcon>
                <CalendarOutlined class="text-blue-500" />
              </template>
            </a-date-picker>

            <!-- Create Button -->
            <a-button type="primary" @click="showCreateRecordModal = true" size="large" class="custom-create-button">
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
            <!-- Overview Content -->
            <div v-if="healthBook && hasHealthBookRecord" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                <TemperatureChartCard :health-book="healthBook" :temperature-history="temperatureHistory" />

                <!-- Health Status & Vaccination -->
                <HealthStatusCard :health-book="healthBook" />

                <!-- Exercise & Method -->
                <ExerciseMethodCard :health-book="healthBook" />
              </div>
            </div>

            <!-- Empty State when no health book data in Overview tab -->
            <div v-else class="flex flex-col items-center justify-center min-h-[50vh] px-4">
              <a-empty description="Không có dữ liệu sổ sức khỏe cho ngày này">
                <a-button type="primary" size="large" @click="showCreateRecordModal = true">
                  <template #icon>
                    <EditOutlined />
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

    <!-- Create HealthBook Modal -->
    <CreateHealthBookModal v-model:visible="showCreateHealthBookModal" @success="handleHealthBookCreated" />

    <!-- Create Health Record Modal -->
    <CreateHealthRecordModal
      v-model:visible="showCreateRecordModal"
      :healthBookId="healthBook?._id"
      :selected-date="selectedDate"
      @success="handleRecordCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, CalendarOutlined, CameraOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import type { HealthBook } from "~/types/api";
import { useHealthRecordsApi } from "~/composables/api/useHealthRecordsApi";
import { useHealthBooksApi } from "~/composables/api/useHealthBooksApi";
import { useAuthStore } from "~/stores/auth";
import CreateHealthBookModal from "~/components/health-book/CreateHealthBookModal.vue";
import CreateHealthRecordModal from "~/components/health-book/CreateHealthRecordModal.vue";
import HealthMetricsCard from "~/components/health-book/HealthMetricsCard.vue";
import HealthConditionsCard from "~/components/health-book/HealthConditionsCard.vue";
import DigestiveHealthCard from "~/components/health-book/DigestiveHealthCard.vue";
import TemperatureChartCard from "~/components/health-book/TemperatureChartCard.vue";
import HealthStatusCard from "~/components/health-book/HealthStatusCard.vue";
import ExerciseMethodCard from "~/components/health-book/ExerciseMethodCard.vue";
import VaccinationSchedule from "~/components/health-book/VaccinationSchedule.vue";
import SupportRequestList from "~/components/health-book/SupportRequestList.vue";

// Define page meta
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const authStore = useAuthStore();
// Get customerId from healthBook (needed for child components)
const customerId = computed(() => healthBook.value?.customerId || "");

// API composables
const { getHealthRecordByDate, getHealthRecords } = useHealthRecordsApi();
const { getHealthBook, getHealthBooks, getCurrentHealthBook } = useHealthBooksApi();

// State
const healthBook = ref<HealthBook | null>(null);
const temperatureHistory = ref();
const hasHealthBook = ref(false);
const hasHealthBookRecord = ref(false);
const loading = ref(true);
const error = ref("");
const selectedDate = ref<Dayjs>(dayjs());
const activeTab = ref("overview");
const showCreateHealthBookModal = ref(false);
const showCreateRecordModal = ref(false);
const profileInfo = ref<{
  name?: string;
  dob?: string;
  gender?: string;
  avatar?: string;
}>({});

// Fetch healthbook profile (bé's profile info)
const fetchHealthBookProfile = async () => {
  try {
    loading.value = true;
    error.value = "";

    // Use 'me' endpoint for current user's healthbook
    const response = await getCurrentHealthBook();
    // Handle nested data structure: response.data.data
    const book: any = response?.data?.data?.data;
    if (book && book._id) {
      // User has created healthbook (check for _id to ensure it's a valid healthbook object)
      hasHealthBook.value = true;
      // Store healthbook info for profile display
      profileInfo.value = {
        name: book.name || "",
        dob: book.dob || "",
        gender: book.gender || "male",
        avatar: book.avatar || "",
      };

      // Also store the healthbook ID for fetching records
      healthBook.value = {
        _id: book._id,
        customerId: book.customerId || "",
        name: book.name || "",
        dob: book.dob || "",
        gender: book.gender || "male",
        avatar: book.avatar || "",
        weight: "",
        height: "",
        temperature: "",
        skinConditions: "",
        tooth: { count: "", descriptions: "" },
        nutrition: { count: "", descriptions: "" },
        sleep: { time: "", descriptions: "" },
        frequencyOfDefecation: "",
        fecalCondition: "",
        digestiveProblems: "",
        healthCondition: "",
        vaccination: "",
        vaccinationDate: "",
        vaccinationContent: "",
        method: { status: "", descriptions: "" },
        exerciseAndSkills: "",
        note: "",
        domain: "",
        origin: "",
        createdAt: book.createdAt || "",
        updatedAt: book.updatedAt || "",
      } as HealthBook;

      console.log("Healthbook exists, fetching today's record...");
      // After getting healthbook, fetch today's health record
      await fetchHealthRecordByDate();
    } else {
      // User hasn't created healthbook yet - show empty state
      hasHealthBook.value = false;
      healthBook.value = null;
      loading.value = false;
    }
  } catch (err: any) {
    console.error("Error fetching healthbook profile:", err);
    hasHealthBook.value = false;
    healthBook.value = null;
    loading.value = false;

    // Only show error if it's a real error (not just null data)
    if (err?.response?.status && err.response.status !== 404) {
      error.value = err.message || "Không thể tải thông tin sổ sức khỏe";
    }
  }
};

// Helper functions
const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const calculateAge = (dob: string) => {
  const birthDate = dayjs(dob);
  const now = dayjs();
  const months = now.diff(birthDate, "month");
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0) {
    return remainingMonths > 0 ? `${years} tuổi ${remainingMonths} tháng` : `${years} tuổi`;
  }
  return `${months} tháng tuổi`;
};

// Fetch health record by date (only called if healthbook exists)
const fetchHealthRecordByDate = async (date?: string) => {
  console.log("--------------------------------");
  // Don't fetch records if user doesn't have a healthbook
  if (!hasHealthBook.value) {
    loading.value = false;
    hasHealthBookRecord.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    // Format date to YYYY-MM-DD for API
    const selectedDateObj = date ? dayjs(date, "DD/MM/YYYY") : dayjs();
    const formattedDate = selectedDateObj.format("YYYY-MM-DD");
    // Get health record by date using 'me' endpoint
    const response = await getHealthRecordByDate("me", formattedDate);
    const record = response?.data?.data?.data;
    temperatureHistory.value = response?.data?.data?.temperatureHistory;

    if (record) {
      // Merge health record data with existing healthbook profile info
      healthBook.value = {
        ...healthBook.value,
        weight: record.weight?.toString() || "",
        height: record.height?.toString() || "",
        temperature: record.temperature?.toString() || "",
        skinConditions: record.skinCondition || "",
        tooth: {
          count: "",
          descriptions: record.oralHealth || "",
        },
        nutrition: {
          count: "",
          descriptions: record.nutrition || "",
        },
        sleep: {
          time: "",
          descriptions: record.sleep || "",
        },
        frequencyOfDefecation: record.stoolFrequency || "",
        fecalCondition: record.stoolCondition || "",
        digestiveProblems: record.digestiveIssues || "",
        healthCondition: record.healthStatus || "",
        vaccination: record.vaccination?.dose || "",
        vaccinationDate: record.vaccination?.date ? dayjs(record.vaccination.date).format("DD/MM/YYYY") : "",
        vaccinationContent: record.vaccination?.dose || "",
        method: {
          status: record.method || "",
          descriptions: "",
        },
        exerciseAndSkills: record.motorSkills || "",
        note: record.notes || "",
        recordedAt: formattedDate,
      } as HealthBook;
      hasHealthBookRecord.value = true;
    } else {
      // No record found for this date - keep profile info but clear record data
      hasHealthBookRecord.value = false;
      temperatureHistory.value = undefined;
      // Keep the profile info from profileInfo, don't set to null
      if (healthBook.value) {
        healthBook.value = {
          ...healthBook.value,
          weight: "",
          height: "",
          temperature: "",
          skinConditions: "",
          tooth: { count: "", descriptions: "" },
          nutrition: { count: "", descriptions: "" },
          sleep: { time: "", descriptions: "" },
          frequencyOfDefecation: "",
          fecalCondition: "",
          digestiveProblems: "",
          healthCondition: "",
          vaccination: "",
          vaccinationDate: "",
          vaccinationContent: "",
          method: { status: "", descriptions: "" },
          exerciseAndSkills: "",
          note: "",
        } as HealthBook;
      }
    }
  } catch (err: any) {
    console.error("Error fetching health record:", err);
    // Don't treat missing record as error, just set to null
    healthBook.value = null;

    // Only show error for real API errors
    if (err?.response?.status && err.response.status >= 500) {
      error.value = "Không thể tải dữ liệu bản ghi sức khỏe";
    }
  } finally {
    loading.value = false;
  }
};

// Handle date change
const handleDateChange = (date: Dayjs | null) => {
  if (date) {
    const formattedDate = date.format("DD/MM/YYYY");
    fetchHealthRecordByDate(formattedDate);
  }
};

// Handle healthbook created
const handleHealthBookCreated = async () => {
  showCreateHealthBookModal.value = false;
  // Refresh to load the newly created healthbook
  await fetchHealthBookProfile();
};

// Handle record created
const handleRecordCreated = async () => {
  showCreateRecordModal.value = false;

  // If this was the first record created, refresh healthbook profile
  if (!hasHealthBook.value) {
    await fetchHealthBookProfile();
  } else {
    // Otherwise just reload the health record for the selected date
    const formattedDate = selectedDate.value.format("DD/MM/YYYY");
    await fetchHealthRecordByDate(formattedDate);
  }
};

// Initial load
onMounted(async () => {
  // First fetch healthbook profile, which will automatically fetch today's record if healthbook exists
  await fetchHealthBookProfile();
});
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

/* Custom Date Picker Desktop */
:deep(.custom-date-picker) {
  border-radius: 24px !important;
  border: 2px solid #1890ff !important;
  padding: 8px 20px !important;
  width: 128px;
}

:deep(.custom-date-picker .ant-picker-input input) {
  color: #1890ff !important;
  font-weight: 500;
  font-size: 16px;
}

:deep(.custom-date-picker .ant-picker-suffix) {
  color: #1890ff;
}

/* Custom Create Button Desktop */
.custom-create-button {
  border-radius: 24px !important;
  padding: 8px 24px !important;
  height: 48px !important;
  font-weight: 500;
  font-size: 16px;
}

/* Custom Date Picker Mobile */
:deep(.custom-date-picker-mobile) {
  border-radius: 24px !important;
  border: 2px solid #1890ff !important;
  padding: 8px 20px !important;
  height: 48px !important;
}

:deep(.custom-date-picker-mobile .ant-picker-input input) {
  color: #1890ff !important;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
}

:deep(.custom-date-picker-mobile .ant-picker-suffix) {
  color: #1890ff;
}

/* Custom Create Button Mobile */
.custom-create-button-mobile {
  border-radius: 24px !important;
  padding: 8px 24px !important;
  height: 48px !important;
  font-weight: 500;
  font-size: 16px;
}
</style>
