<template>
    <div class="table-data">
        <a-collapse :active-key="customerSelected.length ? 1 : 0" :bordered="false">
            <a-collapse-panel
                key="1"
                :show-arrow="false"
            >
                <div class="flex items-center justify-end mb-4">
                    <!-- <a-button type="dashed" class="mr-2" @click="$refs.tagsModal.open([], 'add')">
                        {{ $t('customer.add_tag') }}
                    </a-button>
                    <a-button type="dashed" class="mr-2" @click="$refs.tagsModal.open([], 'remove')">
                        {{ $t('customer.remove_tag') }}
                    </a-button> -->
                    <a-tooltip placement="topLeft" :title="`Xóa ${customerSelected.length > 1 ? `${customerSelected.length} khách hàng` : ''}`" arrow-point-at-center>
                        <a-button type="link" class="ml-2 group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center" @click="$refs.confirmDelete.open()">
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
            :data-source="customers"
            :pagination="false"
            :scroll="{ x: 500 }"
            :row-key="(row) => row._id"
            :loading="loading || loadingDelete"
            :custom-row="customRow"
            class="cursor-pointer !text-[13px] table-customer"
        >
            <a-table-column
                key="account_code"
                data-index="account_code"
                title="Mã KH"
                :width="80"
            >
                <template #default="account_code">
                    <span class="block w-full truncate pr-2">{{ account_code || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="customer"
                title="Tên khách hàng"
                :width="160"
                align="left"
            >
                <template #default="customer">
                    <span v-if="customer.fullname" class="text-[13px]">{{ `${customer.fullname}` }}</span>
                    <span v-else class="text-[13px]">{{ `${customer.firstname || ''} ${customer.lastname || ''}` }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="email"
                data-index="email"
                title="Email"
                :width="150"
            >
                <template #default="email">
                    <span class="block w-full truncate pr-2">{{ email || '--' }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="phone"
                data-index="phone"
                title="Số điện thoại"
                :width="120"
            >
                <template #default="phone">
                    {{ phone }}
                </template>
            </a-table-column>
            <a-table-column
                key="address"
                data-index="address"
                title="Địa chỉ"
                :width="150"
            >
                <template #default="address">
                    <p class="!m-0 truncate">
                        {{ address || '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                data-index="status"
                title="Trạng thái"
                :width="150"
            >
                <template #default="status">
                    <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[status]}]`">
                        <span :class="`w-2 h-2 rounded-full`" :style="`background-color: ${STATUS_COLOR[status]}`" />
                        <span :style="`color: ${STATUS_COLOR[status]}`">{{ STATUS_LABEL[status] }}</span>
                    </span>
                </template>
            </a-table-column>
            <!-- <a-table-column
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
                                <div
                                    @click="openHealthForm(scope)"
                                >
                                    Cập nhật sổ sức khỏe
                                </div>
                            </a-menu-item>
                            <a-menu-item>
                                <nuxt-link
                                    :to="`/khach-hang/${scope._id}`"
                                >
                                    Chi tiết khách hàng
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item
                                class="!text-danger-100"
                                @click="() => {
                                    selected = scope; $refs.confirmDelete.open(scope) }"
                            >
                                Xóa khách hàng
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column> -->
        </a-table>
        <ConfirmDialog
            ref="confirmDelete"
            :title="`Xóa ${customerSelected.length} khách hàng`"
            content="Bạn chắc chắn muốn xóa khách hàng này"
            @confirm="confirmDelete"
        />
        <TagsModal
            ref="tagsModal"
        />
        <DialogHeadlthBook ref="dialogHeadlthBook" />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import ConfirmDialog from '@/components/customers/ConfirmDialog.vue';
    import TagsModal from '@/components/customers/TagsModal.vue';
    import DialogHeadlthBook from '@/components/health-books/Dialog.vue';
    import {
        CUSTOMER_STATUS, CUSTOMER_STATUS_OPTIONS,
    } from '@/constants/customers/status';

    export default {
        components: {
            ConfirmDialog,
            TagsModal,
            DialogHeadlthBook,
        },

        props: {
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
                CUSTOMER_STATUS,
                CUSTOMER_STATUS_OPTIONS,
                selected: {},
                rowSelection: [],
                loadingDelete: false,
            };
        },
        computed: {
            ...mapState('customers', ['customers', 'customerSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        watch: {
        },
        mounted() {
        },
        methods: {
            ...mapActions('customers', ['selectedCustomer']),
            mapDataFromOptions,
            customRow(row) {
                return {
                    on: {
                        click: () => this.$router.push(`/khach-hang/${row._id}`),
                    },
                };
            },
            onSelectChange(selectedRowKeys) {
                this.selectedCustomer(selectedRowKeys);
            },
            async bulkUpdate(action) {
                try {
                    this.loadingAction = true;
                    await this.$api.products.bulkUpdate({
                        action,
                        data: this.productSelected,
                    });
                    this.$message.success('Cập nhật thành công');
                    await this.$store.dispatch('products/fetchAll', { ...this.$route.query });
                    this.loadingAction = false;
                    this.selectedProduct([]);
                } catch (e) {
                    this.$handleError(e);
                    this.loadingAction = false;
                }
            },
            async confirmDelete() {
                try {
                    this.loadingDelete = true;
                    await this.$api.customers.deleteMany([this.selected._id, ...this.customerSelected]);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
                    this.selectedCustomer([]);
                    this.loadingDelete = false;
                } catch (e) {
                    this.loadingDelete = false;
                    this.$handleError(e);
                }
            },

            openHealthForm(record) {
                this.$refs.dialogHeadlthBook.open(record);
                console.log(record);
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
    .ant-table-row-expand-icon {
        display: none;
    }
}
</style>
