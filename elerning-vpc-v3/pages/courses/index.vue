<template>
  <div class="">
    <!-- Banner Section -->
    <div
      class="h-auto md:mb-[5rem] sm:h-[500px] py-10 sm:pt-20 sm:pb-20 md:pb-60 bg-cover bg-center bg-no-repeat bg-[url('https://cdn.synck.io.vn/vanphuccare/banner/main.webp')]
              relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
    >
      <div class="container h-full">
        <div class="relative z-[1] flex flex-col h-full gap-6">
          <div class="text-white">
            <div class="flex items-center gap-4 flex-wrap">
              <h4 class="text-3xl sm:text-4xl font-bold text-white mb-1">
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
                  ><path
                    d="M3.17 7.44 12 12.55l8.77-5.08M12 21.61v-9.07"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  /><path
                    d="M9.93 2.48 4.59 5.44c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.17c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.63-3.01-.63-4.15.01Z"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  /></svg>
                </span>
                <span v-if="searchKey">
                  {{ filteredCourses?.length }} kết quả cho "{{ searchKey }}"
                </span>
                <span v-else>
                  {{ filteredCourses?.length }} khóa học
                </span>
              </div>
            </div>
            <div class="mt-4">
              <p class="mb-0 md:max-w-[70%] text-white leading-relaxed">
                Vạn Phúc Care cung cấp những khóa học chất lượng, chuyên sâu nhất để hỗ trợ bậc phụ huynh trong hành trình nuôi dưỡng và chăm sóc con cái. Các khóa học không chỉ mang đến các chủ đề đa dạng, những kiến thức chuyên môn chuẩn Y khoa, mà còn chia sẻ những kinh nghiệm thực tế được giảng dạy bởi đội ngũ chuyên gia và cố vấn giàu kinh nghiệm trong lĩnh vực Mẹ và Bé.
              </p>
            </div>
          </div>
          <div class="mt-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              <div class="w-full">
                <a-input
                  v-model="searchKey"
                  placeholder="Tìm kiếm theo tên, mô tả, danh mục, tags..."
                  class="!bg-transparent custom_input w-full"
                  @change="handleSearch"
                >
                  <i slot="suffix">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      class="fill-none stroke-white"
                    ><path
                      d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    /></svg>
                  </i>
                </a-input>
              </div>
              <div class="w-full">
                <div class="flex items-center justify-center md:justify-end gap-4">
                  <div class="w-auto cursor-pointer">
                    <img class="w-[150px] md:w-auto object-cover h-auto" src="/images/download-google-app.png" alt="Google Play">
                  </div>
                  <div class="w-auto cursor-pointer">
                    <img class="w-[150px] md:w-auto object-cover h-auto" src="/images/download-iphone-app.png" alt="App Store">
                  </div>
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
          <div v-if="filteredCourses.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32">
            <CourseCard
              v-for="(course, index) in filteredCourses"
              :key="index"
              :course="course"
              :is-purchased="isPurchased(course._id)"
              @add-to-cart="handleAddToCart"
              @buy-now="handleBuyNow"
              @view-detail="handleViewDetail"
              class=""
            />
          </div>
          <div v-else class="pt-20">
            <a-empty descriptions="Chưa có khóa học nào" />
          </div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32">
          <div
            v-for="index in [1,2,3,4]"
            :key="index"
            class=""
          >
            <Skeleton />
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
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import CourseCard from '~/components/courses/CourseCard.vue'
import Skeleton from '~/components/shared/Skeleton.vue'
import CartToast from '~/components/cart/Toast.vue'

// Store
const courseStore = useCoursesStore()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Reactive data
const loading = ref(false)
const searchKey = ref('')

// Computed
const courses = computed(() => courseStore.courses)

// Computed để xác định trạng thái khóa học
const getCourseStatus = (courseId: string) => {
  if (!authStore.user) return 'not_purchased'
  
  if (authStore.user.courseCompleted?.includes(courseId)) return 'completed'
  if (authStore.user.courseRegister?.includes(courseId)) return 'purchased'
  return 'not_purchased'
}

