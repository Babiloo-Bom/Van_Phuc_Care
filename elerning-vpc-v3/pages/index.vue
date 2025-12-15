<template>
  <div class="">
    <!-- Hero Banner -->
    <div
      class="h-auto md:mb-[5rem] sm:h-[500px] py-10 sm:pt-20 sm:pb-20 md:pb-60 bg-cover bg-center bg-no-repeat bg-[url('https://cdn.synck.io.vn/vanphuccare/banner/main.webp')]
             relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
    >
      <div class="absolute inset-0 bg-[#1A75BBB2]"></div>
      <div class="container mx-auto !px-0 sm:!px-auto">
        <div
          class="relative z-[1] flex flex-col items-center sm:items-start h-full gap-6 p-4 sm:pt-0"
        >
          <!-- Centered Content -->
          <div class="text-white text-center sm:text-left">
            <div
              class="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 flex-wrap sm:mb-4"
            >
              <h4 class="text-2xl sm:text-4xl font-bold text-white mb-0">
                Tất cả khóa học
              </h4>
              <div
                class="flex items-center rounded-full py-1.5 px-5 border-[1px] border-solid border-white gap-2"
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
                <span>{{ coursesStore.courses?.length || 0 }} khóa học</span>
              </div>
            </div>
            <div class="hidden md:block max-w-[800px] mx-auto">
              <p class="mb-0 text-lg">
                Vạn Phúc Care cung cấp những khóa học chất lượng, chuyên sâu
                nhất để hỗ trợ bậc phụ huynh trong hành trình nuôi dưỡng và chăm
                sóc con cái. Các khóa học không chỉ mang đến các chủ đề đa dạng,
                những kiến thức chuyên môn chuẩn Y khoa, mà còn chia sẻ những
                kinh nghiệm thực tế được giảng dạy bởi đội ngũ chuyên gia và cố
                vấn giàu kinh nghiệm trong lĩnh vực Mẹ và Bé.
              </p>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="mt-auto w-full">
            <div class="flex flex-col items-center gap-6">
              <!-- Search Bar -->
              <div class="w-full text-center sm:text-left">
                <a-input
                  v-model:value="searchKey"
                  placeholder="Tìm kiếm khóa học"
                  class="!bg-transparent rounded-full h-10 w-full sm:w-[340px] custom_input"
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

              <!-- Filter Options -->
              <div
                class="w-full flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
              >
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
                  <a-select-option value="intermediate"
                    >Trung bình</a-select-option
                  >
                  <a-select-option value="advanced">Nâng cao</a-select-option>
                </a-select>

                <!-- Sort Options -->
                <a-select
                  v-model:value="sortBy"
                  placeholder="Sắp xếp theo"
                  class="!w-48 !bg-white/10 !border-white/30"
                  @change="handleSortChange"
                >
                  <a-select-option value="priority"
                    >Ưu tiên (Đã mua → Chưa mua → Hoàn thành)</a-select-option
                  >
                  <a-select-option value="price-low"
                    >Giá thấp → cao</a-select-option
                  >
                  <a-select-option value="price-high"
                    >Giá cao → thấp</a-select-option
                  >
                  <a-select-option value="newest">Mới nhất</a-select-option>
                  <a-select-option value="rating"
                    >Đánh giá cao nhất</a-select-option
                  >
                </a-select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Courses Section -->
    <section class="pb-20 p-4 lg:pt-20 sm:pt-10 bg-[#f4f7f9]">
      <div class="container mx-auto !px-0 md:!px-auto">
        <div
          v-if="googleError"
          class="flex justify-center items-center min-h-[300px]"
        >
          <div class="callback-container">
            <div class="error-state">
              <a-result
                status="error"
                title="Đăng nhập thất bại"
                :sub-title="googleError"
              >
                <template #extra>
                  <a-button type="primary" @click="goToLogin">
                    Thử lại
                  </a-button>
                  <a-button @click="goToLogin"> Về trang đăng nhập </a-button>
                </template>
              </a-result>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="!loading">
            <div
              v-if="filteredCourses.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 -mt-36 sm:-mt-44 md:-mt-14 lg:-mt-40"
            >
              <CourseCard
                v-for="(course, index) in filteredCourses"
                :key="index"
                :course="(course as any)"
                :is-purchased="isPurchased(course._id)"
                @add-to-cart="handleAddToCart"
                @buy-now="handleBuyNow"
                @view-detail="handleViewDetail"
                :progress="getProgress(course._id)"
              />
            </div>
            <div v-else class="pt-20">
              <a-empty class="text-center" description="Chưa có khóa học nào" />
            </div>
          </div>
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 -mt-36 sm:-mt-44 md:-mt-14 lg:-mt-40"
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
                <div class="h-8 bg-gray-200 rounded w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Google OAuth Loading Overlay Popup -->
    <div v-if="googleLoading" class="google-loading-overlay">
      <div class="google-loading-popup">
        <a-spin size="large" />
        <h3>Đang xử lý đăng nhập Google...</h3>
        <p>Vui lòng đợi trong giây lát</p>
      </div>
    </div>

    <!-- Cart Toast -->
    <CartToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCoursesStore } from "~/stores/courses";
