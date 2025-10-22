<template>
    <div>
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-collection">
            <div class="flex items-center justify-start gap-3">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-3">
                            <h4 class="m-0 text-[20px] font-bold">
                                {{ 'Cài đặt' }}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mt-4 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                <div
                    v-for="(setting, index) in settings"
                    :key="`setting_${index}`"
                    class="cursor-pointer hover:bg-[#139cff17] border border-[transparent] hover:border-[#1b77b9] transition-all duration-150 rounded-sm p-3 flex items-start gap-4 justify-start"
                    @click="$router.push(setting.router)"
                >
                    <span v-html="setting.icon" />
                    <div>
                        <h6 class="m-0 font-[600] text-[16px]">
                            {{ setting.name }}
                        </h6>
                        <p class="m-0 text-[13px]">
                            {{ setting.descriptions }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';

    export default {
        components: {
        },

        data() {
            return {
                loading: false,
                rules: {},
                form: {},
                data: [],
                settings: [
                    {
                        name: `${'Cài đặt chung'}`,
                        descriptions: 'Quản lý website, cài đặt hình ảnh, logo,...',
                        icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M10 16.95H6.21c-3.37 0-4.21-.84-4.21-4.21v-6c0-3.37.84-4.21 4.21-4.21h10.53c3.37 0 4.21.84 4.21 4.21M10 21.47v-4.52M2 12.95h8M6.74 21.47H10" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 12.8v5.71c0 2.37-.59 2.96-2.96 2.96h-3.55c-2.37 0-2.96-.59-2.96-2.96V12.8c0-2.37.59-2.96 2.96-2.96h3.55c2.37 0 2.96.59 2.96 2.96Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.244 18.25h.01" stroke="#1b77b9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                        router: '/settings/contact',
                    },
                    {
                        name: 'Thanh toán',
                        descriptions: 'Cài đặt các phương thức thanh toán của bạn',
                        icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M11.74 17.75h5.92c-.09.08-.18.15-.27.23l-4.27 3.2c-1.41 1.05-3.71 1.05-5.13 0l-4.28-3.2C2.77 17.28 2 15.73 2 14.56V7.15c0-1.22.93-2.57 2.07-3l4.98-1.87c.82-.31 2.18-.31 3 0l4.97 1.87c.95.36 1.76 1.36 2.01 2.38h-7.3c-.22 0-.42.01-.61.01-1.85.11-2.33.78-2.33 2.89v5.43c.01 2.3.6 2.89 2.95 2.89Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.8 11.22H22" stroke="#1b77b9" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 9.42v5.55c-.02 2.22-.63 2.77-2.94 2.77h-7.32c-2.35 0-2.94-.59-2.94-2.9V9.41c0-2.1.48-2.77 2.33-2.89.19 0 .39-.01.61-.01h7.32c2.35.01 2.94.59 2.94 2.91Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.32 15.26h1.33M14.75 15.26h3.27" stroke="#1b77b9" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                        router: '/settings/payments',
                    },
                    {
                        name: 'Thành viên & Vai trò',
                        descriptions: 'Quản lý vai trò thành viên & phân quyền sử dụng hệ thống',
                        icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M18.14 21.62c-.88.26-1.92.38-3.14.38H9c-1.22 0-2.26-.12-3.14-.38.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 2H9C4 2 2 4 2 9v6c0 3.78 1.14 5.85 3.86 6.62.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65C20.86 20.85 22 18.78 22 15V9c0-5-2-7-7-7Zm-3 12.17c-1.98 0-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58-1.6 3.59-3.58 3.59Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.58 10.58c0 1.98-1.6 3.59-3.58 3.59s-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                        router: '/settings/members',
                    },
                    {
                        name: 'Cơ cấu tổ chức',
                        descriptions: 'Biểu đồ minh họa cấu trúc và mối quan hệ giữa các bộ phận trong tổ chức.',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="#1b77b9" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M3 9a2 2 0 100-4 2 2 0 000 4zM21 9a2 2 0 100-4 2 2 0 000 4zM19 7h-4M9 7H5M7.5 16.5v2c0 .61-.37 1.14-.89 1.36A1.4 1.4 0 016 20H4c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5zM21.5 16.5v2c0 .83-.67 1.5-1.5 1.5h-2a1.4 1.4 0 01-.61-.14c-.52-.22-.89-.75-.89-1.36v-2c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5zM15 5.5v3c0 .82-.68 1.5-1.5 1.5h-3C9.68 10 9 9.32 9 8.5v-3c0-.82.68-1.5 1.5-1.5h3c.82 0 1.5.68 1.5 1.5z"></path><path stroke="#1b77b9" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M15 7.73c2.37 1.2 4 3.78 4 6.77 0 .17-.01.33-.03.5M5.03 15c-.02-.17-.03-.33-.03-.5 0-2.99 1.63-5.57 4-6.77"></path></svg>',
                        router: '/settings/department',
                    },
                    {
                        name: 'API & Development',
                        descriptions: 'Sử dụng ứng dụng OAuth để xác thực và thực hiện lệnh gọi API từ bất kỳ nền tảng bên ngoài nào.',
                        icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M19 16V6.5c0-1.1-.9-2-2-2h-5.5" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="m14 2-3 2.5L14 7M19 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 8v9.5c0 1.1.9 2 2 2h5.5" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="m10 22 3-2.5-3-2.5M5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#1b77b9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                        router: '/settings/api-development',
                    },
                ],
            };
        },
        computed: {
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt',
                link: '/settings',
            }]);
        },
        methods: {
            _cloneDeep,
        },

        head() {
            return {
                title: 'Cài đặt',
            };
        },
    };
</script>
<style lang="scss">
</style>
