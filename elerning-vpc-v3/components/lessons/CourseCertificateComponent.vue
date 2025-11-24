<template>
  <div class="w-full bg-white rounded-lg py-10 border-[#ACD7F9]">
    <div class="md:w-[702px] px-3 w-full mx-auto">
      <div class="text-[#15CF74] font-bold text-sm text-center">Chúc mừng bạn đã hoàn thành khóa học</div>
      <h2 class="m-0 leading-8 text-2xl font-bold text-center text-[#1A75BB]">{{ props.course?.title || "Khóa học" }}</h2>
      <div id="certificate" class="relative mt-5 md:mt-8">
        <img class="w-full" src="../../public/images/certificate-desktop.png" alt="/">
        <div class="absolute font-semibold certificate-fullname text-[17px] w-full sm:text-[36px] text-center text-[#1C5477] font_utm-aristote">
            {{ user?.fullname }}
        </div>
        <div class="absolute font-bold text-[10px] sm:text-[19px] certificate-course-title  text-center w-full text-[#1C5477]">
            {{ props.course?.title }}
        </div>
        <div class="absolute font-bold text-[8px] sm:text-[14px] top-[86%] text-[#1F3466] certificate-date">
            {{ (new Date()).toLocaleDateString('en-GB') }}
        </div>
      </div>
      <div class="cursor-pointer text-[#1A75BB] text-[15px] mt-5 underline underline-offset-2 md:text-xl text-center" @click="handleDownloadDocuments">
            Tải xuống <span class="uppercase">Chứng nhận hoàn thành khóa học</span>
      </div>
      <div class="w-full border-dashed border-b h-[1px] border-[#798894] my-8"></div>
      <div class="flex flex-col gap-2 mb-10" v-if="coupon !== null">
        <div class="text-xl md:text-2xl font-bold text-[#1A75BB]">Quà tặng</div>
        <div class="text-sm text-[#798894] leading-5 mb-3">
          Sau khi hoàn thành khóa học, bạn sẽ nhận được những quà tặng sau từ Van Phuc Care:
        </div>
        <div class="flex flex-wrap gap-4">
          <div class="w-[298px] h-[67px] border border-[#D8D8D8] rounded-md flex items-center bg-white">
            <div class="flex flex-col items-center justify-center h-full px-[18px] border-r border-r-dashed border-l-[6px] border-l-[#1A75BB] rounded-l-md  border-gray-300">
              <img src="/images/logo.png" alt="Logo" class="w-[30px] object-contain">
            </div>
            <div class="flex-1 relative pl-6 h-full flex flex-col justify-center">
              <div class="text-[13px] font-semibold text-[#020618] mb-[6px]">
                {{ coupon.name }}
              </div>
              <div class="text-[10px] text-[#62748E] flex gap-4">
                <span>
                  Mã Voucher <span class="text-[#2E90E5] font-semibold">{{ coupon.code }}</span>
                </span>
                <span>
                  HSD <span class="text-[#2E90E5] font-semibold">{{ (new Date(coupon.validTo)).toLocaleDateString('en-GB') }}</span>
                </span>
              </div>
              <div class="w-[7px] h-[7px] rounded-full border-b border-[#D9D9D9] bg-white absolute left-[-4px] top-[-3px]"></div>
              <div class="w-[7px] h-[7px] rounded-full border-t border-[#D9D9D9] bg-white absolute left-[-4px] bottom-[-3px]"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-[60px] flex flex-col gap-[14px]" v-if="filteredCourses.length > 0">
        <div class="text-xl md:text-2xl font-bold text-[#1A75BB]">Khóa học liên quan</div>
        <div class="related-courses-carousel">
          <swiper
            :slides-per-view="1"
            :space-between="20"
            :breakpoints="{
              768: {
                slidesPerView: 1.7,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2.2,
                spaceBetween: 20,
              },
            }"
          >
            <swiper-slide v-for="(item, index) in filteredCourses" :key="index">
              <CourseCard
                :course="(item as any)"
                :is-purchased="false"
                @add-to-cart="handleAddToCart"
                @buy-now="handleBuyNow"
                @view-detail="handleViewDetail"
                class=""
              />
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div class="flex md:flex-nowrap md:flex-row flex-col-reverse gap-3">
        <div class="flex flex-col gap-6 md:w-1/2">
          <div class="text-[#1A75BB] font-bold text-xl text-center md:text-left md:text-2xl">Lời thủ thỉ của "Bé Thìn"</div>
          <div class="text-sm text-[#020618] leading-5  text-center md:text-left">
            Chúc mừng bạn đã hoàn thành khóa học. Nếu muốn củng cố lại kiến thức đừng quên quay lại đây bạn nhé!!!
          </div>
          <div class="w-full lg:w-[330px]">
            <a-button
              type="primary"
              @click="navigateTo('/my-learning')"
              class="bg-[#317BC4] border-none hover:bg-blue-600 rounded-[4px] h-[44px] font-semibold px-8 text-white w-full text-[13px]"
            >
              Học lại từ đầu
            </a-button>
          </div>
        </div>
        <div class="md:w-1/2">
          <img
            src="../../public/images/drangon_grade.png"
            alt="certificate-lesson-image"
            class="w-full h-auto md:max-w-[247px] md:mt-[-30px] mx-auto md:ml-10 object-contain max-w-[210px]"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import CourseCard from "~/components/courses/CourseCard.vue";