import { useCartStore } from "~/stores/cart";
import { useAuthStore } from "~/stores/auth";
import { useCourseApi } from "~/composables/useCourseApi";
import { message } from "ant-design-vue";
import CourseCard from "~/components/courses/CourseCard.vue";
import CartToast from "~/components/cart/Toast.vue";

// SEO Configuration for SPA mode
// Function to update SEO meta tags
const updateSEOMetaTags = () => {
  // Update document title
  document.title =
    "Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam";

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      "Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp."
    );
  }

  // Add Open Graph tags
  const addMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };

  const addMetaName = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", name);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  };
  
  // Open Graph tags
  addMetaTag(
    "og:title",
    "Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam"
  );
  addMetaTag(
    "og:description",
    "Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp."
  );
  addMetaTag("og:url", "https://vanphuccare.com");
  addMetaTag("og:image", "https://vanphuccare.com/images/og-home.jpg");
  addMetaTag("og:image:width", "1200");
  addMetaTag("og:image:height", "630");

  // Twitter Card tags
  addMetaName("twitter:card", "summary_large_image");
  addMetaName(
    "twitter:title",
    "Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam"
  );
  addMetaName(
    "twitter:description",
    "Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp."
  );
  addMetaName("twitter:image", "https://vanphuccare.com/images/og-home.jpg");

  // Keywords
  addMetaName(
    "keywords",
    "học trực tuyến, e-learning, khóa học online, lập trình, marketing, thiết kế, khoa học dữ liệu, Van Phuc Care, học online, giáo dục trực tuyến"
  );

  // Canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', 'https://vanphuccare.com')
  
}

// Also use useHead as fallback
useHead({
  title: "Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam",
  meta: [
    {
      name: "description",
      content:
        "Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.",
    },
    {
      name: "keywords",
      content:
        "học trực tuyến, e-learning, khóa học online, lập trình, marketing, thiết kế, khoa học dữ liệu, Van Phuc Care, học online, giáo dục trực tuyến",
    },
    {
      property: "og:title",
      content:
        "Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam",
    },
    {
      property: "og:description",
      content:
        "Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://vanphuccare.com",
    },
    {
      property: "og:image",
      content: "https://vanphuccare.com/images/og-home.jpg",
    },
    {
      property: "og:image:width",
      content: "1200",
    },
    {
      property: "og:image:height",
      content: "630",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content:
        "Van Phuc Care E-Learning - Nền Tảng Học Trực Tuyến Hàng Đầu Việt Nam",
    },
    {
      name: "twitter:description",
      content:
        "Van Phuc Care E-Learning - Nền tảng học trực tuyến hàng đầu Việt Nam với các khóa học chất lượng cao về lập trình, marketing, thiết kế, khoa học dữ liệu. Học mọi lúc, mọi nơi với giáo viên chuyên nghiệp.",
    },
    {
      name: "twitter:image",
      content: "https://vanphuccare.com/images/og-home.jpg",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://vanphuccare.com",
    },
  ],
});

const router = useRouter();
const coursesStore = useCoursesStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const courseApi = useCourseApi();

const loading = ref(false);
const searchKey = ref("");
const courses = ref([]);

const selectedCategory = ref("");
const selectedLevel = ref("");
const sortBy = ref("priority");

const categories = computed(() => {
  const sourceCourses =
    courses.value.length > 0 ? courses.value : coursesStore.courses;
  const cats = [
    ...new Set(sourceCourses.map((course) => course.category).filter(Boolean)),
  ];
  return cats;
});

