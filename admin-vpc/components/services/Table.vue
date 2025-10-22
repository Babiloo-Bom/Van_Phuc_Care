<template>
    <div class="table-data">
        <a-table
            :data-source="services"
            :pagination="false"
            :scroll="{ x: 1000 }"
            :row-key="(row) => row._id"
            :loading="loading"
            :custom-row="customRow"
            class="cursor-pointer !text-[13px]"
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
                title="Khóa học"
                :width="120"
                align="left"
            >
                <template #default="record">
                    <p class="m-0">
                        {{ record.title }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="rate"
                title="Đánh giá"
                :width="80"
                align="center"
                data-index="rate"
            >
                <template #default="rate">
                    <p class="m-0">
                        {{ rate }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="reviews"
                title="Reviews"
                :width="80"
                align="center"
                data-index="reviews"
            >
                <template #default="reviews">
                    <p class="m-0">
                        {{ reviews }} reviews
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                data-index="status"
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
                :width="100"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('dd/MM/yyyy') }}
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
                                <nuxt-link
                                    :to="`/dich-vu/${scope.slug}`"
                                >
                                    Chi tiết dịch vụ
                                </nuxt-link>
                            </a-menu-item>
                            <a-menu-item class="!text-danger-100" @click="() => { $refs.ConfirmDialog.open(scope) }">
                                Xóa dịch vụ
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column> -->
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
    import Dialog from '@/components/services/Dialog.vue';
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
                selected: '',
                status: null,
                loading: false,
                rowSelection: [],
            };
        },
        computed: {
            ...mapState('services', ['services', 'serviceSelected']),
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
            ...mapActions('services', ['selectedService']),

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('services/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            customRow(row) {
                return {
                    on: {
                        click: () => this.$router.push(`/dich-vu/${row.slug}`),
                    },
                };
            },
            onSelectChange(selectedRowKeys) {
                this.selectedService(selectedRowKeys);
            },
            async confirmDelete() {
                try {
                    await this.$api.services.delete(this.serviceSelected._id);
                    this.$message.success('Xóa thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
            async updateShowService() {
                try {
                    this.$api.services.update(this.serviceSelected._id, { status: this.status });
                    this.status = null;
                } catch (e) {
                    this.$handleError(e);
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
