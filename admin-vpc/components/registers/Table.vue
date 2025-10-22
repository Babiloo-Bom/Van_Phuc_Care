<template>
    <div class="table-data">
        <a-table
            :data-source="registers"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
        >
            <a-table-column
                key="title"
                title="Dịch vụ"
                :width="100"
                align="left"
            >
                <template #default="record">
                    <p class="m-0">
                        {{ record.service.title }}
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
                    <p class="m-0">
                        {{ customer?.fullname || email }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="numberDay"
                title="Số buổi còn lại"
                :width="120"
                align="center"
                data-index="numberDay"
            >
                <template #default="numberDay">
                    <p class="m-0">
                        {{ numberDay ? `${numberDay} buổi` : '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="implementer"
                title="Người thực hiện"
                :width="120"
                align="center"
                data-index="implementer"
            >
                <template #default="implementer">
                    <p class="m-0">
                        {{ implementer ? implementer?.fullname : '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="contract"
                title="Hợp đồng"
                :width="100"
                align="center"
                data-index="contract"
            >
                <template #default="contract">
                    <p class="m-0">
                        {{ contract?.originalname || 'Chưa có' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                data-index="createdAt"
                title="Thời gian gửi"
                align="center"
                :width="100"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('dd/MM/yyyy') }}
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
                            <a-menu-item @click="() => { $refs.dialog.open(scope) }">
                                Chi tiết
                            </a-menu-item>
                            <a-menu-item
                                class="!text-danger-100"
                                @click="() => {
                                    selected = scope;
                                    $refs.ConfirmDialog.open(scope)
                                }"
                            >
                                Xóa
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
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import Dialog from '@/components/registers/Dialog.vue';
    import {
        SERVICES_STATUS, SERVICES_STATUS_OPTIONS,
    } from '@/constants/services/status';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },

        props: {
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                SERVICES_STATUS,
                SERVICES_STATUS_OPTIONS,
                selected: {},
                status: null,
                loading: false,
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('registers', ['registers', 'registerSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(SERVICES_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(SERVICES_STATUS_OPTIONS, 'value', 'color');
            },
        },
        watch: {
            '$route.query': {
                handler() {
                },
                deep: true,
                immediate: true,
            },
        },
        mounted() {
        },

        methods: {
            mapDataFromOptions,
            ...mapActions('registers', ['selectedService']),

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('registers/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async confirmDelete() {
                try {
                    this.loading = true;
                    await this.$api.registers.delete([this.selected._id]);
                    this.$message.success('Xóa thành công');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    await this.$store.dispatch('registers/fetchAll');
                    this.loading = false;
                }
            },
            onChangeShowService(value) {
                this.status = value;
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
