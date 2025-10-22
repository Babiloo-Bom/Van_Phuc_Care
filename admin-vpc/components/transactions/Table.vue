<template>
    <div class="table-data">
        <a-table
            :data-source="transactions"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row._id"
            :loading="loading || loadingDelete"
            class="cursor-pointer !text-[13px]"
        >
            <a-table-column
                key="title"
                title="Tên giao dịch"
                :width="150"
                data-index="title"
                align="left"
            >
                <template #default="title">
                    <span>{{ title }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="type"
                title="Loại giao dịch"
                :width="120"
                data-index="type"
                align="left"
            >
                <template #default="type">
                    <span>{{ type }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="customer"
                title="Khách hàng"
                :width="120"
            >
                <template #default="record">
                    <span>
                        {{ record.customer?.fullname }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                key="email"
                title="Email"
                :width="150"
            >
                <template #default="record">
                    <p class="m-0 truncate pr-3">
                        {{ record.customer?.email }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                :width="150"
            >
                <template #default="record">
                    <div class="flex items-center synck-select">
                        <div class="flex items-center gap-1">
                            <span :class="`block !min-w-2 !w-2 !h-2 rounded-full`" :style="`background-color: ${STATUS_COLOR[record.status]}`" />
                            <span class="w-fit block font-[600]" :style="`color: ${STATUS_COLOR[record.status]}`">{{ STATUS_LABEL[record.status] }}</span>
                        </div>
                        <a-select
                            :default-value="record.status"
                            style="width: 120px"
                            @change="(value) => handleChangeStatus(record, value)"
                        >
                            <template #suffixIcon>
                                <div class="flex p-1 items-center justify-center rounded-full bg-[#f8f8fb] border border-[#dce1e5] relative top-[-5px] right-[-40px]">
                                    <svg
                                        v-if="!loadingSave"
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            stroke="#262626"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-miterlimit="10"
                                            stroke-width="1.5"
                                            d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                                        />
                                    </svg>
                                    <a-icon v-else type="loading" />
                                </div>
                            </template>
                            <a-select-option v-for="(option, index) in TRANSACTION_STATUS_OPTIONS" :key="`transaction_status_${index}`" :value="option.value">
                                <div class="flex items-center gap-1">
                                    <span class="w-fit block font-[600]">{{ option.label }}</span>
                                </div>
                            </a-select-option>
                        </a-select>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="total"
                title="Tổng"
                :width="120"
                data-index="total"
            >
                <template #default="total">
                    <p class="m-0">
                        {{ total | currencyFormat }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                data-index="createdAt"
                title="Ngày tạo"
                :width="100"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('HH:ss dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                align="center"
                :width="60"
                fixed="right"
            >
                <template #default="scope">
                    <a-dropdown placement="bottomRight" :trigger="['hover']">
                        <a-button class="!mr-0" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item @click="() => { $refs.dialog.open(scope) }">
                                Chỉnh sửa giao dịch
                            </a-menu-item>
                            <a-menu-item v-if="scope.cart" @click="() => { $refs.DetailDialog.open(scope.items, scope) }">
                                Chi tiết giao dịch
                            </a-menu-item>
                            <a-menu-item class="!text-danger-100" @click="() => { selectedTransaction(scope); $refs.ConfirmDialog.open() }">
                                Xóa giao dịch
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <Dialog ref="dialog" />
        <DetailDialog ref="DetailDialog" />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/transactions/Dialog.vue';
    import {
        TRANSACTION_STATUS, TRANSACTION_STATUS_OPTIONS,
    } from '@/constants/transactions/status';
    import DetailDialog from '@/components/transactions/DetailDialog.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
            DetailDialog,
        },

        props: {
            transactions: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                TRANSACTION_STATUS,
                TRANSACTION_STATUS_OPTIONS,
                loadingSave: false,
                loadingDelete: false,
                selected: '',
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('transactions', ['transactionSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(TRANSACTION_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(TRANSACTION_STATUS_OPTIONS, 'value', 'color');
            },
        },
        mounted() {
            this.addClickListenersToRows();
        },

        methods: {
            ...mapActions('transactions', ['selectedTransaction']),
            mapDataFromOptions,
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.transactions[index]); // Pass the clicked row data
                    });
                });
            },
            handleRowClick(row) {
                this.$refs.dialog.open(row);
            },
            onSelectChange(selectedRowKeys) {
                this.selectedTransaction(selectedRowKeys);
            },
            async confirmDelete() {
                try {
                    this.loadingDelete = true;
                    await this.$api.transactions.delete(this.transactionSelected._id);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('transactions/fetchAll', { ...this.$route.query, target: this.transactionSelected.target });
                    this.selectedTransaction([]);
                    this.loadingDelete = false;
                } catch (e) {
                    this.loadingDelete = false;
                    this.$handleError(e);
                }
            },
            async handleChangeStatus(record, value) {
                try {
                    this.loadingSave = true;
                    await this.$api.transactions.update(record._id, {
                        status: value,
                    });
                    await this.$store.dispatch('transactions/fetchAll', { ...this.$route.query, target: record.target });
                    this.$message.success('Cập nhật thành công');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingSave = false;
                }
            },
        },
    };
</script>
<style lang="scss">
.group:hover svg path {
    stroke: #fff;
}
.table-data {
    .ant-table-selection-column {
        padding-left: 0px !important;
        padding-right: 0px !important;
        width: 40px !important;
    }
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
