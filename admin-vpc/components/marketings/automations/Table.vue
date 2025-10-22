<template>
    <div class="table-data">
        <a-collapse :active-key="automationSelected.length ? 1 : 0" :bordered="false">
            <a-collapse-panel
                key="1"
                :show-arrow="false"
            >
                <div class="flex items-center justify-end mb-4">
                    <a-tooltip placement="topLeft" :title="`Tags ${automationSelected.length > 1 ? 's' : ''}`" arrow-point-at-center>
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
            :data-source="automations"
            :pagination="false"
            :scroll="{ x: 600 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
            :row-selection="{ selectedRowKeys: automationSelected, onChange: onSelectChange }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="automation"
                title="Tên automations"
                :width="150"
                align="left"
            >
                <template #default="automation">
                    <span class="text-[13px]">{{ `${automation.automation_name}` }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="createdBy"
                title="Người tạo"
                :width="150"
            >
                <template #default="automation">
                    <div class="flex items-center gap-2">
                        <a-avatar :src="automation.avatar" />
                        <div>
                            <p class="m-0">
                                {{ automation.creator_name }}
                            </p>
                            <p class="m-0">
                                {{ automation.role_name }} - {{ automation.dept_name }}
                            </p>
                        </div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="group"
                title="Nhóm"
                :width="150"
            >
                <template #default="automation">
                    {{ automation.group_name || '--' }}
                </template>
            </a-table-column>
            <a-table-column
                key="type"
                title="Loại"
                :width="80"
            >
                <template #default="automation">
                    {{ automation.automation_type === 'by_diagram' ? 'Biểu đồ' : '--' }}
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                data-index="status"
                title="Trạng thái"
                :width="80"
            >
                <template #default="status">
                    <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[status]}]`">
                        <span :class="`w-2 h-2 rounded-full`" :style="`background-color: ${STATUS_COLOR[status]}`" />
                        <span :style="`color: ${STATUS_COLOR[status]}`">{{ STATUS_LABEL[status] }}</span>
                    </span>
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
                                    :to="`/khach-hang/${scope._id}`"
                                >
                                    Chi tiết khách hàng
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item class="!text-danger-100" @click="() => { $refs.ConfirmDialog.open(scope) }">
                                Xóa khách hàng
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa"
            content="Bạn chắc chắn muốn xóa dữ liệu"
            @confirm="confirmDelete"
        />
        <TagsModal
            ref="tagsModal"
        />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import {
        CUSTOMER_STATUS, CUSTOMER_STATUS_OPTIONS,
    } from '@/constants/customers/status';
    import ConfirmDialog from '@/components/marketings/automations/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
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
                selected: '',
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('marketing/automations', ['automations', 'automationSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        watch: {
            automations: {
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
            ...mapActions('automations', ['selectedAutomation']),
            mapDataFromOptions,
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.automations[index]); // Pass the clicked row data
                    });
                });
            },
            handleRowClick(row) {
                console.log(row);
                // this.$router.push(`/khach-hang/${row._id}`);
            },
            onSelectChange(selectedRowKeys) {
                this.selectedAutomation(selectedRowKeys);
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
                    await this.$api.automations.deleteMany(this.automationSelected);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('automations/fetchAll', { ...this.$route.query });
                    this.selectedAutomation([]);
                    this.loadingDelete = false;
                } catch (e) {
                    this.loadingDelete = false;
                    this.$handleError(e);
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
