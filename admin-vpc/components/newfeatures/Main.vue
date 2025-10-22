<template>
    <div>
        <a-button type="text" class="!w-[30px] !h-[30px] !rounded-full !flex items-center justify-center !min-w-[30px] !p-0" @click="toggleDraw">
            <svg
                class="transition-all duration-300"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
            ><path
                d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"
                stroke="#161629"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            /><path
                d="M2 13h3.76a2 2 0 0 1 1.79 1.11l.89 1.79C9 17 10 17 10.24 17h3.53a2 2 0 0 0 1.79-1.11l.89-1.79a2 2 0 0 1 1.79-1.11h3.74M10.34 7h3.33M9.5 10h5"
                stroke="#161629"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            /></svg>
        </a-button>
        <a-drawer
            placement="right"
            :visible="visible"
            width="480px"
            :mask-closable="false"
            @close="close"
        >
            <div class="min-h-[65px] py-3 px-4 border-b border-[#ececec]">
                <div>
                    <h6 class="m-0 font-bold text-[18px]">
                        {{ `Tính năng` }}
                    </h6>
                    <p class="m-0">
                        Ngày cập nhật: {{ new Date() | dateFormat('HH:mm dd/MM/yyyy') }}
                    </p>
                </div>
            </div>
            <div class="p-2">
                <div class="bg-[#fff] rounded-md p-3 cursor-pointer">
                    <img class="w-full rounded-md h-[250px] object-cover" src="https://cdn.synck.io.vn/assets/images/synck-ai.png">
                    <div class="ml-2">
                        <span class="block pl-1 border-l-[4px] border-[#1351d8] text-[#1351d8] text-[16px] font-[600] mt-4 uppercase">Tính năng mới</span>
                        <h6 class="text-[16px] font-[600] mt-2 text-[#191919]">
                            Quản lý doanh nghiệp hiệu quả hơn với Synck's AI
                        </h6>
                    </div>
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center justify-center gap-1">
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                                stroke="#a5a5a5"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="M15.695 13.7h.009M15.695 16.7h.009M11.995 13.7h.01M11.995 16.7h.01M8.294 13.7h.01M8.294 16.7h.01"
                                stroke="#a5a5a5"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                            <span class="text-[#a5a5a5] text-[12px]">Dự kiến: 25/12/2024</span>
                        </div>
                        <div class="flex items-center justify-center gap-1">
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
                                stroke="#a5a5a5"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="m19.21 15.74-3.54 3.54c-.14.14-.27.4-.3.59l-.19 1.35c-.07.49.27.83.76.76l1.35-.19c.19-.03.46-.16.59-.3l3.54-3.54c.61-.61.9-1.32 0-2.22-.89-.89-1.6-.6-2.21.01Z"
                                stroke="#a5a5a5"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="M18.7 16.25c.3 1.08 1.14 1.92 2.22 2.22"
                                stroke="#a5a5a5"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="M3.41 22c0-3.87 3.85-7 8.59-7 1.04 0 2.04.15 2.97.43"
                                stroke="#a5a5a5"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                            <span class="text-[#a5a5a5] text-[12px]">Tác giả: Elly</span>
                        </div>
                    </div>
                </div>
            </div>
        </a-drawer>
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
            toggleDraw() {
                this.visible = !this.visible;
            },
            close() {
                this.visible = false;
            },
        },
    };
</script>
<style>
.ant-popover {
    width: 350px;
}
.ant-drawer-body {
    padding: 4px;
}
.ant-drawer-content-wrapper {
    max-width: 100%;
}
.ant-drawer-wrapper-body {
    background: #fafaff !important;
}
</style>
