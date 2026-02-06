<template>
  <div class="health-book-page min-h-screen">
    <!-- Auth Checking / Google OAuth Processing State -->
    <div
      v-if="isCheckingAuth"
      class="fixed top-0 left-0 right-0 bottom-0 bg-white/95 flex items-center justify-center z-[9999]"
    >
      <div class="text-center p-8">
        <a-spin size="large" />
        <p class="mt-4 text-gray-600">Đang xác thực...</p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="flex items-center justify-center min-h-screen"
    >
      <a-spin size="large" tip="Đang tải dữ liệu sổ sức khỏe..." />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-screen px-4"
    >
      <a-result status="error" title="Không thể tải dữ liệu" :sub-title="error">
        <template #extra>
          <a-button type="primary" @click="navigateTo('/login')">
            Quay lại đăng nhập
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- Empty State: No Healthbook Created Yet -->
    <div v-else-if="!hasHealthBook" class="container mx-auto">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[#1A75BB] text-center lg:text-left">
          Sổ sức khỏe điện tử
        </h1>
      </div>

      <div class="w-full bg-white rounded-xl p-5 pt-0 mt-20">
        <!-- Profile Header Section - Empty State -->
        <div class="bg-white rounded-lg mb-6">
          <!-- Mobile Layout -->
          <div class="lg:hidden">
            <!-- Profile Info (Mobile) -->
            <div class="flex flex-col items-center">
              <!-- Avatar fallback khi chưa có hồ sơ (theo thiết kế MY) -->
              <div class="relative mb-3 -translate-y-14">
                <nuxt-img
                  src="/images/avatar-fallback.png"
                  alt="Vạn Phúc Care"
                  class="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  width="96"
                  height="96"
                  format="webp"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>

              <!-- Name -->
              <h2 class="text-2xl font-bold text-[#1A75BB] mb-1 text-center">
                N/A
              </h2>

              <!-- Date of Birth & Age -->
              <div class="text-gray-600 text-sm mb-3">
                <span>Ngày sinh: ???</span>
                <span class="mx-2">—</span>
                <span>? tháng tuổi</span>
              </div>
            </div>
          </div>

          <!-- Desktop Layout -->
          <div class="hidden lg:flex items-center justify-between relative">
            <!-- Left: Profile Info -->
            <div class="flex items-center gap-4">
              <!-- Avatar fallback khi chưa có hồ sơ (theo thiết kế MY) -->
              <div
                class="absolute -top-20 left-5 border-4 lg:border-8 border-white rounded-full"
              >
                <nuxt-img
                  src="/images/avatar-fallback.png"
                  alt="Vạn Phúc Care"
                  class="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                  width="128"
                  height="128"
                  format="webp"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
              <div class="w-40 h-20"></div>
              <!-- Info -->
              <div>
                <h2 class="text-3xl font-bold text-[#1A75BB] mb-2">N/A</h2>
                <div class="text-gray-600 flex items-center gap-2 font-bold">
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
            <a-tab-pane key="overview" :tab="overviewTabLabel">
              <!-- Empty State Content -->
              <div
                class="flex flex-col items-center justify-center min-h-[60vh] px-4"
              >
                <div class="text-center max-w-2xl">
                  <!-- Van Phuc Care Mascot Illustration -->
                  <div class="mb-8">
                    <nuxt-img
                      src="/images/empty-healthbook.png"
                      alt="Vạn Phúc Care"
                      class="w-auto h-52 md:h-72 mx-auto"
                      format="webp"
                      width="288"
                      loading="lazy"
                    />
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
              <div
                class="flex flex-col items-center justify-center min-h-[50vh] px-4"
              >
                <a-empty
                  description="Chưa có thông tin lịch tiêm. Vui lòng tạo hồ sơ trước."
                >
                  <a-button
                    type="primary"
                    @click="showCreateHealthBookModal = true"
                  >
                    Tạo hồ sơ của bé
                  </a-button>
                </a-empty>
              </div>
            </a-tab-pane>

            <!-- Support Request Tab -->
            <a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
              <div
                class="flex flex-col items-center justify-center min-h-[50vh] px-4"
              >
                <a-empty
                  description="Chưa có yêu cầu hỗ trợ. Vui lòng tạo hồ sơ trước."
                >
                  <a-button
                    type="primary"
                    @click="showCreateHealthBookModal = true"
                  >
                    Tạo hồ sơ của bé
                  </a-button>
                </a-empty>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="container mx-auto">
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[#1A75BB] text-center lg:text-left">
          Sổ sức khỏe điện tử
        </h1>
        <!-- Action Buttons (Mobile) - Only show on overview tab -->
        <div
          v-if="activeTab === 'overview'"
          class="flex gap-2 w-full mt-4 justify-center items-center lg:hidden"
        >
          <!-- Date Picker Mobile -->
          <a-date-picker
            v-model:value="selectedDate"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            @change="handleDateChange"
            @openChange="handleDatePickerOpenChange"
            @panelChange="handleDatePickerPanelChange"
            class="custom-date-picker-mobile"
            size="large"
          >
            <template #suffixIcon>
              <CalendarOutlined class="text-blue-500" />
            </template>
            <template #dateRender="{ current }">
              <div class="ant-picker-cell-inner" :style="{ position: 'relative' }">
                {{ current.date() }}
                <div
                  v-if="markedDates.has(current.format('YYYY-MM-DD'))"
                  :style="{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#155DFC',
                    borderRadius: '50%',
                  }"
                />
              </div>
            </template>
          </a-date-picker>

          <!-- Create Button Mobile -->
          <a-button
            type="primary"
            size="large"
            @click="showCreateRecordModal = true"
            class="custom-create-button-mobile"
          >
            <template #icon>
              <EditOutlined />
            </template>
            Tạo bản ghi
          </a-button>
        </div>
      </div>

      <div class="w-full bg-white rounded-xl p-5 pt-0 mt-20">
        <!-- Profile Header Section - Always visible -->
        <div class="bg-white rounded-lg mb-6">
          <!-- Mobile Layout -->
          <div class="lg:hidden">
            <!-- Profile Info (Mobile) -->
            <div class="flex flex-col items-center relative pt-16">
              <!-- Avatar -->
              <div
                class="absolute -top-14 mb-3 border-4 lg:border-8 border-white rounded-full"
              >
                <img
                  v-if="profileInfo.avatar || healthBook?.avatar"
                  :src="profileInfo.avatar || healthBook?.avatar"
                  :alt="profileInfo.name || healthBook?.name"
                  class="w-24 h-24 rounded-full object-cover"
                  width="96"
                  height="96"
                  fetchpriority="high"
                  loading="eager"
                  decoding="async"
                  @error="(e) => { const t = e.target as HTMLImageElement; if (t) t.src = '/images/avatar-fallback.png' }"
                />
                <nuxt-img
                  v-else
                  src="/images/avatar-fallback.png"
                  :alt="profileInfo.name || healthBook?.name"
                  class="w-24 h-24 rounded-full object-cover"
                  width="96"
                  height="96"
                  format="webp"
                  loading="eager"
                  fetchpriority="high"
                />
                <CameraOutlined
                  class="absolute flex items-center justify-center bottom-2.5 right-2.5 size-4 bg-white rounded-full p-0.5 text-gray-500 text-sm shadow cursor-pointer hover:bg-gray-100"
                  @click="openAvatarPicker"
                />
              </div>

              <!-- Name -->
              <h2
                class="text-2xl font-bold text-[#1A75BB] mb-1 text-center capitalize"
              >
                {{ profileInfo.name || healthBook?.name }}
              </h2>

              <div
                v-if="profileInfo.dob || healthBook?.dob"
                class="text-gray-600 text-sm mb-3 flex flex-col items-center gap-2"
              >
                <div class="flex items-center gap-2">
                  <span
                    >Ngày sinh:
                    {{
                      formatDate(profileInfo.dob || healthBook?.dob || "")
                    }}</span
                  >
                  <span>—</span>
                  <span>{{
                    calculateAge(profileInfo.dob || healthBook?.dob || "")
                  }}</span>
                </div>
                <!-- Dòng 2: Nút chỉnh sửa thông tin -->
                <span
                  class="flex items-center gap-1 text-[#1A75BB] cursor-pointer hover:opacity-80"
                  @click="showEditInfoModal = true"
                >
                  <EditOutlined class="text-sm" />
                  <span class="text-sm font-medium">Chỉnh sửa thông tin</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Desktop Layout -->
          <div class="hidden lg:flex items-center justify-between relative">
            <!-- Left: Profile Info -->
            <div class="flex items-center gap-4">
              <!-- Avatar -->
              <div
                class="absolute -top-20 left-5 border-4 lg:border-8 border-white rounded-full"
              >
                <img
                  :src="
                    profileInfo.avatar ||
                    healthBook?.avatar ||
                    '/images/avatar-fallback.png'
                  "
                  :alt="profileInfo.name || healthBook?.name"
                  class="w-32 h-32 rounded-full object-cover border-5 lg:border-8 border-blue-100"
                  width="128"
                  height="128"
                  fetchpriority="high"
                  loading="eager"
                  decoding="async"
                  @error="(e) => { const t = e.target as HTMLImageElement; if (t) t.src = '/images/avatar-fallback.png' }"
                />
                <CameraOutlined
                  class="absolute bottom-1 right-1 bg-white rounded-full p-2 text-gray-500 shadow cursor-pointer hover:bg-gray-50"
                  @click="openAvatarPicker"
                />
              </div>
              <div class="w-40 h-20"></div>
              <!-- Info -->
              <div>
                <h2 class="text-3xl font-bold text-[#1A75BB] mb-2 capitalize">
                  {{ profileInfo.name || healthBook?.name }}
                </h2>
                <div
                  v-if="profileInfo.dob || healthBook?.dob"
                  class="text-gray-600 flex items-center gap-2 font-bold"
                >
                  <span
                    >Ngày sinh:
                    {{
                      formatDate(profileInfo.dob || healthBook?.dob || "")
                    }}</span
                  >
                  <span>—</span>
                  <span>{{
                    calculateAge(profileInfo.dob || healthBook?.dob || "")
                  }}</span>
                  <span
                    class="ml-2 flex items-center gap-1 text-[#1A75BB] cursor-pointer hover:opacity-80"
                    @click="showEditInfoModal = true"
                  >
                    <EditOutlined class="text-sm" />
                    <span class="text-sm font-medium">Chỉnh sửa thông tin</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Right: Actions - Only show on overview tab -->
            <div
              v-if="activeTab === 'overview'"
              class="flex items-center gap-3"
            >
              <!-- Date Picker -->
              <a-date-picker
                v-model:value="selectedDate"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                @change="handleDateChange"
                @openChange="handleDatePickerOpenChange"
                @panelChange="handleDatePickerPanelChange"
                class="custom-date-picker"
                size="large"
              >
                <template #suffixIcon>
                  <CalendarOutlined class="text-blue-500" />
                </template>
                <template #dateRender="{ current }">
                  <div class="ant-picker-cell-inner" :style="{ position: 'relative' }">
                    {{ current.date() }}
                    <div
                      v-if="markedDates.has(current.format('YYYY-MM-DD'))"
                      :style="{
                        position: 'absolute',
                        bottom: '-2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        backgroundColor: '#155DFC',
                        borderRadius: '50%',
                      }"
                    />
                  </div>
                </template>
              </a-date-picker>

              <!-- Create Button -->
              <a-button
                type="primary"
                @click="showCreateRecordModal = true"
                size="large"
                class="custom-create-button"
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
            <a-tab-pane key="overview" :tab="overviewTabLabel">
              <!-- Overview Content -->
              <div
                v-if="healthBook && hasHealthBookRecord"
                class="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                <!-- Left Column: Health Metrics -->
                <div class="lg:col-span-4 space-y-6">
                  <!-- Health Metrics Card -->
                  <HealthMetricsCard :health-book="healthBook" />

                  <!-- Health Conditions -->
                  <HealthConditionsCard :health-book="healthBook" />
                </div>

                <!-- Right Column: Charts + Additional Info -->
                <div class="lg:col-span-8 space-y-1">
                  <!-- Digestive Health -->
                  <div class="hidden lg:block mb-6">
                    <DigestiveHealthCard :health-book="healthBook" />
                  </div>
                  <div
                    class="min-[1440px]:grid min-[1440px]:grid-cols-3 min-[1440px]:gap-6"
                  >
                    <div class="min-[1440px]:col-span-2">
                      <!-- Temperature Chart -->
                      <TemperatureChartCard
                        :health-book="healthBook"
                        :temperature-history="temperatureHistory"
                        :selected-date="selectedDate"
                      />
                    </div>
                    <div
                      class="min-[1440px]:col-span-1 flex flex-col min-[1440px]:flex-col-reverse min-[1440px]:justify-end"
                    >
                      <!-- Health Status & Vaccination -->
                      <HealthStatusCard :health-book="healthBook" />

                      <!-- Digestive Health -->
                      <div class="lg:hidden">
                        <DigestiveHealthCard :health-book="healthBook" />
                      </div>

                      <!-- Exercise & Method -->
                      <ExerciseMethodCard :health-book="healthBook" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State when no health book data in Overview tab -->
              <div
                v-else
                class="flex flex-col items-center justify-center min-h-[50vh] px-4"
              >
                <a-empty
                  description="Không có dữ liệu sổ sức khỏe cho ngày này"
                  class="healthbook-empty"
                >
                  <a-button
                    type="primary"
                    size="large"
                    @click="showCreateRecordModal = true"
                    class="flex items-center justify-center font-bold"
                  >
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
              <Suspense>
                <VaccinationSchedule
                  :customer-id="customerId"
                  :health-book-id="healthBook?._id"
                />
                <template #fallback>
                  <div class="flex items-center justify-center py-20">
                    <a-spin size="large" tip="Đang tải lịch tiêm..." />
                  </div>
                </template>
              </Suspense>
            </a-tab-pane>

            <!-- Support Request Tab -->
            <a-tab-pane key="support" tab="Yêu cầu hỗ trợ">
              <Suspense>
                <SupportRequestList :customer-id="customerId" />
                <template #fallback>
                  <div class="flex items-center justify-center py-20">
                    <a-spin size="large" tip="Đang tải yêu cầu hỗ trợ..." />
                  </div>
                </template>
              </Suspense>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>

    <!-- Create HealthBook Modal -->
    <CreateHealthBookModal
      v-model:visible="showCreateHealthBookModal"
      @success="handleHealthBookCreated"
    />

    <!-- Create Health Record Modal -->
    <CreateHealthRecordModal
      v-model:visible="showCreateRecordModal"
      :healthBookId="healthBook?._id"
      :selected-date="selectedDate"
      @success="handleRecordCreated"
    />

    <!-- Hidden file input for avatar upload -->
    <input
      ref="avatarFileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleAvatarChange"
    />

    <!-- Avatar Upload Loading Modal -->
    <a-modal
      v-model:open="isUploadingAvatar"
      :closable="false"
      :footer="null"
      :maskClosable="false"
      centered
    >
      <div class="flex flex-col items-center justify-center py-8">
        <a-spin size="large" />
        <p class="mt-4 text-gray-600">Đang tải ảnh lên...</p>
      </div>
    </a-modal>

    <!-- Edit Info Modal -->
    <a-modal
      v-model:open="showEditInfoModal"
      :title="null"
      :width="1088"
      :footer="null"
      :maskClosable="true"
      :closable="true"
      :centered="true"
      class="edit-info-modal"
    >
      <a-form
        :model="editInfoForm"
        layout="vertical"
        @finish="handleEditInfoSubmit"
        class="edit-info-form"
      >
        <!-- Title -->
        <div class="edit-info-modal-title">CHỈNH SỬA THÔNG TIN</div>

        <!-- Họ và tên bé -->
        <a-form-item
          label="Họ và tên bé"
          name="name"
          :rules="[{ required: true, message: 'Vui lòng nhập họ và tên bé' }]"
          class="edit-info-form-item mb-6"
        >
          <a-input
            v-model:value="editInfoForm.name"
            placeholder="Nhập họ và tên bé"
            size="large"
          />
        </a-form-item>

        <!-- Ngày sinh và Giới tính - Same Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <a-form-item
            label="Ngày sinh"
            name="dob"
            :rules="[{ required: true, message: 'Vui lòng chọn ngày sinh' }]"
            class="edit-info-form-item"
          >
            <a-date-picker
              v-model:value="editInfoForm.dob"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              class="w-full"
              size="large"
            />
          </a-form-item>

          <a-form-item
            label="Giới tính"
            name="gender"
            :rules="[{ required: true, message: 'Vui lòng chọn giới tính' }]"
            class="edit-info-form-item"
          >
            <a-select
              v-model:value="editInfoForm.gender"
              placeholder="Chọn giới tính"
              size="large"
            >
              <a-select-option value="male">Nam</a-select-option>
              <a-select-option value="female">Nữ</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!-- Save Button -->
        <div class="flex justify-center mt-8">
          <a-button
            type="primary"
            html-type="submit"
            :loading="isUpdatingInfo"
            size="large"
            class="edit-info-save-btn"
          >
            Lưu thông tin
          </a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from "vue";
