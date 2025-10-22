/* eslint-disable vue/no-v-model-argument */
<template>
    <div class="bg-[#fff] a-the-sidebar-vertical max-h-screen h-full flex flex-col" :class="[collapsed ? 'w-auto' : '!w-[235px]']">
        <div class="mt-4 flex items-center justify-center gap-2 cursor-pointer" @click="$router.push('/')">
            <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]">
                <svg
                    viewBox="0 0 20 20"
                    class="m-0 w-[20px] h-[20px]"
                    focusable="false"
                    aria-hidden="true"
                ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
            </a-button>
            <span class="font-bold">{{ $t('account.return_home') }}</span>
        </div>
        <div class="pt-9 flex justify-center items-center" :class="[collapsed ? 'px-4' : 'px-6']">
            <div v-show="!collapsed" class="text-white font-semibold text-3xl">
                <img
                    v-if="$auth.user?.avatar"
                    :src="$auth?.user?.avatar"
                    alt="avatar"
                    class="d-block mx-auto !w-[72px] !h-[72px] rounded-full object-cover"
                >
                <div v-else class="!w-[72px] !h-[72px] rounded-full object-cover !flex !justify-center !items-center mx-auto  !text-[#5dc2a7] !bg-[#53c66e2b]">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="#53c66e" /></svg>
                </div>
                <p class="m-0 h-[14px] text-center text-[#161a21] mt-1 text-[14px] font-bold">
                    {{ $auth?.user?.firstName }} {{ $auth?.user?.lastName }}
                </p>
                <span class="text-center text-[12px] text-[#a5a5a5] font-[400]">{{ $auth?.user?.email }}</span>
            </div>
        </div>
        <a-menu
            v-model="activeKeys"
            :open-keys="openKeys"
            :default-selected-keys="activeKeys"
            :inline-collapsed="collapsed"
            class="w-[235px] !mt-4 flex-grow overflow-y-auto custom-scroll overflow-x-hidden !p-4"
            mode="inline"
            @click="handleClick"
            @openChange="handleOpenChange"
        >
            <a-menu-item v-for="(sidebarItem) in SIDEBAR_ITEMS" :key="sidebarItem.route">
                <span class="truncate !text-[13px] font-[500]">{{ sidebarItem.label }}</span>
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                SIDEBAR_ITEMS: [
                    {
                        route: '/khoa-hoc',
                        label: 'Danh sách khóa học',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    }, {
                        route: '/khoa-hoc/truy-cap',
                        label: 'Quản lý truy cập',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    }, {
                        route: '/khoa-hoc/lich-su-giao-dich',
                        label: 'Lịch sử giao dịch',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
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
                    this.activeKeys = [`${this.$route.path}`];
                },
            },
        },

        async mounted() {
            this.collapsed = window.innerWidth < 768 ? false : localStorage.getItem('collapsed') === 'true' || false;
            this.handleOpenChange([this.$route.path]);
            this.activeKeys = [`${this.$route.path}`];
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
            @apply m-0 pr-4 pl-[0.95rem] mt-3 rounded-[6px]  #{!important};

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