const filteredCourses = computed(() => {
  // Use local state as primary source
  let sourceCourses =
    courses.value.length > 0 ? courses.value : coursesStore.courses;

  // Apply search filter
  if (searchKey.value) {
    sourceCourses = sourceCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchKey.value.toLowerCase()) ||
        course.shortDescription
          ?.toLowerCase()
          .includes(searchKey.value.toLowerCase())
    );
  }

  // Apply category filter
  if (selectedCategory.value) {
    sourceCourses = sourceCourses.filter(
      (course) => course.category === selectedCategory.value
    );
  }

  // Apply level filter
  if (selectedLevel.value) {
    sourceCourses = sourceCourses.filter(
      (course) => course.level === selectedLevel.value
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case "priority":
      // Đã mua → Chưa mua → Hoàn thành
      sourceCourses = sourceCourses.sort((a: any, b: any) => {
        const aPurchased = authStore.user?.courseRegister?.includes(a._id) || false;
        const bPurchased = authStore.user?.courseRegister?.includes(b._id) || false;

        const aCompleted = authStore.user?.courseCompleted?.includes(a._id) || false;
        const bCompleted = authStore.user?.courseCompleted?.includes(b._id) || false;
        const priorityA =
          aCompleted ? 3 : aPurchased ? 1 : 2

        const priorityB =
          bCompleted ? 3 : bPurchased ? 1 : 2;
        
        return priorityA - priorityB
      });
      break;
    case "price-low":
      sourceCourses = sourceCourses.sort(
        (a, b) => (a.price || 0) - (b.price || 0)
      );
      break;
    case "price-high":
      sourceCourses = sourceCourses.sort(
        (a, b) => (b.price || 0) - (a.price || 0)
      );
      break;
    case "newest":
      sourceCourses = sourceCourses.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      break;
    case "rating":
      sourceCourses = sourceCourses.sort((a, b) => {
        const aRating = typeof a.rating === "number" ? a.rating : 0;
        const bRating = typeof b.rating === "number" ? b.rating : 0;
        return bRating - aRating;
      });
      break;
  }

  // Enrich for UI states: purchased/completed/progress
  const myCoursesMap = new Map(
    (coursesStore.myCourses || []).map((c: any) => [c._id?.toString(), c])
  )
  const purchasedSet = new Set(authStore.user?.courseRegister || [])

  return sourceCourses.map((c: any) => {
    const id = c._id?.toString()
    const myCourse = id ? myCoursesMap.get(id) : null
    const progressPct = myCourse?.progress?.progressPercentage ?? c?.progress?.progressPercentage ?? getProgress(id || '')
    const isCompleted = myCourse?.progress?.isCompleted || c?.progress?.isCompleted || progressPct === 100
    const isPurchasedFlag = (c?.isPurchased === true) || purchasedSet.has(id || '')
    return {
      ...c,
      isPurchased: isPurchasedFlag,
      isCompleted,
      progress: progressPct,
    }
  })
})

// Methods
const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement;
  searchKey.value = target.value || "";
};

// Filter handlers
const handleCategoryChange = (value: string) => {
  selectedCategory.value = value;
};

const handleLevelChange = (value: string) => {
  selectedLevel.value = value;
};

const handleSortChange = (value: string) => {
  sortBy.value = value;
};

const isPurchased = (courseId: string) => {
  const purchased = authStore.user?.courseRegister?.includes(courseId) || false
  return purchased
}
const getProgress = (courseId: string) => {
  const course = coursesStore.myCourses.find((c: any) => c._id === courseId);
  if (course && course.progress) {
    return course.progress.progressPercentage || 0;
  }
  return 0;
  };
// Cart handlers
const handleAddToCart = async (course: any) => {
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1, userId: String(authStore.user?.id) || "" })
    message.success("Đã thêm vào giỏ hàng");
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || "";
    if (msg.toLowerCase().includes("already in cart") || msg.includes("trong giỏ")) {
      message.warning("Khóa học đã tồn tại trong giỏ hàng");
    } else {
      message.error("Không thể thêm vào giỏ hàng");
    }
  }
};

