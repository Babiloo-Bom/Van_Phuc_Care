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
            {{ certificateDate }}
        </div>
      </div>
      <div class="cursor-pointer text-[#1A75BB] text-[15px] mt-5 underline underline-offset-2 md:text-xl text-center" @click="handleDownloadDocuments">
            Tải xuống <span class="uppercase">Chứng nhận hoàn thành khóa học</span>
      </div>
      <div class="w-full border-dashed border-b h-[1px] border-[#798894] my-8"></div>
      <div class="flex flex-col gap-3 mb-10">
        <div class="text-xl md:text-2xl font-bold text-[#1A75BB]">Quà tặng</div>
        <div class="text-sm text-[#798894] leading-5">
          {{ coupon ? 'Sau khi hoàn thành khóa học, bạn sẽ nhận được quà tặng từ Van Phuc Care:' : 'Chúng tôi vui mừng gửi tặng bạn mã giảm 10% học phí cho khóa học tiếp theo (hiệu lực trong 7 ngày).' }}
        </div>
        <div class="flex flex-wrap gap-4">
          <div
            class="w-full md:w-[360px] border border-[#D8D8D8] rounded-lg flex items-center bg-[#E9F5FF] shadow-sm cursor-pointer select-none transition active:scale-[0.99]"
            @click="handleCopyCoupon"
          >
            <div class="flex items-center justify-center w-[60px] h-[60px] ml-3 mr-4 rounded-xl bg-white border border-[#C4DDF4] text-[#1A75BB]">
              <svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.2674 2.00428C22.2674 2.38602 22.1402 2.79957 21.9175 3.1495L16.7322 10.5298L16.2869 11.1342L15.7461 11.8977L14.9826 12.9793C14.6008 13.5519 13.9646 13.8382 13.3284 13.8064C12.6921 13.8064 12.0559 13.5201 11.6742 12.9793L10.4017 11.1342L10.0518 10.6571C10.3063 10.6571 10.5607 10.5934 10.8152 10.5298C11.6105 10.3071 12.3104 9.86177 12.7876 9.22554C12.883 9.1301 12.9466 9.00286 13.0102 8.90742L13.3284 8.43025L13.6147 8.01669L13.8692 7.66676L16.2232 4.29473C16.3187 4.16748 16.4141 4.04023 16.5095 3.91298L18.6409 0.859056C19.2772 -0.031672 20.5178 -0.254354 21.4085 0.38188C21.9493 0.763621 22.2674 1.36804 22.2674 2.00428Z" fill="#1E78BA"/>
                <path d="M14.2832 5.59885C13.9968 5.66248 13.6787 5.72611 13.3606 5.72611H13.3288C13.2016 5.72611 13.1061 5.7261 12.9789 5.69429C12.788 5.66248 12.5653 5.63066 12.3744 5.59885C11.611 5.40798 10.9747 4.96262 10.4976 4.39001C10.4657 4.3582 10.4658 4.32638 10.4339 4.32638C10.3385 4.19914 10.2431 4.0719 10.1794 3.94465L9.70227 3.2766L9.16147 2.48131L8.04806 0.85891C7.66632 0.318111 7.0619 0 6.42567 0C6.04393 0 5.63037 0.127239 5.28044 0.349921C4.38971 0.986155 4.16703 2.22682 4.80327 3.11754L5.91668 4.70813L6.48928 5.50342L7.76175 7.31669L7.95262 7.60299L8.39799 8.23923L9.54321 9.86163C9.73408 9.86163 9.92495 9.82981 10.084 9.798C10.1476 9.798 10.2113 9.76619 10.2749 9.76619C11.0702 9.5435 11.77 9.09814 12.2472 8.46191C12.3426 8.36647 12.4063 8.23922 12.4699 8.14379L14.2832 5.59885Z" fill="#F48283"/>
                <path d="M13.3289 4.07189C14.4533 4.07189 15.3649 3.16037 15.3649 2.03595C15.3649 0.911523 14.4533 0 13.3289 0C12.2045 0 11.293 0.911523 11.293 2.03595C11.293 3.16037 12.2045 4.07189 13.3289 4.07189Z" fill="#1E78BA"/>
                <path d="M5.50397 17.7195C5.82209 17.7832 6.04477 18.0058 6.23564 18.2285C6.45832 18.483 6.61738 18.8011 6.74463 19.1192C6.9355 19.6282 6.9673 20.169 6.9673 20.7098V21.8869C6.9673 22.1732 6.74462 22.3958 6.49013 22.3958C6.23563 22.3958 6.01295 22.1732 6.01295 21.8869V20.7098C6.01295 20.0736 5.94934 19.6282 5.82209 19.2783C5.66303 18.8647 5.09041 18.8647 4.93136 19.2783C4.7723 19.6282 4.74048 20.0736 4.74048 20.7098V21.8869C4.74048 22.1732 4.5178 22.3958 4.26331 22.3958C4.00881 22.3958 3.78613 22.1732 3.78613 21.8869V20.7098C3.78613 20.0736 3.84976 19.4055 4.13606 18.8011C4.26331 18.5466 4.42237 18.3239 4.61324 18.1013C4.80411 17.8786 5.12223 17.6559 5.50397 17.7195Z" fill="#1A76BB"/>
                <path d="M0.827106 21.9501C0.636236 21.7593 0.477177 21.5047 0.349931 21.2821C0.0636254 20.7095 0 20.0414 0 19.4052V18.26C0 17.9737 0.222682 17.751 0.477176 17.751C0.731669 17.751 0.954351 17.9737 0.954351 18.26V19.4052C0.954351 20.0414 1.01798 20.455 1.14522 20.8049C1.30428 21.2184 1.87689 21.2184 2.03595 20.8049C2.19501 20.455 2.22682 20.0414 2.22682 19.4052V18.26C2.22682 17.9737 2.4495 17.751 2.70399 17.751C2.95849 17.751 3.18117 17.9737 3.18117 18.26V19.4052C3.18117 19.946 3.14936 20.4868 2.95849 20.9958C2.83125 21.3139 2.67219 21.6002 2.4495 21.8865C2.25863 22.1092 2.03595 22.3319 1.71783 22.3955C1.71783 22.3955 1.71784 22.3955 1.68603 22.3955C1.39972 22.4273 1.0816 22.2046 0.827106 21.9501Z" fill="#1A76BB"/>
                <path d="M8.43035 19.8505L8.46216 20.4231V21.9182C8.46216 22.2045 8.23948 22.4272 7.98499 22.4272C7.73049 22.4272 7.50781 22.2045 7.50781 21.9182V18.1008C7.50781 17.9418 7.63506 17.8145 7.79412 17.8145H8.17586C8.33492 17.8145 8.46217 17.91 8.52579 18.0372L9.79826 20.3595L9.76645 19.7869V18.2917C9.76645 18.0054 9.98913 17.7827 10.2436 17.7827C10.4981 17.7827 10.7208 18.0054 10.7208 18.2917V22.0773C10.7208 22.2682 10.5617 22.4272 10.3709 22.4272H9.95732C9.86188 22.4272 9.76644 22.3636 9.73463 22.3L8.43035 19.8505Z" fill="#1A76BB"/>
                <path d="M13.9973 21.0911H13.1702V21.9182C13.1702 22.2045 12.9475 22.4272 12.693 22.4272C12.4385 22.4272 12.2158 22.2045 12.2158 21.9182V18.0372C12.2158 17.91 12.3113 17.7827 12.4703 17.7827H14.0291C14.9516 17.7827 15.4606 18.2599 15.4606 19.2461V19.6278C15.4288 20.614 14.9198 21.0911 13.9973 21.0911ZM13.8064 18.7689H13.1702V20.0732H13.8064C14.3154 20.0732 14.4426 19.9459 14.4426 19.4688V19.3415C14.4745 18.8961 14.3472 18.7689 13.8064 18.7689Z" fill="#1A76BB"/>
                <path d="M18.2284 20.0102H16.9241V21.8235C16.9241 22.1098 16.7014 22.3325 16.4469 22.3325C16.1924 22.3325 15.9697 22.1098 15.9697 21.8235V18.197C15.9697 17.9107 16.1924 17.688 16.4469 17.688C16.7014 17.688 16.9241 17.9107 16.9241 18.197V19.0241H18.2284V18.197C18.2284 17.9107 18.451 17.688 18.7055 17.688C18.96 17.688 19.1827 17.9107 19.1827 18.197V21.8235C19.1827 22.1098 18.96 22.3325 18.7055 22.3325C18.451 22.3325 18.2284 22.1098 18.2284 21.8235V20.0102Z" fill="#1A76BB"/>
                <path d="M21.9496 20.7419V18.197C21.9496 17.9107 22.1723 17.688 22.4268 17.688C22.6813 17.688 22.904 17.9107 22.904 18.197V20.7101C22.904 21.8553 22.395 22.3325 21.4724 22.3325H21.0907C20.1682 22.3325 19.6592 21.8553 19.6592 20.7101V18.197C19.6592 17.9107 19.8819 17.688 20.1364 17.688C20.3908 17.688 20.6135 17.9107 20.6135 18.197V20.7419C20.6135 21.2191 20.7408 21.3463 21.2498 21.3463C21.7588 21.3463 21.9496 21.1873 21.9496 20.7419Z" fill="#1A76BB"/>
                <path d="M25.7035 20.7413C25.7035 20.5187 25.8626 20.3596 26.0853 20.3596H26.1807C26.4352 20.3596 26.6579 20.5823 26.6579 20.8686V20.9004C26.6579 21.8866 26.1489 22.3637 25.2264 22.3637H24.8446C23.9221 22.3637 23.4131 21.8866 23.4131 20.7413V19.3416C23.4131 18.1964 23.9221 17.7192 24.8446 17.7192H25.2264C26.1489 17.7192 26.6579 18.1964 26.6579 19.1826V19.2144C26.6579 19.5007 26.4352 19.7234 26.1807 19.7234H26.0853C25.8626 19.7234 25.7035 19.5643 25.7035 19.3416C25.7035 19.0235 25.449 18.7372 25.1309 18.7372C24.5583 18.7372 24.3993 18.8326 24.3993 19.3416V20.805C24.3993 21.2821 24.5265 21.4094 25.0991 21.4094C25.449 21.314 25.7035 21.0595 25.7035 20.7413Z" fill="#1A76BB"/>
                <path d="M5.34436 22.3953C5.6079 22.3953 5.82154 22.1816 5.82154 21.9181C5.82154 21.6546 5.6079 21.4409 5.34436 21.4409C5.08083 21.4409 4.86719 21.6546 4.86719 21.9181C4.86719 22.1816 5.08083 22.3953 5.34436 22.3953Z" fill="#F48283"/>
                <path d="M20.4872 16.5745C20.2645 16.5745 20.1055 16.5427 19.9464 16.4472C19.8191 16.3836 19.6919 16.2564 19.6601 16.0973C19.5965 15.9382 19.5647 15.7156 19.5965 15.4611C19.5965 15.1748 19.6601 14.9839 19.7237 14.793C19.8191 14.634 19.9146 14.5067 20.0736 14.4431C20.2327 14.3795 20.3918 14.3477 20.5826 14.3477C20.6781 14.3477 20.7417 14.3477 20.8371 14.3795C20.9326 14.3795 20.9962 14.4113 21.028 14.4431L20.9962 14.8566C20.9326 14.8248 20.8689 14.8248 20.8053 14.793C20.7417 14.793 20.6781 14.7612 20.5826 14.7612C20.4554 14.7612 20.3599 14.793 20.2963 14.8248C20.2327 14.8566 20.1691 14.9203 20.1055 15.0475C20.0736 15.143 20.0418 15.302 20.0418 15.4929C20.0418 15.6837 20.0418 15.811 20.0736 15.9064C20.1055 16.0019 20.1691 16.0973 20.2327 16.1291C20.2963 16.1609 20.3918 16.1927 20.519 16.1927C20.5826 16.1927 20.6463 16.1927 20.7417 16.1609C20.8053 16.1609 20.8689 16.1291 20.9326 16.0973L20.9007 16.5108C20.8371 16.5427 20.7735 16.5427 20.7099 16.5427C20.6781 16.5745 20.5826 16.5745 20.4872 16.5745Z" fill="#F48284"/>
                <path d="M22.4273 14.3789C22.491 14.5698 22.5228 14.7288 22.5864 14.9197C22.65 15.1106 22.6818 15.2696 22.7454 15.4605C22.7773 15.6514 22.8409 15.8104 22.8727 16.0013C22.9045 16.1922 22.9363 16.3512 22.9681 16.5421H22.491C22.4591 16.383 22.4591 16.2558 22.4273 16.0967H21.6957C21.6639 16.2558 21.632 16.383 21.5684 16.5421H21.123C21.1549 16.3512 21.2185 16.1922 21.2821 16.0013C21.3457 15.8104 21.4094 15.6514 21.473 15.4605C21.5366 15.2696 21.6002 15.1106 21.6638 14.9197C21.7275 14.7288 21.7911 14.5698 21.8865 14.3789H22.4273ZM22.3637 15.715C22.3637 15.6514 22.3319 15.5878 22.3319 15.4923C22.3001 15.3333 22.2683 15.1424 22.2047 14.9833C22.1728 14.9197 22.1728 14.8243 22.141 14.7607C22.1092 14.8243 22.0774 14.9197 22.0456 14.9833C21.982 15.1424 21.9183 15.3333 21.8547 15.4923C21.8229 15.5559 21.8229 15.6196 21.7911 15.715H22.3637Z" fill="#F48284"/>
                <path d="M23.7637 16.5421H23.3184L23.4138 14.3789H24.2091C24.3363 14.3789 24.4636 14.4107 24.559 14.4425C24.6544 14.4743 24.7499 14.5698 24.8135 14.6652C24.8771 14.7606 24.9089 14.8879 24.8771 15.047C24.8771 15.206 24.8453 15.3333 24.7499 15.4287C24.6863 15.5241 24.5908 15.5878 24.4636 15.6514C24.5272 15.7786 24.6226 15.9059 24.6863 16.0331C24.7817 16.1922 24.8453 16.3512 24.9407 16.5421H24.4318C24.3681 16.383 24.3045 16.224 24.2091 16.0649C24.1773 15.9695 24.1136 15.8741 24.05 15.7786H23.7955L23.7637 16.5421ZM23.8592 14.7607L23.8273 15.3651H24.1455C24.2091 15.3651 24.2409 15.3651 24.3045 15.3333C24.3363 15.3014 24.4 15.2696 24.4318 15.2378C24.4636 15.206 24.4954 15.1424 24.4954 15.047C24.4954 14.9515 24.4636 14.8879 24.4318 14.8243C24.3681 14.7606 24.3045 14.7607 24.2091 14.7607H23.8592Z" fill="#F48284"/>
                <path d="M26.7538 14.3789L26.722 14.7607H25.8631L25.8313 15.2378H26.5947L26.5629 15.6196H25.7994V16.1604H26.6584L26.6265 16.5421H25.3223L25.4177 14.3789H26.7538Z" fill="#F48284"/>
              </svg>
            </div>
            <div class="flex-1 py-3 pr-3">
              <div class="text-[14px] md:text-[15px] font-semibold text-[#020618] mb-[6px]">
                {{ coupon?.name || 'Giảm 10% học phí khóa học' }}
              </div>
              <div class="text-[11px] md:text-[12px] text-[#62748E] leading-5 flex flex-wrap gap-4">
                <span>
                  Mã Voucher <span class="text-[#2E90E5] font-semibold">{{ coupon?.code || 'Sẽ được gửi ngay sau khi hoàn thành' }}</span>
                </span>
                <span>
                  HSD <span class="text-[#2E90E5] font-semibold">{{ coupon ? (new Date(coupon.validTo)).toLocaleDateString('en-GB') : '7 ngày kể từ hôm nay' }}</span>
                </span>
              </div>
              <div class="text-[11px] text-[#62748E] mt-1">
                Áp dụng 1 lần cho khóa học tiếp theo.
              </div>
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
              @click="handleReLearn"
              class="bg-[#317BC4] border-none hover:bg-blue-600 rounded-[4px] h-[44px] font-semibold px-8 text-white w-full text-[13px]"
            >
              Xem lại
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
import { message } from 'ant-design-vue';
import { useProgressTracking } from '~/composables/useProgressTracking';

