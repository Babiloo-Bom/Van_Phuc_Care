<template>
    <div class="flex flex-col h-full">
        <div class=" banner-carousel flex-1 h-full">
            <a-empty v-if="feedbacks?.length === 0" description="Không có dữ liệu" class="!mt-20" />
            <VueSlickCarousel
                v-else
                key="banner"
                ref="SliderCarousel"
                v-bind="settings"
                @beforeChange="afterChangeSlide"
            >
                <div v-for="(feedback, index) in feedbacks" :key="`feedback_${index}`" class="">
                    <div class="relative w-full h-full max-w-[80%] mx-auto">
                        <div class="pb-4 ">
                            <div class="flex items-center gap-4">
                                <img :src="feedback.avatar || '/images/avatar-empty.webp'" class="w-[73px] h-[73px] rounded-full object-cover" alt="/">
                                <div class="flex flex-col border-b-[1px] border-[#1A75BB] w-full pb-4">
                                    <div class="flex  items-center">
                                        <p class="m-0 font-[600] text-[#1A75BB] mr-2">
                                            {{ feedback.fullname }}
                                        </p>
                                        <a-rate :default-value="feedback.rate" disabled style="fontSize: 36px" />
                                    </div>
                                    <p class="text-[12px] italic m-0 text-[#7C7C7C]">
                                        (Đăng nhập bằng Google mail)
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p class="m-0 text-[#868686] mt-4 text-[14px]">
                            {{ feedback.content }}
                        </p>
                    </div>
                </div>

                <template #prevArrow>
                    <div slot="prev-arrow" class="absolute -top-3 sm:!left-[2%] !flex !flex-col !items-center !justify-center z-50 !w-12 !h-12 rounded-full !text-center !bg-prim-900 hover:!text-prim-900 !text-white duration-300 hover:!bg-white">
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            style="
    color: #1a75bbcc;
"
                        ><path
                            stroke="#1A75BB"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="3"
                            d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                        /></svg>
                    </div>
                </template>
                <template #nextArrow>
                    <div slot="next-arrow" class="absolute -top-3 !right-[2%] !flex !flex-col !items-center !justify-center !w-12 !h-12 rounded-full !text-center !bg-prim-900 hover:!text-prim-900 !text-white duration-300 hover:!bg-white">
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            stroke="#1A75BB"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="3"
                            d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"
                        /></svg>
                    </div>
                </template>

                <template #customPaging>
                    <div slot="custom-paging">
                        <span class="block mx-auto w-20 h-1 rounded-full bg-white duration-300" />
                    </div>
                </template>
            </VueSlickCarousel>
        </div>
    </div>
</template>

<script>
    import VueSlickCarousel from 'vue-slick-carousel';
    import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
    import 'vue-slick-carousel/dist/vue-slick-carousel.css';
    import { mapState } from 'vuex';

    export default {
        components: {
            VueSlickCarousel,
        },

        props: {
            data: {
                type: Array,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            path: {
                type: String,
                default: '/',
            },
            title: {
                type: String,
                default: 'Record',
            },
        },

        data() {
            return {
                titleAnimate: true,
                dataCarousel: this.feedbacks || [],
                settings: {
                    speed: 1000,
                    autoplaySpeed: 1000,
                    dots: false,
                    fade: true,
                    arrows: true,
                    autoplay: false,
                    delay: 5000,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 1280,
                            settings: {
                                arrows: false,
                            },
                        },
                    ],
                },
            };
        },

        computed: {
            ...mapState('feedbacks', ['feedbacks']),
        },

        watch: {
            // data: {
            //     handler() {
            //         this.dataCarousel = this.feedbacks?.slice(0, 5) || [];
            //         this.$refs.SliderCarousel.onPropsUpdated();
            //     },
            //     deep: true,
            // },
        },

        methods: {
            afterChangeSlide() {
                this.titleAnimate = false;
                setTimeout(() => {
                    this.titleAnimate = true;
                }, 0);
            },
        },
    };
</script>

<style lang="scss">
    .banner-carousel {
        // * {
        //     height: 100% !important;;
        // }
        .slick-slider {
            @apply h-full;
        }
        .slick-prev:before, .slick-next:before {
            content: '' !important;
        }
        .slick-list {
            padding: 0px 0px !important;
            // @apply h-[79vh] lg:h-[calc(100vh-100px)] #{!important};
        }
        .slick-track {
            height: 100%;
        }
        .lick-slide {
            float: right !important;
        }
        .slick-dots {
            bottom: -6px;
            @apply xl:pr-28;
            .slick-active {
                span {
                    @apply w-20 bg-black relative;
                }
            }
            li {
                @apply w-20 mx-1;
            }
        }
        p {
            @apply mb-0
        }
    }
</style>
