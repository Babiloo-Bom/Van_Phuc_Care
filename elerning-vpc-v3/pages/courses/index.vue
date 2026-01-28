<template>
  <div class="">
    <!-- H1 Title for SEO -->
    <h1 class="sr-only">Trang Tất Cả Khóa Học</h1>
    
    <!-- Banner Section -->
    <BannerSlider
      page-type="all-courses"
      default-title="Tất cả khóa học"
      default-description="Vạn Phúc Care cung cấp những khóa học chất lượng, chuyên sâu nhất để hỗ trợ bậc phụ huynh trong hành trình nuôi dưỡng và chăm sóc con cái. Các khóa học không chỉ mang đến các chủ đề đa dạng, những kiến thức chuyên môn chuẩn Y khoa, mà còn chia sẻ những kinh nghiệm thực tế được giảng dạy bởi đội ngũ chuyên gia và cố vấn giàu kinh nghiệm trong lĩnh vực Mẹ và Bé."
      :show-course-count="true"
      :course-count="filteredCourses.length"
    >
      <!-- Search Box -->
      <div class="w-full text-center md:text-left">
        <a-input
          v-model="searchKey"
          placeholder="Tìm kiếm khóa học"
          class="!bg-transparent rounded-full h-10 w-full max-w-[400px] sm:max-w-[440px] md:max-w-[340px] custom_input mx-auto md:mx-0"
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
    </BannerSlider>

    <!-- Courses Section -->
    <section class="pb-20 p-4 lg:pt-20 sm:pt-10 bg-[#f4f7f9] relative z-10">
      <div class="container mx-auto !px-0 md:!px-auto">
        <div v-if="!loading">
          <div
            v-if="filteredCourses.length"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-[-348px] sm:mt-[-328px] md:-mt-60 lg:-mt-72"
          >
            <CourseCard
              v-for="(course, index) in filteredCourses"
              :key="index"
              :course="course as any"
              :is-purchased="isPurchased(course)"
              @add-to-cart="handleAddToCart"
              @buy-now="handleBuyNow"
              @view-detail="handleViewDetail"
              :progress="getProgress(course._id)"
              class=""
            />
          </div>
          <div v-else>
            <a-empty
              descriptions="Chưa có khóa học nào"
              class="flex flex-col items-center"
            />
          </div>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-[-348px] sm:mt-[-328px] md:-mt-60 lg:-mt-60"
        >
          <div v-for="index in [1, 2, 3, 4]" :key="index" class="">
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
import { ref, computed, onMounted } from "vue";
import { useCoursesStore } from "~/stores/courses";
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";
import CourseCard from "~/components/courses/CourseCard.vue";
import Skeleton from "~/components/shared/Skeleton.vue";
import CartToast from "~/components/cart/Toast.vue";
import BannerSlider from "~/components/banners/BannerSlider.vue";

// Store
const courseStore = useCoursesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

// Reactive data
const loading = ref(false);
const searchKey = ref("");
const selectedCategory = ref("");
const selectedLevel = ref("");
const sortBy = ref<
  "priority" | "price-low" | "price-high" | "newest" | "rating"
>("priority");

// Computed
const courses = computed(() => courseStore.courses);

const categories = computed(() => {
  const sourceCourses = courses.value || [];
  const cats = [
    ...new Set(
      sourceCourses.map((course: any) => course.category).filter(Boolean)
    ),
  ];
  return cats;
});

// Computed để xác định trạng thái khóa học dựa trên user
const getCourseStatus = (courseId: string) => {
  if (!authStore.user) return "not_purchased";

  if (authStore.user.courseCompleted?.includes(courseId)) return "completed";
  if (authStore.user.courseRegister?.includes(courseId)) return "purchased";
  return "not_purchased";
};

// Check if course is purchased (ưu tiên dữ liệu user, sau đó tới flag từ API)
const isPurchased = (course: any) => {
  if (!course?._id) return false;

  const fromUser =
    authStore.user?.courseRegister?.includes(course._id.toString()) || false;

  return fromUser || course?.isPurchased || false;
};

