<template>
    <div class="table-data">
        <a-table
            :data-source="forms"
            :pagination="false"
            :scroll="{ x: 600 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
        >
            <a-table-column
                key="title"
                title="Thông tin"
                :width="300"
                align="left"
            >
                <template #default="record">
                    <div>
                        <h5 class="text-lg mb-1">
                            {{ record.title }}
                        </h5>
                        <div class="flex items-center gap-2 mb-1">
                            <span><i class="fas fa-link" /></span>
                            <p class="mb-0 text-xs">
                                {{ record.link }}
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <span><i class="far fa-clock" /></span>
                            <p class="mb-0 text-xs">
                                {{ record.createdAt | dateFormat }}
                            </p>
                        </div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="creater"
                title="Người tạo"
                :width="200"
            >
                <template #default="record">
                    <div class="flex items-start flex-col gap-2">
                        <h4 class="mb-0">
                            {{ record.creater.fullname }}
                        </h4>
                        <span class="text-xs">{{ record.creater.role }}</span>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="access"
                title="Lượt truy cập"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.access }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="today"
                title="Hôm nay"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.today }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="total"
                title="Tổng số"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.total }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Hiển thị"
                :width="120"
                align="center"
            >
                <template #default="record">
                    <a-switch
                        :default-checked="record.status === 'active' ? true : false"
                    />
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa"
            content="Bạn chắc chắn muốn xóa dữ liệu"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import {
        CUSTOMER_STATUS, CUSTOMER_STATUS_OPTIONS,
    } from '@/constants/customers/status';
    import ConfirmDialog from '@/components/marketings/emails/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
        },

        props: {
            forms: {
                type: Array,
                required: () => [],
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
                CUSTOMER_STATUS,
                CUSTOMER_STATUS_OPTIONS,
                selected: '',
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('marketing/emails', ['emails', 'emailSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        watch: {
            emails: {
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
            ...mapActions('emails', ['selectedAutomation']),
            mapDataFromOptions,
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.emails[index]); // Pass the clicked row data
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
                    await this.$api.emails.deleteMany(this.emailSelected);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('emails/fetchAll', { ...this.$route.query });
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
