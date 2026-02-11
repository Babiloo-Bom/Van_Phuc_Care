<template>
  <div class="banner-slider-wrapper relative">
    <!-- Swiper Container -->
    <swiper
      v-if="hasBanners"
      :modules="modules"
      :slides-per-view="1"
      :loop="banners.length > 1"
      :autoplay="banners.length > 1 ? {
        delay: 5000,
        disableOnInteraction: false,
      } : false"
      :pagination="banners.length > 1 ? { clickable: true } : false"
      class="banner-swiper"
      @swiper="onSwiper"
    >
      <swiper-slide
        v-for="(banner, index) in banners"
        :key="banner._id || index"
        class="banner-slide"
      >
        <div
          class="block w-full h-full cursor-pointer"
          @click="handleBannerClick(banner)"
        >
          <div
            class="banner-item md:mb-[5rem] h-[480px] min-h-[480px] max-h-[480px] w-full py-10 sm:pt-20 sm:pb-20 md:pb-60 relative z-[1] overflow-hidden"
          >
            <NuxtImg
              :src="banner.image || '/images/home/banner.png'"
              alt=""
              class="absolute inset-0 w-full h-full object-cover"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :preload="index === 0"
              sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
              width="1920"
              height="480"
            />
            <div class="absolute inset-0 opacity-60 bg-prim-100"></div>
            <div class="absolute inset-0 bg-[#1A75BBB2]"></div>
            <div class="container h-full" :class="props.pageType === 'all-courses' ? 'mx-auto !px-0 md:!px-auto' : props.pageType === 'my-courses' ? 'mx-auto' : ''">
              <div
                class="relative z-[1] flex flex-col items-center md:items-start h-full gap-6"
              >
                <div class="text-white w-full px-4 lg:px-0 xl:px-4 flex flex-col items-center lg:items-start">
                  <div class="flex flex-row flex-nowrap items-center justify-between md:justify-start gap-2 md:gap-6 w-full max-w-[400px] sm:max-w-[440px] md:max-w-full">
                    <!-- Title (h2 cho thứ tự heading SEO/A11y: h1 -> h2) -->
                    <h2 class="text-[28px] sm:text-3xl md:text-4xl font-bold text-white mb-0">
                      {{ defaultTitle }}
                    </h2>

                    <!-- Course Count (only for all-courses page) -->
                    <div
                      v-if="showCourseCount"
                      class="flex items-center rounded-full md:mt-1 py-1.5 px-2 md:px-5 border-[1px] border-solid border-white gap-3 w-fit"
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          class="fill-none stroke-white"
                        >
                          <path
                            d="M3.17 7.44 12 12.55l8.77-5.08M12 21.61v-9.07"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9.93 2.48 4.59 5.44c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.17c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.63-3.01-.63-4.15.01Z"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span class="text-xs leading-none"> {{ courseCount }} khóa học </span>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="mt-4 hidden md:block">
                    <p class="mb-0 md:max-w-[800px] text-white leading-relaxed">
                      {{ defaultDescription }}
                    </p>
                  </div>

                  <!-- Slot for additional content (e.g., search box) -->
                  <div v-if="$slots.default" class="w-full text-center mt-4 md:text-left">
                    <slot />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- Fallback Banner (if no banners from API) -->
    <div
      v-else
      class="md:mb-[5rem] h-[480px] min-h-[480px] max-h-[480px] w-full py-10 sm:pt-20 sm:pb-20 md:pb-60 relative z-[1] overflow-hidden"
    >
      <NuxtImg
        src="/images/home/banner.png"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
        width="1920"
        height="480"
        format="webp"
      />
      <div class="absolute inset-0 opacity-60 bg-prim-100"></div>
      <div class="absolute inset-0 bg-[#1A75BBB2]"></div>
      <div class="container h-full" :class="props.pageType === 'all-courses' ? 'mx-auto !px-0 md:!px-auto' : props.pageType === 'my-courses' ? 'mx-auto' : ''">
        <div
          class="relative z-[1] flex flex-col items-center md:items-start h-full gap-6"
        >
          <div class="text-white w-full px-4 lg:px-0 xl:px-4 flex flex-col items-center lg:items-start">
            <div class="flex flex-row flex-nowrap items-center justify-between md:justify-start gap-2 md:gap-6 w-full max-w-[400px] sm:max-w-[440px] md:max-w-full">
              <h2 class="text-[28px] sm:text-3xl md:text-4xl font-bold text-white mb-0">
                {{ defaultTitle }}
              </h2>
              <div
                v-if="showCourseCount"
                class="flex items-center rounded-full md:mt-1 py-1.5 px-2 md:px-5 border-[1px] border-solid border-white gap-3 w-fit"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    class="fill-none stroke-white"
                  >
                    <path
                      d="M3.17 7.44 12 12.55l8.77-5.08M12 21.61v-9.07"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.93 2.48 4.59 5.44c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.17c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.63-3.01-.63-4.15.01Z"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="text-xs leading-none">{{ courseCount }} khóa học</span>
              </div>
            </div>
            <div class="mt-4 hidden md:block">
              <p class="mb-0 md:max-w-[800px] text-white leading-relaxed">
                {{ defaultDescription }}
              </p>
            </div>

            <!-- Slot for additional content (e.g., search box) -->
            <div v-if="$slots.default" class="w-full text-center mt-4 md:text-left">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { useBannersApi } from '~/composables/api/useBannersApi'

// Register Swiper modules
const modules = [Autoplay, Pagination]

interface Banner {
  _id: string
  page: string
  title: string
  image: string
  url?: string
  order: number
  status: string
  description?: string
}

interface Props {
  pageType: 'all-courses' | 'my-courses'
  defaultTitle?: string
  defaultDescription?: string
  showCourseCount?: boolean
  courseCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultTitle: 'Khóa học',
  defaultDescription: '',
  showCourseCount: false,
  courseCount: 0,
})

const banners = ref<Banner[]>([])
const loading = ref(false)
const swiperInstance = ref<any>(null)
const { getBanners } = useBannersApi()

// Computed để kiểm tra có banners hay không - đảm bảo reactivity
const hasBanners = computed(() => banners.value && banners.value.length > 0)


const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper
}

const handleBannerClick = (banner: Banner) => {
  if (banner.url && banner.url !== '#') {
    // Analytics tracking can be added here
    // Navigate to the URL in the same tab
    window.location.href = banner.url
  }
}

const fetchBanners = async () => {
  loading.value = true
  try {
    const data = await getBanners(props.pageType)
    if (Array.isArray(data) && data.length > 0) {
      banners.value = data
    } else {
      banners.value = []
    }
  } catch (error) {
    banners.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBanners()
})
</script>

<style scoped>
.banner-slider-wrapper {
  width: 100%;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-slide {
  width: 100%;
  height: 100%;
}

.banner-item {
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.banner-item:hover {
  transform: scale(1.01);
}

/* Swiper pagination customization */
:deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
}

</style>

