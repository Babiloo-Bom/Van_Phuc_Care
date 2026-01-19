<template>
  <div class="container mx-auto">
    <!-- Header: Title only (removed tabs) -->
    <h1 class="text-3xl font-bold text-[#1A75BB] w-full text-center md:text-left mb-8 md:mb-4">Tất cả dịch vụ</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#317BC4]"></div>
        <p class="mt-2 text-sm text-gray-500">Đang tải...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredServices.length === 0" class="text-center py-12">
      <p class="text-gray-500">Không có dịch vụ nào</p>
    </div>

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div
        v-for="service in filteredServices"
        :key="service._id"
        class="service-card"
        @click="openRegisterModal(service)"
      >
        <!-- Thumbnail -->
        <div class="card-image-wrapper">
          <img
            :src="service.thumbnail || '/images/service-thumbnail-default.png'"
            :alt="service.title"
            class="card-image"
            loading="lazy"
            @error="(e) => (e.target as HTMLImageElement).src = '/images/service-thumbnail-default.png'"
          />
        </div>

        <!-- Content -->
        <div class="card-content">
          <h3 class="card-title">
            {{ service.title }}
          </h3>
          <p class="card-description">
            {{ service.shortDescriptions || service.descriptions }}
          </p>

          <!-- Action Button: Always show "Chi tiết" -->
          <div class="card-footer">
            <button class="detail-button" @click.stop="handleDetailClick(service)">Chi tiết</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <a-modal
      v-model:open="isRegisterModalOpen"
      :footer="null"
      :width="isMobile ? '90%' : 900"
      :centered="true"
      @cancel="closeRegisterModal"
      :bodyStyle="{ padding: 0 }"
      class="relative overflow-hidden rounded-xl"
    >
      <div class="register-modal">
        <!-- Registration Form -->
        <div v-if="!isRegistrationSuccess" class="modal-content-wrapper">
          <!-- Left Side: Form -->
          <div class="modal-form-section">
            <h2 class="modal-title">Đăng ký dịch vụ</h2>

            <a-form :model="registerForm" layout="vertical" @finish="handleRegisterSubmit">
              <!-- Họ và tên -->
              <a-form-item
                label="Họ và tên"
                name="fullname"
                :rules="[{ required: true, message: 'Vui lòng nhập họ và tên' }]"
              >
                <a-input v-model:value="registerForm.fullname" placeholder="Nguyễn Văn A" size="large" />
              </a-form-item>

              <!-- Số điện thoại và Email -->
              <div :class="isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'">
                <a-form-item
                  label="Số điện thoại"
                  name="phone"
                  :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]"
                >
                  <a-input v-model:value="registerForm.phone" placeholder="0923333389" size="large" />
                </a-form-item>

                <a-form-item label="Email" name="email">
                  <a-input
                    v-model:value="registerForm.email"
                    placeholder="nguyenvana@gmail.com"
                    size="large"
                    type="email"
                  />
                </a-form-item>
              </div>

              <!-- Địa chỉ -->
              <a-form-item label="Địa chỉ" name="address">
                <a-textarea
                  v-model:value="registerForm.address"
                  placeholder="Số 59 ngõ 249 Yên Duyên, Phường Yên Sở, Quận Hoàng Mai, Hà Nội"
                  :rows="3"
                  size="large"
                />
              </a-form-item>

              <!-- Submit Button -->
              <a-form-item>
                <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  block
                  :loading="isSubmitting"
                  class="register-submit-btn"
                >
                  Đăng ký ngay
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <!-- Right Side: Image (Desktop only) -->
          <div v-if="!isMobile" class="modal-image-section"></div>
          <nuxt-img
            src="/images/service/service-register.png"
            alt="Register"
            class="modal-image"
            format="webp"
            loading="lazy"
          />
        </div>

        <!-- Success Screen -->
        <div v-else class="success-screen">
          <div class="success-content">
            <!-- Mascot Image -->
            <div class="success-mascot">
              <nuxt-img
                src="/images/service/service-register.png"
                alt="Register"
                class="modal-image-success"
                format="webp"
                loading="lazy"
              />
              <nuxt-img
                src="/images/service/service-register-success.png"
                alt="Success"
                class="mascot-image"
                format="webp"
                loading="lazy"
              />
            </div>

            <!-- Success Title -->
            <h2 class="success-title">Đăng ký thành công</h2>

            <!-- Success Message -->
            <p class="success-message">
              Cảm ơn bạn đã tin tưởng và đăng ký dịch vụ của Vạn Phúc Care. Bộ phận dịch vụ khách hàng sẽ liên hệ lại
              trong thời gian sớm nhất.
            </p>

            <!-- Action Button -->
            <a-button type="primary" size="large" block @click="goToHome" class="success-btn"> Về trang chủ </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useServicesApi } from "~/composables/api/useServicesApi";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "default" });
