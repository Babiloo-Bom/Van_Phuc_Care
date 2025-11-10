<template>
  <div class="">
    <!-- Hero Banner -->
    <div
      class="h-auto md:mb-[5rem] sm:h-[500px] py-10 sm:pt-20 sm:pb-20 md:pb-60 bg-cover bg-center bg-no-repeat bg-[url('https://cdn.synck.io.vn/vanphuccare/banner/main.webp')]
             relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
    >
      <div class="container h-full">
        <div class="relative z-[1] flex flex-col h-full gap-6">
          <!-- Centered Content -->
          <div class="text-white text-center">
            <div class="flex items-center justify-center gap-4 flex-wrap mb-4">
              <h4 class="text-3xl sm:text-4xl font-bold text-white">
                Tất cả khóa học
              </h4>
              <div class="flex items-center rounded-full py-1.5 px-5 border-[1px] border-solid border-white gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                <span>{{ coursesStore.courses?.length || 0 }} khóa học</span>
              </div>
            </div>
            <div class="max-w-4xl mx-auto">
              <p class="mb-0 text-lg">
                Vạn Phúc Care cung cấp những khóa học chất lượng, chuyên sâu nhất để hỗ trợ bậc phụ huynh trong hành trình nuôi dưỡng và chăm sóc con cái. Các khóa học không chỉ mang đến các chủ đề đa dạng, những kiến thức chuyên môn chuẩn Y khoa, mà còn chia sẻ những kinh nghiệm thực tế được giảng dạy bởi đội ngũ chuyên gia và cố vấn giàu kinh nghiệm trong lĩnh vực Mẹ và Bé.
              </p>
            </div>
          </div>
          
          <!-- Bottom Section -->
          <div class="mt-auto">
            <div class="flex flex-col items-center gap-6">
              <!-- Search Bar -->
              <div class="w-full max-w-md">
                <a-input
                  v-model:value="searchKey"
                  placeholder="Tìm kiếm khóa học"
                  class="!bg-transparent custom_input"
                  @change="handleSearch"
                >
                  <template #suffix>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      class="fill-none stroke-white"
                    >
                      <path
                        d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </template>
                </a-input>
              </div>
              
              <!-- Filter Options -->
              <div class="flex flex-wrap items-center gap-4 justify-center">
                <!-- Category Filter -->
                <a-select
                  v-model:value="selectedCategory"
                  placeholder="Chọn danh mục"
                  class="!w-48 !bg-white/10 !border-white/30"
                  @change="handleCategoryChange"
                >
                  <a-select-option value="">Tất cả danh mục</a-select-option>
                  <a-select-option 
                    v-for="category in categories" 
                    :key="category" 
                    :value="category"
                  >
                    {{ category }}
                  </a-select-option>
                </a-select>
                
                <!-- Level Filter -->
                <a-select
                  v-model:value="selectedLevel"
                  placeholder="Chọn cấp độ"
                  class="!w-48 !bg-white/10 !border-white/30"
                  @change="handleLevelChange"
                >
                  <a-select-option value="">Tất cả cấp độ</a-select-option>
                  <a-select-option value="beginner">Cơ bản</a-select-option>
                  <a-select-option value="intermediate">Trung bình</a-select-option>
                  <a-select-option value="advanced">Nâng cao</a-select-option>
                </a-select>
                
                <!-- Sort Options -->
                <a-select
                  v-model:value="sortBy"
                  placeholder="Sắp xếp theo"
                  class="!w-48 !bg-white/10 !border-white/30"
                  @change="handleSortChange"
                >
                  <a-select-option value="priority">Ưu tiên (Đã mua → Chưa mua → Hoàn thành)</a-select-option>
                  <a-select-option value="price-low">Giá thấp → cao</a-select-option>
                  <a-select-option value="price-high">Giá cao → thấp</a-select-option>
                  <a-select-option value="newest">Mới nhất</a-select-option>
                  <a-select-option value="rating">Đánh giá cao nhất</a-select-option>
                </a-select>
              </div>
              
              <!-- App Download Buttons -->
              <div class="flex flex-col sm:flex-row items-center gap-4">
                <div class="w-auto cursor-pointer">
                  <img class="w-[140px] h-auto object-contain" src="/images/download-google-app.png" alt="Google Play" />
                </div>
                <div class="w-auto cursor-pointer">
                  <img class="w-[140px] h-auto object-contain" src="/images/download-iphone-app.png" alt="App Store" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses Section -->
    <section class="pb-20 p-4 lg:pt-20 sm:pt-0 bg-[#f4f7f9]">
      <div class="container mx-auto !px-0 md:!px-auto">
        <div v-if="!loading">
          <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32">
            <CourseCard
              v-for="(course, index) in filteredCourses"
              :key="index"
              :course="course"
              :is-purchased="isPurchased(course._id)"
              @add-to-cart="handleAddToCart"
              @buy-now="handleBuyNow"
              @view-detail="handleViewDetail"
            />
          </div>
          <div v-else class="pt-20">
            <a-empty description="Chưa có khóa học nào" />
          </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32">
          <div
            v-for="index in [1, 2, 3, 4]"
            :key="index"
            class="bg-white rounded-lg shadow-sm animate-pulse"
          >
            <div class="h-48 bg-gray-200 rounded-t-lg" />
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-4 bg-gray-200 rounded w-1/2" />
              <div class="h-8 bg-gray-200 rounded w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cart Toast -->
    <CartToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCoursesStore } from '~/stores/courses'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useCourseApi } from '~/composables/useCourseApi'
