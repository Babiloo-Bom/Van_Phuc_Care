<template>
  <div class="course-card" @click="goToCourseDetail">
    <div class="course-thumbnail">
      <NuxtImg
        :src="getImageUrl(course.thumbnail, '/images/courses/default-course.jpg')"
        :alt="course.title"
        class="thumbnail-image"
        loading="lazy"
        sizes="xs:100vw sm:100vw md:50vw lg:33vw"
        width="400"
        height="225"
      />
      <div class="course-badge" v-if="course.isFeatured">
        <span class="badge-text">Nổi bật</span>
      </div>
      <div class="course-badge purchased-badge" v-if="course.isPurchased" style="top: auto; bottom: 12px; left: 12px; background: #e6f7ff; border: 1px solid #1a75bb;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a75bb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span class="badge-text" style="color: #1a75bb;">Đã mua</span>
      </div>
    </div>

    <div class="course-content">
      <h3 class="course-title">{{ course.title }}</h3>
      <div class="course-price" v-if="!isPurchased">
        <!-- Hiển thị giá khuyến mãi nếu đang trong thời gian khuyến mãi -->
        <div
          class="price-current"
          v-if="
            ((course as any)?.isPromotionActive ||
              ((course as any)?.promotionDaysRemaining ?? 0) > 0) &&
            course.originalPrice &&
            Number(course.originalPrice) > Number(course.price || 0)
          "
        >
          {{ formatPrice(Number(course.price || 0)) }}
        </div>
        <!-- Hiển thị giá gốc nếu không có khuyến mãi hoặc không thỏa điều kiện khuyến mãi -->
        <div class="price-current" v-else-if="course.price || course.originalPrice">
          {{ formatPrice(Number(course.originalPrice || course.price || 0)) }}
        </div>
        <!-- Hiển thị giá gốc bị gạch khi có khuyến mãi -->
        <div
          class="price-original"
          v-if="
            ((course as any)?.isPromotionActive ||
              ((course as any)?.promotionDaysRemaining ?? 0) > 0) &&
            course.originalPrice &&
            Number(course.originalPrice) > Number(course.price || 0)
          "
        >
          {{ formatPrice(Number(course.originalPrice)) }}
        </div>
        <div class="price-discount" v-if="isPromotionActive && (course.discount ?? 0) > 0">
          -{{ course.discount ?? 0 }}%
        </div>
      </div>

      <div v-if="!isPurchased" class="course-stats">
        <Rating
          :value="course.rating?.average ?? 0"
          disabled
          allow-half
          :size="14"
          active-color="#FFD700"
          inactive-color="#E5E7EB"
        />
        <span class="rating-count"
          >({{ course.rating?.count || 0 }} lượt đánh giá)</span
        >
      </div>

      <CourseCardStats
        :video-count="course.videoCount"
        :document-count="course.documentCount ?? 0"
        :quiz-count="course.quizCount ?? 0"
      />

      <p class="course-description">{{ course.shortDescription }}</p>
      <CourseCardActions
        :is-purchased="course.isPurchased == true"
        :ever-completed="everCompleted"
        :is-currently-completed="isCurrentlyCompleted"
        :progress-pct="progressPct"
        @buy-now="buyNow"
        @add-to-cart="addToCart"
        @go-to-certificate="goToCertificate"
        @go-to-learning="goToLearningOrCertificate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Import Rating component explicitly if auto-import doesn't work
import Rating from "~/components/courses/Rating.vue";
import CourseCardStats from "~/components/courses/CourseCardStats.vue";
import CourseCardActions from "~/components/courses/CourseCardActions.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useImageUrl } from "~/composables/useImageUrl";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  instructor?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  level: string;
  duration: number;
  lessons: number;
  students: number;
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  status: string;
  videoCount: number;
  documentCount: number;
  quizCount: number;
  createdAt: string;
  updatedAt: string;
  isPurchased?: boolean;
  isCompleted?: boolean;
}

const props = defineProps<{
  course: Course;
  isPurchased?: boolean;
  progress?: number;
}>();

const emit = defineEmits<{
  addToCart: [course: Course];
  buyNow: [course: Course];
  viewDetail: [course: Course];
}>();

const router = useRouter();
const authStore = useAuthStore();
const { getImageUrl } = useImageUrl();

