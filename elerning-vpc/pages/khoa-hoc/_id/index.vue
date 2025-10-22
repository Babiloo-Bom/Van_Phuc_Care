<template>
    <div>
        <div
            :class="`sm:h-[450px] py-10 sm:pt-20 sm:pb-20 md:pb-40 bg-cover bg-center bg-no-repeat relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100`"
            :style="`background: url(${course.thumbnail}) center center/cover no-repeat fixed`"
        >
            <div class="container h-full">
                <div class="grid grid-cols-12 gap-8">
                    <div class="col-span-12 xl:col-span-8 relative z-[1] flex flex-col h-full gap-6">
                        <div class="text-white">
                            <div class="mb-6">
                                <nuxt-link to="/" class="m-0">
                                    Tất cả khóa học |
                                </nuxt-link>
                                <nuxt-link :to="course?.slug || ''" class="m-0">
                                    {{ course?.title }}
                                </nuxt-link>
                            </div>
                            <div class="flex items-center gap-4">
                                <h4 class="text-3xl sm:text-4xl font-bold text-white mb-1">
                                    {{ course.title }}
                                </h4>
                            </div>
                            <div class="mt-4">
                                <p class="mb-0 md:max-w-[90%]">
                                    {{ course.shortDescriptions }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-auto">
                            <div class="text-white">
                                <div class="text-white flex items-center gap-2">
                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            class="fill-none stroke-white"
                                        ><path
                                            d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /><path
                                            d="m15.71 15.18-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg>
                                    </span>
                                    <span>Ưu đãi còn 3 ngày</span>
                                </div>
                                <div class="flex items-end gap-4 py-1">
                                    <h3 v-if="course.price" class="text-3xl sm:text-5xl mb-0 text-white">
                                        {{ Number(course.price)?.toLocaleString('en-US') }}đ
                                    </h3>
                                    <h3 v-else class="text-3xl sm:text-5xl font-[600] mb-0 text-[#15CF74]">
                                        {{ 'Miễn phí' }}
                                    </h3>
                                    <h4 v-if="course.priceSale" class="text-xl sm:text-3xl italic mb-0 line-through text-white">
                                        {{ Number(course.priceSale)?.toLocaleString('en-US') }}đ
                                    </h4>
                                </div>
                                <div class="text-white flex items-center gap-4 flex-wrap">
                                    <div class="flex gap-1 items-center w-full sm:w-auto">
                                        <a-rate
                                            class="relative -top-0.5"
                                            style="fontSize: 14px;color: #FFD74B; marginRight: 0px"
                                            :value="course.rate"
                                            disabled
                                        />
                                        <span class="">
                                            {{ (course.reviewsCount || 0)?.toLocaleString('en-US') }} lượt đánh giá
                                        </span>
                                    </div>
                                    <div class="flex items-center justify-start gap-1">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                class="fill-none stroke-white"
                                            ><path
                                                d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /><path
                                                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /></svg>
                                        </span>
                                        <span>{{ course.videoCount }} video</span>
                                    </div>
                                    <div class="flex items-center justify-start gap-1">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                class="fill-none stroke-white"
                                            ><path
                                                d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                            /><path
                                                d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /></svg>
                                        </span>
                                        <span>{{ course.documentCount }} tài liệu</span>
                                    </div>
                                    <div class="flex items-center justify-start gap-1">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 10 9"
                                                class="fill-none stroke-white"
                                            >
                                                <path
                                                    d="M4.31471 8.36571H2.15047C1.55283 8.3657 1.06836 7.91654 1.06836 7.36246L1.0684 1.34307C1.06841 0.789004 1.55288 0.339844 2.15052 0.339844H7.02016C7.61779 0.339844 8.10227 0.789008 8.10227 1.34308V4.10198M5.93805 6.94448L6.92999 7.86411L9.09422 5.85756M2.96223 2.34631H6.20858M2.96223 3.85117H6.20858M2.96223 5.35602H4.5854"
                                                    stroke-width="0.7"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <span>{{ course.examCount }} bài trắc nghiệm</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-[#f4f7f9] py-0 md:py-14">
            <div class="container mx-auto">
                <div class="grid grid-cols-12 gap-8">
                    <div class="col-span-12 lg:col-span-8">
                        <div>
                            <div v-if="!course.videoIframe">
                                <img class="h-[300px] lg:h-[500px] w-full object object-cover rounded-md" :src="course.thumbnail" alt="/">
                            </div>
                            <div v-else v-html="course?.videoIframe" />
                            <div class="card-container mt-6">
                                <a-tabs type="card" @change="handleChange">
                                    <a-tab-pane key="1" tab="Tổng quan">
                                        <div class="py-5">
                                            <h4 class="text-3xl font-bold text-prim-100 mb-1">
                                                {{ course.title }}
                                            </h4>
                                            <div class="border-t-[1px] border-solid border-gray-40 pt-4">
                                                <div v-html="course.descriptions" />
                                            </div>
                                        </div>
                                    </a-tab-pane>
                                    <a-tab-pane key="2" tab="Nội dung khóa học">
                                        <div class="py-5">
                                            <div class="flex bg-[#f3f9ff] items-center gap-4 p-2 rounded-sm flex-wrap">
                                                <h3 class="mb-0 text-prim-100 mr-2 font-semibold w-full sm:w-auto">
                                                    Nội dung khóa học:
                                                </h3>
                                                <div class="flex items-center justify-start gap-1 text-prim-100">
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            class="fill-none stroke-prim-100"
                                                        ><path
                                                            d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z"
                                                            stroke-width="1.5"
                                                            stroke-miterlimit="10"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        /><path
                                                            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                                                            stroke-width="1.5"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        /></svg>
                                                    </span>
                                                    <span>{{ course.videoCount }} video</span>
                                                </div>
                                                <div class="flex items-center justify-start gap-1 text-prim-100">
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            class="fill-none stroke-prim-100"
                                                        ><path
                                                            d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z"
                                                            stroke-width="1.5"
                                                            stroke-miterlimit="10"
                                                        /><path
                                                            d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"
                                                            stroke-width="1.5"
                                                            stroke-miterlimit="10"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                        /></svg>
                                                    </span>
                                                    <span>{{ course.documentCount }} tài liệu</span>
                                                </div>
                                                <div class="flex items-center justify-start gap-1 text-prim-100">
                                                    <span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 10 9"
                                                            class="fill-none stroke-prim-100"
                                                        >
                                                            <path
                                                                d="M4.31471 8.36571H2.15047C1.55283 8.3657 1.06836 7.91654 1.06836 7.36246L1.0684 1.34307C1.06841 0.789004 1.55288 0.339844 2.15052 0.339844H7.02016C7.61779 0.339844 8.10227 0.789008 8.10227 1.34308V4.10198M5.93805 6.94448L6.92999 7.86411L9.09422 5.85756M2.96223 2.34631H6.20858M2.96223 3.85117H6.20858M2.96223 5.35602H4.5854"
                                                                stroke-width="0.7"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                            />
                                                        </svg>
                                                    </span>
                                                    <span>{{ course.examCount }} bài trắc nghiệm</span>
                                                </div>
                                            </div>
                                            <div class="mt-4">
                                                <h2 class="text-3xl uppercase font-bold text-prim-100">
                                                    Nội dung chính
                                                </h2>
                                                <ContentCourse :data="course" />
                                            </div>
                                        </div>
                                    </a-tab-pane>
                                    <a-tab-pane key="3" tab="Giảng viên">
                                        <div class="text-prim-100 flex flex-wrap gap-6 py-5">
                                            <div class="w-[200px] h-[200px] mx-auto">
                                                <img class="w-full h-full object-cover rounded-full" :src="course.lecturers?.avatar" alt="avatar">
                                            </div>
                                            <div class="w-full sm:w-auto sm:flex-1">
                                                <h2 class="text-prim-100 text-3xl font-bold mb-1">
                                                    {{ course.lecturers?.fullname }}
                                                </h2>
                                                <p v-if="course.lecturers?.specialize" class="mb-0 text-xl font-semibold">
                                                    Chuyên môn: {{ course.lecturers.specialize }}
                                                </p>
                                                <span class="block w-full h-[1px] bg-gray-80 my-3" />
                                                <p v-if="course.lecturers?.skills" class="mb-0">
                                                    Kỹ năng: {{ course.lecturers.skills }}
                                                </p>
                                                <ul class="mt-8 mb-0 flex gap-4">
                                                    <li
                                                        v-for="(social, index) in socialMediaArray"
                                                        :key="`social_${index}`"
                                                        class="cursor-pointer"
                                                        @click="openSocial(social.link)"
                                                    >
                                                        <img
                                                            v-if="social.icon"
                                                            class="w-[20px] h-[20px] object-contain"
                                                            :src="social.icon"
                                                            :alt="social.icon"
                                                        >
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </a-tab-pane>
                                    <a-tab-pane key="4" tab="Đánh giá">
                                        <div v-if="!loadingReview" class="py-5 sm:px-8">
                                            <div v-if="reviews?.length" class="flex flex-col gap-6">
                                                <div v-for="(review, index) in reviews" :key="`review_${index}`" class="flex gap-6 border-b-[1px] border-solid border-gray-80 pb-6 flex-wrap">
                                                    <div class="w-[120px] h-[120px]">
                                                        <img class="w-full h-full object-cover rounded-full" :src="review.avatar" alt="">
                                                    </div>
                                                    <div class="w-full sm:w-auto sm:flex-1">
                                                        <h3 class="mb-0 text-prim-100 font-semibold text-xl">
                                                            {{ review.name }}
                                                            <span class="text-gray-80 text-base italic font-normal block sm:inline-block">
                                                                (Đăng nhập bằng Google mail)
                                                            </span>
                                                        </h3>
                                                        <a-rate style="fontSize: 14px;color: #FFD74B; marginRight: 0px" :value="review.rate || 5" disabled />
                                                        <p>
                                                            {{ review.content }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <a-empty v-else description="Chưa có đánh giá nào" />
                                            <!-- <div class="mt-6 cursor-pointer">
                                                <h3 class="mb-0 text-center text-prim-100 font-semibold text-xl">
                                                    Xem thêm
                                                </h3>
                                                <span class="block text-center text-xl animate-bounce"><i class="fas fa-angle-double-down" /></span>
                                            </div> -->
                                        </div>
                                        <div v-else class="flex items-center justify-center h-full min-h-[350px]">
                                            <span class="genstech-loader" />
                                        </div>
                                    </a-tab-pane>
                                </a-tabs>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-4">
                        <div class="bg-white rounded-md px-3 pt-3 pb-5 lg:-mt-[100%] z-[2] shadow-xl sticky top-[90px]">
                            <div>
                                <img class="w-full h-[200px] object-cover rounded" :src="course.thumbnail" alt="/">
                            </div>
                            <div class="flex flex-col items-center gap-2 mt-2">
                                <a-button
                                    v-if="isHasInCart"
                                    type="primary"
                                    class="!w-full !py-2 !h-[45px]"
                                >
                                    Đã có trong giỏ hàng
                                </a-button>
                                <a-button
                                    v-else
                                    type="primary"
                                    class="!w-full !py-2 !h-[45px]"
                                    @click="addToCart"
                                >
                                    Thêm vào giỏ hàng
                                </a-button>
                                <a-button class="!w-full !bg-second-100 !py-2 !h-[45px] !text-white !border-second-100" @click="rediectCheckout">
                                    Thanh toán ngay
                                </a-button>
                            </div>
                            <div class="mt-2">
                                <ul class="mb-0">
                                    <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                                        <span class="font-semibold text-prim-100">Thời lượng:</span>
                                        <span v-if="course.timeCount">Tổng {{ course.timeCount }}</span>
                                        <span v-else>{{ 'Đang cập nhật' }}</span>
                                    </li>
                                    <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                                        <span class="font-semibold text-prim-100">Bài giảng:</span>
                                        <span>{{ totalLessons(course.chapters) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                                        <span class="font-semibold text-prim-100">Trắc nghiệm:</span>
                                        <span>{{ course.examCount }}</span>
                                    </li>
                                    <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                                        <span class="font-semibold text-prim-100">Trình độ:</span>
                                        <span>{{ mapDifficulty(course.level) }}</span>
                                    </li>
                                    <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                                        <span class="font-semibold text-prim-100">Ngôn ngữ:</span>
                                        <span>Tiếng Việt</span>
                                    </li>
                                    <li class="flex justify-between items-center border-b-[1px] border-solid border-gray-40 py-3">
                                        <span class="font-semibold text-prim-100">Chứng nhận:</span>
                                        <span>{{ course.certificate ? 'Có' : 'Không' }}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="text-center mt-6">
                                <h4 class="text-prim-100 font-semibold">
                                    Tìm hiểu thêm thông tin về khóa học
                                </h4>
                                <div>
                                    <ul class="mb-0 flex items-center justify-center gap-4">
                                        <li>
                                            <a
                                                href="https://www.facebook.com/chamsocmevabe.vanphuc"
                                                target="_blank"
                                                alt=""
                                                aria-label=""
                                                class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                                            >
                                                <i class="fab fa-facebook-f leading-8 text-xl text-[#868686]" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.instagram.com/vanphuccare/"
                                                target="_blank"
                                                alt=""
                                                aria-label=""
                                                class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                                            >
                                                <img src="/images/instagram.png" alt="/" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.zalo.vn/vanphuccare/"
                                                target="_blank"
                                                alt=""
                                                aria-label=""
                                                class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                                            >
                                                <img src="/images/zalo.png" alt="/" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://vanphuccare.vn"
                                                target="_blank"
                                                alt=""
                                                aria-label=""
                                                class="text-center w-8 h-8 rounded-full bg-[#ececec] flex flex-col justify-center items-center"
                                            >
                                                <i class="fas fa-link leading-8 text-xl text-[#868686]" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <h4 class="text-prim-100 font-semibold mt-4">
                                    Chi tiết xin liên hệ
                                </h4>
                                <a-button class="!rounded-full w-full !h-[45px] px-2">
                                    <div class="flex items-center justify-center gap-3">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                class="fill-none stroke-prim-100"
                                            ><path
                                                d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98a28.75 28.75 0 0 1-3.28-2.8 28.414 28.414 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z"
                                                stroke-width="1.5"
                                                stroke-miterlimit="10"
                                            /></svg>
                                        </span>
                                        <a href="tel:(024) 6329 6698" class="!text-prim-100">(024) 6329 6698</a>
                                        <span class="text-prim-100 relative -top-0.5">|</span>
                                        <a href="tel:0908093198" class="!text-prim-100">0908093198</a>
                                    </div>
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-10 py-10 border-t-[1px] border-solid border-gray-80">
                    <h2 class="text-3xl text-gray-100">
                        Khóa học phổ biến
                    </h2>
                    <RecomentCourse class="mt-6" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import RecomentCourse from '@/components/courses/RecomentCourse.vue';
    import ContentCourse from '@/components/courses/ContentCourse.vue';

    export default {
        auth: false,
        components: {
            RecomentCourse,
            ContentCourse,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                loadingReview: false,
                socialMediaArray: [],
            };
        },
        computed: {
            ...mapState('courses', ['course', 'reviews']),
            ...mapState('courses', ['cart']),
            isHasInCart() {
                return this.cart.find((course) => course._id === this.course._id);
            },
        },
        watch: {
            '$route.query': {
                handler(query) {
                    const { username, pwd } = query;
                    if (username && pwd) {
                        this.login(username, pwd);
                    }
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            rediectCheckout() {
                if (!this.isHasInCart) {
                    this.addToCart();
                }
                this.$router.push('/thanh-toan');
            },
            convertToObjectArray() {
                this.socialMediaArray = Object.entries(this.course?.lecturers?.contacts || {})
                    .map(([key, value]) => ({
                        icon: this.getIcon(key),
                        link: key === 'email' ? `mailto:${value}` : value,
                    }));
            },
            getIcon(key) {
                switch (key) {
                    case 'facebook':
                        return '/images/svg/facebook.svg';
                    case 'email':
                        return '/images/svg/email.png';
                    case 'website':
                        return '/images/svg/google.svg';
                    case 'linkedin':
                        return '/images/svg/linkedin-original.svg';
                    default:
                        return '';
                }
            },

            openSocial(value) {
                window.open(value, '_blank');
            },

            mapDifficulty(vietnameseDifficulty) {
                const vietnameseToEnglish = {
                    easy: 'Dễ',
                    medium: 'Vừa',
                    hard: 'Khó',
                };
                return vietnameseToEnglish[vietnameseDifficulty] || 'Unknown';
            },

            async addToCart() {
                const {
                    _id, thumbnail, title, price, slug, priceSale,
                } = this.course;
                await this.$store.dispatch('courses/addToCart', {
                    _id,
                    thumbnail,
                    title,
                    price,
                    slug,
                    priceSale,
                });
            },

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('courses/fetchDetail', this.$route.params.id);
                    this.convertToObjectArray();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async handleChange(value) {
                if (value === '4') {
                    try {
                        this.loadingReview = true;
                        await this.$store.dispatch('courses/fetchReviews', this.course._id);
                    } catch (error) {
                        this.$handleError(error);
                    } finally {
                        this.loadingReview = false;
                    }
                }
            },
            async login(username, password) {
                const currentPath = this.$router.currentRoute.path;
                await this.$auth
                    .loginWith('local', {
                        data: {
                            username,
                            password,
                            remindAccount: false,
                            origin: 'vanphuccare.gensi.vn',
                        },
                    })
                    .then(async () => {
                        this.$auth.$storage.setLocalStorage('data', {
                            username,
                            password,
                            remindAccount: false,
                            origin: 'vanphuccare.gensi.vn',
                        });
                        this.$message.success('Đăng nhập thành công');
                        this.$router.push(currentPath);
                        this.fetchData();
                    })
                    .catch((error) => {
                        this.$handleError(error, (_error) => {
                            const errorData = _error?.response?.data;
                            this.$message.error('Tên đăng nhập hoặc mật khẩu không chính xác');
                            if (errorData?.code === 401) {
                                this.$router.push('/login');
                            }
                        });
                    })
                    .finally(async () => {
                        this.loading = false;
                    });
            },
            totalLessons(chapters = []) {
                // Use reduce to count the total number of lessons across all chapters
                return chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
            },
        },
    };
</script>

<style lang="scss">
.card-container .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-wrap {
    @apply px-5
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
.ant-tabs-tab-active.ant-tabs-tab {
    min-width: 150px
}
</style>
