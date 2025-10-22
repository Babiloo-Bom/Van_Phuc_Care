/* eslint-disable vue/no-v-model-argument */
<template>
    <div class="a-the-sidebar-vertical max-h-screen h-full flex flex-col w-full">
        <div class="flex flex-col justify-between h-full overflow-x-hidden mt-10">
            <div class="h-[80px] flex justify-center items-center px-4">
                <div class="text-white font-semibold text-3xl w-[160px]">
                    <img class="w-full" src="/images/logo-auth.png" alt="/logo">
                </div>
            </div>
            <a-menu
                v-model="activeKeys"
                :open-keys="openKeys"
                :default-selected-keys="activeKeys"
                :inline-collapsed="collapsed"
                class="w-[240px] flex-grow overflow-y-auto overflow-x-hidden custom-scroll !p-4"
                mode="inline"
                @click="handleClick"
                @openChange="handleOpenChange"
            >
                <template v-for="sidebarItem in sidebar">
                    <a-sub-menu v-if="sidebarItem.childs" :key="sidebarItem.route">
                        <template slot="title">
                            <i class="fill-prim-100 stroke-prim-100 mr-2 !mb-0" v-html="sidebarItem.icon" />
                            <span class="truncate relative z-[1]">{{ sidebarItem.label }}</span>
                        </template>
                        <template v-for="sidebarItemChild in sidebarItem.childs">
                            <a-menu-item v-if="sidebarItemChild.route" :key="sidebarItemChild.route">
                                <span class="truncate relative z-[1]">{{ sidebarItemChild.label }}</span>
                            </a-menu-item>
                        </template>
                    </a-sub-menu>
                    <a-menu-item v-else :key="sidebarItem.route">
                        <i class="fill-prim-100 stroke-prim-100 mr-2 !mb-0" v-html="sidebarItem.icon" />
                        <span class="truncate relative z-[1]">{{ sidebarItem.label }}</span>
                    </a-menu-item>
                </template>
            </a-menu>
        </div>
        <ConfirmAuth
            ref="confirmAuth"
            @confirm="submitAuth"
        />
    </div>
</template>

<script>
    import ConfirmAuth from '@/components/auth/dialogs/AskLogin.vue';

    export default {
        components: {
            ConfirmAuth,
        },
        props: {
            mode: {
                type: String,
                default: 'inline',
            },
        },

        data() {
            return {
                sidebar: [{
                    route: '/',
                    label: 'Tất cả khóa học',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3.5 18V7c0-4 1-5 5-5h7c4 0 5 1 5 5v10c0 .14 0 .28-.01.42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.35 15H20.5v3.5c0 1.93-1.57 3.5-3.5 3.5H7c-1.93 0-3.5-1.57-3.5-3.5v-.65C3.5 16.28 4.78 15 6.35 15ZM8 7h8M8 10.5h5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/khoa-hoc-cua-toi',
                    label: 'Khóa học của tôi',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/trang-ca-nhan',
                    label: 'Đăng nhập',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/trang-chu',
                    label: 'Trang chủ',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18.14 21.62c-.88.26-1.92.38-3.14.38H9c-1.22 0-2.26-.12-3.14-.38.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 2H9C4 2 2 4 2 9v6c0 3.78 1.14 5.85 3.86 6.62.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65C20.86 20.85 22 18.78 22 15V9c0-5-2-7-7-7Zm-3 12.17c-1.98 0-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58-1.6 3.59-3.58 3.59Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.58 10.58c0 1.98-1.6 3.59-3.58 3.59s-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }],
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
                },
            },
            '$route.path': {
                handler() {
                    this.activeKeys = [this.$route.path];
                },
                deep: true,
            },
        },

        async mounted() {
            this.collapsed = window.innerWidth < 768 ? false : localStorage.getItem('collapsed') === 'true' || false;
            this.handleOpenChange([this.$route.path]);
            this.activeKeys = [this.$route.path];
        },

        methods: {
            handleClick({ key }) {
                if (key === '/trang-ca-nhan') {
                    const authData = localStorage.getItem('auth.data');
                    if (!this.$auth?.user?.email || !authData) {
                        window.open('https://my.vanphuccare.vn');
                    } else {
                        const authDataObject = JSON.parse(authData);
                        window.open(`https://my.vanphuccare.vn?username=${authDataObject.username}&pwd=${authDataObject.password}`, '_blank');
                    }
                } else if (key === '/trang-chu') {
                    window.open('https://vanphuccare.vn/', '_blank');
                } else if (key === '/khoa-hoc-cua-toi') {
                    const authData = localStorage.getItem('auth.data');
                    if (!this.$auth?.user?.email || !authData) {
                        this.$refs.confirmAuth.open();
                    } else {
                        const authDataObject = JSON.parse(authData);
                        this.user = authDataObject;
                        this.$router.push(key);
                    }
                } else {
                    this.$router.push(key);
                }
            },

            handleOpenChange(keys) {
                this.openKeys = keys?.length ? [keys?.pop()] : [];
            },
        },
    };
</script>
<style lang="scss">
    .a-the-sidebar-vertical:not(.a-menu--collapse) {
        .ant-menu {
            @apply bg-white;
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
            height: auto !important;
            @apply text-prim-100 flex items-center;
            @apply m-0 px-4 mt-3 rounded-full #{!important};

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
                    @apply fill-white stroke-white;
                }
            }
        }
        .ant-menu-vertical {
            @apply border-r-0 #{!important};
        }
    }
</style>
