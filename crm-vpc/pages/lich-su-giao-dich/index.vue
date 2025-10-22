<template>
    <div>
        <div class="card-container">
            <a-tabs type="card">
                <a-tab-pane key="1" tab="Lịch sử giao dịch">
                    <div v-if="!loading">
                        <TransactionHistoryTable v-if="transactions?.length" :transactions="transactions" />
                        <a-empty v-else description="Không có dữ liệu" />
                    </div>
                    <div v-else class="flex items-center justify-center h-full min-h-[450px]">
                        <span class="genstech-loader" />
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import TransactionHistoryTable from '@/components/transactionHistory/Table.vue';

    export default {
        components: {
            TransactionHistoryTable,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
            };
        },

        computed: {
            ...mapState('transactions', ['transactions']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Lịch sử giao dịch',
                link: '/lich-su-giao-dich',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.transactions === null) {
                        await this.$store.dispatch('transactions/fetchAll', { ...this.$route.query });
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
                title: 'Lịch sử giao dịch',
            };
        },
    };
</script>

<style lang="scss">
.card-container {
  overflow: hidden;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  min-height: 400px;
  margin-top: -16px;
}

.card-container > .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-wrap {
    @apply px-5
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}
@media only screen and (max-width: 600px) {
    .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    padding: 0;
    }
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
