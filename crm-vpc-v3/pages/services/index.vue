<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dịch vụ</h1>
        <p class="text-gray-600 mt-2">Các dịch vụ chăm sóc mẹ và bé</p>
      </div>
      <!-- Có thể thêm nút đăng ký dịch vụ nếu cần -->
    </div>

    <div class="flex gap-4 mb-6">
      <button
        class="px-4 py-2 rounded-full font-semibold"
        :class="{ 'bg-primary-500 text-white': activeTab === 'used', 'bg-gray-100 text-gray-700': activeTab !== 'used' }"
        @click="activeTab = 'used'"
      >Đã sử dụng</button>
      <button
        class="px-4 py-2 rounded-full font-semibold"
        :class="{ 'bg-primary-500 text-white': activeTab === 'all', 'bg-gray-100 text-gray-700': activeTab !== 'all' }"
        @click="activeTab = 'all'"
      >Tất cả dịch vụ</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in filteredServices"
        :key="service._id"
        class="card hover:shadow-xl transition-shadow bg-white rounded-xl border border-gray-100 p-4 flex flex-col"
      >
        <div class="aspect-video rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-gray-50">
          <img
            v-if="service.thumbnail"
            :src="service.thumbnail"
            alt="service"
            class="object-cover w-full h-full"
          />
          <span v-else class="text-5xl">💼</span>
        </div>
        <h3 class="text-lg font-semibold text-primary-700 mb-2">{{ service.title }}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ service.shortDescriptions || service.descriptions }}</p>
        <div class="flex justify-between items-center mb-4">
          <span class="px-2 py-1 text-xs rounded-full" :class="service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'">
            {{ service.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng' }}
          </span>
        </div>
        <button class="text-primary-500 font-semibold text-sm underline w-fit" @click="goDetail(service)">Chi tiết</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServicesApi } from '~/composables/api/useServicesApi'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'default' })
useHead({ title: 'Dịch vụ' })

const { getServices } = useServicesApi()
const router = useRouter()

const services = ref<any[]>([])
const activeTab = ref<'all' | 'used'>('all')

const fetchServices = async () => {
  try {
    const res = await getServices({})
    services.value = res.data?.data || []
  } catch (e) {
    // handle error
  }
}

onMounted(fetchServices)

const filteredServices = computed<any[]>(() => {
  if (activeTab.value === 'used') {
    return services.value.filter(s => s.used)
  }
  return services.value
})

function goDetail(service: any) {
  router.push(`/services/${service.slug || service._id}`)
}
</script>

<style scoped>
.card {
  min-height: 340px;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
