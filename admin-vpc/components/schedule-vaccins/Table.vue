<template>
    <div class="table-data">
        <a-table
            :data-source="schedules"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
            :row-selection="{ selectedRowKeys: scheduleSelected, onChange: onSelectChange }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="thumbnail"
                title="Ảnh"
                :width="120"
                align="left"
                data-index="thumbnail"
            >
                <template #default="thumbnail">
                    <img :src="thumbnail" alt="/" class="rounded-md h-16  w-[120px] object-cover">
                </template>
            </a-table-column>
            <a-table-column
                key="title"
                title="Tiêu đề"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <p class="m-0">
                        {{ record.title }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="numberOfInjections"
                title="Số mũi tiêm"
                :width="80"
                align="center"
                data-index="numberOfInjections"
            >
                <template #default="numberOfInjections">
                    <p class="m-0">
                        {{ numberOfInjections }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="time"
                title="Thời gian tiêm"
                :width="120"
                align="center"
                data-index="time"
            >
                <template #default="time">
                    <p class="m-0">
                        {{ time }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                data-index="status"
                title="Trạng thái"
                :width="100"
            >
                <template #default="status">
                    <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[status]}]`">
                        <span :class="`w-2 h-2 rounded-full`" :style="`background-color: ${STATUS_COLOR[status]}`" />
                        <span :style="`color: ${STATUS_COLOR[status]}`">{{ STATUS_LABEL[status] }}</span>
                    </span>
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
                                Chi tiết lịch tiêm
                            </a-menu-item>
                            <a-menu-item
                                class="!text-danger-100"
                                @click="() => {
                                    $refs.ConfirmDialog.open(),
                                    selectedDelete = scope._id
                                }"
                            >
                                Xóa lịch tiêm
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
    import Dialog from '@/components/schedule-vaccins/Dialog.vue';
    import {
        SERVICES_STATUS, SERVICES_STATUS_OPTIONS,
    } from '@/constants/services/status';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },

        props: {
            schedules: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                loading: false,
                SERVICES_STATUS,
                SERVICES_STATUS_OPTIONS,
                selected: '',
                selectedDelete: '',
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('schedule-vaccins', ['scheduleSelected']),
            STATUS_LABEL() {
                return this.mapDataFromOptions(SERVICES_STATUS_OPTIONS, 'value', 'label');
            },

            STATUS_COLOR() {
                return this.mapDataFromOptions(SERVICES_STATUS_OPTIONS, 'value', 'color');
            },
        },
        mounted() {
        },

        methods: {
            mapDataFromOptions,
            ...mapActions('schedule-vaccins', ['selectedSchedule']),
            handleRowClick(row) {
                this.$refs.dialog.open(row);
            },
            onSelectChange(selectedRowKeys) {
                this.selectedSchedule(selectedRowKeys);
            },
            async confirmDelete() {
                try {
                    await this.$api.schedules.delete(this.selectedDelete);
                    this.$message.success('Xóa thành công');
                    this.$nuxt.refresh();
                } catch (e) {
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