interface ICoupon {
  _id: string;
  name: string;
  code: string;
  validTo: string;
}

const props = defineProps<{
  course: Course | null
}>()

const loading = ref(false)
const courseStore = useCoursesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const coupon = ref<ICoupon | null>(null)

const user = authStore.currentUser

const filteredCourses = computed(() => {
  return courseStore.courses.filter(c => c.isPurchased === false && c._id !== props.course?._id)
})

// Methods
const fetchCourses = async () => {
  try {
    loading.value = true;
    await courseStore.fetchAll();
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    loading.value = false;
  }
};
const fetchCoupons = async () => {
  try {
    loading.value = true;
    const couponApi = useCouponApi();
    const response = await couponApi.getCouponValid(props?.course?._id as string);
    if (response && response.data) {
      coupon.value = response.data?.coupon as ICoupon;
    }
  } catch (error) {
    console.error("Error fetching coupons:", error);
  } finally {
    loading.value = false;
  }
};

const handleAddToCart = async (course: any) => {
  if (!course._id) {
    console.error("❌ Course ID is missing!");
    return;
  }

  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1, userId: String(authStore.user?.id) || "" })
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
  }
};

const handleBuyNow = async (course: any) => {
  try {
    await cartStore.addToCart({ courseId: course._id, quantity: 1, userId: String(authStore.user?.id) || "" })
    navigateTo('/checkout')
  } catch (error) {
    console.error("❌ Error buying now:", error);
  }
};

const handleViewDetail = (course: any) => {
  try {
    navigateTo(`/courses/${course.slug}`)
  } catch (error) {
    console.error("❌ Error viewing detail:", error);
  }
};

const handleDownloadDocuments = () => {
  const certificateElement = document.getElementById('certificate')
  if (!certificateElement) return

  html2canvas(certificateElement).then((canvas) => {
    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/png');

    // Create a link to download the image
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'certificate.png'; // Specify the filename

    // Append to the body, click to download and remove from the DOM
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
// Lifecycle
onMounted(() => {
  fetchCourses()
  fetchCoupons()
})

</script>

<style scoped>
.certificate-fullname {
  top: 37%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  line-height: 32px;
}
.certificate-course-title{
  top: 57%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  line-height: 20px;
}
.certificate-date {
  left: 27%;
  transform: translateX(-50%);
  top: 86%;
  line-height: 16px;
}
@media screen and (max-width: 768px) {
  .certificate-fullname {
    top: 35%;
    line-height: 24px;
  }
  .certificate-course-title{
    top: 56%;
    line-height: 16px;
  }
  .certificate-date {
    top: 85%;
    line-height: 12px;
  }
  
}
.related-courses-carousel :deep(.swiper-horizontal){
  padding: 10px 0px 10px 0px;
}
.quiz-container {
  margin: 0 auto;
}
.active {
  border-color: #1890FF;
  color: #1890FF;
}
.custom-radio {
  margin-right: 0 !important;
}
</style>
