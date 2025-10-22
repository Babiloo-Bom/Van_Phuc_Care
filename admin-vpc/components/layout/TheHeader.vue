<template>
    <div class="bg-white py-2 px-6 md:px-6 flex justify-between items-center border-b border-gray-10">
        <div>
            <div class="md:hidden cursor-pointer" @click="toggleSidebar">
                <i class="fas fa-bars text-lg" />
            </div>
            <div class="hidden md:flex items-center gap-4">
                <i class="fas fa-bars text-xl cursor-pointer" @click="$emit('toggleSidebar')" />
                <Breadcrumb :links="breadcrumbs" class="max-w-[400px]" />
            </div>
        </div>
        <div class="flex items-center gap-6">
            <!-- <div class="font-semibold">
                <i class="fas fa-question-circle" /> <span class="hidden md:inline">Trợ giúp</span>
            </div> -->
            <NewFeatures />
            <NotificationPopover />
            <div class="flex items-center gap-2">
                <a-popover placement="bottomRight" trigger="hover">
                    <template slot="content">
                        <div class="flex gap-3 items-center border-[#d9d9d9] border-b py-3 px-4 ">
                            <a-avatar :src="$auth.user?.avatar" :size="40" class="avatar-popup !flex !justify-center !items-center  !text-[#5dc2a7] !bg-[#2766572b]">
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="#276657"
                                ><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="#276657" /></svg>
                            </a-avatar>
                            <div class="info ">
                                <h5 class="font-extrabold hover:text-prim-100 cursor-pointer">
                                    {{ $auth?.user?.firstName }} {{ $auth?.user?.lastName }}
                                </h5>
                                <p>{{ $auth.user?.email }}</p>
                            </div>
                        </div>
                        <div class="!border-b-0 py-4 px-4 cursor-pointer hover:text-prim-100 " @click="$router.push('/profile?type=information')">
                            <p class="font-[600] m-0">
                                Tài khoản
                            </p>
                        </div>
                        <div class="!border-b-0 pb-4 px-4 cursor-pointer hover:text-prim-100 " @click="$router.push('/profile?type=history')">
                            <p class="font-[600] m-0">
                                Lịch sử đăng nhập
                            </p>
                        </div>
                        <div class="py-3 px-4 cursor-pointer hover:text-prim-100 border-[#d9d9d9] border-t" @click="logout">
                            <p class="m-0 font-[600]">
                                Đăng xuất
                            </p>
                        </div>
                    </template>
                    <div class="flex gap-3 items-center bg-[#f8f8fb] border border-[#dce1e5] rounded-full p-1 pr-3">
                        <a-avatar :src="$auth.user?.avatar" :size="30" class="!flex !justify-center !items-center  !text-[#5dc2a7] !bg-[#2766572b]">
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 14.5c-5.01 0-9.09 3.36-9.09 7.5 0 .28.22.5.5.5h17.18c.28 0 .5-.22.5-.5 0-4.14-4.08-7.5-9.09-7.5Z" fill="#276657" /></svg>
                        </a-avatar>
                        <div class="info ">
                            <h5 class="font-extrabold cursor-pointer">
                                {{ $auth?.user?.firstName }} {{ $auth?.user?.lastName }}
                            </h5>
                        </div>
                    </div>
                </a-popover>
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
        <!-- <UpdateInfoDialog ref="updateInfoDialog" /> -->
        <UpdatePasswordDialog ref="updatePasswordDialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import TheSidebar from '@/components/layout/TheSidebar.vue';
    import NotificationPopover from '@/components/notifications/Popover.vue';
    import NewFeatures from '@/components/newfeatures/Main.vue';
    // import UpdateInfoDialog from '@/components/auth/dialogs/UpdateInfo.vue';
    import UpdatePasswordDialog from '@/components/auth/dialogs/UpdatePassword.vue';
    import Breadcrumb from '@/components/shared/Breadcrumb.vue';

    export default {
        components: {
            TheSidebar,
            NotificationPopover,
            NewFeatures,
            // UpdateInfoDialog,
            UpdatePasswordDialog,
            Breadcrumb,
        },

        data() {
            return {
                sidebarVisible: false,
            };
        },

        computed: {
            ...mapState('breadcrumbs', ['breadcrumbs']),
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
        },
    };
</script>

<style lang="scss">
.header-sidebar-drawer {
    .ant-drawer-body {
        @apply p-0 h-full #{!important};
    }
}
.ant-popover-inner{
    border-radius: 8px;
}
.ant-popover-arrow{
    @apply z-10 bg-white
}
.ant-popover-inner-content{
    @apply p-0 min-w-[250px]
}
.info h5, .info p, .info span{
    @apply m-0 font-semibold
}
.ant-popover-placement-bottomRight > .ant-popover-content > .ant-popover-arrow{
    right: 23px;
}
.avatar-popup .ant-avatar-string {
    left: 20px !important;
    opacity: 1 !important;
    transform: translate(-50%, 0%);
}
.button {
  border-radius: 8px;
  border: 2px solid #276657;
  border-bottom: 6px solid #276657;
  transition: all 0.1s;
  display: inline-flex;
}

.button:hover {
  background-color: #e4ffeb;
  border-color: #276657;
}

.button:active {
  border-bottom: 2px solid #276657;
}

.answer-number {
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.answer-choice {
    width: 100%;
    text-align: center;
    font-size: 14px;
    height: fit-content;
    line-height: 28px;
    font-weight: 600;
}
</style>
