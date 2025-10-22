<template>
    <div>
        <div class="card-container !md:px-4 lg:p-4">
            <a-tabs type="card">
                <a-tab-pane key="1" tab="Lịch sử giao dịch">
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-4">
                                <a-button class="!w-[27px] !h-[27px] !p-0 !flex !items-center justify-center" type="primary" @click="$router.push('/lich-su-giao-dich')">
                                    <svg
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    ><path
                                        stroke="#fff"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="2"
                                        d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                                    /></svg>
                                </a-button>
                                <h6 class="text-[#1A75BB] m-0 font-bold">
                                    Về trang lịch sử giao dịch
                                </h6>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center mt-auto text-prim-100 font-semibold">
                                <p class="mb-0">
                                    Lịch sử giao dịch
                                </p>
                                <span class="mx-4">|</span>
                                <p class="mb-0">
                                    {{ transaction.title || 'Lorem ipsum' }}
                                </p>
                            </div>
                            <!-- <div class="cursor-pointer">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    class="stroke-prim-100 fill-none"
                                ><path
                                    d="M7.25 7h9.5V5c0-2-.75-3-3-3h-3.5c-2.25 0-3 1-3 3v2ZM16 15v4c0 2-1 3-3 3h-2c-2 0-3-1-3-3v-4h8Z"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /><path
                                    d="M21 10v5c0 2-1 3-3 3h-2v-3H8v3H6c-2 0-3-1-3-3v-5c0-2 1-3 3-3h12c2 0 3 1 3 3ZM17 15H7M7 11h3"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                            </div> -->
                        </div>
                        <div class="flex items-end justify-between mt-4">
                            <div>
                                <img class="w-[120px] h-auto" src="/images/logo.png" alt="">
                            </div>
                            <div>
                                <h3 class="text-3xl mb-0 !text-[28px]">
                                    Hóa Đơn
                                </h3>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-1 gap-4">
                            <div class="flex-1 h-[1px] bg-gray-40" />
                            <div class="md:flex gap-4 items-center">
                                <p class="mb-0">
                                    Khách hàng: <span class="font-semibold">{{ transaction?.customer?.email }}</span>
                                </p>
                                <p class="mb-0">
                                    Thời gian: <span class="font-semibold">{{ moment(transaction.createdAt).format('HH:ss DD/MM/YYYY') }}</span>
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between mt-4 gap-4 flex-col items-start md:flex-row md:items-center">
                            <!-- <div>
                                <h4 class="font-semibold mb-1 text-lg">
                                    Invoice to:
                                </h4>
                                <div>
                                    <p class="mb-0">
                                        {{transaction?.customer?.address}}
                                    </p>
                                    <p class="mb-0">
                                        {{transaction?.customer?.email}}
                                    </p>
                                </div>
                            </div> -->
                            <!-- <div class="md:text-right">
                                <h4 class="font-semibold mb-1 text-lg">
                                    Pay to:
                                </h4>
                                <div>
                                    <p class="mb-0">
                                        {{ transaction.address }}
                                    </p>
                                    <p class="mb-0">
                                        {{ transaction.email }}
                                    </p>
                                </div>
                            </div> -->
                        </div>
                        <div class="mt-4">
                            <TransactionHistoryBillTable :transactions="transactions" />
                        </div>
                        <div class="flex items-center justify-between mt-1 gap-4">
                            <div>
                                <h4 class="font-semibold mb-1 text-lg">
                                    Thông tin thanh toán:
                                </h4>
                                <div>
                                    <p v-if="transaction.customer?.cardNumber" class="mb-0">
                                        Credit Card - 200******123
                                    </p>
                                    <p class="mb-0">
                                        Tổng cộng: {{ transaction.total | currencyFormat }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <h4 class="font-bold mb-1 text-lg">
                                    Tổng cộng:
                                </h4>
                                <div>
                                    <p class="mb-0 text-green-100 text-2xl font-semibold">
                                        {{ transaction.total | currencyFormat }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div class="rounded-md p-8 border-[1px] border-solid border-gray-40">
                                <h4 class="font-semibold">
                                    Term & Conditions:
                                </h4>
                                <ul class="mb-0 mt-2 list-disc pl-5">
                                    <li>All claims relating to quantity or shipping errors shall be waived by Buyer unless made in writing to Seller within thirty (30) days after delivery of goods to the address stated. </li>
                                    <li>Delivery dates are not guaranteed and Seller has no liability for damages that may be incurred due to any delay in shipment of goods hereunder. Taxes are excluded unless otherwise stated.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from 'moment';
    import TransactionHistoryBillTable from '@/components/transactionHistory/BillTable.vue';

    export default {
        components: {
            TransactionHistoryBillTable,
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
            ...mapState('transactions', ['transaction']),
            transactions() {
                return [{
                    ...this.transaction,
                }];
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Lịch sử giao dịch',
                link: '/lich-su-giao-dich',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82M16.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM8.25 22a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM9 8h12" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }, {
                label: this.transaction.title,
                link: `/lich-su-giao-dich/${this.transaction._id}`,
            }]);
        },

        methods: {
            moment,
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('transactions/fetchDetail', this.$route.params.id);
                    console.log(this.transaction);
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
<style scoped>

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