const handleBuyNow = async (course: any) => {
  try {
    // Add to cart first
    await cartStore.addToCart({ courseId: course._id, quantity: 1, userId: String(authStore.user?.id) || "" });
    // Navigate to checkout
    navigateTo("/cart");
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || "";
    if (msg.toLowerCase().includes("already in cart") || msg.includes("trong giỏ")) {
      message.warning("Khóa học đã tồn tại trong giỏ hàng");
      navigateTo("/cart");
    } else {
      message.error("Không thể mua ngay lúc này");
    }
  }
};

const handleViewDetail = (course: any) => {
  try {
    // Nếu đã hoàn thành -> trang chứng chỉ; đã mua -> trang học; chưa mua -> chi tiết khóa học
    if (course.isCompleted) {
      navigateTo(`/my-learning/${course.slug}?certificate=true`);
      return;
    }
    if (course.isPurchased) {
      navigateTo(`/my-learning/${course.slug}`);
      return;
    }
    navigateTo(`/courses/${course.slug}`);
  } catch (error) {
    console.error("❌ Error viewing detail:", error);
  }
};

const fetchData = async () => {
  try {
    loading.value = true;
    await coursesStore.fetchAll();
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    loading.value = false;
  }
};

// Google OAuth states
const googleLoading = ref(false);
const googleError = ref("");
const googleSuccess = ref(false);
import { useGoogleAuth } from "~/composables/useGoogleAuth";
const { completeGoogleLogin } = useGoogleAuth();

const goToLogin = () => {
  router.push("/login");
};

onMounted(async () => {
  // Update SEO meta tags first
  updateSEOMetaTags();

  // Xử lý đăng nhập Google nếu có code trên URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  if (code) {
    googleLoading.value = true;
    googleError.value = "";
    try {
      const response = await completeGoogleLogin(code, state || undefined);
      if (response && response.success && response.data) {
        let tokenExpireAtNum;
        if (typeof response.data.tokenExpireAt === "string") {
          tokenExpireAtNum = Date.now() + 7 * 24 * 60 * 60 * 1000;
        } else {
          tokenExpireAtNum =
            response.data.tokenExpireAt || Date.now() + 7 * 24 * 60 * 60 * 1000;
        }
        const userData = {
          ...response.data.user,
          id: response.data.user?._id || `google-user-${Date.now()}`,
          email: response.data.user?.email || "user@google.com",
          fullname: response.data.user?.fullname || "Google User",
          avatar: response.data.user?.avatar || "",
          role: response.data.user?.role || "user",
          verified: true,
        };
        await authStore.completeGoogleLogin(
          response.data.accessToken,
          tokenExpireAtNum,
          userData
        );
        googleSuccess.value = true;
        await nextTick();
        window.location.href = "/";
        // Giữ loading cho đến khi reload lại trang hoặc chuyển hướng rõ ràng
        setTimeout(() => {
          googleLoading.value = false;
        }, 1000);
      } else {
        throw new Error(response.error || "Đăng nhập Google thất bại");
      }
    } catch (error) {
      if (error instanceof Error) {
        googleError.value = error.message || "Đăng nhập Google thất bại";
      } else {
        googleError.value = "Đăng nhập Google thất bại";
      }
      // Chuyển về trang login nếu lỗi
      setTimeout(() => {
        googleLoading.value = false;
        window.location.href = "/login";
      }, 1000);
    }
    // Không tắt loading ngay lập tức
    return;
  }

  // Initialize auth first to ensure user data is loaded
  await authStore.initAuth();
  // Fetch myCourses trước để enrich UI, sau đó fetchAll song song
  if (authStore.isLoggedIn) {
    await Promise.allSettled([
      coursesStore.fetchMyCourses(),
      cartStore.fetchCart(),
      fetchData(),
    ]);
  } else {
    await fetchData();
  }
});
</script>

<style scoped>
.custom_input :deep(.ant-input) {
  @apply bg-transparent placeholder:text-white rounded-full hover:border-white focus:border-white outline-none text-white;
}

.card-img-loading {
  min-height: 400px;
}

.google-loading-overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 41, 59, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.google-loading-popup {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 48px 32px 32px 32px;
  min-width: 320px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.google-loading-popup h3 {
  margin: 24px 0 8px;
  color: #333;
  font-size: 20px;
}
.google-loading-popup p {
  color: #666;
  margin: 0;
}
</style>