// % tiến trình tổng các bài của khóa học (same logic as my-learning/[slug].vue courseProgress)
const progressPct = computed(() => {
  const courseId = props.course?._id?.toString?.();

  // Kiểm tra nếu khóa học đã hoàn thành (ưu tiên cao nhất)
  if (courseId && authStore.user?.courseCompleted?.includes(courseId)) {
    return 100;
  }

  // Kiểm tra isCompleted từ course.progress
  if ((props.course as any)?.progress?.isCompleted === true) {
    return 100;
  }

  // Ưu tiên lấy từ course.progress.progressPercentage
  const pctFromCourse = (props.course as any)?.progress?.progressPercentage;
  if (pctFromCourse !== undefined) {
    return Math.min(pctFromCourse, 100);
  }

  // Fallback về prop progress
  const pctFromProp = props.progress ?? 0;
  return Math.min(Math.max(pctFromProp, 0), 100);
});

// Đã từng hoàn thành (có chứng chỉ) - dựa trên user.courseCompleted
const everCompleted = computed(() => {
  const id = props.course?._id?.toString?.();
  return !!(id && authStore.user?.courseCompleted?.includes(id));
});

// Tiến trình hiện tại đã hoàn thành hay chưa
const isCurrentlyCompleted = computed(() => {
  return props.course.isCompleted === true || progressPct.value >= 100;
});

// Tạo formatter 1 lần ở module scope, tái sử dụng cho mọi lần gọi
const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatPrice = (price: number): string => {
  return priceFormatter.format(price);
};

const addToCart = () => {
  emit("addToCart", props.course);
};

const buyNow = () => {
  emit("buyNow", props.course);
};

const viewDetail = () => {
  emit("viewDetail", props.course);
};

const goToCourseDetail = () => {
  if (!props.course?.slug) return;
  router.push(`/courses/${props.course.slug}`);
};

const goToLearning = () => {
  if (!props.course?.slug) return;
  router.push(`/my-learning/${props.course.slug}`);
};

const goToCertificate = () => {
  if (!props.course?.slug) return;
  router.push(`/my-learning/${props.course.slug}?certificate=true`);
};

const goToLearningOrCertificate = () => {
  if (!props.course?.slug) return;

  if (props.isPurchased) {
    // Người dùng đã mua nhưng chưa từng hoàn thành -> vào trang học
    router.push(`/my-learning/${props.course.slug}`);
    return;
  }

  // Chưa mua -> về trang chi tiết
  router.push(`/courses/${props.course.slug}`);
};

const handleCardClick = () => {
  // Card click luôn điều hướng về trang chi tiết khóa học;
  // các hành động "Học ngay", "Đã hoàn thành" dùng nút riêng.
  emit("viewDetail", { ...props.course, _forceDetail: true } as any);
};

// Check if promotion is still active
const isPromotionActive = computed(() => {
  const course = props.course as any;

  // Check backend flags trước (không tốn tài nguyên)
  if (course?.isPromotionActive === true) return true;
  if ((course?.promotionDaysRemaining ?? 0) > 0) return true;

  // Fallback: so sánh trực tiếp timestamp, tránh tạo Date object thừa
  const promotionEndDate = course?.promotionEndDate;
  if (!promotionEndDate) return false;

  return new Date(promotionEndDate).getTime() > Date.now();
});
</script>

<style scoped>
.course-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  z-index: 1;
  contain: layout style;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.course-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ff6b6b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.course-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.course-category {
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.course-title {
  font-size: 22px;
  line-height: 28px;
  font-weight: 700;
  color: #1a75bb;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-description {
  color: #868686;
  font-size: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  margin-bottom: 16px;
}

.instructor {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.instructor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.instructor-name {
  font-size: 14px;
  color: #666;
}

.course-stats {
  display: flex;
  gap: 8px;
  align-items: center;
}

.rating-count {
  font-size: 12px;
  line-height: 14px;
  color: #868686;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.course-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.price-current {
  font-size: 20px;
  font-weight: 700;
  color: #f48283;
}

.price-original {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.price-discount {
  background: #fef3c7;
  color: #d97706;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}


.course-purchased {
  margin-bottom: 16px;
}

.purchased-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #d1fae5;
  color: #065f46;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #a7f3d0;
}

.icon {
  margin-right: 4px;
}
</style>
