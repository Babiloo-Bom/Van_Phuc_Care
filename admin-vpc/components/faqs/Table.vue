<template>
    <div>
        <a-table
            :data-source="faqs"
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
                :custom-render="(text, record, index) => index + 1"
            />
            <a-table-column
                key="faq"
                title="Câu hỏi"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.title }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="content"
                title="Câu trả lời"
                :width="100"
                align="center"
            >
                <template #default="record">
                    <span v-html="record.content" />
                </template>
            </a-table-column>
            <!-- <a-table-column
                key="status"
                title="Trạng thái"
                :width="150"
                align="center"
            >
                <template #default="record">
                    <span>{{ record.status }}</span>
                </template>
            </a-table-column> -->
            <a-table-column
                key="action"
                title="Thao tác"
                align="center"
                :width="100"
            >
                <template #default="record">
                    <div class="flex gap-3 items-center justify-center">
                        <a-button
                            type="primary"
                            class="!bg-prim-100 !border-transparent !leading-[10px]"
                            shape="circle"
                            @click="() => {
                                faqSelected = record,
                                $refs.Dialog.open(record)
                            }"
                        >
                            <i class="fas fa-pencil-alt" />
                        </a-button>
                        <a-button
                            type="primary"
                            shape="circle"
                            class="!bg-prim-100 !border-transparent !leading-[10px]"
                            @click="() => {
                                faqSelected = record,
                                $refs.confirm.open()}"
                        >
                            <i class="fas fa-trash" />
                        </a-button>
                    </div>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="confirm"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <Dialog ref="Dialog" />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/customer-cares/faqs/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },
        props: {
            faqs: {
                type: Array,
                default: () => [],
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
                faqSelected: null,
            };
        },
        computed: {
        },
        methods: {
            async confirmDelete() {
                try {
                    await this.$api.faqs.delete(this.faqSelected._id);
                    this.$message.success('Xóa thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