// Lấy thông tin hoàn thành từ myCourses / user
const isCompleted = (course: any) => {
  if (!course?._id) return false;

  const myCourse = courseStore.myCourses.find(
    (c: any) => c._id?.toString() === course._id?.toString()
  );

  const progressPct = Math.min(
    myCourse?.progress?.progressPercentage ??
    course?.progress?.progressPercentage ??
    0,
    100
  );

  const completedByUser =
    authStore.user?.courseCompleted?.includes(course._id.toString()) || false;

  return (
    completedByUser ||
    myCourse?.progress?.isCompleted === true ||
    course?.progress?.isCompleted === true ||
    progressPct === 100
  );
};
const getProgress = (courseId: string) => {
  const course = courseStore.myCourses.find((c: any) => c._id === courseId);
  if (course && course.progress) {
    return Math.min(course.progress.progressPercentage || 0, 100);
  }
  return 0;
};
// Computed để sắp xếp theo thứ tự ưu tiên / các tuỳ chọn sort
const sortedCourses = computed(() => {
  let source = [...courses.value];
  const authStoreLocal = useAuthStore();

  // Sort theo tuỳ chọn
  switch (sortBy.value) {
    case "price-low":
      source.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
      break;
    case "price-high":
      source.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
      break;
    case "newest":
      source.sort(
        (a: any, b: any) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
      break;
    case "rating":
      source.sort(
        (a: any, b: any) => (b.rating?.average || 0) - (a.rating?.average || 0)
      );
      break;
    case "priority":
    default:
      if (!authStoreLocal.user) return source;
      source.sort((a: any, b: any) => {
        const statusA = getCourseStatus(a._id);
        const statusB = getCourseStatus(b._id);

        // Thứ tự ưu tiên: purchased -> not_purchased -> completed
        const priority: Record<string, number> = {
          purchased: 1,
          not_purchased: 2,
          completed: 3,
        };

        return (priority[statusA] || 2) - (priority[statusB] || 2);
      });
      break;
  }

  return source;
});

const filteredCourses = computed(() => {
  let source = sortedCourses.value;

  const searchTerm = searchKey.value.toLowerCase().trim();

  if (searchTerm) {
    source = source.filter((course: any) => {
      // Tìm kiếm theo title
      const titleMatch =
        course.title?.toLowerCase().includes(searchTerm) || false;

      // Tìm kiếm theo shortDescription
      const shortDescMatch =
        course.shortDescription?.toLowerCase().includes(searchTerm) || false;

      // Tìm kiếm theo description
      const descMatch =
        course.description?.toLowerCase().includes(searchTerm) || false;

      // Tìm kiếm theo category
      const categoryMatch =
        course.category?.toLowerCase().includes(searchTerm) || false;

      // Tìm kiếm theo tags
      const tagsMatch =
        course.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm)
        ) || false;

      return (
        titleMatch || shortDescMatch || descMatch || categoryMatch || tagsMatch
      );
    });
  }

  // Lọc theo category
  if (selectedCategory.value) {
    source = source.filter(
      (course: any) => course.category === selectedCategory.value
    );
  }

  // Lọc theo level
  if (selectedLevel.value) {
    source = source.filter(
      (course: any) => course.level === selectedLevel.value
    );
  }

  return source;
});

// Methods
const handleSearch = (e: any) => {
  searchKey.value = e.target.value || "";
};

const handleCategoryChange = (value: string) => {
  selectedCategory.value = value;
};

const handleLevelChange = (value: string) => {
  selectedLevel.value = value;
};

const handleSortChange = (value: any) => {
  sortBy.value = value;
};

const fetchCourses = async () => {
  await courseStore.fetchAll();
};

// SSR: Fetch courses BEFORE rendering HTML
// This ensures courses are available in view-source/disabled JS
const { pending: coursesPending } = await useAsyncData('courses', async () => {
  try {
    await fetchCourses();
    return courseStore.courses;
  } catch (error) {
    // Return empty array on error, don't break SSR
    return [];
  }
});

// Update loading state based on SSR fetch status
loading.value = coursesPending.value;

const handleAddToCart = async (course: any) => {
  if (!course._id) {
    return;
  }

  try {
    await cartStore.addToCart({
      courseId: course._id,
      quantity: 1,
      userId: String(authStore.user?.id) || "",
    });
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || "";
    if (
      msg.toLowerCase().includes("already in cart") ||
      msg.includes("trong giỏ")
    ) {
      (window as any).$message?.warning?.("Khóa học đã tồn tại trong giỏ hàng");
    } else {
      (window as any).$message?.error?.("Không thể thêm vào giỏ hàng");
    }
  }
};

const handleBuyNow = async (course: any) => {
  try {
    await cartStore.addToCart({
      courseId: course._id,
      quantity: 1,
      userId: String(authStore.user?.id) || "",
    });
    navigateTo("/cart");
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || "";
    if (
      msg.toLowerCase().includes("already in cart") ||
      msg.includes("trong giỏ")
    ) {
      (window as any).$message?.warning?.("Khóa học đã tồn tại trong giỏ hàng");
    } else {
      (window as any).$message?.error?.("Không thể mua ngay lúc này");
    }
  }
};

const handleViewDetail = (course: any) => {
  try {
    // Nếu đã hoàn thành -> trang chứng chỉ
    if (isCompleted(course)) {
      navigateTo(`/my-learning/${course.slug}?certificate=true`);
      return;
    }

    // Nếu đã mua -> trang học
    if (isPurchased(course)) {
      navigateTo(`/my-learning/${course.slug}`);
      return;
    }

    // Chưa mua -> trang chi tiết khóa học
    navigateTo(`/courses/${course.slug}`);
  } catch (error) {
  }
};

