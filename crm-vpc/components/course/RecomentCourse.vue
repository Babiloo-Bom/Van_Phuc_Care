<template>
    <div class="course-carousel">
        <a-empty v-if="dataCarousel.length === 0" description="Không có dữ liệu" />
        <VueSlickCarousel
            v-else
            key="courseSlide"
            ref="SliderCarousel"
            v-bind="settings"
        >
            <div v-for="_course in dataCarousel" :key="_course.id">
                <div class="w-full h-full relative cursor-pointer">
                    <div v-if="loading">
                        <Loading />
                    </div>
                    <div
                        v-else
                        @click="openCourse(_course.slug)"
                    >
                        <CourseCard
                            :course="_course"
                            class="max-w-[360px] mx-auto md:max-w-none"
                        />
                    </div>
                </div>
            </div>
            <template #prevArrow>
                <div
                    slot="prev-arrow"
                    class="absolute !top-[108%] !left-[30%] sm:!top-1/2 sm:-translate-y-1/2 sm:!-left-0 md:!-left-20 xl:!left-[-5%] !flex !flex-col !items-center !justify-center z-[5]
                            !w-10 !h-10 rounded-full !text-center !bg-prim-100 hover:!text-prim-100 !border-[2px] !border-solid !border-prim-100 !text-white duration-300 hover:!bg-white"
                >
                    <i class="fas fa-chevron-left text-3xl" />
                </div>
            </template>
            <template #nextArrow>
                <div
                    slot="next-arrow"
                    class="absolute !top-[108%] !right-[30%] sm:!top-1/2 sm:-translate-y-1/2 sm:!-right-0 md:!-right-20 xl:!right-[-5%] !flex !flex-col !items-center !justify-center z-[5]
                            !w-10 !h-10 rounded-full !text-center !bg-prim-100 hover:!text-prim-100 !border-[2px] !border-solid !border-prim-100 !text-white duration-300 hover:!bg-white"
                >
                    <i class="fas fa-chevron-right text-3xl" />
                </div>
            </template>

            <template #customPaging>
                <div slot="custom-paging">
                    <span class="block mx-auto w-20 h-1 rounded-full bg-white duration-300" />
                </div>
            </template>
        </VueSlickCarousel>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import VueSlickCarousel from 'vue-slick-carousel';
    import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
    import 'vue-slick-carousel/dist/vue-slick-carousel.css';
    import Loading from '@/components/shared/LoadingSecond.vue';
    import CourseCard from '@/components/course/Card.vue';

    export default {
        components: {
            VueSlickCarousel,
            Loading,
            CourseCard,
        },

        props: {
            params: {
                type: Object,
                default: () => {},
            },
        },

        async fetch() {
            if (this.recomentCourses?.length) {
                this.dataCarousel = this.recomentCourses;
            } else {
                await this.$store.dispatch('courses/fetchRecoment', { ...this.$route.query });
                this.dataCarousel = this.recomentCourses;
            }
            this.$forceUpdate();
        },

        data() {
            return {
                loading: false,
                dataCarousel: Array(1).fill({}),
            };
        },

        computed: {
            ...mapState('courses', ['recomentCourses']),
            settings() {
                return {
                    speed: 500,
                    dots: false,
                    infinite: true,
                    arrows: true,
                    slidesToShow: this.dataCarousel?.length < 4 ? this.dataCarousel?.length : 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    responsive: [
                        {
                            breakpoint: 1400,
                            settings: {
                                slidesToShow: 3,
                            },
                        },
                        {
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 3,
                            },
                        },
                        {
                            breakpoint: 1279,
                            settings: {
                                arrows: true,
                                slidesToShow: 2,
                            },
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                arrows: true,
                                slidesToShow: 1,
                            },
                        },
                    ],
                };
            },
        },

        watch: {
            dataCarousel() {
                this.$forceUpdate();
            },
        },

        methods: {
            openCourse(slug) {
                const authData = localStorage.getItem('auth.data');
                const authDataObject = JSON.parse(authData);
                window.open(`https://edu.vanphuccare.vn/khoa-hoc/${slug}?username=${authDataObject.username}&pwd=${authDataObject.password}`, '_blank');
            },
        },
    };
</script>

<style lang="scss">
    .course-carousel {
        .slick-prev:before, .slick-next:before {
            content: '' !important;
        }
        .slick-list {
            overflow: hidden;
            padding: 0px 0px !important;
        }
        .slick-slide {
            float: left !important;
            padding: 0px 8px !important;
        }
        .slick-slider {
            margin: 0px -8px !important;
        }
        .slick-dots {
            bottom: -6px;
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
