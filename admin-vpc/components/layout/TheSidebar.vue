/* eslint-disable vue/no-v-model-argument */
<template>
    <div class="bg-[#fff] a-the-sidebar-vertical max-h-screen h-full flex flex-col" :class="[collapsed ? 'w-auto' : '!w-[250px]']">
        <div class="h-[80px] flex justify-center items-center" :class="[collapsed ? 'px-4' : 'px-6']">
            <!-- <nuxt-link class="flex justify-center items-center mt-1" to="/">
                <img src="/images/logo-white.svg" width="50">
            </nuxt-link> -->
            <nuxt-link v-show="!collapsed" to="/" class="text-white font-semibold text-3xl pt-5">
                <img class="w-[100px] h-auto" src="/images/logo.png" alt="/logo">
            </nuxt-link>
        </div>
        <a-menu
            v-model="activeKeys"
            :open-keys="openKeys"
            :default-selected-keys="activeKeys"
            :inline-collapsed="collapsed"
            class="w-[250px] !mt-4 flex-grow overflow-y-auto custom-scroll overflow-x-hidden !p-4"
            mode="inline"
            @click="handleClick"
            @openChange="handleOpenChange"
        >
            <template v-for="sidebarItem in sidebar">
                <a-sub-menu v-if="sidebarItem.childs" :key="sidebarItem.route">
                    <template slot="title">
                        <i class="fill-[#1a77ba] stroke-[#1a77ba] mr-2 !mb-0" v-html="sidebarItem.icon" />
                        <span class="truncate">{{ sidebarItem.label }}</span>
                    </template>
                    <template v-for="sidebarItemChild in sidebarItem.childs">
                        <a-menu-item v-if="sidebarItemChild.route" :key="sidebarItemChild.route">
                            <span class="truncate">{{ sidebarItemChild.label }}</span>
                        </a-menu-item>
                    </template>
                </a-sub-menu>
                <a-menu-item v-else :key="sidebarItem.route">
                    <i class="fill-[#1a77ba] stroke-[#1a77ba] mr-2 !mb-0" v-html="sidebarItem.icon" />
                    <span class="truncate">{{ sidebarItem.label }}</span>
                </a-menu-item>
            </template>
        </a-menu>
        <div class="flex justify-between items-center mb-2">
            <a-menu
                v-model="activeKeys"
                :open-keys="openKeys"
                :default-selected-keys="activeKeys"
                :inline-collapsed="collapsed"
                class="w-[250px] !mt-4 flex-grow overflow-y-auto custom-scroll overflow-x-hidden !p-4"
                mode="inline"
                @click="handleClick"
                @openChange="handleOpenChange"
            >
                <template>
                    <a-menu-item key="settings">
                        <i class="fill-[#1a77ba] stroke-[#1a77ba] mr-2 !mb-0">
                            <svg
                                class="transition-all duration-300 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2ZM7.67 5.5c0-.41.34-.75.75-.75s.75.34.75.75v3.9c0 .41-.34.75-.75.75s-.75-.34-.75-.75V5.5Zm1.853 10.931a.566.566 0 0 0-.353.505V18.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-1.564a.567.567 0 0 0-.353-.505A2.713 2.713 0 0 1 5.7 13.95c0-1.5 1.22-2.73 2.72-2.73 1.5 0 2.73 1.22 2.73 2.73 0 1.108-.67 2.057-1.627 2.481ZM16.33 18.5c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-3.9c0-.41.34-.75.75-.75s.75.34.75.75v3.9Zm-.75-5.73c-1.5 0-2.73-1.22-2.73-2.73 0-1.108.67-2.057 1.627-2.481a.566.566 0 0 0 .353-.505V5.5c0-.41.34-.75.75-.75s.75.34.75.75v1.564c0 .223.15.414.353.505A2.713 2.713 0 0 1 18.3 10.05c0 1.5-1.22 2.72-2.72 2.72Z" /></svg>
                        </i>
                        <span class="truncate">{{ 'Cài đặt hệ thống' }}</span>
                    </a-menu-item>
                </template>
            </a-menu>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                sidebar: [{
                    route: '/',
                    label: 'Trang chủ',
                    icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m9.02 2.84-5.39 4.2C2.73 7.74 2 9.23 2 10.36v7.41c0 2.32 1.89 4.22 4.21 4.22h11.58c2.32 0 4.21-1.9 4.21-4.21V10.5c0-1.21-.81-2.76-1.8-3.45l-6.18-4.33c-1.4-.98-3.65-.93-5 .12ZM12 17.99v-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/thong-ke',
                    label: 'Thống kê',
                    icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="m7.33 14.49 2.38-3.09c.34-.44.97-.52 1.41-.18l1.83 1.44c.44.34 1.07.26 1.41-.17l2.31-2.98"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/dich-vu',
                    label: 'Dịch vụ',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    childs: [
                        {
                            route: '/dich-vu',
                            label: 'Danh sách dịch vụ',
                            icon: '',
                        },
                        {
                            route: '/dich-vu/registered',
                            label: 'Hợp đồng',
                            icon: '',
                        },
                    ],
                }, {
                    route: '/marketing',
                    label: 'Marketing',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5.9 17h12.19c1.9 0 2.9-1 2.9-2.9V2h-18v12.1C3 16 4 17 5.9 17ZM2 2h20M8 22l4-2v-3M16 22l-4-2" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="m7.5 11 3.15-2.63c.25-.21.58-.15.75.13l1.2 2c.17.28.5.33.75.13L16.5 8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    childs: [
                        {
                            route: '/marketing/automation',
                            label: 'Automation',
                            icon: '',
                        },
                        {
                            route: '/marketing/email',
                            label: 'Email Marketing',
                            icon: '',
                        },
                        {
                            route: '/marketing/form',
                            label: 'Form khảo sát',
                            icon: '',
                        },
                    ],
                }, {
                    route: '/khach-hang',
                    label: 'Khách hàng',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18.14 21.62c-.88.26-1.92.38-3.14.38H9c-1.22 0-2.26-.12-3.14-.38.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 2H9C4 2 2 4 2 9v6c0 3.78 1.14 5.85 3.86 6.62.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65C20.86 20.85 22 18.78 22 15V9c0-5-2-7-7-7Zm-3 12.17c-1.98 0-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58-1.6 3.59-3.58 3.59Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.58 10.58c0 1.98-1.6 3.59-3.58 3.59s-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    // childs: [
                    //     {
                    //         route: '/khach-hang/',
                    //         label: 'Danh sách khách hàng',
                    //         icon: '',
                    //     },
                    //     {
                    //         route: '/khach-hang/phan-hoi',
                    //         label: 'Phản hồi khách hàng',
                    //         icon: '',
                    //     },
                    // ],
                }, {
                    route: '/tickets',
                    label: 'Chăm sóc KH',
                    icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 18.86h-.76c-.8 0-1.56.31-2.12.87l-1.71 1.69c-.78.77-2.05.77-2.83 0l-1.71-1.69c-.56-.56-1.33-.87-2.12-.87H6c-1.66 0-3-1.33-3-2.97V4.98c0-1.64 1.34-2.97 3-2.97h12c1.66 0 3 1.33 3 2.97v10.91c0 1.63-1.34 2.97-3 2.97Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 9.16c0-.93.76-1.69 1.69-1.69.93 0 1.69.76 1.69 1.69 0 1.88-2.67 2.08-3.26 3.87-.12.37.19.74.58.74h2.68M16.04 13.76V8.05a.58.58 0 0 0-.42-.56.593.593 0 0 0-.66.25c-.72 1.16-1.5 2.48-2.18 3.64-.11.19-.11.44 0 .63s.32.31.55.31H17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    childs: [
                        {
                            route: '/tickets',
                            label: 'Support tickets',
                            icon: '',
                        },
                        {
                            route: '/feedbacks',
                            label: 'Phản hồi & Đánh giá',
                            icon: '',
                        },
                    ],
                },
                ],
                isOpen: true,
                openKeys: [],
                logoutVisible: false,
                collapsed: false,
                activeKeys: [],
            };
        },

        computed: {
        },

        watch: {
            '$route.query': {
                handler() {
                    this.activeKeys = [`/${this.$route.path.split('/')[1]}`];
                },
            },
        },

        async mounted() {
            this.collapsed = window.innerWidth < 768 ? false : localStorage.getItem('collapsed') === 'true' || false;
            this.handleOpenChange([`/${this.$route.path.split('/')[1]}`]);
            this.activeKeys = [`/${this.$route.path.split('/')[1]}`];
        },

        methods: {
            handleClick({ key }) {
                this.$router.push(key);
            },

            handleOpenChange(keys) {
                this.openKeys = keys?.length ? [keys?.pop()] : [];
            },

            toggleCollapsed() {
                this.collapsed = !this.collapsed;
                localStorage.setItem('collapsed', this.collapsed);
            },
        },
    };
</script>

<style lang="scss">
    .a-the-sidebar-vertical:not(.a-menu--collapse) {
        .ant-menu {
            @apply bg-[#fff];
        }
        .ant-menu-inline {
            @apply border-0;
        }
        .ant-menu-sub {
            .ant-menu-item {
                @apply pl-8 #{!important};
            }
        }
        .ant-menu-submenu-arrow {
            @apply text-right;
        }
        .ant-menu-item, .ant-menu-submenu-title {
            max-height: 36px;
            height: auto !important;
            @apply text-[#1a77ba] flex items-center;
            @apply m-0 px-4 mt-3 rounded-[6px]  #{!important};

            >span {
                @apply flex-grow;
            }

            i {
                @apply text-lg w-4 mr-4 #{!important};
            }

            .ant-menu-submenu-arrow {
                @apply mr-0;
                &::after, &::before {
                    @apply bg-white #{!important};
                }
            }

            &-selected {
                @apply bg-prim-100 text-white font-semibold after:opacity-100 after:hidden;
                i {
                    @apply fill-[#fff] stroke-[#fff];
                }
            }
        }
        .ant-menu-vertical {
            @apply border-r-0 #{!important};
        }
    }
</style>
