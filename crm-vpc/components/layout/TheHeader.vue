<template>
    <div class="bg-white py-3 px-4 md:px-6 flex justify-between items-center border-b border-gray-10 sticky top-0">
        <div>
            <!-- <div class="md:hidden cursor-pointer" @click="toggleSidebar">
                <i class="fas fa-bars text-lg" />
            </div> -->
            <div class="flex items-center gap-4">
                <i class="md:!hidden fas fa-bars text-[#1877f2] text-xl cursor-pointer" @click="toggleSidebar" />
                <Breadcrumb :links="breadcrumbs" class="max-w-[400px]" />
            </div>
        </div>
        <div class="flex items-center gap-6">
            <!-- <div class="font-semibold">
                <i class="fas fa-question-circle" /> <span class="hidden md:inline">Trợ giúp</span>
            </div> -->
            <!-- <div class="flex justify-center items-center">
                <div class="text-white font-semibold text-3xl w-[100px] h-[65px]">
                    <img class="w-full h-full object-contain" src="/images/logo.png" alt="/logo">
                </div>
            </div> -->
            <!-- <NotificationPopover /> -->
            <!-- <div class="flex items-center gap-2">
                <a-avatar :src="$auth.user ? $auth.user.avatar : ''" class="!text-[#1877f2] !bg-[#d6e8ff]">
                    <i class="fas fa-user" />
                </a-avatar>
                <a-dropdown :trigger="['click']">
                    <div class="cursor-pointer font-semibold">
                        {{ $auth.user.fullname || '' }}
                        <i class="fas fa-chevron-down" />
                    </div>
                    <template #overlay>
                        <a-menu class="!mt-3">
                            <a-menu-item class="!py-2" @click="$refs.updateInfoDialog.open()" />
                            <a-menu-item class="!py-2">
                                <i class="mr-4 fas fa-user" />Cập nhật thông tin
                            </a-menu-item>
                            <a-menu-item class="!py-2" @click="$refs.updatePasswordDialog.open()">
                                <i class="mr-4 fas fa-key" />Đổi mật khẩu
                            </a-menu-item>
                            <a-menu-item class="!py-2" @click="logout">
                                <i class="mr-4 fas fa-sign-out-alt" />Đăng xuất
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div> -->
        </div>
        <a-drawer
            v-if="$auth.user"
            class="header-sidebar-drawer"
            :visible="sidebarVisible"
            placement="left"
            width="280px"
            @close="sidebarVisible = false"
        >
            <TheSidebar class="h-full" />
        </a-drawer>
        <!-- <UpdateInfoDialog ref="updateInfoDialog" /> -->
        <UpdatePasswordDialog ref="updatePasswordDialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import TheSidebar from '@/components/layout/TheSidebar.vue';
    // import NotificationPopover from '@/components/notifications/Popover.vue';
    // import UpdateInfoDialog from '@/components/auth/dialogs/UpdateInfo.vue';
    import UpdatePasswordDialog from '@/components/auth/dialogs/UpdatePassword.vue';
    import Breadcrumb from '@/components/shared/Breadcrumb.vue';

    export default {
        components: {
            TheSidebar,
            // NotificationPopover,
            // UpdateInfoDialog,
            UpdatePasswordDialog,
            Breadcrumb,
        },

        data() {
            return {
                sidebarVisible: false,
                showMenu: false,
            };
        },

        computed: {
            ...mapState('breadcrumbs', ['breadcrumbs']),
        },
        watch: {
            '$route.path': {
                async handler() {
                    this.sidebarVisible = false;
                    this.scrollToTop();
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            toggleSidebar() {
                this.sidebarVisible = !this.sidebarVisible;
            },

            async logout() {
                // trigger logout and remove data in local storage
                await this.$auth.logout();
                this.$auth.$storage.removeLocalStorage('data');
                this.$router.push('/login');
            },
            openMenu() {
                this.showMenu = true;
            },
            closeMenu() {
                this.showMenu = false;
            },
            scrollToTop() {
                window.scrollTo(0, 0);
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
