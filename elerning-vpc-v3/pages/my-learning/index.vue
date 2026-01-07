<template>
  <div class="">
    <!-- Hero Banner -->
    <div
      class="h-auto md:mb-[5rem] sm:h-[500px] py-10 sm:pt-20 sm:pb-20 md:pb-60 bg-cover bg-center bg-no-repeat bg-[url('https://cdn.synck.io.vn/vanphuccare/banner/main.webp')]
             relative z-[1] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
    >
      <div class="absolute inset-0 bg-[#1A75BBB2]"></div>
      <div class="container h-full mx-auto px-4 lg:px-6">
        <div
          class="relative z-[1] flex flex-col items-center md:items-start h-full gap-6"
        >
          <div class="text-white w-full">
            <div class="flex flex-col gap-4 md:gap-6">
              <!-- Title -->
              <h4 class="text-3xl sm:text-4xl font-bold text-white mb-0 text-center md:text-left">
                Khóa học của tôi
              </h4>
              
              <!-- Course Count -->
              <div
                class="flex items-center rounded-full py-1.5 px-5 border-[1px] border-solid border-white gap-2 w-fit mx-auto md:mx-0"
              >
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
                <span v-if="searchKey">
                  {{ filteredCourses.length }} kết quả cho "{{ searchKey }}"
                </span>
                <span v-else>{{ coursesStore.myCourses?.length || 0 }} khóa học</span>
              </div>
              
              <!-- Search -->
              <div class="w-full text-center md:text-left">
                <a-input
                  v-model:value="searchKey"
                  placeholder="Tìm kiếm theo tên, mô tả, danh mục, tags..."
                  class="!bg-transparent rounded-full h-10 w-full max-w-[400px] sm:max-w-[440px] md:max-w-[340px] custom_input"
                  @change="handleSearch"
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
            </div>
            
            <!-- Description -->
            <div class="mt-4 hidden md:block">
              <p class="mb-0 md:max-w-[800px] text-white leading-relaxed">
                Tập hợp các khóa học chuyên sâu, được giảng dạy bởi các chuyên
                gia, cố vấn giàu kinh nghiệm trong lĩnh vực chăm sóc Mẹ và Bé
                giúp các bậc phụ huynh trở thành những người cha, người mẹ thông
                thái, hiểu biết sâu rộng về mọi khía cạnh chăm sóc trẻ sơ sinh,
                mang lại sự an tâm và hạnh phúc cho mỗi gia đình.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses Section -->
    <section class="pb-20 p-4 lg:pt-20 sm:pt-10 bg-[#f4f7f9] relative z-10">
      <div class="container mx-auto !px-0 md:!px-auto">
        <div v-if="!loading">
          <div
            v-if="filteredCourses.length"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32 md:-mt-40 lg:-mt-60"
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
          <div v-else class="flex items-center justify-center min-h-[400px] pt-20 sm:pt-0">
            <a-empty class="flex flex-col items-center" description="Bạn chưa có khóa học nào" />
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32 md:-mt-40 lg:-mt-60"
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

// SEO
useHead({
  title: "Khóa học của tôi - Van Phuc Care E-Learning",
  meta: [
    {
      name: "description",
      content:
        "Quản lý và học các khóa học đã đăng ký tại Van Phuc Care E-Learning",
    },
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
    const priorityA =
      pa > 0 && pa < 100 ? 1 : pa === 0 ? 2 : 3;

    const priorityB =
      pb > 0 && pb < 100 ? 1 : pb === 0 ? 2 : 3;

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
    return course.progress.progressPercentage || 0;
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
    loading.value = true
    
    // Get auth store
    const authStore = useAuthStore()
    
    // Get all courses first
    await coursesStore.fetchMyCourses()
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
.custom_input :deep(.ant-input) {
  @apply bg-transparent placeholder:text-white rounded-full hover:border-white focus:border-white outline-none text-white;
}
</style>
