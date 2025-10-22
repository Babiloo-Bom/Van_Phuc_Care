<template>
    <div class="table-data">
        <a-collapse :active-key="cartSelected.length ? 1 : 0" :bordered="false">
            <a-collapse-panel
                key="1"
                :show-arrow="false"
            >
                <div class="flex items-center justify-end mb-4">
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
                    <a-tooltip placement="topLeft" :title="'Xóa'" arrow-point-at-center>
                        <a-button type="link" class="ml-2 group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center" @click="$refs.optionsExport.open()">
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
                    </a-tooltip>
                </div>
            </a-collapse-panel>
        </a-collapse>
        <a-table
            :data-source="carts"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onSelectRecord }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="code"
                :title="$t('order.name')"
                align="center"
                :width="300"
            >
                <template #default="cart">
                    <span :class="`font-bold text-[#53c66e] ${cart.status !== 'canceled' ? '' : 'line-through'}`">#{{ cart._id }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                :title="$t('shared.createdAt')"
                align="center"
                :width="150"
            >
                <template #default="cart">
                    <span :class="`${cart.status !== 'canceled' ? '' : 'line-through'}`">{{ cart.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="customer"
                :title="$t('customer.name')"
                :width="160"
                align="center"
            >
                <template #default="cart">
                    <h4>{{ cart.customer ? cart.customer.email : '--' }}</h4>
                </template>
            </a-table-column>
            <a-table-column
                key="price"
                :title="$t('shared.total')"
                align="center"
                :width="150"
            >
                <template #default="cart">
                    <span :class="`${cart.status !== 'canceled' ? '' : 'line-through'}`">{{ totalBill(cart) | currencyFormat }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="products"
                :title="$t('shared.product')"
                align="center"
                :width="150"
            >
                <template #default="cart">
                    <span :class="`${cart.status !== 'canceled' ? '' : 'line-through'}`">{{ handleTotalProduct(cart.items) }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                data-index="status"
                :title="$t('shared.status')"
                align="center"
                :width="150"
            >
                <template #default="status">
                    <a-tag :color="STATUS_COLOR[status]">
                        {{ STATUS_LABEL[status] }}
                    </a-tag>
                </template>
            </a-table-column>
        </a-table>
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
                    <template v-for="cart, index in cartSelected">
                        <span :key="index">
                            <CartPrint :data="cart" class="html2pdf__page-break" />
                        </span>
                    </template>
                </section>
            </VueHtml2pdf>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import {
        STATUS, STATUS_OPTIONS,
    } from '@/constants/carts/status';
    import VueHtml2pdf from 'vue-html2pdf';
    import CartPrint from '@/components/orders/carts/CartPrint.vue';

    export default {
        components: {
            VueHtml2pdf,
            CartPrint,
        },

        props: {
            carts: {
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

        data() {
            return {
                STATUS,
                STATUS_OPTIONS,
                selectedRowKeys: [],
            };
        },
        computed: {
            ...mapState('orders/carts', ['cartSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(STATUS_OPTIONS, 'value', 'color');
            },

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

        mounted() {
            this.addClickListenersToRows();
        },

        methods: {
            mapDataFromOptions,
            ...mapActions('orders/carts', ['selectedCart']),
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.carts[index]); // Pass the clicked row data
                    });
                });
            },

            handleRowClick(row) {
                this.$router.push(`/orders/carts/${row._id}`);
            },

            handleTotalProduct(arr) {
                return arr.reduce((accumulator, currentValue) => accumulator + Number(currentValue.number), 0);
            },

            totalPrice(data) {
                return data.reduce((accumulator, product) => accumulator + (product.price * product.number), 0);
            },

            totalBill(data) {
                const transportPrice = data.transportFee ? Number(data.transportFee.price) : 0;
                const productTotal = Number(this.totalPrice(data.items));

                if (data.discount) {
                    if (data.discount.type === 'percentage') {
                        const discountPercentage = Number(data.discount.price) / 100;
                        return productTotal * (1 - discountPercentage) + transportPrice;
                    } if (data.discount.type === 'amount') {
                        return productTotal - Number(data.discount.price) + transportPrice;
                    }
                }

                return productTotal + transportPrice;
            },

            onSelectChange(selectedRowKeys) {
                this.selectedRowKeys = selectedRowKeys;
            },

            onProgress(progress) {
                this.progress = progress;
            },

            onSelectRecord(record, selected, selectedRows) {
                this.selectedCart(selectedRows);
            },
        },
    };
</script>
<style lang="scss">
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
