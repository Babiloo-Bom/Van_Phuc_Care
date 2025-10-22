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
                        route: '/health-books',
                        label: 'Sổ sức khỏe điện tử',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3.5 18V7c0-4 1-5 5-5h7c4 0 5 1 5 5v10c0 .14 0 .28-.01.42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.35 15H20.5v3.5c0 1.93-1.57 3.5-3.5 3.5H7c-1.93 0-3.5-1.57-3.5-3.5v-.65C3.5 16.28 4.78 15 6.35 15ZM8 7h8M8 10.5h5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    }, {
                        route: '/health-books/lich-su-giao-dich',
                        label: 'Lịch sử giao dịch',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                    }, {
                        route: '/lich-tiem',
                        label: 'Lịch tiêm',
                        icon: '<svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 2v3M16 2v3M3.5 9.09h17M18 23a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19.49 19.05h-2.98M18 17.59v2.99" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 8.5v7.86c-.73-.83-1.8-1.36-3-1.36-2.21 0-4 1.79-4 4 0 .75.21 1.46.58 2.06.21.36.48.68.79.94H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.995 13.7h.01M8.294 13.7h.01M8.294 16.7h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
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
