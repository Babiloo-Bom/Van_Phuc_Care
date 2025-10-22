<template>
    <div>
        <div v-if="!loading">
            <div v-if="courses.length" class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
                <div
                    v-for="(_course, index) in courses"
                    :key="`card_course_${index}`"
                    type="text"
                    class="cursor-pointer"
                    @click="openCourse(_course.slug)"
                >
                    <CardCourse :course="_course" />
                </div>
            </div>
            <div v-else class="">
                <div class="flex justify-center items-center flex-col mt-4 h-[40vh] bg-white rounded">
                    <h3 class="!mb-3 text-3xl text-[#868686] font-light">
                        Bạn chưa đăng ký khóa học nào
                    </h3>
                    <a class="py-1 inline-block px-6 font-semibold !text-white bg-prim-100 rounded-sm" href="https://edu.vanphuccare.vn/">
                        Đến trang tất cả khóa học
                    </a>
                </div>
                <div class="mt-4">
                    <RecomentCourse />
                </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
        <!-- <div class="card">
            <h3 class="text-[30px] m-0 text-[#1a75bb] font-bold text-center flex items-center justify-center h-[400px]" style="line-height: normal">
                KHÓA HỌC ĐANG ĐƯỢC CẬP NHẬT
            </h3>
        </div> -->
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CardCourse from '@/components/course/Card.vue';
    import RecomentCourse from '@/components/course/RecomentCourse.vue';

    export default {
        components: {
            CardCourse,
            RecomentCourse,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('courses', ['courses']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Khóa học của tôi',
                link: '/khoa-hoc-cua-toi',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.courses === null) {
                        await this.$store.dispatch('courses/fetchAll', { ...this.$route.query });
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            openCourse(slug) {
                const authData = localStorage.getItem('auth.data');
                const authDataObject = JSON.parse(authData);
                window.open(`https://edu.vanphuccare.vn/khoa-hoc/${slug}?username=${authDataObject.username}&pwd=${authDataObject.password}`, '_blank');
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

</style>
