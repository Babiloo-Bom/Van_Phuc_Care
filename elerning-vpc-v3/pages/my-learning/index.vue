<template>
  <div class="">
    <!-- H1 Title for SEO -->
    <h1 class="sr-only">Khóa học của tôi - Van Phuc Care E-Learning</h1>
    
    <!-- Hero Banner -->
    <BannerSlider
      page-type="my-courses"
      default-title="Khóa học của tôi"
      default-description="Tập hợp các khóa học chuyên sâu, được giảng dạy bởi các chuyên gia, cố vấn giàu kinh nghiệm trong lĩnh vực chăm sóc Mẹ và Bé giúp các bậc phụ huynh trở thành những người cha, người mẹ thông thái, hiểu biết sâu rộng về mọi khía cạnh chăm sóc trẻ sơ sinh, mang lại sự an tâm và hạnh phúc cho mỗi gia đình."
      :show-course-count="true"
      :course-count="coursesStore.myCourses?.length || 0"
    >
      <!-- Search Box -->
      <div class="w-full text-center md:text-left">
        <a-input
          v-model:value="searchKey"
          placeholder="Tìm kiếm khóa học"
          aria-label="Tìm kiếm khóa học của tôi"
          class="!bg-transparent rounded-full h-10 w-full max-w-[400px] sm:max-w-[440px] md:max-w-[340px] custom_input mx-auto md:mx-0"
          @change="handleSearch"
          @click.prevent.stop
        >
          <template #prefix>
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
    </BannerSlider>

    <!-- Courses Section -->
    <section class="pb-20 p-4 lg:pt-20 sm:pt-10 bg-[#f4f7f9] relative z-10">
      <div class="container mx-auto !px-0 md:!px-auto">
        <div v-if="!loading">
          <div
            v-if="filteredCourses.length"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-[-348px] sm:mt-[-328px] md:-mt-60 lg:-mt-72"
          >
            <PurchasedCourseCard
              v-for="(course, index) in filteredCourses"
              :key="index"
              :course="course as any"
              :is-purchased="true"
              :progress="getProgress(course._id)"
              @view-detail="handleViewDetail"
              class="transform transition hover:-translate-y-1 duration-150"
            />
          </div>
          <div
            v-else
            class="flex items-center justify-center min-h-[400px] pt-20 sm:pt-0"
          >
            <a-empty
              class="flex flex-col items-center"
              description="Bạn chưa có khóa học nào"
            />
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-[-348px] sm:mt-[-328px] md:-mt-60 lg:-mt-72"
        >
          <div
            v-for="index in [1, 2, 3, 4]"
            :key="index"
            class="bg-white rounded-lg shadow-sm animate-pulse"
          >
            <div class="h-48 bg-gray-200 rounded-t-lg" />
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-4 bg-gray-200 rounded w-1/2" />
              <div class="h-2 bg-gray-200 rounded w-full mt-4" />
              <div class="h-8 bg-gray-200 rounded w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCoursesStore } from "~/stores/courses";
import PurchasedCourseCard from "~/components/courses/PurchasedCourseCard.vue";
import BannerSlider from "~/components/banners/BannerSlider.vue";

// SEO (cho phép index khi có nội dung công khai / crawler)
useHead({
  title: "Trang Khóa học của tôi",
  meta: [
    {
      name: "description",
      content:
        "Dễ dàng quản lý và truy cập các khóa học đã mua.",
    },
    {
      name: "keywords",
      content:
        "Khóa học trực tuyến, Vạn Phúc Care, Trang Khóa học của tôi",
    },
    { name: "robots", content: "index, follow" },
  ],
});

// Middleware: Require authentication
definePageMeta({
  middleware: "auth",
});

const coursesStore = useCoursesStore();
const loading = ref(false);
const searchKey = ref("");

// Computed
const filteredCourses = computed(() => {
  if (!searchKey.value) return coursesStore.myCourses;

  const myCourses = coursesStore.myCourses.filter((course) =>
    course.title.toLowerCase().includes(searchKey.value.toLowerCase())
  );
  // Return filtered courses sort
  myCourses.sort((a: any, b: any) => {
    const pa = getProgress(a._id);
    const pb = getProgress(b._id);
    const priorityA = pa > 0 && pa < 100 ? 1 : pa === 0 ? 2 : 3;

    const priorityB = pb > 0 && pb < 100 ? 1 : pb === 0 ? 2 : 3;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    return pb - pa;
  });
  return myCourses;
});

// Methods
const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement;
  searchKey.value = target.value || "";
};

const getProgress = (courseId: string) => {
  const course = coursesStore.myCourses.find((c: any) => c._id === courseId);
  if (course && course.progress) {
    return Math.min(course.progress.progressPercentage || 0, 100);
  }
  return 0;
};

const handleViewDetail = (course: any) => {
  // Nếu click vào card (_forceDetail) -> về trang chi tiết khóa học
  if ((course as any)._forceDetail) {
    navigateTo(`/courses/${course.slug}`);
    return;
  }

  // Các nút bên trong card (Học ngay / Đã hoàn thành) mới vào trang học
  navigateTo(`/my-learning/${course.slug}`);
};

const fetchData = async () => {
  try {
    loading.value = true;

    // Get auth store
    const authStore = useAuthStore();

    // Get all courses first
    await coursesStore.fetchMyCourses();
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Viền ô tìm kiếm theo Figma: very light grey #E5E5E5 */
.custom_input :deep(.ant-input-affix-wrapper) {
  @apply bg-transparent rounded-full border-[1px] !border-solid;
  border-color: #E5E5E5 !important;
}

.custom_input :deep(.ant-input-affix-wrapper:hover),
.custom_input :deep(.ant-input-affix-wrapper:focus),
.custom_input :deep(.ant-input-affix-wrapper-focused) {
  @apply !border-[1px] !border-solid !shadow-none;
  border-color: #E5E5E5 !important;
}

.custom_input :deep(.ant-input) {
  @apply bg-transparent placeholder:text-white text-white outline-none;
}
</style>
