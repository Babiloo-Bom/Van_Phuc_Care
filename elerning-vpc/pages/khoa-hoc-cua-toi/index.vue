<template>
    <div class="">
        <!-- :style="`background-image: url(${retreat.thumbnail || ''})`" -->
        <div
            class="h-auto sm:h-[500px] py-10 sm:pt-20 sm:pb-20 md:pb-60 bg-cover bg-center bg-no-repeat bg-[url('https://cdn.synck.io.vn/vanphuccare/banner/main.webp')]
                    relative z-[0] after:absolute after:content-[''] after:top-0 after:left-0 after:w-full after:h-full after:opacity-60 after:bg-prim-100"
        >
            <div class="container h-full">
                <div class="relative z-[1] flex flex-col h-full gap-6">
                    <div class="text-white">
                        <div class="flex items-center gap-4 flex-wrap">
                            <h4 class="text-3xl sm:text-4xl font-bold text-white mb-1">
                                Khóa học của tôi
                            </h4>
                            <div class="flex items-center rounded-full py-1.5 px-5 border-[1px] border-solid border-white gap-2">
                                <span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        class="fill-none stroke-white"
                                    ><path
                                        d="M3.17 7.44 12 12.55l8.77-5.08M12 21.61v-9.07"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /><path
                                        d="M9.93 2.48 4.59 5.44c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.17c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.63-3.01-.63-4.15.01Z"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /></svg>
                                </span>
                                <span>{{ myCourses?.length || 0 }} khóa học</span>
                            </div>
                        </div>
                        <div class="mt-4">
                            <p class="mb-0 md:max-w-[70%]">
                                Tập hợp các khóa học chuyên sâu, được giảng dạy bởi các chuyên gia, cố vấn giàu kinh nghiệm trong lĩnh vực chăm sóc Mẹ và Bé giúp các bậc phụ huynh trở thành những người cha, người mẹ thông thái, hiểu biết sâu rộng về mọi khía cạnh chăm sóc trẻ sơ sinh, mang lại sự an tâm và hạnh phúc cho mỗi gia đình.
                            </p>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                            <div>
                                <a-input
                                    placeholder="Tìm kiếm khóa học"
                                    class="!bg-transparent custom_input"
                                    @change="handleSearch"
                                >
                                    <i slot="suffix">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            class="fill-none stroke-white"
                                        ><path
                                            d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg>
                                    </i>
                                </a-input>
                            </div>
                            <div>
                                <div class="flex items-center justify-center md:justify-end gap-4">
                                    <div class="w-auto cursor-pointer">
                                        <img class="w-[150px] md:w-auto object-cover h-auto" src="/images/download-google-app.png" alt="/logo">
                                    </div>
                                    <div class="w-auto cursor-pointer">
                                        <img class="w-[150px] md:w-auto object-cover h-auto" src="/images/download-iphone-app.png" alt="/logo">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="pb-20 p-4 lg:pt-20 sm:pt-0 bg-[#f4f7f9]">
            <div class="container mx-auto !px-0 md:!px-auto">
                <div v-if="!loading">
                    <div v-if="myCourses.filter(e => (e.title.toLowerCase()).includes(searchKey.toLowerCase())).length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32">
                        <CourseCard
                            v-for="(course, index) in myCourses.filter(e => (e.title.toLowerCase()).includes(searchKey.toLowerCase()))"
                            :key="index"
                            :is-register="true"
                            :course="course"
                            class=""
                        />
                    </div>
                    <div v-else>
                        <a-empty description="Bạn chưa có khóa học nào" />
                    </div>
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:-mt-32">
                    <div
                        v-for="index in [1,2,3,4]"
                        :key="index"
                        class=""
                    >
                        <Skeleton />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from 'moment';
    import CourseCard from '@/components/home/CourseCard.vue';
    import Skeleton from '@/components/shared/Skeleton.vue';

    export default {
        components: {
            CourseCard,
            Skeleton,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                searchKey: '',
            };
        },

        computed: {
            ...mapState('courses', ['myCourses', 'pagination']),
        },

        methods: {
            moment,
            handleSearch(e) {
                this.searchKey = e.target.value;
            },
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('courses/fetchMyCourse');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Khóa học của tôi',
            };
        },
    };
</script>
<style lang="scss">
    .custom_input .ant-input {
        @apply bg-transparent placeholder:text-white rounded-full hover:border-white focus:border-white outline-none text-white py-6 px-4 #{!important}
    }
</style>