import {
  UserOutlined,
  CalendarOutlined,
  CameraOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import { message } from "ant-design-vue";
import type { HealthBook } from "~/types/api";
import { useHealthRecordsApi } from "~/composables/api/useHealthRecordsApi";
import { useHealthBooksApi } from "~/composables/api/useHealthBooksApi";
import { useAuthStore } from "~/stores/auth";

// Eager load critical components (shown immediately)
import CreateHealthBookModal from "~/components/health-book/CreateHealthBookModal.vue";
import CreateHealthRecordModal from "~/components/health-book/CreateHealthRecordModal.vue";
import HealthMetricsCard from "~/components/health-book/HealthMetricsCard.vue";
import HealthConditionsCard from "~/components/health-book/HealthConditionsCard.vue";
import DigestiveHealthCard from "~/components/health-book/DigestiveHealthCard.vue";
import TemperatureChartCard from "~/components/health-book/TemperatureChartCard.vue";
import HealthStatusCard from "~/components/health-book/HealthStatusCard.vue";
import ExerciseMethodCard from "~/components/health-book/ExerciseMethodCard.vue";

// Lazy load heavy tab components (loaded only when tab is activated)
const VaccinationSchedule = defineAsyncComponent(
  () => import("~/components/health-book/VaccinationSchedule.vue")
);
const SupportRequestList = defineAsyncComponent(
  () => import("~/components/health-book/SupportRequestList.vue")
);

// Define page meta - No middleware, handle auth in component (for Google OAuth callback)
definePageMeta({
  layout: "default",
  middleware: [], // Handle auth manually to support Google OAuth callback
});

// Preload critical images for LCP
useHead({
  link: [
    {
      rel: "preconnect",
      href: "https://files.vanphuccare.vn",
      crossorigin: "anonymous",
    },
  ],
});

const authStore = useAuthStore();
const router = useRouter();

// Google Auth composable
const { completeGoogleLogin } = useGoogleAuth();

// State for Google OAuth handling
const isCheckingAuth = ref(true);

// Get customerId from healthBook (needed for child components)
const customerId = computed(() => healthBook.value?.customerId || "");

// API composables
const { getHealthRecordByDate, getHealthRecords, getRecordDates } = useHealthRecordsApi();
const {
  getHealthBook,
  getHealthBooks,
  getCurrentHealthBook,
  updateUserHealthBook,
} = useHealthBooksApi();

// Avatar upload state
const avatarFileInput = ref<HTMLInputElement | null>(null);
const isUploadingAvatar = ref(false);

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
const showEditInfoModal = ref(false);
const isUpdatingInfo = ref(false);

// Calendar marked dates state
const markedDates = ref<Set<string>>(new Set());
const cachedMonths = ref<Set<string>>(new Set());
const profileInfo = ref<{
  name?: string;
  dob?: string;
  gender?: string;
  avatar?: string;
}>({});
const editInfoForm = ref<{
  name?: string;
  dob?: Dayjs | null;
  gender?: "male" | "female";
}>({
  name: "",
  dob: null,
  gender: "male",
});

// Responsive state for screen size
const isMobile = ref(true);

// Computed property for overview tab label
const overviewTabLabel = computed(() =>
  isMobile.value ? "Tổng quan" : "Tổng quan sức khỏe"
);

// Handle screen resize
const handleResize = () => {
  if (typeof window !== "undefined") {
    isMobile.value = window.innerWidth < 768;
  }
};

// Cleanup resize listener
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

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

      // After getting healthbook, fetch today's health record
      await fetchHealthRecordByDate();
    } else {
      // User hasn't created healthbook yet - show empty state and auto open modal
      hasHealthBook.value = false;
      healthBook.value = null;
      loading.value = false;

      // Auto open create healthbook modal after a short delay
      // setTimeout(() => {
      //   showCreateHealthBookModal.value = true;
      // }, 500);
    }
  } catch (err: any) {
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
    return remainingMonths > 0
      ? `${years} tuổi ${remainingMonths} tháng`
      : `${years} tuổi`;
  }
  return `${months} tháng tuổi`;
};

