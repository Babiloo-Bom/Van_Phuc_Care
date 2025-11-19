<template>
  <div class="services-container">
    <!-- Header: Title + Tabs -->
    <div class="header-wrapper">
      <!-- Page Title -->
      <h1 class="page-title">Dịch vụ</h1>

      <!-- Tab Filter -->
      <div class="tabs-wrapper">
        <button
          class="tab-button"
          :class="{ 'tab-active': activeTab === 'used' }"
          @click="activeTab = 'used'"
        >
          Đã sử dụng
        </button>
        <button
          class="tab-button"
          :class="{ 'tab-active': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          Tất cả dịch vụ
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#317BC4]"></div>
        <p class="mt-2 text-sm text-gray-500">Đang tải...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredServices.length === 0" class="text-center py-12">
      <p class="text-gray-500">
        {{ activeTab === 'used' ? 'Bạn chưa đăng ký dịch vụ nào' : 'Không có dịch vụ nào' }}
      </p>
    </div>

    <!-- Services Grid -->
    <div v-else class="services-grid">
      <div
        v-for="service in filteredServices"
        :key="service._id"
        class="service-card"
        @click="goDetail(service)"
      >
        <!-- Thumbnail -->
        <div class="card-image-wrapper">
          <img
            v-if="service.thumbnail"
            :src="service.thumbnail"
            :alt="service.title"
            class="card-image"
          />
          <div v-else class="card-image-placeholder">
            <span class="text-4xl">💼</span>
          </div>
        </div>

        <!-- Content -->
        <div class="card-content">
          <h3 class="card-title">
            {{ service.title }}
          </h3>
          <p class="card-description">
            {{ service.shortDescriptions || service.descriptions }}
          </p>
          
          <!-- Action Button -->
          <div class="card-footer">
            <button class="detail-button">
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Link (Mobile) -->
    <div class="register-link-wrapper">
      <a href="/services/register" class="register-link">
        Đăng ký dịch vụ
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useServicesApi } from '~/composables/api/useServicesApi'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'default' })
useHead({ title: 'Dịch vụ' })

const { getServices, getMyServices } = useServicesApi()
const router = useRouter()

const services = ref<any[]>([])
const activeTab = ref<'all' | 'used'>('all')
const isLoading = ref(false)

const fetchServices = async () => {
  try {
    isLoading.value = true
    
    if (activeTab.value === 'used') {
      // Get user's registered services
      const res = await getMyServices({})
      services.value = res.data?.data || []
    } else {
      // Get all services
      const res = await getServices({})
      services.value = res.data?.data || []
    }
  } catch (e) {
    console.error('Error fetching services:', e)
    services.value = []
  } finally {
    isLoading.value = false
  }
}

// Watch activeTab changes to fetch data
watch(activeTab, () => {
  fetchServices()
})

onMounted(fetchServices)

const filteredServices = computed<any[]>(() => {
  return services.value
})

function goDetail(service: any) {
  router.push(`/services/${service.slug || service._id}`)
}
</script>

<style scoped>
/* Container */
.services-container {
  @apply w-full;
}

/* Header */
.header-wrapper {
  @apply flex flex-col items-center mb-6;
  @apply md:flex-row md:justify-between md:items-center md:mb-8;
}

.page-title {
  @apply text-2xl font-bold text-[#317BC4] mb-4;
  @apply md:text-3xl md:mb-0;
  font-family: 'SVN-Gilroy', sans-serif;
}

/* Tabs */
.tabs-wrapper {
  @apply flex gap-3;
}

.tab-button {
  @apply px-6 py-2 rounded-full font-semibold text-sm transition-all;
  @apply bg-[#E5E5E5] text-[#999999];
  font-family: 'SVN-Gilroy', sans-serif;
}

.tab-button.tab-active {
  @apply bg-[#317BC4] text-white;
}

.tab-button:hover {
  @apply opacity-90;
}

/* Grid */
.services-grid {
  @apply grid grid-cols-1 gap-4 mb-8;
  @apply md:grid-cols-2 md:gap-5;
}

/* Card */
.service-card {
  @apply bg-white rounded-2xl overflow-hidden cursor-pointer;
  @apply border border-gray-100 shadow-sm;
  @apply transition-all duration-300;
  @apply hover:shadow-md;
}

.card-image-wrapper {
  @apply w-full aspect-video overflow-hidden bg-gray-50;
}

.card-image {
  @apply w-full h-full object-cover;
}

.card-image-placeholder {
  @apply w-full h-full flex items-center justify-center;
  @apply bg-gradient-to-br from-blue-50 to-blue-100;
}

.card-content {
  @apply p-4;
}

.card-title {
  @apply text-base font-bold text-[#317BC4] mb-2;
  @apply line-clamp-1;
  font-family: 'SVN-Gilroy', sans-serif;
}

.card-description {
  @apply text-sm text-[#9CA3AF] mb-3;
  @apply line-clamp-2 min-h-[40px];
  font-family: 'SVN-Gilroy', sans-serif;
}

.card-footer {
  @apply flex justify-end;
}

.detail-button {
  @apply text-sm font-semibold text-[#317BC4];
  @apply hover:underline transition-all;
  font-family: 'SVN-Gilroy', sans-serif;
}

/* Register Link */
.register-link-wrapper {
  @apply hidden;
  @apply md:hidden text-center mt-6 pt-6 border-t border-gray-200;
}

.register-link {
  @apply text-sm font-semibold text-[#317BC4];
  @apply hover:underline;
  font-family: 'SVN-Gilroy', sans-serif;
}

/* Mobile specific */
@media (max-width: 767px) {
  .services-container {
    @apply px-4;
  }

  .header-wrapper {
    @apply mb-4;
  }

  .page-title {
    @apply text-center text-xl mb-3;
  }

  .tabs-wrapper {
    @apply justify-center gap-2;
  }

  .tab-button {
    @apply px-5 py-1.5 text-xs;
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

  .register-link-wrapper {
    @apply block;
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