useHead({ title: "Dịch vụ" });

const { getServices, getMyServices, registerService } = useServicesApi();
const router = useRouter();
const { user } = useAuth();
const authStore = useAuthStore();

const services = ref<any[]>([]);
const registeredServiceIds = ref<Set<string>>(new Set());
const isLoading = ref(false);
const isRegisterModalOpen = ref(false);
const isSubmitting = ref(false);
const selectedService = ref<any>(null);
const isMobile = ref(false);
const isRegistrationSuccess = ref(false);

// Default link when service has no link configured
const DEFAULT_SERVICE_LINK = "https://vanphuccare.vn/dich-vu";

const registerForm = ref({
  fullname: "",
  phone: "",
  email: "",
  address: "",
});

const fetchServices = async () => {
  try {
    isLoading.value = true;
    // Get all services
    const res = await getServices({});
    services.value = res.data?.data?.data || res.data?.data || [];

    // Get user's registered services to check duplicates
    if (user.value) {
      try {
        const myServicesRes = await getMyServices({});
        const myServices = myServicesRes.data?.data?.data || myServicesRes.data?.data || [];
        registeredServiceIds.value = new Set(myServices.map((s: any) => s.serviceId || s._id));
      } catch (e) {
      }
    }
  } catch (e) {
    services.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchServices();
  isMobile.value = window.innerWidth < 768;
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});

const filteredServices = computed<any[]>(() => {
  return services.value;
});

// Click "Chi tiết" → open configured link (or default link)
function handleDetailClick(service: any) {
  const link = service.link?.trim() || DEFAULT_SERVICE_LINK;
  window.open(link, "_blank", "noopener,noreferrer");
}

async function openRegisterModal(service: any) {
  // Check if already registered - show error immediately without opening modal
  if (registeredServiceIds.value.has(service._id)) {
    message.warning("Bạn đã đăng ký dịch vụ này rồi");
    return;
  }

  selectedService.value = service;

  // Refresh user profile to get latest data including fullAddress
  if (user.value) {
    try {
      await authStore.refreshUserData();
    } catch (e) {
    }
  }

  // Pre-fill form with user info if available
  if (user.value) {
    registerForm.value.fullname = user.value.fullname || user.value.name || "";
    registerForm.value.phone = user.value.phone || "";
    registerForm.value.email = user.value.email || "";
    registerForm.value.address = user.value.fullAddress || "";
  }

  isRegisterModalOpen.value = true;
}

function closeRegisterModal() {
  isRegisterModalOpen.value = false;
  isRegistrationSuccess.value = false;
  selectedService.value = null;
  // Reset form
  registerForm.value = {
    fullname: "",
    phone: "",
    email: "",
    address: "",
  };
}

function goToHome() {
  closeRegisterModal();
  // router.push('/')
}