// Fetch health record by date (only called if healthbook exists)
const fetchHealthRecordByDate = async (date?: string) => {
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

    // Get health record by date using healthbook ID
    const healthBookId = healthBook.value?._id;
    if (!healthBookId) {
      loading.value = false;
      hasHealthBookRecord.value = false;
      return;
    }

    const response = await getHealthRecordByDate(healthBookId, formattedDate);
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
        skinConditionNote: record.skinConditionNote || "",
        tooth: {
          count: "",
          descriptions: record.oralHealth || "",
        },
        oralHealthNote: record.oralHealthNote || "",
        nutrition: {
          count: "",
          descriptions: record.nutrition || "",
        },
        nutritionNote: record.nutritionNote || "",
        sleep: {
          time: "",
          descriptions: record.sleep || "",
        },
        sleepNote: record.sleepNote || "",
        frequencyOfDefecation: record.stoolFrequency || "",
        fecalCondition: record.stoolCondition || "",
        digestiveProblems: record.digestiveIssues || "",
        healthCondition: record.healthStatus || "",
        vaccination: record.vaccination?.dose || "",
        vaccinationDate: record.vaccination?.date
          ? dayjs(record.vaccination.date).format("DD/MM/YYYY")
          : "",
        vaccinationContent: record.vaccination?.dose || "",
        method: {
          status: record.method || "",
          descriptions: "",
        },
        schedule: record.schedule || "",
        scheduleNote: record.scheduleNote || "",
        notes: record.notes || "",
        developmentMilestone: record.developmentMilestone || "",
        grossMotorSkills: record.grossMotorSkills || "",
        fineMotorSkills: record.fineMotorSkills || "",
        visualCognition: record.visualCognition || "",
        communicationEmotion: record.communicationEmotion || "",
        earlyWarning: record.earlyWarning || "",
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
          skinConditionNote: "",
          tooth: { count: "", descriptions: "" },
          oralHealthNote: "",
          nutrition: { count: "", descriptions: "" },
          nutritionNote: "",
          sleep: { time: "", descriptions: "" },
          sleepNote: "",
          frequencyOfDefecation: "",
          fecalCondition: "",
          digestiveProblems: "",
          healthCondition: "",
          vaccination: "",
          vaccinationDate: "",
          vaccinationContent: "",
          method: { status: "", descriptions: "" },
          schedule: "",
          scheduleNote: "",
          notes: "",
          developmentMilestone: "",
          grossMotorSkills: "",
          fineMotorSkills: "",
          visualCognition: "",
          communicationEmotion: "",
          earlyWarning: "",
          exerciseAndSkills: "",
          note: "",
        } as HealthBook;
      }
    }
  } catch (err: any) {
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

// ========== Calendar Marked Dates Functions ==========

/**
 * Fetch dates that have health records for a given month
 * This is used to display dots under dates in the calendar picker
 */
const fetchMarkedDatesForMonth = async (monthDate: Dayjs) => {
  if (!healthBook.value?._id) return;

  const monthKey = monthDate.format("YYYY-MM");
  // Skip if already cached
  if (cachedMonths.value.has(monthKey)) return;

  try {
    const start = monthDate.startOf("month").format("YYYY-MM-DD");
    const end = monthDate.endOf("month").format("YYYY-MM-DD");

    const response = await getRecordDates(healthBook.value._id, start, end);
    // Handle various response structures
    const dates: string[] = 
      response?.data?.data?.data?.dates ||
      response?.data?.data?.dates || 
      response?.data?.dates ||
      (response as any)?.dates ||
      [];
    
    // Add dates to markedDates set
    dates.forEach((d: string) => markedDates.value.add(d));
    // Mark month as cached
    cachedMonths.value.add(monthKey);
    
  } catch (err) {
  }
};

/**
 * Handle calendar panel open - fetch marked dates for current month
 */
const handleDatePickerOpenChange = (open: boolean) => {
  if (open && healthBook.value?._id) {
    fetchMarkedDatesForMonth(selectedDate.value);
  }
};

/**
 * Handle calendar panel change (month/year navigation)
 */
const handleDatePickerPanelChange = (date: Dayjs) => {
  if (date && healthBook.value?._id) {
    fetchMarkedDatesForMonth(date);
  }
};

// Avatar upload functions
const openAvatarPicker = () => {
  avatarFileInput.value?.click();
};

const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    message.error("Vui lòng chọn file ảnh");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    message.error("Kích thước ảnh tối đa là 5MB");
    return;
  }

  if (!healthBook.value?._id) {
    message.error("Không tìm thấy thông tin sổ sức khỏe");
    return;
  }

  try {
    isUploadingAvatar.value = true;

    // Call API to update healthbook with avatar file
    const result = await updateUserHealthBook(healthBook.value._id, {
      avatar: file,
    });

    // Response structure: { message: "", data: { message: "...", data: { avatar: "..." } } }
    const avatarUrl = result?.data?.data?.avatar || result?.data?.avatar;

    if (!avatarUrl) {
      throw new Error("Không thể cập nhật ảnh đại diện");
    }

    // Update local state
    if (healthBook.value) {
      healthBook.value.avatar = avatarUrl;
    }
    if (profileInfo.value) {
      profileInfo.value.avatar = avatarUrl;
    }

    message.success("Cập nhật ảnh đại diện thành công!");
  } catch (err: any) {
    message.error(err.message || "Không thể cập nhật ảnh đại diện");
  } finally {
    isUploadingAvatar.value = false;
    // Reset input value to allow selecting the same file again
    if (input) {
      input.value = "";
    }
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

    // Add the created date to markedDates (so dot appears immediately)
    const dateKey = selectedDate.value.format("YYYY-MM-DD");
    markedDates.value.add(dateKey);
  }
};

