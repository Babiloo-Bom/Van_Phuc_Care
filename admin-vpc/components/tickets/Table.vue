<template>
    <div class="table-data">
        <a-table
            :data-source="tickets"
            :pagination="false"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
            :custom-row="customRow"
        >
            <a-table-column
                key="name"
                title="Người tạo"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <p class="m-0 truncate">
                        {{ record.createdBy.fullname }}
                    </p>
                    <p class="m-0 truncate">
                        {{ record.createdBy.email }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="type"
                title="Loại hỗ trợ"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <p class="m-0">
                        {{ record.type === 'support_parent' ? 'Hỗ trợ cha mẹ' : 'Khác' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="content"
                title="Nội dung"
                :width="300"
            >
                <template #default="record">
                    <div class="truncate-2" v-html="record.content" />
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Hiển thị"
                :width="90"
                align="left"
                data-index="status"
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
                :width="100"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('HH:mm dd/MM/yyyy') }}
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
                            <a-menu-item
                                class="!text-danger-100"
                                @click="() => {
                                    $refs.ConfirmDialog.open(),
                                    selectedDelete = scope._id
                                }"
                            >
                                Xóa bản ghi
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
        <Conversations ref="conversations" />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import Dialog from '@/components/tickets/Dialog.vue';
    import Conversations from '@/components/tickets/Conversations.vue';
    import {
        SERVICES_STATUS, SERVICES_STATUS_OPTIONS,
    } from '@/constants/services/status';

    export default {
        components: {
            ConfirmDialog,
            Conversations,
            Dialog,
        },

        props: {
            data: {
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
                SERVICES_STATUS,
                SERVICES_STATUS_OPTIONS,
                selected: '',
                selectedDelete: '',
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('tickets', ['tickets', 'ticketSelected']),
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
            ...mapActions('tickets', ['selectedTicket']),
            customRow(row) {
                return {
                    on: {
                        click: () => this.$refs.conversations.open(row),
                    },
                };
            },
            onSelectChange(selectedRowKeys) {
                this.selectedBook(selectedRowKeys);
            },
            async confirmDelete() {
                try {
                    await this.$api.tickets.delete(this.selectedDelete);
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
