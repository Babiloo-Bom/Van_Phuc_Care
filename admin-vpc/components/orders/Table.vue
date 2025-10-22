<template>
    <div class="table-data">
        <a-collapse :active-key="orderSelected.length ? 1 : 0" :bordered="false">
            <a-collapse-panel
                key="1"
                :show-arrow="false"
            >
                <div class="flex items-center justify-end mb-4">
                    <!-- <a-button type="link">
                {{ $t('order.create_invoice') }}
            </a-button> -->
                    <a-tooltip placement="topLeft" :title="$t('order.print_packing_slip')" arrow-point-at-center>
                        <a-button
                            type="link"
                            class="group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center"
                            @click="$refs.html2Pdf.generatePdf()"
                        >
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="M7.25 7h9.5V5c0-2-.75-3-3-3h-3.5c-2.25 0-3 1-3 3v2ZM16 15v4c0 2-1 3-3 3h-2c-2 0-3-1-3-3v-4h8Z"
                                stroke="#53c66e"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="M21 10v5c0 2-1 3-3 3h-2v-3H8v3H6c-2 0-3-1-3-3v-5c0-2 1-3 3-3h12c2 0 3 1 3 3ZM17 15H7M7 11h3"
                                stroke="#53c66e"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                        </a-button>
                    </a-tooltip>
                    <!-- <a-tooltip placement="topLeft" :title="$t('other.archive')" arrow-point-at-center>
                <a-button
                    type="link"
                    class="ml-2 group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center"
                    @click="archiveOrder"
                >
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M19.5 10.22V19c0 2-.5 3-3 3h-9c-2.5 0-3-1-3-3v-8.78M5 2h14c2 0 3 1 3 3v2c0 2-1 3-3 3H5c-2 0-3-1-3-3V5c0-2 1-3 3-3ZM10.18 14h3.64"
                        stroke="#53c66e"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
            </a-tooltip> -->
                    <a-popover placement="bottomRight" trigger="click">
                        <template slot="content">
                            <div class="!border-b-0 py-4 px-4 cursor-pointer hover:text-prim-100" @click="bulkUpdate('archive')">
                                <p class="font-[600] m-0">
                                    {{ $t('order.archive_orders') }}
                                </p>
                            </div>
                            <div class="!border-b-0 pb-4 px-4 cursor-pointer hover:text-prim-100 " @click="bulkUpdate('unarchive')">
                                <p class="font-[600] m-0">
                                    {{ $t('order.unarchive_orders') }}
                                </p>
                            </div>
                            <div class="!border-b-0 pt-4 pb-4 px-4 cursor-pointer hover:text-prim-100 border-[#d9d9d9] border-t" @click="bulkUpdate('fullfill')">
                                <p class="font-[600] m-0">
                                    {{ $t('order.mark_as_fullfill') }}
                                </p>
                            </div>
                            <div class="!border-b-0 pb-4 px-4 cursor-pointer hover:text-prim-100" @click="bulkUpdate('shipping')">
                                <p class="font-[600] m-0">
                                    {{ $t('order.mark_as_shipping') }}
                                </p>
                            </div>
                            <div class="!border-b-0 pb-4 px-4 cursor-pointer hover:text-prim-100" @click="bulkUpdate('paid')">
                                <p class="font-[600] m-0">
                                    {{ $t('order.mark_as_paid') }}
                                </p>
                            </div>
                            <div class="py-3 px-4 cursor-pointer hover:text-prim-100 border-[#d9d9d9] border-t" @click="$refs.confirmCancel.open()">
                                <p class="m-0 font-[600]">
                                    {{ $t('shared.cancel') }} {{ $t('order.name_lowercase') }}
                                </p>
                            </div>
                        </template>
                        <a-tooltip placement="topLeft" :title="$t('other.more_actions')" arrow-point-at-center>
                            <a-button type="link" class="ml-2 !w-[35px] !h-[35px] group hover:!bg-[#53c66e] !rounded-full !p-0 transition hover:ease-in !flex items-center gap-1 justify-center">
                                <span class="w-[4px] h-[4px] rounded-full bg-[#53c66e] group-hover:!bg-[#fff]" />
                                <span class="w-[4px] h-[4px] rounded-full bg-[#53c66e] group-hover:!bg-[#fff]" />
                                <span class="w-[4px] h-[4px] rounded-full bg-[#53c66e] group-hover:!bg-[#fff]" />
                            </a-button>
                        </a-tooltip>
                    </a-popover>
                </div>
            </a-collapse-panel>
        </a-collapse>

        <a-table
            :data-source="orders"
            :pagination="false"
            :scroll="{ x: '90vh' }"
            :row-key="(row) => row._id"
            :loading="loading || loadingAction"
            class="cursor-pointer"
            :row-selection="{ selectedRowKeys: orderSelected, onChange: onSelectChange, onSelect: onSelectRecord }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                v-for="column in columns"
                :key="column.value"
                :title="column.label"
                :width="column.width"
                align="left"
                :fixed="column.fixed"
            >
                <template #default="product">
                    <Column :type="column.value" :value="product" />
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="confirmCancel"
            :title="`${$t('shared.cancel')} đơn hàng`"
            :content="$t('order.cancel')"
            @confirm="confirmCancel"
        />
        <div class="fixed -right-[100%] z-20">
            <VueHtml2pdf
                ref="html2Pdf"
                :show-layout="false"
                :float-layout="false"
                :enable-download="false"
                :preview-modal="true"
                :paginate-elements-by-height="1900"
                filename="Order List"
                :pdf-quality="2"
                :manual-pagination="false"
                :html-to-pdf-options="htmlToPdfOptions"
                pdf-format="a5"
                pdf-orientation="landscape"
                @progress="onProgress($event)"
                @hasStartedGeneration="hasStartedGeneration()"
                @hasGenerated="hasGenerated($event)"
            >
                <section slot="pdf-content">
                    <template v-for="order, index in selectedOrders">
                        <span :key="index">
                            <OrderPrint :data="order" class="html2pdf__page-break" />
                        </span>
                    </template>
                </section>
            </VueHtml2pdf>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import Column from '@/components/shared/tables/ColumnOrderTable.vue';
    import ConfirmDialog from '@/components/orders/ConfirmDialog.vue';
    import VueHtml2pdf from 'vue-html2pdf';
    import OrderPrint from '@/components/orders/OrderPrint.vue';

    export default {
        components: {
            Column,
            OrderPrint,
            VueHtml2pdf,
            ConfirmDialog,
        },

        props: {
            columns: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
            pagination: {
                type: Object,
                required: false,
            },
        },

        async asyncData({ store, query }) {
            await store.dispatch('orders/fetchAll', query);
            this.selectedOrder([]);
        },

        data() {
            return {
                loadingAction: false,
                selectedRowKeys: [],
                selectedOrders: [],
                progress: null,
            };
        },
        computed: {
            ...mapState('orders', ['orders', 'orderSelected']),
            hasSelected() {
                return this.selectedRowKeys.length > 0;
            },
            htmlToPdfOptions() {
                return {
                    margin: 0,
                    image: {
                        type: 'jpeg',
                        quality: 2,
                    },
                    enableLinks: true,
                };
            },
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.addClickListenersToRows();
                },
            },
        },
        mounted() {
            this.addClickListenersToRows();
        },

        methods: {
            ...mapActions('orders', ['selectedOrder']),
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.orders[index]); // Pass the clicked row data
                    });
                });
            },
            handleRowClick(row) {
                this.$router.push(`/orders/${row.code}`);
            },
            onSelectChange(selectedRowKeys) {
                this.selectedOrder(selectedRowKeys);
            },
            async bulkUpdate(action) {
                try {
                    this.loadingAction = true;
                    await this.$api.orders.bulkUpdate({
                        action,
                        data: this.orderSelected,
                    });
                    this.$message.success(`${this.$t('form.update_data')} thành công`);
                    await this.$store.dispatch('orders/fetchAll', { ...this.$route.query });
                    this.loadingAction = false;
                    this.selectedOrder([]);
                } catch (e) {
                    this.$handleError(e);
                    this.loadingAction = false;
                }
            },
            async confirmCancel() {
                try {
                    this.loadingAction = true;
                    const orderHandled = this.orders.filter((e) => !['done', 'canceled'].includes(e.status));
                    await this.$api.orders.bulkUpdate({
                        action: 'cancel',
                        data: this.orderSelected.filter((element) => orderHandled.map((e) => e._id).includes(element.toString())),
                    });
                    this.$message.success(`${this.$t('order.archive_orders')} thành công`);
                    await this.$store.dispatch('orders/fetchAll', { ...this.$route.query });
                    this.loadingAction = false;
                    this.selectedOrder([]);
                } catch (e) {
                    this.$handleError(e);
                    this.loadingAction = false;
                }
            },

            // pdf function
            onProgress(progress) {
                this.progress = progress;
            },

            onSelectRecord(record, selected, selectedRows) {
                this.selectedOrders = selectedRows;
            },
        },
    };
</script>
<style lang="scss">
.ant-table-selection-column {
    padding-left: 0px !important;
    padding-right: 0px !important;
    width: 40px !important;
}
.group:hover svg path {
    stroke: #fff;
}

.table-data {
    .ant-collapse {
        .ant-collapse-item {
            .ant-collapse-header {
                padding: 0 !important;
            }
        }
        .ant-collapse-content-box {
                padding: 0 !important;
        }
    }
    .ant-collapse-borderless > .ant-collapse-item {
        border-bottom: 0 !important;
    }
    .ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content {
        background-color: #fff !important;
    }
}
</style>
