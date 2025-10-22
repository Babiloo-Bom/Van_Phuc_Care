<template>
    <div>
        <a-table
            :data-source="contracts"
            :pagination="false"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
            :row-selection="{ selectedRowKeys: contractSelected, onChange: onSelectChange }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="dayRemaining"
                title="Số ngày còn lại"
                :width="150"
                align="left"
                data-index="dayRemaining"
            >
                <template #default="dayRemaining">
                    <span>{{ dayRemaining }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="title"
                title="Tên hợp đồng"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <span>{{ record.title }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="numberContract"
                title="Số hợp đồng"
                :width="140"
                align="center"
                data-index="numberContract"
            >
                <template #default="numberContract">
                    <p>
                        {{ numberContract }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="customer"
                title="Khách hàng"
                :width="120"
                align="center"
                data-index="customer"
            >
                <template #default="customer">
                    <p>
                        {{ customer?.email }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="staff"
                title="Người phụ trách"
                :width="150"
                align="center"
                data-index="staff"
            >
                <template #default="staff">
                    <p>
                        {{ staff?.fullname }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="value"
                title="Giá trị"
                :width="120"
                align="center"
                data-index="value"
            >
                <template #default="value">
                    <p>
                        {{ value | currencyFormat }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="realValue"
                title="Giá trị thực"
                :width="120"
                align="center"
                data-index="realValue"
            >
                <template #default="realValue">
                    <p>
                        {{ realValue | currencyFormat }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="payment"
                title="Đã thanh toán"
                :width="150"
                align="center"
                data-index="payment"
            >
                <template #default="payment">
                    <p>
                        {{ payment?.total | currencyFormat }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="debt"
                title="Công nợ"
                :width="150"
                align="center"
                data-index="debt"
            >
                <template #default="debt">
                    <p>
                        {{ debt?.total | currencyFormat }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.status }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="type"
                title="Kiểu hợp đồng"
                :width="150"
                align="center"
                data-index="type"
            >
                <template #default="type">
                    <p>
                        {{ type }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                data-index="createdAt"
                title="Ngày tạo"
                align="center"
                :width="120"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="effectiveAt"
                data-index="effectiveAt"
                title="Ngày có hiệu lực"
                align="center"
                :width="150"
            >
                <template #default="effectiveAt">
                    {{ effectiveAt | dateFormat('dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="expirationAt"
                data-index="expirationAt"
                title="Ngày hết hiệu lực"
                align="center"
                :width="180"
            >
                <template #default="expirationAt">
                    {{ expirationAt | dateFormat('dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                align="center"
                :width="60"
                fixed="right"
            >
                <template #default="scope">
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mr-0" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item>
                                <nuxt-link
                                    :to="`/contracts/${scope._id}`"
                                >
                                    Chỉnh sửa hợp đồng
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item class="!text-danger-100" @click="() => { $refs.ConfirmDialog.open(scope) }">
                                Xóa hợp đồng
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa khóa học"
            @confirm="confirmDelete"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn muốn xóa khóa học này chứ?
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: Hành động không thể hoàn tác</span>
            </div>
        </ConfirmDialog>
        <Dialog ref="Dialog" />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/contracts/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },

        props: {
            contracts: {
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
                selected: '',
                rowSelection: [],
            };
        },

        computed: {
            ...mapState('contracts', ['contractSelected']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.addClickListenersToRows();
                },
                deep: true,
                immediate: true,
            },
        },

        mounted() {
            this.addClickListenersToRows();
        },

        methods: {
            ...mapActions('contracts', ['selectedContract']),
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.contracts[index]); // Pass the clicked row data
                    });
                });
            },

            handleRowClick(row) {
                this.$router.push(`/khoa-hoc/${row._id}`);
            },

            onSelectChange(selectedRowKeys) {
                this.selectedContract(selectedRowKeys);
            },

            async confirmDelete() {
                try {
                    await this.$api.contracts.delete(this.contractSelected._id);
                    this.$message.success('Xóa khóa học thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
