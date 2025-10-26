<template>
  <div v-if="isCompleted" class="pt-5 py-20">
    <div class="container">
      <div>
        <ul class="text-primary-100 flex items-center gap-3 font-semibold">
          <li>
            <NuxtLink to="/my-learning">
              Khóa học của tôi
            </NuxtLink>
          </li>
          <li>
            <span>|</span>
          </li>
          <li>
            <span>{{ course.title }}</span>
          </li>
        </ul>
        <div class="flex items-center gap-3">
          <a-button class="!w-8 !px-1" type="primary" @click="goBack">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              class="fill-none stroke-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                stroke-width="1.5"
                d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
              />
            </svg>
          </a-button>
          <span class="text-xl text-primary-100 font-semibold">Về bài học của tôi</span>
        </div>
      </div>
      <section class="mt-0 sm:mt-10">
        <div class="grid grid-cols-12 md:gap-12">
          <div class="col-span-12 lg:col-span-8">
            <div>
              <div class="mt-6 text-center">
                <h3 class="text-green-100 mb-0 text-xl">
                  Chúc mừng bạn đã hoàn thành khóa học
                </h3>
                <h2 class="text-primary-100 font-semibold text-3xl">
                  {{ course.title }}
                </h2>
                <img class="mx-auto mt-4" src="/images/courses/congurations.png" alt="/" />
              </div>
              <div class="mt-6">
                <div class="border-[1px] border-solid border-gray-80 p-4 rounded">
                  <div class="flex justify-between items-center flex-wrap">
                    <span class="text-primary-100 font-semibold">Tiến trình</span>
                    <span class="font-semibold text-[#787d84]">100% Hoàn thành</span>
                    <div class="w-full flex h-2 rounded-full mt-1 overflow-hidden">
                      <div class="bg-[#14cf76] w-full" />
                      <div class="flex-1 bg-[#d9d9d9]" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <div id="certificate" ref="certificateRef" class="relative w-[100%]">
                  <img class="w-full" src="/images/courses/certificate.png" alt="/" />
                  <p class="absolute font-[400] text-[1.4rem] sm:text-[32px] top-[32%] sm:top-[37%] text-center w-full" style="left: 50%; font-family: Synck;transform: translate(-50%, 50%)">
                    {{ authStore.user?.fullname || 'Học viên' }}
                  </p>
                  <p class="absolute font-bold top-[52%] sm:top-[57%] text-[1rem] sm:text-[28px] text-center w-full text-[#1674bc]" style="left: 50%;transform: translate(-50%, 50%)">
                    {{ course.title }}
                  </p>
                  <p class="absolute font-bold text-[10px] sm:text-[12px] bottom-[23%] sm:bottom-[25%]" style="right: 21%; transform: translate(50%, 50%);">
                    {{ currentDate }}
                  </p>
                </div>
                <a-button class="!bg-prim-100 !mt-4 !text-white !flex items-center gap-2" @click="handleDownloadCertificate">
                  <span class="text-[16px] font-[500]">Tải xuống</span>
                </a-button>
              </div>
              <div class="mt-10 sm:mt-20 pt-4 border-t-[1px] border-dashed border-gray-80">
                <h2 class="text-primary-100 font-semibold text-3xl">
                  Thư ngỏ
                </h2>
                <p class="my-4 text-lg">
                  Thông qua các học phần đào tạo trực tuyến tại Vạn Phúc Care Academy, đội ngũ giảng viên chúng tôi hy vọng sẽ góp phần giúp bạn làm chủ hoàn toàn bộ kỹ năng chăm sóc sức khỏe mẹ và bé. Hệ thống bài giảng được xây dựng từ cơ bản đến chuyên sâu, thiết kế đơn giản & dễ hiểu, phù hợp với đa dạng học viên có nhu cầu học tập ngay tại nhà.
                </p>
                <ul class="!ml-6 mb-5 list-disc text-lg">
                  <li>
                    Bài học kết hợp video và lý thuyết cô đọng, minh họa dễ hiểu.
                  </li>
                  <li>
                    Mỗi học phần bài giảng đều được đính kèm tài liệu giúp học viên chủ động nghiên cứu, mở rộng vốn tri thức.
                  </li>
                </ul>
                <div class="!w-full bg-prim-100 py-3 rounded-sm cursor-pointer text-center" @click="router.push('/')">
                  <span class="text-white text-lg">Tìm hiểu tất cả khóa học</span>
                </div>
              </div>
              <div class="mt-8">
                <h2 class="text-primary-100 font-semibold text-3xl mb-2">
                  Cập nhật kiến thức mới nhất
                </h2>
                <p class="mb-1 text-lg">
                  Các học phần đào tạo được biên soạn bởi đội ngũ giảng viên Vạn Phúc Care không chỉ cung cấp kiến thức chuyên sâu và khoa học từ các chuyên gia đầu ngành, mà còn giúp bạn tự tin áp dụng vào thực tế. Cùng với đó, bạn còn có thể liên tục cập nhật thông tin mới bằng cách truy cập chuyên trang tin tức, kiến thức của chúng tôi. Các chủ đề được xây dựng xung quanh lĩnh vực chăm sóc sức khỏe mẹ và bé, dinh dưỡng và các phương pháp chăm sóc tiên tiến khác. Tất cả nội dung đều được cập nhật hàng tuần, mang đến cho bạn nguồn thông tin đáng tin cậy và hữu ích, hỗ trợ bạn hoàn thiện kỹ năng điều dưỡng, chăm sóc sức khỏe mẹ và bé
                </p>
                <div class="mb-4 sm:mb-0 !w-full bg-prim-100 py-3 rounded-sm cursor-pointer text-center mt-4" @click="router.push('/')">
                  <span class="text-white text-lg">Xem thêm kiến thức mới nhất tại đây</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
            <div>
              <NavCourse :chapters="course.chapters" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-full min-h-[60vh]">
    <a-result
      status="warning"
      title="Bạn chưa hoàn thành khóa học này"
      sub-title="Vui lòng hoàn thành tất cả các bài học để nhận chứng nhận"
    >
      <template #extra>
        <a-button type="primary" @click="router.push(`/my-learning/${route.params.slug}`)">
          Quay lại khóa học
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '~/stores/courses'
import { useAuthStore } from '~/stores/auth'
import NavCourse from '~/components/courses/NavCourse.vue'
import html2canvas from 'html2canvas'

// SEO
useHead({
  title: 'Chứng nhận - Van Phuc Care E-Learning',
})

// Middleware: Require authentication
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const totalLessonCount = ref(0)
const certificateRef = ref<HTMLElement | null>(null)

// Computed
const course = computed(() => coursesStore.course)
const processing = computed(() => coursesStore.processing)

const isCompleted = computed(() => {
  const completed = processing.value?.complete?.length || 0
  return completed === totalLessonCount.value && totalLessonCount.value > 0
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-GB')
})

// Methods
const calculateTotalLessons = (chapters: any[] = []) => {
  totalLessonCount.value = chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0)
}

const handleDownloadCertificate = async () => {
  if (!certificateRef.value) return

  try {
    const canvas = await html2canvas(certificateRef.value)
    const imageData = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = imageData
    link.download = 'certificate.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading certificate:', error)
  }
}

const goBack = () => {
  router.push(`/my-learning/${route.params.slug}`)
}

const fetchData = async () => {
  try {
    const slug = route.params.slug as string
    
    await coursesStore.fetchDetail(slug)
    await coursesStore.fetchProcessing(course.value._id)
    
    calculateTotalLessons(course.value.chapters)
  } catch (error) {
    console.error('Error fetching certificate data:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>