interface ICoupon {
  _id: string;
  name: string;
  code: string;
  validTo: string;
}

const props = defineProps<{
  course: Course | null
}>()
const emit = defineEmits<{
  isRepeating: []
}>()
const loading = ref(false)
const courseStore = useCoursesStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const progressTracking = useProgressTracking();

const coupon = ref<ICoupon | null>(null)
const copied = ref(false)

const user = authStore.currentUser

const certificateDate = computed(() => {
  const raw = (props.course as any)?.progress?.completedAt;
  if (raw) {
    try {
      return new Date(raw).toLocaleDateString("en-GB");
    } catch {
      return new Date().toLocaleDateString("en-GB");
    }
  }
  return new Date().toLocaleDateString("en-GB");
});

const filteredCourses = computed(() => {
  return courseStore.courses.filter(c => c.isPurchased === false && c._id !== props.course?._id)
})

const handleReLearn = async () => {
  const currentCourse = courseStore.currentCourse || props.course as any;
  const slug = currentCourse?.slug || props.course?.slug;

  if (!slug) {
    return;
  }

  // Chế độ Review: Không reset progress, không reset chứng chỉ
  // Chỉ điều hướng về trang học tập với query review=true để bỏ qua check bài trước
  await navigateTo(`/my-learning/${slug}?chapter=0&lesson=0&review=true`);

  // Báo cho parent biết đang ở chế độ review
  emit('isRepeating');
}
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
    // Tự động tạo coupon completion nếu chưa có
    await couponApi.createCompletionCoupon(props?.course?._id as string);
    const response: any = await couponApi.getCouponValid(props?.course?._id as string);
    const rawCoupon = response?.data?.coupon || response?.coupon || null;
    // Fallback HSD +7 ngày nếu backend chưa trả
    if (rawCoupon && !rawCoupon.validTo) {
      const now = new Date();
      rawCoupon.validTo = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    coupon.value = rawCoupon;
  } catch (error) {
    console.error("Error fetching coupons:", error);
  } finally {
    loading.value = false;
  }
};

const handleCopyCoupon = async () => {
  const code = coupon.value?.code;
  if (!code) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    copied.value = true;
    message.success({
      content: "Đã sao chép mã",
      duration: 2,
    });
  } catch (error) {
    message.error({
      content: "Không thể sao chép mã",
      duration: 2,
    });
  } finally {
    setTimeout(() => (copied.value = false), 2000);
  }
}

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
    navigateTo('/cart')
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
