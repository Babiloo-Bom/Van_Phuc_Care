<template>
    <div class="bg-prim-100 shadow-lg w-full fixed h-[75px] z-[999] top-[-1px]">
        <div class="container flex justify-between items-center py-3 xl:!px-0">
            <div class="gap-6">
                <nuxt-link to="/">
                    <div class="text-white flex items-end">
                        <img class="object-contain w-[160px] h-auto" src="/images/logo-white.png" alt="/logo">
                        <span class="text-white text-2xl sm:text-3xl font-light ml-4" style="line-height: 18px">
                            Academy
                        </span>
                    </div>
                </nuxt-link>
            </div>
            <div class="flex-1 ml-auto flex justify-end">
                <div class="hidden lg:block">
                    <ul class="mb-0 flex items-center gap-4">
                        <li
                            v-for="(side, index) in sidebar"
                            :key="side.route"
                            class="relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#0860a3] transition-all duration-300"
                            :class="`${activeKeys === side.route ? 'bg-[#0860a3]' : ''} ${index === 1 || index === 3 ? 'after:absolute after:h-[70%] after:w-[1px] after:bg-white after:-right-2 after:top-1/2 after:-translate-y-1/2' : ''}`"
                            @click="handleClick(side.route)"
                        >
                            <i class="fill-none stroke-white mr-2 !mb-0" v-html="side.icon" />
                            <span class="text-white">
                                {{ side.label }}
                            </span>
                        </li>
                        <li
                            class="relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#0860a3] transition-all duration-300"
                            @click="handleClick('/trang-ca-nhan')"
                        >
                            <i class="fill-none stroke-white mr-2 !mb-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </i>
                            <span v-if="$auth.user" class="text-white">
                                {{ $auth.user.fullname }}
                            </span>
                            <span v-else class="text-white">
                                {{ 'Đăng nhập' }}
                            </span>
                        </li>
                        <li
                            v-if="$auth.user"
                            class="relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#0860a3] transition-all duration-300"
                            @click="handleLogout"
                        >
                            <i class="fill-none stroke-white mr-2 !mb-0">
                                <svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M17.44 14.62L20 12.06 17.44 9.5M9.76 12.06h10.17M11.76 20c-4.42 0-8-3-8-8s3.58-8 8-8"></path></svg>
                            </i>
                            <span class="text-white">
                                {{ 'Đăng xuất' }}
                            </span>
                        </li>
                        <li
                            class="relative flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-[#0860a3] transition-all duration-300"
                            :class="`${activeKeys === '/gio-hang' ? 'bg-[#0860a3]' : ''}`"
                            @click="handleClick('/gio-hang')"
                        >
                            <i
                                class="relative fill-none stroke-white !mb-0"
                                :class="`after:absolute after:w-1.5 after:h-1.5 after:rounded-full after:bg-danger-100 after:-top-0 after:-right-0`"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    class="fill-none stroke-white"
                                ><path
                                    d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                            </i>
                        </li>
                    </ul>
                </div>
                <div class="lg:hidden block cursor-pointer">
                    <div @click="toggleSidebar">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            class="fill-none stroke-white"
                        ><path
                            d="M3 4.5h18M3 9.5h18M3 14.5h18M3 19.5h18"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /></svg>
                    </div>
                </div>
            </div>
        </div>
        <a-drawer
            class="header-sidebar-drawer"
            :visible="sidebarVisible"
            placement="left"
            width="280px"
            @close="sidebarVisible = false"
        >
            <TheSidebar class="h-full" />
        </a-drawer>
        <ConfirmAuth
            ref="confirmAuth"
            @confirm="submitAuth"
        />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ConfirmAuth from '@/components/auth/dialogs/AskLogin.vue';
    import TheSidebar from '@/components/layout/TheSidebar.vue';

    export default {
        components: {
            TheSidebar,
            ConfirmAuth,
        },

        data() {
            return {
                sidebar: [{
                    route: '/',
                    label: 'Tất cả khóa học',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3.5 18V7c0-4 1-5 5-5h7c4 0 5 1 5 5v10c0 .14 0 .28-.01.42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.35 15H20.5v3.5c0 1.93-1.57 3.5-3.5 3.5H7c-1.93 0-3.5-1.57-3.5-3.5v-.65C3.5 16.28 4.78 15 6.35 15ZM8 7h8M8 10.5h5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/khoa-hoc-cua-toi',
                    label: 'Khóa học của tôi',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99h-.06c-2.1.18-5.29 1.25-7.07 2.37l-.17.11c-.29.18-.77.18-1.06 0l-.25-.15C9.44 3.9 6.26 2.84 4.16 2.67 2.97 2.57 2 3.47 2 4.66v12.08c0 .96.78 1.86 1.74 1.98l.29.04c2.17.29 5.52 1.39 7.44 2.44l.04.02c.27.15.7.15.96 0 1.92-1.06 5.28-2.17 7.46-2.46l.33-.04c.96-.12 1.74-1.02 1.74-1.98ZM12 5.49v15M7.75 8.49H5.5M8.5 11.49h-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }, {
                    route: '/trang-chu',
                    label: 'Trang chủ',
                    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18.14 21.62c-.88.26-1.92.38-3.14.38H9c-1.22 0-2.26-.12-3.14-.38.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 2H9C4 2 2 4 2 9v6c0 3.78 1.14 5.85 3.86 6.62.22-2.6 2.89-4.65 6.14-4.65 3.25 0 5.92 2.05 6.14 4.65C20.86 20.85 22 18.78 22 15V9c0-5-2-7-7-7Zm-3 12.17c-1.98 0-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58-1.6 3.59-3.58 3.59Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.58 10.58c0 1.98-1.6 3.59-3.58 3.59s-3.58-1.61-3.58-3.59C8.42 8.6 10.02 7 12 7s3.58 1.6 3.58 3.58Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                }],
                user: {},
                loading: false,
                sidebarVisible: false,
            };
        },

        computed: {
            ...mapState('breadcrumbs', ['breadcrumbs']),
            activeKeys() {
                return this.$route.path;
            },
        },

        methods: {
            toggleSidebar() {
                this.sidebarVisible = !this.sidebarVisible;
            },

            handleClick(key) {
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
            async handleLogout() {
                this.loading = true;
                await this.$auth.logout();
                this.loading = false;
                this.$router.push('/');
            },
            submitAuth() {
                console.log('ok');
            },
        },
    };
</script>

<style lang="scss">
    .header-sidebar-drawer {
        .ant-drawer-body {
            @apply p-0 h-full #{!important};
        }
    }
</style>
