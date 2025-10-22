<template>
    <div class="relative">
        <div class="product-carousel mt-3 mx-auto relative">
            <VueSlickCarousel
                v-if="blogs?.length"
                key="product-slide"
                ref="productCarousel"
                v-bind="settings"
            >
                <div v-for="(blog, index) in (blogs)" :key="`blogs_${index}`" class="cursor-pointer group transition-all duration-150">
                    <img class="rounded-sm h-[200px] w-full object-cover" :src="blog.thumbnail" alt="/">
                    <div class="mt-2 flex items-center justify-between">
                        <h4 class="max-w-[80%] font-[600] text-[15px] m-0">
                            {{ blog.title }}
                        </h4>
                    </div>
                </div>
                <template #prevArrow>
                    <div slot="prev-arrow">
                        <a-button class="!p-[5px] !flex items-center justify-center !z-50 absolute bottom !outline-none hover:!border-[#1351d8] rounded-full border-[#1351d8]">
                            <svg
                                class="transition-all duration-150 w-6 h-5 mt-[2px]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                stroke="#161a21"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-miterlimit="10"
                                stroke-width="1.5"
                                d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                            /></svg>
                        </a-button>
                    </div>
                </template>
                <template #nextArrow>
                    <div slot="next-arrow">
                        <a-button class="!p-[5px] !flex items-center justify-center -right-[15px] md:right-[0] !outline-none hover:!border-[#1351d8] rounded-full border-[#1351d8]">
                            <svg
                                data-v-1643b9e2=""
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                class="transition-all duration-150 w-6 h-5 mt-[2px]"
                            ><path
                                data-v-1643b9e2=""
                                stroke="#161a21"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-miterlimit="10"
                                stroke-width="1.5"
                                d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"
                            /></svg>
                        </a-button>
                    </div>
                </template>
            </VueSlickCarousel>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import VueSlickCarousel from 'vue-slick-carousel';
    import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
    import 'vue-slick-carousel/dist/vue-slick-carousel.css';

    export default {
        components: {
            VueSlickCarousel,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                settings: {
                    speed: 500,
                    autoplay: false,
                    focusOnSelect: true,
                    infinite: true,
                    slidesToShow: 1,
                    responsive: [
                        {
                            breakpoint: 1280,
                            settings: {
                                slidesToShow: 1,
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
                },
            };
        },

        computed: {
            ...mapState('systems/blogs', ['blogs']),
        },

        watch: {
            data: {
                handler() {
                },
                deep: true,
            },
        },
        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.blogs === null) {
                        await this.$store.dispatch('systems/blogs/fetchAll');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="scss">
.product-carousel {
.slick-slide>div {
}
.slick-prev, .slick-next {
    transform: translate(-50%, -50%);
    top: 120% !important;
}
.slick-prev {
    left: 75%;
}
.slick-next {
    right: 5%;
}

.slick-next:before, .slick-prev:before {
    content: none;
}
.ant-btn:hover, .ant-btn:focus {
    color: #161a21 !important;
    border-color: #161a21 !important;
}
}
</style>