async function handleRegisterSubmit() {
  if (!selectedService.value) return;

  try {
    isSubmitting.value = true;

    const response = await registerService({
      serviceId: selectedService.value._id,
      notes: `Họ tên: ${registerForm.value.fullname}\nSĐT: ${registerForm.value.phone}\nEmail: ${registerForm.value.email}\nĐịa chỉ: ${registerForm.value.address}`,
    });

    if (response.status) {
      // Add to registered set immediately
      registeredServiceIds.value.add(selectedService.value._id);
      // Show success screen instead of closing modal
      isRegistrationSuccess.value = true;
      // Refresh services list
      await fetchServices();
    } else {
      message.error(response.message || "Đăng ký thất bại!");
    }
  } catch (e: any) {
    // Error already shown by apiClient, no need to show again
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.services-container {
  @apply px-4 py-6 max-w-7xl mx-auto;
  @apply md:px-6 md:py-8;
}

.services-grid {
  @apply grid grid-cols-1 gap-4 mb-8;
  @apply sm:grid-cols-2 sm:gap-5;
  @apply lg:grid-cols-3 lg:gap-6;
  @apply xl:grid-cols-4;
}

/* Card */
.service-card {
  @apply bg-white rounded-2xl overflow-hidden cursor-pointer p-4;
  @apply border border-[#D5D5D5] shadow-sm;
  @apply transition-all duration-300;
  @apply hover:shadow-md;
}

.card-image-wrapper {
  @apply w-full aspect-video overflow-hidden bg-gray-50 relative;
}

.card-image {
  @apply w-full h-full object-cover rounded-lg;
}

.card-image-placeholder {
  @apply w-full h-full flex items-center justify-center;
  @apply bg-gradient-to-br from-blue-50 to-blue-100;
}

.card-content {
  @apply mt-4;
}

.card-title {
  @apply text-base font-bold text-[#317BC4] mb-2;
  @apply line-clamp-1;
  font-family: "SVN-Gilroy", sans-serif;
}

.card-description {
  @apply text-sm text-[#9CA3AF] mb-3;
  @apply line-clamp-2 min-h-[40px];
  font-family: "SVN-Gilroy", sans-serif;
}

.card-footer {
  @apply flex justify-end;
}

.detail-button {
  @apply text-sm font-semibold text-[#317BC4];
  @apply underline transition-all;
  font-family: "SVN-Gilroy", sans-serif;
}

.detail-button:hover {
  @apply text-[#2563a8];
}

/* Register Modal */
.register-modal {
  @apply overflow-hidden;
}

.modal-content-wrapper {
  @apply flex;
}

.modal-form-section {
  @apply flex-1 p-8 bg-white;
}

.modal-image-section {
  @apply w-72 flex items-center justify-center;
  background: linear-gradient(180deg, #e8f3ff 0%, #ffffff 100%);
}

.modal-image {
  @apply w-[500px] h-auto object-contain hidden md:block absolute -bottom-20 -right-36 -rotate-12;
}

.modal-title {
  @apply text-2xl font-bold text-[#317BC4] mb-6;
  font-family: "SVN-Gilroy", sans-serif;
}

.register-submit-btn {
  @apply bg-[#317BC4] hover:bg-[#2563a8] border-none;
  @apply h-12 text-base font-semibold;
  font-family: "SVN-Gilroy", sans-serif;
}

/* Success Screen */
.success-screen {
  @apply flex items-center justify-center p-8;
  @apply md:p-16;
  min-height: 500px;
}

.success-content {
  @apply text-center max-w-md mx-auto;
}

.modal-image-success {
  @apply h-60 w-auto object-contain;
}

.success-mascot {
  @apply flex justify-center mb-2 relative;
}

.mascot-image {
  @apply w-16 h-16 object-contain absolute left-1/2 top-[55%];
}

.success-title {
  @apply text-2xl font-bold text-[#317BC4] mb-2;
  @apply md:text-3xl md:mb-3;
  font-family: "SVN-Gilroy", sans-serif;
}

.success-message {
  @apply text-sm text-gray-600 leading-relaxed mb-2;
  @apply md:text-base md:mb-4;
  font-family: "SVN-Gilroy", sans-serif;
}

.success-btn {
  @apply bg-[#317BC4] hover:bg-[#2563a8] border-none;
  @apply h-12 text-base font-semibold rounded-lg;
  @apply md:h-14 md:text-lg;
  font-family: "SVN-Gilroy", sans-serif;
}

/* Mobile specific */
@media (max-width: 767px) {
  .services-container {
    @apply px-4;
  }

  .services-grid {
    @apply gap-3;
  }

  .card-content {
    @apply p-3;
  }

  .card-title {
    @apply text-sm mb-1.5;
  }

  .card-description {
    @apply text-xs min-h-[36px] mb-2;
  }

  .detail-button {
    @apply text-xs;
  }

  .modal-title {
    @apply text-xl mb-4;
  }

  .modal-content-wrapper {
    @apply flex-col;
  }

  .modal-form-section {
    @apply p-4;
  }

  .success-screen {
    @apply p-6;
    min-height: 400px;
  }

  .success-title {
    @apply text-xl mb-3;
  }

  .success-message {
    @apply text-sm mb-6;
  }

  .success-btn {
    @apply h-12 text-base;
  }
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
<style>
.ant-modal-content:has(.register-modal) {
  @apply bg-[#ECF5FF] p-0 rounded-md;
}
</style>
