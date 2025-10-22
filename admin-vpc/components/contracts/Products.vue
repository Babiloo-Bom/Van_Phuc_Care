<template>
    <div>
        <div class="flex justify-end w-full !mb-2 ">
            <a-button type="primary" class="!flex items-center gap-2 justify-center" @click="openModalAddService">
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
                {{ 'Thêm dịch vụ' }}
            </a-button>
        </div>
        <a-table
            :data-source="serviceSelected"
            :pagination="false"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
            :row-selection="{ selectedRowKeys: contractSelected, onChange: onSelectChange }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="code"
                title="Mã dịch vụ"
                :width="150"
                align="left"
                data-index="code"
            >
                <template #default="code">
                    <span>{{ code }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="name"
                title="Tên dịch vụ"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <span>{{ record.name }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="quantity"
                title="Số lượng"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <span>{{ record.quantity }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="price"
                title="Đơn giá"
                :width="140"
                align="center"
                data-index="price"
            >
                <template #default="price">
                    <p>
                        {{ price | currencyFormat }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="vat"
                title="VAT(%)"
                :width="120"
                align="center"
            >
                <template #default="vat">
                    <p>
                        {{ vat }}%
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="value"
                title="Thành tiền"
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
        <AddServiceModal ref="addServiceModal" />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/contracts/Dialog.vue';
    import AddServiceModal from '@/components/contracts/AddServiceModal.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
            AddServiceModal,
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
            ...mapState('services', ['services', 'pagination', 'serviceSelected']),
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
            ...mapActions('services', ['selectedService']),
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

            async openModalAddService() {
                if (!this.services.length) {
                    this.$store.dispatch('services/fetchAll', { ...this.$route.query });
                }
                this.$refs.addServiceModal.open();
            },
        },
    };
</script>
