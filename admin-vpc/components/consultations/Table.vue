<template>
    <div>
        <a-table
            :data-source="consultations"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row._id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="STT"
                align="center"
                :width="40"
                :custom-render="
                    (text, record, index) =>index+1
                "
            />
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
                key="fullname"
                title="Họ và tên"
                :width="150"
                align="center"
                data-index="fullname"
            >
                <template #default="fullname">
                    <span>{{ fullname }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="phone"
                title="Số điện thoại"
                :width="120"
                align="center"
                data-index="phone"
            >
                <template #default="phone">
                    <p v-if="phone">
                        {{ phone }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="email"
                title="Email"
                :width="150"
                align="center"
                data-index="email"
            >
                <template #default="email">
                    <p v-if="email">
                        {{ email }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="symptom"
                title="Triệu chứng"
                :width="150"
                align="center"
                data-index="symptom"
            >
                <template #default="symptom">
                    <div v-if="symptom" class="flex gap-2 items-center">
                        <p class="text-limit">
                            {{ symptom }}
                        </p>
                        <a-tooltip v-if="symptom.length > 40" placement="top">
                            <template #title>
                                <span>{{ symptom }}</span>
                            </template>
                            <a-button type="primary" shape="circle" class="!flex items-center justify-center !w-[20px] !min-w-[20px] !h-[20px]">
                                <svg
                                    class="transition-all duration-300 m-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm-.75 6c0-.41.34-.75.75-.75s.75.34.75.75v5c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8Zm1.67 8.38c-.05.13-.12.23-.21.33-.1.09-.21.16-.33.21-.12.05-.25.08-.38.08s-.26-.03-.38-.08-.23-.12-.33-.21c-.09-.1-.16-.2-.21-.33A.995.995 0 0 1 11 16c0-.13.03-.26.08-.38s.12-.23.21-.33c.1-.09.21-.16.33-.21a1 1 0 0 1 .76 0c.12.05.23.12.33.21.09.1.16.21.21.33.05.12.08.25.08.38s-.03.26-.08.38Z" fill="#fff"/></svg>
                            </a-button>
                        </a-tooltip>
                    </div>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="problemAdvice"
                title="Vấn đề cần tư vấn"
                :width="150"
                align="center"
                data-index="problemAdvice"
            >
                <template #default="problemAdvice">
                    <p v-if="problemAdvice">
                        {{ problemAdvice }}
                    </p>
                    <p v-else>
                        {{ '--' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="internalResponse"
                title="Phản hồi nội bộ"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <a-select
                        :value="record.internalResponse"
                        style="width: 160px"
                        :options="internalResponse"
                        @change="(value) => updateInternalResponse(value, record._id)"
                    />
                </template>
            </a-table-column>
            <a-table-column
                key="customerResponse"
                title="Phản hồi khách hàng"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <a-select
                        :value="record.customerResponse"
                        style="width: 160px"
                        :options="customerResponse"
                        @change="(value) => updateCustomerResponse(value, record._id)"
                    />
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                title="Thao tác"
                align="center"
                :width="100"
                fixed="right"
            >
                <template #default="consultation">
                    <div class="flex gap-3">
                        <a-button
                            type="primary"
                            class="!bg-prim-100 !border-transparent !leading-[10px]"
                            shape="circle"
                            @click="() => {
                                consultationSelected = consultation,
                                $refs.Dialog.open(consultation)
                            }"
                        >
                            <i class="fas fa-pencil-alt" />
                        </a-button>
                        <a-button
                            type="primary"
                            shape="circle"
                            class="!bg-prim-100 !border-transparent !leading-[10px]"
                            @click="() => {
                                consultationSelected = consultation,
                                $refs.ConfirmDialog.open()}"
                        >
                            <i class="fas fa-trash" />
                        </a-button>
                    </div>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <Dialog ref="Dialog" />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/consultations/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },

        props: {
            consultations: {
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
                consultationSelected: null,
                internalResponse: [
                    {
                        value: 'notReceived',
                        label: 'Chưa tiếp nhận',
                    },
                    {
                        value: 'received',
                        label: 'Đã tiếp nhận',
                    },
                    {
                        value: 'skip',
                        label: 'Bỏ qua',
                    },
                ],
                customerResponse: [
                    {
                        value: 'repliedEmail',
                        label: 'Đã phản hồi qua Email',
                    },
                    {
                        value: 'repliedPhone',
                        label: 'Đã phản hồi qua điện thoại',
                    },
                    {
                        value: 'unconnected',
                        label: 'Không liên lạc được',
                    },
                    {
                        value: 'successed',
                        label: 'Hẹn lịch thành công',
                    },
                ],
            };
        },
        computed: {
        },

        methods: {
            async confirmDelete() {
                try {
                    await this.$api.consultations.delete(this.consultationSelected._id);
                    this.$message.success('Xóa thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
            async updateInternalResponse(value, id) {
                await this.$api.consultations.update(id, { internalResponse: value });
                this.$message.success('Cập nhật thành công');
                await this.$store.dispatch('consultations/fetchAll', this.$route.query);
            },
            async updateCustomerResponse(value, id) {
                await this.$api.consultations.update(id, { customerResponse: value });
                this.$message.success('Cập nhật thành công');
                await this.$store.dispatch('consultations/fetchAll', this.$route.query);
            },
        },
    };
</script>
<style>
.text-limit {
   overflow: hidden;
   display: -webkit-box;
   -webkit-line-clamp: 2;
           line-clamp: 2;
   -webkit-box-orient: vertical;
}
</style>
