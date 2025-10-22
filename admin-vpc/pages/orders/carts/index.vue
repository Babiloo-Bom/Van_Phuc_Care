<template>
    <div>
        <div v-if="!checking && !loading">
            <div v-if="carts?.length || search">
                <div class="card mb-4">
                    <div class="flex justify-between items-end flex-wrap gap-4">
                        <CartFilter />
                        <div class="flex items-center gap-4">
                            <a-button type="dashed" class="!flex items-center gap-2 justify-center" @click="$refs.optionsExport.open()">
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
                        </div>
                    </div>
                </div>
                <div class="card">
                    <Table
                        :carts="carts"
                        :loading="loadingTable"
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
        <ExportModal ref="optionsExport" :title="`Export ${$t('order.name')}`" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Empty from '@/components/orders/carts/Empty.vue';
    import Table from '@/components/orders/carts/Table.vue';
    import CartFilter from '@/components/orders/carts/Filter.vue';
    import ExportModal from '@/components/orders/carts/ExportModal.vue';

    export default {
        components: {
            Empty,
            Table,
            CartFilter,
            ExportModal,
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
            ...mapState('orders/carts', ['carts', 'pagination']),
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
                label: this.$t('order.abandoned_checkouts'),
                link: '/orders/carts',
            }]);
        },

        methods: {

            async fetchData() {
                try {
                    if (this.carts === null) {
                        await this.$store.dispatch('orders/carts/fetchAll', { ...this.$route.query });
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
                title: this.$t('order.abandoned_checkouts'),
            };
        },
    };
</script>