import CourseCard from '~/components/courses/CourseCard.vue'
import CartToast from '~/components/cart/Toast.vue'

// SEO Configuration for SPA mode

// Function to update SEO meta tags
const updateSEOMetaTags = () => {
  // Update document title
  document.title = 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam'
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.')
  }
  
  // Add Open Graph tags
  const addMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }
  
  const addMetaName = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }
  
  // Open Graph tags
  addMetaTag('og:title', 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam')
  addMetaTag('og:description', 'Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.')
  addMetaTag('og:url', 'https://vanphuccare.com')
  addMetaTag('og:image', 'https://vanphuccare.com/images/og-home.jpg')
  addMetaTag('og:image:width', '1200')
  addMetaTag('og:image:height', '630')
  
  // Twitter Card tags
  addMetaName('twitter:card', 'summary_large_image')
  addMetaName('twitter:title', 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam')
  addMetaName('twitter:description', 'Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.')
  addMetaName('twitter:image', 'https://vanphuccare.com/images/og-home.jpg')
  
  // Keywords
  addMetaName('keywords', 'học trực tuyến, e-learning, khóa học online, lập trình, marketing, thiết kế, khoa học dữ liệu, Van Phuc Care, học online, giáo dục trực tuyến')
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', 'https://vanphuccare.com')
  
}

// Also use useHead as fallback
useHead({
  title: 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam',
  meta: [
    {
      name: 'description',
      content: 'Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.'
    },
    {
      name: 'keywords',
      content: 'học trực tuyến, e-learning, khóa học online, lập trình, marketing, thiết kế, khoa học dữ liệu, Van Phuc Care, học online, giáo dục trực tuyến'
    },
    {
      property: 'og:title',
      content: 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam'
    },
    {
      property: 'og:description',
      content: 'Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://vanphuccare.com'
    },
    {
      property: 'og:image',
      content: 'https://vanphuccare.com/images/og-home.jpg'
    },
    {
      property: 'og:image:width',
      content: '1200'
    },
    {
      property: 'og:image:height',
      content: '630'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam'
    },
    {
      name: 'twitter:description',
      content: 'Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.'
    },
    {
      name: 'twitter:image',
      content: 'https://vanphuccare.com/images/og-home.jpg'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://vanphuccare.com'
    }
  ]
})


// Schema.org markup for Homepage (temporarily disabled for testing)
// useSchemaOrg([
//   {
//     '@type': 'WebSite',
//     name: 'Van Phuc Care E-Learning',
//     url: 'https://vanphuccare.com',
//     description: 'Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao',
//     publisher: {
//       '@type': 'Organization',
//       name: 'Van Phuc Care',
//       url: 'https://vanphuccare.com',
//       logo: 'https://vanphuccare.com/images/logo.png'
//     },
//     potentialAction: {
//       '@type': 'SearchAction',
//       target: 'https://vanphuccare.com/courses?search={search_term_string}',
//       'query-input': 'required name=search_term_string'
//     }
//   },
//   {
//     '@type': 'Organization',
//     name: 'Van Phuc Care',
//     url: 'https://vanphuccare.com',
//     logo: 'https://vanphuccare.com/images/logo.png',
//     description: 'Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao',
//     foundingDate: '2024',
//     address: {
//       '@type': 'PostalAddress',
//       addressCountry: 'VN',
//       addressLocality: 'Việt Nam'
//     },
//     contactPoint: {
//       '@type': 'ContactPoint',
//       telephone: '+84-xxx-xxx-xxx',
//       contactType: 'customer service',
//       availableLanguage: 'Vietnamese'
//     },
//     sameAs: [
//       'https://facebook.com/vanphuccare',
//       'https://youtube.com/vanphuccare',
//       'https://linkedin.com/company/vanphuccare'
//     ]
//   },
//   {
//     '@type': 'EducationalOrganization',
//     name: 'Van Phuc Care E-Learning',
//     url: 'https://vanphuccare.com',
//     description: 'Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao',
//     address: {
//       '@type': 'PostalAddress',
//       addressCountry: 'VN',
//       addressLocality: 'Việt Nam'
//     },
//     hasOfferCatalog: {
//       '@type': 'OfferCatalog',
//       name: 'Khóa học trực tuyến',
//       itemListElement: computed(() => 
//         courses.value.map((course, index) => ({
//           '@type': 'Course',
//           name: course.title,
//           description: course.shortDescription,
//           url: `https://vanphuccare.com/courses/${course.slug}`,
//           image: `https://vanphuccare.com${course.thumbnail}`,
//           offers: {
//             '@type': 'Offer',
//             price: course.price,
//             priceCurrency: 'VND',
//             availability: 'https://schema.org/InStock'
//           }
//         }))
//       )
//     }
//   }
// ])

const coursesStore = useCoursesStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const courseApi = useCourseApi()

const loading = ref(false)
const searchKey = ref('')
const courses = ref([]) // Local reactive state

// Filter states
const selectedCategory = ref('')
const selectedLevel = ref('')
const sortBy = ref('priority')

// Computed
const categories = computed(() => {
  const sourceCourses = courses.value.length > 0 ? courses.value : coursesStore.courses
  const cats = [...new Set(sourceCourses.map(course => course.category).filter(Boolean))]
  return cats
})

const filteredCourses = computed(() => {
  
  // Use local state as primary source
  let sourceCourses = courses.value.length > 0 ? courses.value : coursesStore.courses
  
  // Apply search filter
  if (searchKey.value) {
    sourceCourses = sourceCourses.filter(course =>
      course.title.toLowerCase().includes(searchKey.value.toLowerCase()) ||
      course.shortDescription?.toLowerCase().includes(searchKey.value.toLowerCase())
    )
  }
  
  // Apply category filter
  if (selectedCategory.value) {
    sourceCourses = sourceCourses.filter(course => course.category === selectedCategory.value)
  }
  
  // Apply level filter
  if (selectedLevel.value) {
    sourceCourses = sourceCourses.filter(course => course.level === selectedLevel.value)
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'priority':
      // Đã mua → Chưa mua → Hoàn thành
      sourceCourses = sourceCourses.sort((a, b) => {
        const aPurchased = isPurchased(a._id)
        const bPurchased = isPurchased(b._id)
        const aCompleted = authStore.user?.courseCompleted?.includes(a._id) || false
        const bCompleted = authStore.user?.courseCompleted?.includes(b._id) || false
        
        if (aPurchased && !bPurchased) return -1
        if (!aPurchased && bPurchased) return 1
        if (aCompleted && !bCompleted) return 1
        if (!aCompleted && bCompleted) return -1
        return 0
      })
      break
    case 'price-low':
      sourceCourses = sourceCourses.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price-high':
      sourceCourses = sourceCourses.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'newest':
      sourceCourses = sourceCourses.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      break
    case 'rating':
      sourceCourses = sourceCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
  }
  
  return sourceCourses
})

// Methods
const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement
  searchKey.value = target.value || ''
}

