<template>
    <div>
        <div class=" max-w-[1200px] !mx-auto w-full p-3">
            <div class="flex items-center justify-between w-full mb-8">
                <h4 class="m-0 text-[20px] font-bold">
                    {{ 'Xin chào' }}, {{ $auth.user.firstName }} {{ $auth.user.lastName }}
                </h4>
                <p class="m-0 text-[12px] text-[#696f80]">
                    Cập nhật lần cuối: {{ moment().format('DD MMM, YYYY h:mm A') }}
                </p>
            </div>
            <!-- <h5 class="m-0 text-[18px] font-bold">
                Tổng quát
            </h5> -->
            <div class=" bg-[#fff] p-4 max-w-[800px] rounded-md mx-auto">
                <h3 class="mb-2">
                    Workspace
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <nuxt-link to="/health-books" class="bg-[#fafafa] cursor-pointer flex items-center flex-col gap-4 h-full pt-3 pb-4 rounded-md transition-all duration-150 hover:bg-[#85acff1a]">
                        <img class="w-[80px] h-[80px]" src="https://cdn3d.iconscout.com/3d/premium/thumb/notes-3943088-3312610.png?f=webp" alt="/">
                        <h4 class="text-[15px] font-[500] !m-0 text-[#212f3f]">
                            Sổ sức khỏe điện tử
                        </h4>
                    </nuxt-link>
                    <nuxt-link to="/khoa-hoc" class="bg-[#fafafa] cursor-pointer flex items-center flex-col gap-4 h-full pt-3 pb-4 rounded-md transition-all duration-150 hover:bg-[#85acff1a]">
                        <img class="w-[80px] h-[80px]" src="https://cdn3d.iconscout.com/3d/premium/thumb/graduation-hat-3943082-3312604.png?f=webp" alt="/">
                        <h4 class="text-[15px] font-[500] !m-0 text-[#212f3f]">
                            Edu
                        </h4>
                    </nuxt-link>
                    <!-- <div class="bg-[#fafafa] cursor-pointer flex items-center flex-col gap-4 h-full pt-3 pb-4 rounded-md transition-all duration-150 hover:bg-[#85acff1a]">
                        <img class="w-[80px] h-[80px]" src="https://cdn3d.iconscout.com/3d/premium/thumb/presentation-board-3943076-3312598.png?f=webp" alt="/">
                        <h4 class="text-[15px] font-[500] !m-0 text-[#212f3f]">CRM</h4>
                    </div> -->
                </div>
                <!-- <div class="lg:col-span-12 col-span-12">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div class="card">
                            <h6 class="text-[14px] font-[500]">
                                Số khách hàng
                            </h6>
                            <div class="flex items-start mt-[12px] mb-[3px]">
                                <p v-if="!loading" class="text-[24px] font-[600] m-0">
                                    {{ metrics?.totalCustomer || 0 }}
                                </p>
                                <div v-else class="h-[20px] w-[100px] -mb-[1px]">
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <h6 class="text-[14px] font-[500]">
                                Doanh thu
                            </h6>
                            <div class="flex items-start mt-[12px] mb-[3px]">
                                <p v-if="!loading" class="text-[24px] font-[600] m-0">
                                    {{ metrics?.totalPointRedeem || 0 }}
                                </p>
                                <div v-else class="h-[20px] w-[100px] -mb-[1px]">
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <h6 class="text-[14px] font-[500]">
                                Cơ hội mới
                            </h6>
                            <p class="text-[24px] font-[600] mt-[12px] mb-[3px]">
                                0
                            </p>
                        </div>
                        <div class="card">
                            <h6 class="text-[14px] font-[500]">
                                Hợp đồng mới
                            </h6>
                            <p class="text-[24px] font-[600] mt-[12px] mb-[3px]">
                                0 %
                            </p>
                        </div>
                    </div>
                </div> -->
                <!-- <div class="lg:col-span-8 col-span-12 mt-4">
                    <h5 class="m-0 text-[18px] font-bold">
                        Phần mềm gợi ý
                    </h5>
                    <div class="card mt-3">
                        <div class="flex items-center justify-between w-full pb-[9px] mb-3" style="border-bottom: 1px solid #ececec">
                            <h4 class="m-0 text-[14px] font-[600] w-full">
                                {{ 'Show how many points customer will earn' }}
                            </h4>
                        </div>
                        <div>
                            <p class="m-0">
                                Show a section on your product page which indicates how many coins a customer will earn if he purchases the product. This will make the customer aware of the loyalty program
                            </p>
                            <div class="mt-[2px] flex items-center gap-4">
                                <a-button type="" class="!mt-3">
                                    {{ 'Set up programs' }}
                                </a-button>
                                <a-button type="dashed" class="!mt-3 !flex items-center gap-2">
                                    {{ 'Learn more' }}
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5"
                                        stroke="#161a21"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /><path
                                        d="M11.995 16h.009"
                                        stroke="#161a21"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /></svg>
                                </a-button>
                            </div>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <div class="flex items-center justify-between w-full pb-[9px] mb-3" style="border-bottom: 1px solid #ececec">
                            <h4 class="m-0 text-[14px] font-[600] w-full">
                                {{ 'Customize your loyalty branding page' }}
                            </h4>
                        </div>
                        <div class="min-h-[104px] flex flex-col justify-between">
                            <p class="m-0">
                                Customize design of widgets with your brand color and unique messages. Make reward journey more effective.
                            </p>
                            <div class="mt-4 flex items-center gap-4">
                                <a-button type="" class="!mt-3">
                                    {{ 'Set up page' }}
                                </a-button>
                                <a-button type="dashed" class="!mt-3 !flex items-center gap-2">
                                    {{ 'Learn more' }}
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM12 8v5"
                                        stroke="#161a21"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /><path
                                        d="M11.995 16h.009"
                                        stroke="#161a21"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /></svg>
                                </a-button>
                            </div>
                        </div>
                    </div>
                </div> -->
                <!-- <div class="lg:col-span-4 col-span-12 mt-4">
                    <div class="card md:mt-[34px]">
                        <div class="flex items-center justify-between w-full pb-[9px] mb-3" style="border-bottom: 1px solid #ececec">
                            <h4 class="m-0 text-[14px] font-[600] w-full">
                                {{ 'Tính năng sắp ra mắt' }}
                            </h4>
                        </div>
                        <div>
                            <ul class="mb-0" style="list-style-type: disc;">
                                <li>{{ 'Đồng bộ khách hàng' }}</li>
                                <li>{{ 'Cổng tích hợp API' }}</li>
                            </ul>
                            <a-button type="primary" class="!mt-[14px]">
                                {{ 'Yêu cầu tính năng' }}
                            </a-button>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <div class="flex items-center justify-between w-full pb-[9px] mb-3" style="border-bottom: 1px solid #ececec">
                            <h4 class="m-0 text-[14px] font-[600] w-full">
                                {{ "Hỗ trợ" }}
                            </h4>
                        </div>
                        <div>
                            <p>Trung tâm trợ giúp của chúng tôi có mọi thứ bạn cần để tận dụng tối đa hệ thống của mình.</p>
                            <a-button type="" class="!mt-[27px] !flex items-center gap-1" @click="handleOpenWindow('https://docs.synck.io.vn?utm_source=dashboard-admin')">
                                {{ 'Trung tâm trợ giúp' }}
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    stroke="#161a21"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M13 11l8.2-8.2M22 6.8V2h-4.8M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
                                /></svg>
                            </a-button>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    // import { mapState } from 'vuex';
    import moment from 'moment';
    // import Skeleton from '@/components/analystics/Skeleton.vue';

    export default {
        components: {
            // Skeleton,
        },

        async fetch() {
            this.fetchMetrics();
            this.fetchBlogs();
        },

        data() {
            return {
                loading: false,
                loadingOrder: false,
                loadingProduct: false,
                loadingCustomer: false,
                content: '',
                revenue: 0,
                customerTotal: 0,
                productTotal: 0,
                socket: null,
            };
        },

        computed: {
            // ...mapState('dashboard', ['metrics']),
            // ...mapState('systems/blogs', ['blogs']),
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Trang chủ',
                link: '/',
            }]);
        },

        methods: {
            moment,
            async fetchMetrics() {
                try {
                    this.loading = true;
                    if (this.metrics === null) {
                        // await this.$store.dispatch('dashboard/fetchMetrics');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async fetchBlogs() {
                try {
                    this.loadingBlog = true;
                    if (this.blogs === null) {
                        // await this.$store.dispatch('systems/blogs/fetchAll');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingBlog = false;
                }
            },

            handleOpenWindow(link) {
                window.open(link, '_blank');
            },
        },

        head() {
            return {
                title: 'Trang chủ',
            };
        },
    };
</script>
<style lang="scss" scoped>
ul {
    padding-left: 18px;
    ::marker {
        color: #1351d8;
    }
}
.banner-upgrade {
    bottom: 39px;
    left: 235px;
    width: calc(100% - 235px);
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
}

@media (max-width: 768px) {
    .banner-upgrade {
        bottom: 39px;
        left: 0;
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
    }
}
.ant-progress-inner {
    background-color: #e1e1e1;
}
</style>
