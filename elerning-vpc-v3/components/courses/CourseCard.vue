<template>
  <div class="course-card" @click="goToCourseDetail">
    <div class="course-thumbnail">
      <img
        :src="getImageUrl(course.thumbnail, '/images/courses/default-course.jpg')"
        :alt="course.title"
        class="thumbnail-image"
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
        <div class="price-current" v-if="isPromotionActive && course.originalPrice && course.originalPrice > course.price">
          {{ formatPrice(course.price) }}
        </div>
        <!-- Hiển thị giá gốc nếu không có khuyến mãi hoặc giá gốc = giá bán -->
        <div class="price-current" v-else>
          {{ formatPrice(course.originalPrice || course.price) }}
        </div>
        <!-- Hiển thị giá gốc bị gạch khi có khuyến mãi -->
        <div
          class="price-original"
          v-if="isPromotionActive && course.originalPrice && course.originalPrice > course.price"
        >
          {{ formatPrice(course.originalPrice) }}
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

      <div class="flex justify-start items-center flex-wrap gap-2 my-4">
        <div class="flex justify-between items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 9 9"
            fill="none"
          >
            <path
              d="M5.86759 4.70128L5.67654 4.4078L5.66699 4.41447L5.86759 4.70128ZM5.86759 4.12602L5.66006 4.40786L5.67567 4.41936L5.69246 4.42906L5.86759 4.12602ZM3.56207 2.42835L3.7696 2.14651L3.75973 2.13924L3.74937 2.13268L3.56207 2.42835ZM3.07874 2.68192L3.42879 2.6809L3.42866 2.67478L3.07874 2.68192ZM3.0884 6.01671L2.73841 6.01773L2.73843 6.02763L2.73902 6.03751L3.0884 6.01671ZM3.58946 6.29461L3.75894 6.60084L3.77501 6.59195L3.79006 6.58142L3.58946 6.29461ZM4.36303 8.37586V8.02586C2.34005 8.02586 0.700098 6.38591 0.700098 4.36293H0.350098H9.76622e-05C9.76622e-05 6.77251 1.95345 8.72586 4.36303 8.72586V8.37586ZM8.37596 4.36293H8.02596C8.02596 6.38591 6.38601 8.02586 4.36303 8.02586V8.37586V8.72586C6.77261 8.72586 8.72596 6.77251 8.72596 4.36293H8.37596ZM4.36303 0.35V0.7C6.38601 0.7 8.02596 2.33995 8.02596 4.36293H8.37596H8.72596C8.72596 1.95335 6.77261 3.8743e-07 4.36303 3.8743e-07V0.35ZM4.36303 0.35V3.8743e-07C1.95345 3.8743e-07 9.76622e-05 1.95335 9.76622e-05 4.36293H0.350098H0.700098C0.700098 2.33995 2.34005 0.7 4.36303 0.7V0.35ZM5.86759 4.70128L6.05854 4.99461C6.23456 4.88002 6.4387 4.68699 6.43831 4.40486C6.43792 4.11489 6.2239 3.92769 6.04272 3.82299L5.86759 4.12602L5.69246 4.42906C5.71573 4.4425 5.73205 4.45407 5.74294 4.46295C5.7539 4.47188 5.75777 4.47678 5.75765 4.47663C5.7574 4.4763 5.75239 4.46982 5.74742 4.4568C5.74223 4.4432 5.73834 4.42565 5.73831 4.40582C5.73829 4.3861 5.74208 4.36984 5.74622 4.3586C5.75016 4.34792 5.75363 4.34382 5.75199 4.34604C5.75028 4.34835 5.74447 4.35554 5.73179 4.3668C5.71918 4.37801 5.70126 4.39194 5.67664 4.40796L5.86759 4.70128ZM5.86759 4.12602L6.07512 3.84419L3.7696 2.14651L3.56207 2.42835L3.35454 2.71019L5.66006 4.40786L5.86759 4.12602ZM3.56207 2.42835L3.74937 2.13268C3.56521 2.01602 3.31398 1.95371 3.0803 2.06283C2.82728 2.18096 2.72366 2.43692 2.72881 2.68906L3.07874 2.68192L3.42866 2.67478C3.42798 2.64144 3.4346 2.63752 3.42813 2.64992C3.42481 2.65625 3.41885 2.66521 3.40923 2.67452C3.39957 2.68387 3.38829 2.69156 3.37645 2.69709C3.35227 2.70838 3.33601 2.70628 3.33625 2.70631C3.33695 2.70641 3.35073 2.70879 3.37478 2.72402L3.56207 2.42835ZM3.07874 2.68192L2.72874 2.68293L2.73841 6.01773L3.0884 6.01671L3.4384 6.0157L3.42874 2.6809L3.07874 2.68192ZM3.0884 6.01671L2.73902 6.03751C2.75182 6.2524 2.82557 6.51946 3.07436 6.65234C3.31954 6.78328 3.57963 6.70008 3.75894 6.60084L3.58946 6.29461L3.41999 5.98838C3.3977 6.00071 3.37996 6.00855 3.36676 6.01336C3.35349 6.0182 3.34648 6.01936 3.34522 6.01954C3.3441 6.01969 3.35002 6.01873 3.36127 6.02038C3.37303 6.0221 3.38816 6.02635 3.40413 6.03488C3.42015 6.04344 3.43252 6.0539 3.44106 6.06343C3.44926 6.07258 3.45211 6.07879 3.45191 6.07836C3.45163 6.07775 3.4488 6.07144 3.44564 6.05728C3.44249 6.04318 3.4394 6.02306 3.43779 5.99591L3.0884 6.01671ZM3.58946 6.29461L3.79006 6.58142L6.06819 4.9881L5.86759 4.70128L5.66699 4.41447L3.38887 6.0078L3.58946 6.29461Z"
              fill="#393939"
            />
          </svg>
          <span class="text-xs text-[#393939]"
            >{{ course.videoCount }} video</span
          >
        </div>
        <div class="flex justify-between items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 9 8"
            fill="none"
          >
            <path
              d="M7.53101 3.15905V1.28635H4.1517L3.30687 0.35H0.349976V7.37263H1.61722V6.90445L2.88446 3.15905H8.37584L7.1086 7.37263H1.1948"
              stroke="#393939"
              stroke-width="0.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text-xs text-[#393939]">
            {{ course.documentCount ?? 0 }} Tài liệu
          </span>
        </div>
        <div class="flex justify-between items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 9 9"
            fill="none"
          >
            <path
              d="M3.59632 8.37586H1.43209C0.83445 8.37586 0.349972 7.92669 0.349976 7.37262L0.350017 1.35323C0.350021 0.799161 0.8345 0.35 1.43213 0.35H6.30177C6.89941 0.35 7.38389 0.799164 7.38389 1.35324V4.11213M5.21967 6.95463L6.21161 7.87427L8.37584 5.86771M2.24385 2.35647H5.49019M2.24385 3.86132H5.49019M2.24385 5.36618H3.86702"
              stroke="#393939"
              stroke-width="0.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="text-xs text-[#393939]">
            {{ course.quizCount ?? 0 }} Bài trắc nghiệm
          </span>
        </div>
      </div>

      <p class="course-description">{{ course.shortDescription }}</p>
      <div v-if="course.isPurchased == true" class="w-full mb-3 sm:mb-4 flex-grow flex flex-col justify-end">
        <div class="w-full flex items-center justify-between mb-2">
          <span class="text-xs sm:text-sm text-[#868686]">Tiến độ</span>
          <span class="text-xs sm:text-sm text-[#868686]">{{ progressPct }}%</span>
        </div>
        <div class="relative w-full h-1 bg-[#dfdfdf] rounded-sm">
          <div 
            class="absolute top-0 bottom-0 left-0 bg-[#6DE380] rounded-sm transition-all duration-300" 
            :style="{ width: `${Math.min(Math.max(progressPct, 0), 100)}%` }"
          ></div>
        </div>
      </div>
      <div class="course-actions" v-if="!course.isPurchased">
        <button class="btn-buy-now" @click.stop="buyNow">Mua ngay</button>
        <button class="btn-add-cart" @click.stop="addToCart">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clip-path="url(#clip0_136_8590)">
              <path
                d="M12 4C12 2.93913 11.5786 1.92172 10.8284 1.17157C10.0783 0.421427 9.06087 0 8 0C6.93913 0 5.92172 0.421427 5.17157 1.17157C4.42143 1.92172 4 2.93913 4 4H0V14C0 14.5304 0.210714 15.0391 0.585786 15.4142C0.960859 15.7893 1.46957 16 2 16H9.33333V14.6667H2C1.82319 14.6667 1.65362 14.5964 1.5286 14.4714C1.40357 14.3464 1.33333 14.1768 1.33333 14V5.33333H4V6.66667H5.33333V5.33333H10.6667V6.66667H12V5.33333H14.6667V9.33333H16V4H12ZM5.33333 4C5.33333 3.29276 5.61428 2.61448 6.11438 2.11438C6.61448 1.61428 7.29276 1.33333 8 1.33333C8.70724 1.33333 9.38552 1.61428 9.88562 2.11438C10.3857 2.61448 10.6667 3.29276 10.6667 4H5.33333Z"
                fill="white"
              />
              <path
                d="M14.0002 10.6663H12.6669V12.6663H10.6669V13.9996H12.6669V15.9996H14.0002V13.9996H16.0002V12.6663H14.0002V10.6663Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_136_8590">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <div v-else class="flex-grow flex flex-col justify-end w-full gap-4">
        <!-- Nếu đã có chứng chỉ (everCompleted) hoặc đã hoàn thành 100% → chỉ hiển thị "Đã hoàn thành" -->
        <div
          class="course-actions"
          v-if="everCompleted || isCurrentlyCompleted"
        >
          <button class="btn-completed" @click.stop="goToCertificate">
            Đã hoàn thành
          </button>
        </div>

        <!-- Các trường hợp còn lại: đã mua nhưng chưa hoàn thành -->
        <div class="course-actions" v-else>
          <button class="btn-access" @click.stop="goToLearningOrCertificate">
            Học ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import Rating component explicitly if auto-import doesn't work
import Rating from "~/components/courses/Rating.vue";
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

// % tiến trình tổng các bài của khóa học (ưu tiên course.progress.progressPercentage - tiến trình tổng các bài)
const progressPct = computed(() => {
  // Ưu tiên tiến trình tổng các bài từ course.progress.progressPercentage
  const pctFromCourse =
    (props.course as any)?.progress?.progressPercentage ?? 0;
  // Fallback về prop progress nếu không có
  const pctFromProp = props.progress ?? 0;
  // Ưu tiên tiến trình tổng các bài (từ course.progress)
  return pctFromCourse || pctFromProp || 0;
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

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
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
  
  // Check isPromotionActive flag from backend
  if (course?.isPromotionActive === true) {
    return true;
  }
  
  // Check promotionDaysRemaining from backend
  if (course?.promotionDaysRemaining !== undefined && course.promotionDaysRemaining > 0) {
    return true;
  }
  
  // Fallback: calculate from promotionEndDate
  const promotionEndDate = course?.promotionEndDate;
  if (!promotionEndDate) return false;
  
  const endDate = new Date(promotionEndDate);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return daysRemaining > 0;
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

.course-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn-add-cart,
.btn-buy-now {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-buy-now {
  flex: 1;
}

.btn-add-cart {
  flex-shrink: 0;
  background: #f48284;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.btn-add-cart:hover {
  background: #e5e7eb;
}

.btn-buy-now {
  background: #2563eb;
  color: white;
}

.btn-buy-now:hover {
  background: #1d4ed8;
}

.btn-access {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #15cf74;
  color: #ffffff;
}

.btn-access:hover {
  background: #12b865;
}
.btn-completed {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(88.69deg, #FFBE6A -1.04%, #EBBC46 23.61%, #FFDA7D 55.57%, #EBBC46 74.44%, #FFBE6A 97.91%);
  color: white;
}

.btn-completed:hover {
  opacity: 0.9;
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
