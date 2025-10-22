<template>
    <a-spin :spinning="loading">
        <div class="xl:max-w-[80%] w-full mx-auto">
            <div class="flex justify-between items-center bg-[#f1f1f1] py-3 px-3 rounded-t-sm">
                <div class="flex items-center gap-3">
                    <span class="bg-prim-100 text-white rounded-full text-center text-lg w-8 h-8 leading-8">1</span>
                    <h2 class="text-xl mb-0">
                        {{ faq.title }}
                    </h2>
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-3">
                        <span class="font-semibold">{{ statusLabel }}</span>
                        <a-switch
                            :checked="isActive"
                            :loading="loading"
                            @change="changeStatus"
                        />
                    </div>
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mr-0" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item @click="openDetailDialog">
                                Chỉnh sửa
                            </a-menu-item>
                            <a-menu-item class="!text-danger-100" @click="refs.ConfirmDialog.open()">
                                Xóa
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </div>
            <div
                class="py-3 px-5 rounded-b-md border-x-[2px] border-b-[2px] border-solid border-gray-10"
                v-html="faq.content"
            />
        </div>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa câu hỏi này ?"
            content="Bạn chắc chắn xóa câu hỏi này chứ, lưu ý thao tác này không thể khôi phục"
            @confirm="deleteQuetion"
        />
    </a-spin>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
        },

        props: {
            faq: {
                type: Object,
                default: () => {},
            },
            loading: {
                type: Boolean,
            },
        },

        data() {
            return {
            };
        },

        computed: {
            isActive() {
                return _cloneDeep(this.faq.status) === 'active';
            },
            statusLabel() {
                return _cloneDeep(this.faq.status) === 'active' ? 'Đang hiển thị' : 'Bị ẩn';
            },
        },

        methods: {
            openDetailDialog() {
                this.$emit('open');
            },

            async deleteQuetion() {
                try {
                    await this.$api.faqs.delete(this.faq._id);
                    this.$message.success('Xóa câu hỏi thành công');
                    this.$nuxt.refresh();
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async changeStatus() {
                try {
                    await this.$api.faqs.update(
                        this.faq._id, {
                            ...this.faq,
                            status: this.faq.status === 'active' ? 'inactive' : 'active',
                        },
                    );
                    this.$message.success('Thay đổi trang thái thành công');
                    this.$nuxt.refresh();
                } catch (error) {
                    this.$handleError(error);
                }
            },
        },
    };
</script>
