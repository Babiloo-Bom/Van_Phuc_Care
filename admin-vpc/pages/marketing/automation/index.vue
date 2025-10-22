<template>
    <div>
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
        <div v-if="!checking && !loading">
            <div v-if="automations?.length || search">
                <div class="card mb-4">
                    <div class="flex justify-between items-end">
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
                </div>
                <div class="card">
                    <Table
                        :automations="automations"
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
        <!-- <ExportModal ref="optionsExport" title="Export khách hàng" /> -->
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Empty from '@/components/marketings/automations/Empty.vue';
    import Table from '@/components/marketings/automations/Table.vue';
    import AutomationFilter from '@/components/marketings/automations/Filter.vue';

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
            ...mapState('marketing/automations', ['automations', 'pagination']),
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('marketing/automations/fetchAll', { ...this.$route.query });
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
                label: 'Marketing Automations',
                link: '/marketing/automation',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.automations.length === 0) {
                        await this.$store.dispatch('marketing/automations/fetchAll', { ...this.$route.query });
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
        },

        head() {
            return {
                title: 'Marketing Automations',
            };
        },
    };
</script>
