<template>
    <div>
        <div v-if="!checking && !loading">
            <div v-if="customers?.length || search">
                <div class="card mb-4">
                    <div class="flex justify-between items-end">
                        <CustomerFilter />
                        <div class="flex items-center gap-4">
                            <!-- <a-button type="dashed" class="!flex items-center gap-2 justify-center" @click="$refs.optionsExport.open()">
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    d="M9 11v6l2-2M9 17l-2-2"
                                    stroke="#161a21"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /><path
                                    d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
                                    stroke="#161a21"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /><path
                                    d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
                                    stroke="#161a21"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                                Export
                            </a-button>
                            <a-button type="dashed" class="!flex items-center gap-2 justify-center" @click="$refs.import.open()">
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    d="M9 17v-6l-2 2M9 11l2 2"
                                    stroke="#161a21"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /><path
                                    d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
                                    stroke="#161a21"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /><path
                                    d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
                                    stroke="#161a21"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                                Import
                            </a-button> -->
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
                                {{ 'Thêm khách hàng' }}
                            </a-button>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <Table
                        :customers="customers"
                        :loading="loadingTable"
                    />
                    <ct-pagination :data="pagination" />
                </div>
                <!-- <CustomerImportModal ref="import" /> -->
                <CustomerCreateModal ref="create" />
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
    import Empty from '@/components/customers/Empty.vue';
    import Table from '@/components/customers/Table.vue';
    import CustomerFilter from '@/components/customers/Filter.vue';
    // import CustomerImportModal from '@/components/customers/ImportDialog.vue';
    import CustomerCreateModal from '@/components/customers/CreateModal.vue';
    // import ExportModal from '@/components/customers/ExportModal.vue';

    export default {
        components: {
            Empty,
            Table,
            CustomerFilter,
            // CustomerImportModal,
            CustomerCreateModal,
            // ExportModal,
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
            ...mapState('customers', ['customers', 'pagination']),
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
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
                label: 'Danh sách khách hàng',
                link: '/khach-hang',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Danh sách khách hàng',
            };
        },
    };
</script>