// Lifecycle
onMounted(async () => {
  authStore.initAuth();
  // Courses already fetched via useAsyncData above (SSR)
  // Only fetch my courses if user is logged in (client-side only)
  if (authStore.isLoggedIn) {
    courseStore.fetchMyCourses();
  }
});

// Page meta
definePageMeta({
  layout: "default",
  // Tắt tự động sinh Schema của nuxt-schema-org cho riêng trang này
  // để tránh trùng lặp và lỗi image bị dán đúp domain.
  schemaOrg: {
    disabled: true,
  },
});

// Runtime config for building absolute URLs
const runtimeConfig = useRuntimeConfig();
const siteUrl = computed(() =>
  (runtimeConfig.public.appUrl || "").replace(/\/$/, "")
);

// SEO + Schema (JSON-LD)
useHead({
  title: "Trang Tất Cả Khóa Học",
  meta: [
    {
      name: "description",
      content:
        "Van Phuc Care E-Learning - Nền tảng đào tạo trực tuyến chuyên sâu về chăm sóc sức khỏe gia đình, chăm sóc sức khỏe mẹ và bé chuẩn Y khoa. Cung cấp các khóa học thực chiến về chăm sóc y tế, nuôi dạy và kỹ năng làm cha mẹ.",
    },
    {
      name: "keywords",
      content:
        "Khóa học trực tuyến, Vạn Phúc Care, Trang Tất Cả Khóa Học",
    },
    {
      property: "og:title",
      content: "Trang Tất Cả Khóa Học",
    },
    {
      property: "og:description",
      content:
        "Van Phuc Care E-Learning - Nền tảng đào tạo trực tuyến chuyên sâu về chăm sóc sức khỏe gia đình, chăm sóc sức khỏe mẹ và bé chuẩn Y khoa. Cung cấp các khóa học thực chiến về chăm sóc y tế, nuôi dạy và kỹ năng làm cha mẹ.",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      children: computed(() => {
        const base = siteUrl.value || "https://edu.vanphuccare.vn";
        const pageUrl = `${base}/courses`;

        return JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            // 1. Organization (thương hiệu)
            {
              "@type": "Organization",
              "@id": `${base}/#organization`,
              name: "Khóa Học Trực Tuyến Vạn Phúc Care",
              url: base,
              logo: {
                "@type": "ImageObject",
                url: `${base}/images/logo-large.png`,
              },
            },
            // 2. CollectionPage (trang danh sách tất cả khóa học)
            {
              "@type": "CollectionPage",
              "@id": `${pageUrl}#webpage`,
              url: pageUrl,
              name: "Các khóa học chăm sóc mẹ và bé - Vạn Phúc Care",
              description:
                "Van Phuc Care E-Learning - Nền tảng đào tạo trực tuyến chuyên sâu về chăm sóc sức khỏe gia đình, chăm sóc sức khỏe mẹ và bé chuẩn Y khoa. Cung cấp các khóa học thực chiến về chăm sóc y tế, nuôi dạy và kỹ năng làm cha mẹ.",
              isPartOf: { "@id": `${base}/#website` },
              about: { "@id": `${base}/#organization` },
            },
            // 3. ItemList (danh sách các khóa học)
            {
              "@type": "ItemList",
              itemListElement: (courses.value || []).map((course: any, index: number) => {
                const courseUrl = `${base}/courses/${course.slug}`;
                const thumb = course.thumbnail;
                const imageUrl =
                  typeof thumb === "string" && thumb
                    ? thumb.startsWith("http")
                      ? thumb
                      : `${base}${thumb.startsWith("/") ? "" : "/"}${thumb}`
                    : undefined;

                return {
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Course",
                    url: courseUrl,
                    name: course.title,
                    description: course.shortDescription || course.description,
                    image: imageUrl,
                    offers: {
                      "@type": "Offer",
                      price: course.price,
                      priceCurrency: "VND",
                    },
                  },
                };
              }),
            },
          ],
        });
      }),
    },
  ],
});
</script>

<style scoped>
.custom_input :deep(.ant-input-affix-wrapper) {
  @apply bg-transparent rounded-full border-[1px] !border-solid !border-white;
}

.custom_input :deep(.ant-input-affix-wrapper:hover),
.custom_input :deep(.ant-input-affix-wrapper:focus),
.custom_input :deep(.ant-input-affix-wrapper-focused) {
  @apply !border-[1px] !border-solid !border-white !shadow-none;
}

.custom_input :deep(.ant-input) {
  @apply bg-transparent placeholder:text-white text-white;
}

.card-img-loading {
  min-height: 400px;
}

/* Ensure proper spacing and alignment */
.container {
  margin: 0 auto;
}

</style>
