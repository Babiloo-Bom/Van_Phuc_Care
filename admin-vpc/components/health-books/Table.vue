<template>
    <div class="table-data">
        <a-table
            :data-source="healthBooks"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(row) => row._id"
            :loading="loading"
            :locale="{
                emptyText: 'Chưa có sổ nào được ghi'
            }"
            class="cursor-pointer !text-[13px]"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="avatar"
                title="Ảnh"
                :width="60"
                align="center"
                data-index="avatar"
            >
                <template #default="avatar">
                    <img :src="avatar || 'https://firebasestorage.googleapis.com/v0/b/gensi-8df36.appspot.com/o/20240627092102_Logo-VanPhucCare_LogoDoc-Nentrang.jpg?alt=media&token=ed01eb5a-f91a-4f6d-99f1-f25e052e312e'" alt="/" class="rounded-full h-[60px]  w-[60px] object-cover mx-auto block">
                </template>
            </a-table-column>
            <a-table-column
                key="name"
                title="Tên"
                :width="150"
                align="left"
            >
                <template #default="record">
                    <p class="m-0">
                        {{ record.name }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="gender"
                title="Giới tính"
                :width="80"
                align="center"
            >
                <template #default="record">
                    <p class="m-0">
                        {{ record.gender ? (record.gender === 'male' ? 'Nam' : 'Nữ') : 'Khác' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="updatedAt"
                data-index="updatedAt"
                title="Cập nhật"
                align="center"
                :width="120"
            >
                <template #default="updatedAt">
                    {{ updatedAt | dateFormat('HH:ss dd/MM/yyyy') }}
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
                            <!-- <a-menu-item @click="() => { $router.push(`/health-books/${scope._id}`) }">
                                Chi tiết
                            </a-menu-item> -->
                            <a-menu-item @click="() => { $refs.dialog.open(scope) }">
                                Chỉnh sửa
                            </a-menu-item>
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
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import { mapDataFromOptions } from '@/utils/data';
    import Dialog from '@/components/health-books/Dialog.vue';
    import {
        SERVICES_STATUS, SERVICES_STATUS_OPTIONS,
    } from '@/constants/services/status';

    export default {
        components: {
            ConfirmDialog,
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
            ...mapState('health-book', ['healthBooks', 'healthBookSelected']),
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
            ...mapActions('health-book', ['selectedHealthBook']),
            handleRowClick(row) {
                this.$refs.dialog.open(row);
            },
            onSelectChange(selectedRowKeys) {
                this.selectedBook(selectedRowKeys);
            },
            async confirmDelete() {
                try {
                    await this.$api.healthBooks.delete(this.selectedDelete);
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
