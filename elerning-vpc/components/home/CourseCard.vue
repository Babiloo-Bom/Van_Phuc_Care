<template>
    <div class="card !p-0 bg-white !rounded-[12px] h-full">
        <nuxt-link :to="`${isRegister ? '/khoa-hoc-cua-toi' : '/khoa-hoc'}/${course.slug}`" class="h-full flex flex-col justify-between">
            <div class="relative">
                <div class="relative">
                    <img class="rounded-t-md h-[201px] w-[100%] object-cover" :src="course.thumbnail" :alt="course.slug">
                    <div class="absolute bg-[#1A75BB] px-4 bottom-[20px] left-0 h-[27px] flex items-center justify-center">
                        <nuxt-link :to="`${isRegister ? '/khoa-hoc-cua-toi' : '/khoa-hoc'}/${course.slug}`" class="!text-white font-[500]">
                            Truy cập
                        </nuxt-link>
                    </div>
                </div>
                <div class="p-4">
                    <nuxt-link :to="`${isRegister ? '/khoa-hoc-cua-toi' : '/khoa-hoc'}/${course.slug}`">
                        <h4 class="text-[18px] m-0 font-bold text-[#1A75BB]">
                            {{ course.title || 'Đang cập nhật' }}
                        </h4>
                    </nuxt-link>
                    <p class="mt-4 text-[#8C8C8C] line-clamp-4">
                        {{ course.shortDescriptions || 'Mô tả đang cập nhật' }}
                    </p>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center justify-start gap-1">
                            <span>
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z"
                                    stroke="#000000"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /><path
                                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                                    stroke="#000000"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                            </span>
                            <span class="font-[600] text-[#000000]">{{ course.videoCount }} video</span>
                        </div>
                        <div class="flex items-center justify-start gap-1">
                            <span>
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    d="m21.67 14.3-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2Z"
                                    stroke="#000000"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                /><path
                                    d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"
                                    stroke="#000000"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                            </span>
                            <span class="font-[600] text-[#000000]">{{ course.documentCount }} tài liệu</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-start gap-1">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="10"
                                height="9"
                                viewBox="0 0 10 9"
                                fill="none"
                            >
                                <path
                                    d="M4.31471 8.36571H2.15047C1.55283 8.3657 1.06836 7.91654 1.06836 7.36246L1.0684 1.34307C1.06841 0.789004 1.55288 0.339844 2.15052 0.339844H7.02016C7.61779 0.339844 8.10227 0.789008 8.10227 1.34308V4.10198M5.93805 6.94448L6.92999 7.86411L9.09422 5.85756M2.96223 2.34631H6.20858M2.96223 3.85117H6.20858M2.96223 5.35602H4.5854"
                                    stroke="black"
                                    stroke-width="0.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </span>
                        <span class="font-[600] text-[#000000]">{{ course.examCount }} bài trắc nghiệm</span>
                    </div>
                </div>
            </div>
            <div class="px-4 mt-[2px]">
                <div class=" border-t-[1px] border-[#8C8C8C] py-4">
                    <p v-if="course.price" class="m-0 text-[22px] font-[700] text-[#1A75BB]">
                        {{ Number(course.price).toLocaleString('de-DE') || 0 }}đ
                    </p>
                    <p v-else class="m-0 text-[22px] font-[600] text-[#15CF74]">
                        Miễn phí
                    </p>
                    <div class="flex items-center justify-start mt-1">
                        <a-rate style="fontSize: 14px;color: #FFD74B; marginRight: 0px" :default-value="course.rate || 5" disabled />
                        <p class="m-0 text-[12px] mt-[1px] ml-[4px] text-[#868686]">
                            ({{ (course.reviewsCount || 0)?.toLocaleString('en-US') }} đánh giá)
                        </p>
                    </div>
                </div>
            </div>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        props: {
            course: {
                type: Object,
                default: () => {},
            },
            isRegister: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