// Handle edit info modal open
watch(showEditInfoModal, (visible) => {
  if (visible && healthBook.value) {
    const genderValue = (profileInfo.value.gender ||
      healthBook.value.gender ||
      "male") as "male" | "female";
    editInfoForm.value = {
      name: profileInfo.value.name || healthBook.value.name || "",
      dob: profileInfo.value.dob
        ? dayjs(profileInfo.value.dob)
        : healthBook.value.dob
        ? dayjs(healthBook.value.dob)
        : null,
      gender: genderValue,
    };
  }
});

// Handle edit info submit
const handleEditInfoSubmit = async () => {
  if (!healthBook.value?._id) {
    message.error("Không tìm thấy thông tin sổ sức khỏe");
    return;
  }

  if (
    !editInfoForm.value.name ||
    !editInfoForm.value.dob ||
    !editInfoForm.value.gender
  ) {
    message.error("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    isUpdatingInfo.value = true;

    const updateData: {
      name?: string;
      dob?: string;
      gender?: string;
    } = {
      name: editInfoForm.value.name,
      dob: editInfoForm.value.dob.format("YYYY-MM-DD"),
      gender: editInfoForm.value.gender,
    };

    await updateUserHealthBook(healthBook.value._id, updateData);

    // Update local state
    profileInfo.value = {
      ...profileInfo.value,
      name: editInfoForm.value.name,
      dob: editInfoForm.value.dob.format("YYYY-MM-DD"),
      gender: editInfoForm.value.gender,
    };

    if (healthBook.value) {
      healthBook.value.name = editInfoForm.value.name;
      healthBook.value.dob = editInfoForm.value.dob.format("YYYY-MM-DD");
      healthBook.value.gender = editInfoForm.value.gender;
    }

    message.success("Cập nhật thông tin thành công!");
    showEditInfoModal.value = false;
  } catch (err: any) {
    message.error(err.message || "Không thể cập nhật thông tin");
  } finally {
    isUpdatingInfo.value = false;
  }
};

// Initial load
onMounted(async () => {
  // Setup responsive listener for tab labels
  handleResize();
  window.addEventListener("resize", handleResize);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const googleSuccess = urlParams.get("google_success");
  const token = urlParams.get("token");
  const googleError = urlParams.get("google_error");

  // Case 1a: Google OAuth callback with token directly (backend handled OAuth)
  if (googleSuccess === "true" && token) {
    loading.value = true;
    error.value = "";

    try {
      // Token expiry: 7 days from now
      const tokenExpireAtNum = Date.now() + 7 * 24 * 60 * 60 * 1000;

      // Save token and fetch user profile from API
      // Pass null as userData to trigger API fetch
      const result = await authStore.completeGoogleLogin(
        token,
        tokenExpireAtNum,
        null as any // Will trigger fetch from API
      );

      if (!result.success) {
        throw new Error(result.error || "Đăng nhập Google thất bại");
      }

      // Show success message
      message.success("Đăng nhập Google thành công!");

      // Clean URL
      await router.replace("/");

      // Continue to load healthbook data
      isCheckingAuth.value = false;
      await fetchHealthBookProfile();
      return;
    } catch (err: any) {
      // Clean URL first
      await router.replace("/");

      error.value =
        err.message || "Đăng nhập Google thất bại. Vui lòng thử lại.";
      loading.value = false;
      isCheckingAuth.value = false;

      message.error(error.value);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
  }

  // Case 1b: Google OAuth error
  else if (googleError) {
    await router.replace("/login");
    message.error("Đăng nhập Google thất bại");
    return;
  }

  // Case 1c: Google OAuth callback with code (frontend needs to exchange)
  else if (code) {
    // Check if this code was already used (stored in sessionStorage)
    const usedCodes = JSON.parse(
      sessionStorage.getItem("usedGoogleCodes") || "[]"
    );
    if (usedCodes.includes(code)) {
      // Code already used, just clean URL and continue
      await router.replace("/");
      isCheckingAuth.value = false;

      // If user is authenticated, load healthbook
      if (authStore.isAuthenticated) {
        await fetchHealthBookProfile();
      } else {
        router.push("/login");
      }
      return;
    }

    loading.value = true;
    error.value = "";
    try {
      const response = await completeGoogleLogin(code, state || undefined);

      if (!response || !response.success || !response.data) {
        throw new Error(response?.error || "Đăng nhập Google thất bại");
      }
      // Mark this code as used
      usedCodes.push(code);
      sessionStorage.setItem("usedGoogleCodes", JSON.stringify(usedCodes));

      // Calculate token expiry time
      let tokenExpireAtNum: number;
      if (typeof response.data.tokenExpireAt === "string") {
        tokenExpireAtNum = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      } else {
        tokenExpireAtNum =
          response.data.tokenExpireAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
      }

      // Prepare user data
      const userData = {
        ...response.data.user,
        id:
          (response.data.user as any)?._id ||
          response.data.user?.id ||
          `google-user-${Date.now()}`,
        email: response.data.user?.email || "user@google.com",
        fullname:
          (response.data.user as any)?.fullname ||
          response.data.user?.name ||
          "Google User",
        avatar: response.data.user?.avatar || "",
        role: (response.data.user as any)?.role || "user",
        verified: true,
      };
      // Save to auth store
      await authStore.completeGoogleLogin(
        response.data.accessToken,
        tokenExpireAtNum,
        userData
      );

      // Show success message
      message.success("Đăng nhập Google thành công!");

      // Clean URL using router.replace to properly update history
      await router.replace("/");

      // Continue to load healthbook data
      isCheckingAuth.value = false;
      await fetchHealthBookProfile();
      return;
    } catch (err: any) {
      // Clean URL first to prevent reload loop
      await router.replace("/");

      error.value =
        err.message || "Đăng nhập Google thất bại. Vui lòng thử lại.";
      loading.value = false;
      isCheckingAuth.value = false;

      // Show error message
      message.error(error.value);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      return;
    }
  }

  // Case 2: Normal page visit - check authentication
  if (!authStore.isAuthenticated) {
    // Save intended destination
    localStorage.setItem("redirect_after_login", "/");
    router.push("/login");
    return;
  }

  // Case 3: User is authenticated, load healthbook data
  isCheckingAuth.value = false;
  await fetchHealthBookProfile();
});
// Build
</script>

<style scoped>
.healthbook-empty :deep(.ant-empty-footer) {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* Tabs styling */
:deep(.health-book-tabs .ant-tabs-nav) {
  margin-bottom: 24px;
  width: 100%;
}

:deep(.health-book-tabs .ant-tabs-content-holder) {
  width: 100%;
}

:deep(.health-book-tabs .ant-tabs-tab) {
  padding: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #b5b5b5;
}

:deep(.health-book-tabs .ant-tabs-tab + .ant-tabs-tab) {
  margin: 0 0 0 20px !important;
}

:deep(.health-book-tabs .ant-tabs-tab-active) {
  color: #317bc4;
}

:deep(.health-book-tabs .ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #317bc4;
}

:deep(.health-book-tabs .ant-tabs-ink-bar) {
  background-color: #317bc4;
  height: 3px;
}

:deep(.health-book-tabs.ant-tabs) {
  align-items: center;
  justify-content: center;
}

/* Mobile responsive */
@media (max-width: 768px) {
  :deep(.health-book-tabs.ant-tabs) {
    align-items: center;
    justify-content: center;
  }
  :deep(.health-book-tabs .ant-tabs-nav) {
    width: auto;
  }
  :deep(.health-book-tabs .ant-tabs-nav::before) {
    border: none;
  }
  :deep(.health-book-tabs .ant-tabs-tab) {
    padding: 10px 12px;
    font-size: 14px;
  }

  :deep(.health-book-tabs .ant-tabs-tab.ant-tabs-tab-active) {
    color: #fff !important;
    background: #1a75bb !important;
  }

  :deep(.health-book-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #fff !important;
  }

  :deep(.health-book-tabs .ant-tabs-nav::before) {
    border: none;
  }
  :deep(.health-book-tabs .ant-tabs-nav-wrap) {
    border: 1px solid #ebebeb;
    border-radius: 12px;
  }

  :deep(.health-book-tabs .ant-tabs-tab + .ant-tabs-tab) {
    margin: 0 0 0 10px !important;
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
  border: 2px solid #317bc4 !important;
  padding: 8px 20px !important;
  width: 154px;
  height: 48px !important;
}

:deep(.custom-date-picker .ant-picker-input) {
  flex-direction: row-reverse;
}

:deep(.custom-date-picker .ant-picker-input input) {
  color: #317bc4 !important;
  font-weight: 700;
  font-size: 16px;
}

:deep(.custom-date-picker .ant-picker-suffix) {
  color: #317bc4;
  margin-left: 0;
  margin-right: 8px;
}

/* Custom Create Button Desktop */
.custom-create-button {
  border-radius: 24px !important;
  padding: 8px 24px !important;
  height: 48px !important;
  font-weight: 700;
  font-size: 16px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #fff !important;
  box-shadow: none;
  border: 2px solid #317bc4 !important;
  color: #317bc4 !important;
}
.custom-create-button:hover {
  color: #fff !important;
  background-color: #317bc4 !important;
  opacity: 1 !important;
}

/* Custom Date Picker Mobile */
:deep(.custom-date-picker-mobile) {
  border-radius: 24px !important;
  border: 2px solid #317bc4 !important;
  padding: 8px 20px !important;
  height: 48px !important;
}

:deep(.custom-date-picker-mobile .ant-picker-input) {
  flex-direction: row-reverse;
}

:deep(.custom-date-picker-mobile .ant-picker-input input) {
  color: #317bc4 !important;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
}

:deep(.custom-date-picker-mobile .ant-picker-suffix) {
  color: #317bc4;
  margin-left: 0;
}

/* Custom Create Button Mobile */
.custom-create-button-mobile {
  border-radius: 24px !important;
  padding: 8px 24px !important;
  height: 48px !important;
  font-weight: 700;
  font-size: 16px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #fff !important;
  box-shadow: none;
  border: 2px solid #317bc4 !important;
  color: #317bc4 !important;
  line-height: 1;
}

.custom-create-button-mobile:hover {
  color: #fff !important;
  background-color: #317bc4 !important;
  opacity: 1 !important;
}

:deep(.ant-btn.ant-btn-primary) {
  background-color: #317bc4;
}

:deep(.ant-btn.ant-btn-primary:hover) {
  opacity: 0.8;
}

/* Edit Info Modal Styling */
:deep(.edit-info-modal .ant-modal) {
  width: 1088px !important;
  max-width: 90vw;
}

:deep(.edit-info-modal .ant-modal-content) {
  border-radius: 14px;
  min-height: 754px;
}

:deep(.edit-info-modal .ant-modal-body) {
  padding: 32px 40px;
}

/* Modal Title */
.edit-info-modal-title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #317bc4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 32px;
  margin-top: 0;
  width: 100%;
}

/* Form Styling */
.edit-info-form {
  width: 100%;
}

:deep(.edit-info-form-item .ant-form-item-label > label) {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

:deep(.edit-info-form-item .ant-form-item-label > label::before) {
  content: "*";
  color: #ff4d4f;
  margin-right: 4px;
}

/* Save Button */
.edit-info-save-btn {
  min-width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

:deep(.edit-info-save-btn.ant-btn-primary) {
  background-color: #1a75bb;
  border-color: #1a75bb;
}

:deep(.edit-info-save-btn.ant-btn-primary:hover) {
  background-color: #1565a0;
  border-color: #1565a0;
}

/* Input and Select Styling */
:deep(.edit-info-form .ant-input),
:deep(.edit-info-form .ant-picker),
:deep(.edit-info-form .ant-select-selector) {
  border-radius: 8px;
  border: 1px solid #d9d9d9;
}

:deep(.edit-info-form .ant-input:focus),
:deep(.edit-info-form .ant-picker:focus),
:deep(.edit-info-form .ant-select-focused .ant-select-selector) {
  border-color: #1a75bb;
  box-shadow: 0 0 0 2px rgba(26, 117, 187, 0.1);
}

/* Responsive */
@media (max-width: 1200px) {
  :deep(.edit-info-modal .ant-modal) {
    width: 90vw !important;
    max-width: 90vw;
  }

  :deep(.edit-info-modal .ant-modal-body) {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  :deep(.edit-info-modal .ant-modal) {
    width: 95vw !important;
    max-width: 95vw;
  }

  :deep(.edit-info-modal .ant-modal-content) {
    min-height: auto;
  }

  :deep(.edit-info-modal .ant-modal-body) {
    padding: 20px;
  }

  .edit-info-modal-title {
    font-size: 18px;
    margin-bottom: 24px;
  }

  .custom-create-button-mobile {
    padding: 6px 16px !important;
    height: 36px !important;
  }

  :deep(.custom-date-picker-mobile) {
    padding: 6px 16px !important;
    height: 36px !important;
  }

  :deep(.custom-date-picker .ant-picker-suffix) {
    margin-right: 0;
  }
}
</style>