// Check if course is purchased
const isPurchased = (courseId: string) => {
  const purchased = authStore.user?.courseRegister?.includes(courseId) || false
  return purchased
}

// Computed để sắp xếp theo thứ tự ưu tiên
const sortedCourses = computed(() => {
  const authStore = useAuthStore()
  if (!authStore.user) return courses.value
  
  return [...courses.value].sort((a, b) => {
    const statusA = getCourseStatus(a._id)
    const statusB = getCourseStatus(b._id)
    
    // Thứ tự ưu tiên: purchased -> not_purchased -> completed
    const priority: Record<string, number> = {
      'purchased': 1,
      'not_purchased': 2,
      'completed': 3
    }
    
    return (priority[statusA] || 2) - (priority[statusB] || 2)
  })
})

const filteredCourses = computed(() => {
  if (!searchKey.value) return sortedCourses.value
  
  const searchTerm = searchKey.value.toLowerCase().trim()
  if (!searchTerm) return sortedCourses.value
  
  
  const results = sortedCourses.value.filter(course => {
    // Tìm kiếm theo title
    const titleMatch = course.title?.toLowerCase().includes(searchTerm) || false
    
    // Tìm kiếm theo shortDescription
    const shortDescMatch = course.shortDescription?.toLowerCase().includes(searchTerm) || false
    
    // Tìm kiếm theo description
    const descMatch = course.description?.toLowerCase().includes(searchTerm) || false
    
    // Tìm kiếm theo category
    const categoryMatch = course.category?.toLowerCase().includes(searchTerm) || false
    
    // Tìm kiếm theo tags
    const tagsMatch = course.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    ) || false
    
    const isMatch = titleMatch || shortDescMatch || descMatch || categoryMatch || tagsMatch
    
    if (isMatch) {
    }
    
    return isMatch
  })
  
  return results
})

// Methods
const handleSearch = (e: any) => {
  searchKey.value = e.target.value || ''
}

const fetchCourses = async () => {
  try {
    loading.value = true
    await courseStore.fetchAll()
  } catch (error) {
    console.error('Error fetching courses:', error)
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async (course: any) => {
  if (!course._id) {
    console.error('❌ Course ID is missing!')
    return
  }
  
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1 })
  } catch (error) {
    console.error('❌ Error adding to cart:', error)
  }
}

const handleBuyNow = async (course: any) => {
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1 })
    navigateTo('/checkout')
  } catch (error) {
    console.error('❌ Error buying now:', error)
  }
}

const handleViewDetail = (course: any) => {
  try {
    navigateTo(`/courses/${course.slug}`)
  } catch (error) {
    console.error('❌ Error viewing detail:', error)
  }
}

// Lifecycle
onMounted(async () => {
  authStore.initAuth()
  await fetchCourses()
})

// Page meta
definePageMeta({
  layout: 'default'
})

// SEO Configuration for SPA mode

// Use direct DOM manipulation for SPA mode
if (process.client) {
  // Update document title
  document.title = 'Tất Cả Khóa Học - Van Phuc Care E-Learning'
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Khám phá các khóa học trực tuyến chất lượng cao tại Van Phuc Care. Từ lập trình, marketing, thiết kế đến khoa học dữ liệu - học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.')
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
  addMetaTag('og:title', 'Tất Cả Khóa Học - Van Phuc Care E-Learning')
  addMetaTag('og:description', 'Khám phá các khóa học trực tuyến chất lượng cao tại Van Phuc Care. Từ lập trình, marketing, thiết kế đến khoa học dữ liệu - học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.')
  addMetaTag('og:url', 'https://vanphuccare.com/courses')
  addMetaTag('og:image', 'https://vanphuccare.com/images/og-courses.jpg')
  
  // Twitter Card tags
  addMetaName('twitter:card', 'summary_large_image')
  addMetaName('twitter:title', 'Tất Cả Khóa Học - Van Phuc Care E-Learning')
  addMetaName('twitter:description', 'Khám phá các khóa học trực tuyến chất lượng cao tại Van Phuc Care. Từ lập trình, marketing, thiết kế đến khoa học dữ liệu - học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.')
  addMetaName('twitter:image', 'https://vanphuccare.com/images/og-courses.jpg')
  
  // Keywords
  addMetaName('keywords', 'khóa học trực tuyến, e-learning, lập trình, marketing, thiết kế, khoa học dữ liệu, học online, Van Phuc Care')
  
  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', 'https://vanphuccare.com/courses')
  
}

