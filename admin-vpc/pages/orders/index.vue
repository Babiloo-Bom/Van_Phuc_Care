<template>
    <div>
        <div v-if="!checking && !loading">
            <div v-if="orders?.length || search">
                <div class="card mb-4">
                    <div class="flex justify-between items-end flex-wrap gap-4">
                        <OrderFilter />
                        <div class="flex items-center gap-4">
                            <a-button type="dashed" class="!flex items-center gap-2 justify-center" @click="$refs.optionsExport.open()">
                                <svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11v6l2-2M9 17l-2-2" stroke="#161a21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5" stroke="#161a21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z" stroke="#161a21" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                Export
                            </a-button>
                            <a-button type="primary" class="!flex items-center gap-2 justify-center" @click="$router.push('orders/create')">
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
                                {{ 'Thêm' }}
                            </a-button>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <Table
                        :orders="orders"
                        :loading="loadingTable"
                        :columns="columns"
                    />
                    <ct-pagination :data="pagination" />
                </div>
            </div>
            <div v-else>
                <Empty />
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-full">
            <div class="race-by " />
        </div>
        <ExportModal ref="optionsExport" :title="`Export đơn hàng`" />
    </div>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import { mapState } from 'vuex';
    import Empty from '@/components/orders/Empty.vue';
    import Table from '@/components/orders/Table.vue';
    import OrderFilter from '@/components/orders/Filter.vue';
    import ExportModal from '@/components/orders/ExportModal.vue';

    export default {
        components: {
            Empty,
            Table,
            OrderFilter,
            ExportModal,
        },
        async fetch() {
            this.checking = true;
            if (this.$route.query.searchKey) {
                // Remove the searchKey parameter
                delete this.$route.query.searchKey;
                // Push the updated route to the router
                this.$router.push({ path: this.$route.path, query: this.$route.query });
            }
            await this.fetchData();
            this.checking = false;
        },
        data() {
            return {
                loading: false,
                loadingTable: false,
                search: false,
                checking: false,
                columns: [
                    {
                        value: 'code',
                        label: 'Mã đơn hàng',
                        status: true,
                        width: 80,
                        fixed: 'left',
                    },
                    {
                        value: 'createdAt',
                        label: 'Ngày tạo',
                        status: true,
                        width: 150,
                    },
                    {
                        value: 'customer',
                        label: 'Khách hàng',
                        status: true,
                        width: 100,
                    },
                    {
                        value: 'price',
                        label: 'Tổng giá trị',
                        status: true,
                        width: 150,
                    },
                    {
                        value: 'products',
                        label: 'Số sản phẩm',
                        status: true,
                        width: 100,
                    },
                    {
                        value: 'status',
                        label: 'Trạng thái',
                        status: true,
                        width: 100,
                    },
                ],
            };
        },
        computed: {
            ...mapState('orders', ['orders', 'pagination']),
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('orders/fetchAll', { ...this.$route.query });
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
                label: 'Đơn hàng',
                link: '/orders',
            }]);
        },

        methods: {
            _isEmpty,
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.orders === null) {
                        await this.$store.dispatch('orders/fetchAll', { ...this.$route.query });
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Đơn hàng',
            };
        },
    };
</script>