// Filter handlers
const handleCategoryChange = (value: string) => {
  selectedCategory.value = value
}

const handleLevelChange = (value: string) => {
  selectedLevel.value = value
}

const handleSortChange = (value: string) => {
  sortBy.value = value
}

const isPurchased = (courseId: string) => {
  const purchased = authStore.user?.courseRegister?.includes(courseId) || false
  return purchased
}

// Cart handlers
const handleAddToCart = async (course: any) => {
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1 })
  } catch (error) {
    console.error('❌ Error adding to cart:', error)
  }
}

const handleBuyNow = async (course: any) => {
  try {
    // Add to cart first
    await cartStore.addToCart({ courseId: course._id, quantity: 1 })
    // Navigate to checkout
    navigateTo('/checkout')
  } catch (error) {
    console.error('❌ Error buying now:', error)
  }
}

const handleViewDetail = (course: any) => {
  try {
    // Navigate to course detail page
    navigateTo(`/courses/${course.slug}`)
  } catch (error) {
    console.error('❌ Error viewing detail:', error)
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    await coursesStore.fetchAll()
  } catch (error) {
    console.error('Error fetching courses:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Update SEO meta tags first
  updateSEOMetaTags()
  
  await authStore.initAuth()
  
  // Fetch courses
  await fetchData()
  
  // Only load cart if user is logged in
  if (authStore.isLoggedIn) {
    await cartStore.fetchCart()
  }
})
</script>

<style scoped>
.custom_input :deep(.ant-input) {
  @apply bg-transparent placeholder:text-white rounded-full hover:border-white focus:border-white outline-none text-white py-6 px-4;
}

.card-img-loading {
  min-height: 400px;
}
</style>
