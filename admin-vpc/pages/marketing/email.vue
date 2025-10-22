<template>
    <div class="email-marketing">
        <a-tabs default-active-key="2" type="card" @change="changeTab">
            <a-tab-pane key="1" tab="Danh sách Email" force-render>
                <div
                    class="!mx-auto block p-3 pt-0 w-full h-full"
                    style="position: absolute;
                    background: #00000075;
                    z-index: 999;
                    width: 100%;
                    transform: translate(-50%, 0);
                    left: 50%;"
                />
                <div
                    class="!mx-auto block fixed p-3 pt-0 w-fit h-fit"
                    style="
                    z-index: 9999;
                    transform: translate(-50%, 0);
                    top: 32%;
                    left: 57%;"
                >
                    <a-button
                        class="!flex items-center justify-center gap-2 !h-14 !my-3 !px-6 mx-auto cursor-pointer !w-fit card !rounded-full"
                        @click="windowOpenLink"
                    >
                        <img class="w-8 h-8" src="https://cdn.synck.io.vn/favicon.png" alt="google">
                        <span class="font-bold text-[16px]">Upgrade System</span>
                    </a-button>
                    <p class="!text-[#fff] text-[12px]">
                        <i>*Thông tin mang tính chất minh họa</i>
                    </p>
                </div>
                <div v-if="!checking && !loading">
                    <div v-if="emails?.length || search">
                        <div class="card">
                            <div class="flex justify-between items-end mb-4">
                                <AutomationFilter />
                                <div class="flex items-center gap-4">
                                    <a-button type="primary" class="!flex items-center gap-2 justify-center" @click="$refs.create.open()">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="16"
                                            height="16"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="m-0"
                                        ><line
                                            x1="12"
                                            y1="5"
                                            x2="12"
                                            y2="19"
                                        /><line
                                            x1="5"
                                            y1="12"
                                            x2="19"
                                            y2="12"
                                        /></svg>
                                        {{ 'Thêm mới' }}
                                    </a-button>
                                </div>
                            </div>
                            <Table
                                :emails="emails"
                                :loading="loadingTable"
                            />
                            <ct-pagination :data="pagination" />
                        </div>
                    </div>
                    <div v-else>
                        <Empty />
                    </div>
                </div>
                <div v-else class="flex items-center justify-center h-full min-h-[450px]">
                    <span class="genstech-loader" />
                </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Mẫu Email" force-render>
                <div class="card min-h-[200px] !pt-0">
                    <div
                        class="!mx-auto block p-3 pt-0 w-full h-full"
                        style="position: absolute;
                    background: #00000075;
                    z-index: 999;
                    width: 100%;
                    transform: translate(-50%, 0);
                    left: 50%;"
                    />
                    <div
                        class="!mx-auto block fixed p-3 pt-0 w-fit h-fit"
                        style="
                    z-index: 9999;
                    transform: translate(-50%, 0);
                    top: 40%;
                    left: 57%;"
                    >
                        <a-button
                            class="!flex items-center justify-center gap-2 !h-14 !my-3 !px-6 mx-auto cursor-pointer !w-fit card !rounded-full"
                            @click="windowOpenLink"
                        >
                            <img class="w-8 h-8" src="https://cdn.synck.io.vn/favicon.png" alt="google">
                            <span class="font-bold text-[16px]">Upgrade System</span>
                        </a-button>
                        <p class="!text-[#fff] text-[12px]">
                            <i>*Thông tin mang tính chất minh họa</i>
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4">
                        <a-button class="!rounded-md mb-2 !h-full !flex items-center gap-2 justify-center cursor-pointer border-[1px] border-[#e8e8e8]" style="border-style: dashed">
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM8 12h8M12 16V8"
                                stroke="#1a78b8"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                            <p class="m-0 text-[#1a78b8]">
                                Tạo mới
                            </p>
                        </a-button>
                        <div v-for="(template, index) in templates" :key="`template_${index}`" class="rounded-md mb-2  cursor-pointer border-[1px] border-[#e8e8e8]">
                            <img class="h-[200px] object-cover rounded-t-md" :src="`/images/email-templates/${template.thumbnail}`" alt="/">
                            <div class="px-1 py-2">
                                <p class="m-0 mt-1 mx-2">
                                    {{ template.template_name }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
            <!-- <a-tab-pane key="3" tab="Hủy đăng ký nhận email" force-render>
                <div class="card min-h-[200px]" />
            </a-tab-pane> -->
        </a-tabs>
        <!-- <ExportModal ref="optionsExport" title="Export khách hàng" /> -->
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Empty from '@/components/marketings/emails/Empty.vue';
    import Table from '@/components/marketings/emails/Table.vue';
    import AutomationFilter from '@/components/marketings/emails/Filter.vue';

    export default {
        components: {
            Empty,
            Table,
            AutomationFilter,
        },
        async fetch() {
            this.checking = true;
            await this.fetchData();
            this.checking = false;
        },
        data() {
            return {
                loading: false,
                search: false,
                checking: false,
                loadingTable: false,
            };
        },
        computed: {
            ...mapState('marketing/emails', ['emails', 'pagination', 'templates']),
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('marketing/emails/fetchAll', { ...this.$route.query });
                    this.loadingTable = false;
                    if (this.$route.query) {
                        this.search = true;
                    } else {
                        this.search = false;
                    }
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Marketing Email',
                link: '/marketing/email',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.emails.length === 0) {
                        await this.$store.dispatch('marketing/emails/fetchAll', { ...this.$route.query });
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            windowOpenLink() {
                window.open('https://synck.io.vn/', '_blank');
            },
            changeTab(val) {
                console.log(val);
            },
        },

        head() {
            return {
                title: 'Marketing Email',
            };
        },
    };
</script>
<style lang="scss">
.email-marketing {
    .ant-tabs-bar {
        margin: 0 !important;
    }
}
</style>