// Also use useHead as fallback
useHead({
  title: 'Tất Cả Khóa Học - Van Phuc Care E-Learning',
  meta: [
    {
      name: 'description',
      content: 'Khám phá các khóa học trực tuyến chất lượng cao tại Van Phuc Care. Từ lập trình, marketing, thiết kế đến khoa học dữ liệu - học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.'
    },
    {
      name: 'keywords',
      content: 'khóa học trực tuyến, e-learning, lập trình, marketing, thiết kế, khoa học dữ liệu, học online, Van Phuc Care'
    },
    {
      property: 'og:title',
      content: 'Tất Cả Khóa Học - Van Phuc Care E-Learning'
    },
    {
      property: 'og:description',
      content: 'Khám phá các khóa học trực tuyến chất lượng cao tại Van Phuc Care. Từ lập trình, marketing, thiết kế đến khoa học dữ liệu - học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://vanphuccare.com/courses'
    },
    {
      property: 'og:image',
      content: 'https://vanphuccare.com/images/og-courses.jpg'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Tất Cả Khóa Học - Van Phuc Care E-Learning'
    },
    {
      name: 'twitter:description',
      content: 'Khám phá các khóa học trực tuyến chất lượng cao tại Van Phuc Care. Từ lập trình, marketing, thiết kế đến khoa học dữ liệu - học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.'
    },
    {
      name: 'twitter:image',
      content: 'https://vanphuccare.com/images/og-courses.jpg'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://vanphuccare.com/courses'
    }
  ]
})

// Schema.org markup for Course List (temporarily disabled for testing)
// useSchemaOrg([
//   {
//     '@type': 'ItemList',
//     name: 'Danh sách khóa học trực tuyến',
//     description: 'Tất cả các khóa học trực tuyến chất lượng cao tại Van Phuc Care',
//     url: 'https://vanphuccare.com/courses',
//     numberOfItems: computed(() => courses.value.length),
//     itemListElement: computed(() => 
//       courses.value.map((course, index) => ({
//         '@type': 'ListItem',
//         position: index + 1,
//         item: {
//           '@type': 'Course',
//           name: course.title,
//           description: course.shortDescription,
//           url: `https://vanphuccare.com/courses/${course.slug}`,
//           image: `https://vanphuccare.com${course.thumbnail}`,
//           provider: {
//             '@type': 'Organization',
//             name: 'Van Phuc Care',
//             url: 'https://vanphuccare.com'
//           },
//           offers: {
//             '@type': 'Offer',
//             price: course.price,
//             priceCurrency: 'VND',
//             availability: 'https://schema.org/InStock'
//           },
//           aggregateRating: course.rating ? {
//             '@type': 'AggregateRating',
//             ratingValue: course.rating.average,
//             reviewCount: course.rating.count
//           } : undefined
//         }
//       }))
//     )
//   },
//   {
//     '@type': 'Organization',
//     name: 'Van Phuc Care',
//     url: 'https://vanphuccare.com',
//     logo: 'https://vanphuccare.com/images/logo.png',
//     description: 'Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao',
//     sameAs: [
//       'https://facebook.com/vanphuccare',
//       'https://youtube.com/vanphuccare',
//       'https://linkedin.com/company/vanphuccare'
//     ]
//   }
// ])
</script>

<style scoped>
.custom_input :deep(.ant-input) {
  @apply bg-transparent placeholder:text-white rounded-full hover:border-white focus:border-white outline-none text-white py-6 px-4 border-white;
}

.custom_input :deep(.ant-input:focus) {
  @apply border-white shadow-none;
}

.custom_input :deep(.ant-input:hover) {
  @apply border-white;
}

.card-img-loading {
  min-height: 400px;
}

/* Ensure proper spacing and alignment */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}
</style>
