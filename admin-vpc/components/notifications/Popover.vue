<template>
    <div>
        <a-popover
            :v-model="visible"
            title="Thông báo"
            trigger="click"
            placement="bottomLeft"
        >
            <template #content>
                <div v-if="notifications.length !== 0">
                    <!-- <div style="border-bottom: 1px; border-style:solid; border-color:#e8e8e8">
                        <div class="rounded-md p-2">
                            <h4 class="m-0">Thông báo hệ thống</h4>
                            <p class="m-0 text-[12px]">Version 2.0 cập nhật thành công</p>
                            <p class="m-0 text-[12px]">Ngày: 27/08/2023</p>
                        </div>
                    </div> -->
                </div>
                <div v-else class="pb-4">
                    <a-empty description="Bạn chưa có thông báo nào" />
                </div>
            </template>
            <a-button type="text" class="!w-[30px] !h-[30px] !rounded-full !flex items-center justify-center !min-w-[30px] !p-0" @click="togglePopover">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    class="m-0"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                ><path d="M8.72428 18.3333H11.3285C11.688 18.3333 11.9795 18.0419 11.9795 17.6823C11.9795 17.3227 11.688 17.0312 11.3285 17.0312H8.72428C8.36471 17.0312 8.07324 17.3227 8.07324 17.6823C8.07324 18.0419 8.36471 18.3333 8.72428 18.3333Z" fill="#161629" /><path d="M10.0262 1.66666C9.66663 1.66666 9.37516 1.95813 9.37516 2.3177V3.01545C7.1696 3.33231 5.46891 5.23417 5.46891 7.52603L4.63558 11.5285C4.63558 11.7579 4.53223 11.9667 4.37845 12.0479C3.73389 12.3882 3.3335 13.0504 3.3335 13.776C3.3335 14.853 4.20967 15.7292 5.28662 15.7292H14.7658C15.8427 15.7292 16.7189 14.853 16.7189 13.776C16.7189 13.0504 16.3185 12.3882 15.674 12.0479C15.5201 11.9667 15.4168 11.758 15.4168 11.5285L14.5835 7.52603C14.5835 5.23417 12.8828 3.33231 10.6772 3.01545V2.3177C10.6772 1.95813 10.3858 1.66666 10.0262 1.66666ZM13.2814 7.52603L14.1147 11.5285C14.1147 12.2493 14.4792 12.8895 15.066 13.1993C15.2824 13.3136 15.4168 13.5346 15.4168 13.776C15.4168 14.135 15.1248 14.4271 14.7658 14.4271H5.28662C4.92764 14.4271 4.63558 14.135 4.63558 13.776C4.63558 13.5346 4.77002 13.3136 4.98643 13.1993C5.57318 12.8895 5.93766 12.2493 5.93766 11.5285L6.771 7.52603C6.771 5.73111 8.23128 4.27082 10.0262 4.27082C11.8211 4.27082 13.2814 5.73111 13.2814 7.52603Z" fill="#161629" /></svg>
            </a-button>
        </a-popover>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        components: {
        },

        data() {
            return {
                visible: false,
            };
        },

        computed: {
            ...mapState('notifications', ['notifications']),
        },

        methods: {
            togglePopover() {
                this.visible = !this.visible;
            },
        },
    };
</script>
<style>
.ant-popover {
    width: 350px;
}
</style>
