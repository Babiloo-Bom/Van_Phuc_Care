<template>
    <div>
        <div class="">
            <div class="card mb-4">
                <div class="flex justify-between items-end">
                    <TransactionsFilter />
                    <div class="flex items-center gap-4">
                        <a-button type="primary" class="!flex items-center gap-2 justify-center" @click="$refs.dialog.open({target: 'health-books'})">
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
                            {{ 'Tạo mới' }}
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="card">
                <Table
                    :transactions="transactions"
                    :loading="loadingTable || loading"
                />
                <ct-pagination :data="pagination" />
            </div>
            <Dialog ref="dialog" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import TransactionsFilter from '@/components/transactions/Filter.vue';
    import Table from '@/components/transactions/Table.vue';
    import Dialog from '@/components/transactions/Dialog.vue';

    export default {
        layout: 'account',
        components: {
            Table,
            Dialog,
            TransactionsFilter,
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
            ...mapState('transactions', ['transactions', 'pagination']),
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('transactions/fetchAll', { ...this.$route.query, target: 'health-books' });
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
                label: 'Lịch sử giao dịch',
                link: '/health-books/lich-su-giao-dich',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('transactions/fetchAll', { target: 'health-books' });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Lịch sử giao dịch',
            };
        },
    };
</script>
