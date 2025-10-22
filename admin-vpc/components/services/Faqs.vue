<template>
    <div>
        <div class="mb-6 flex items-center flex-wrap gap-2 justify-between">
            <h3 class="mb-0 text-2xl">
                Danh sách câu hỏi
            </h3>
            <a-button
                type="primary"
                @click="() => {
                    $refs.faqDialog?.open(null)
                }"
            >
                Thêm bản ghi
            </a-button>
        </div>
        <div v-if="!loading">
            <div v-if="faqs?.length" class=" bg-white rounded-sm">
                <a-table
                    :data-source="faqs"
                    :pagination="false"
                    :scroll="{ x: 1000 }"
                    :row-key="(row) => row._id"
                    :loading="loadingTable"
                >
                    <a-table-column
                        key="index"
                        title="STT"
                        align="center"
                        :width="60"
                        :custom-render="
                            (text, record, index) =>index + 1"
                    />
                    <a-table-column
                        key="title"
                        title="Tiêu đề"
                        :width="120"
                    >
                        <template #default="record">
                            <span class="line-clamp-2">{{ record.title }}</span>
                        </template>
                    </a-table-column>
                    <a-table-column
                        key="content"
                        title="Nội dung"
                        :width="120"
                    >
                        <template #default="record">
                            <span class="line-clamp-2" v-html="record.content" />
                        </template>
                    </a-table-column>
                    <a-table-column
                        key="status"
                        title="Hiển thị"
                        :width="90"
                        align="center"
                    >
                        <template #default="faq">
                            <a-switch
                                :default-checked="faq.status === 'active' ? true : false"
                                @click="updateStatus(faq)"
                                @change="onChange"
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
                        <template #default="faq">
                            <a-button
                                type="primary"
                                shape="circle"
                                @click="() => {
                                    faqSelected = faq,
                                    $refs.faqDialog.open(faq)
                                }"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="css-i6dzq1 mx-auto"
                                ><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            </a-button>
                            <a-button
                                type="primary"
                                shape="circle"
                                @click="() => {
                                    faqSelected = faq,
                                    $refs.confirmDelete.open(faq)
                                }"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="css-i6dzq1 mx-auto"
                                ><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line
                                    x1="10"
                                    y1="11"
                                    x2="10"
                                    y2="17"
                                /><line
                                    x1="14"
                                    y1="11"
                                    x2="14"
                                    y2="17"
                                /></svg>
                            </a-button>
                        </template>
                    </a-table-column>
                </a-table>
                <ConfirmDialog
                    ref="confirmDelete"
                    title="Xóa phản hồi"
                    content="Bạn chắc chắn xóa bản ghi này ?"
                    @confirm="confirmDelete"
                />
            </div>
            <a-empty v-else />
        </div>
        <div v-else class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
        <FaqDialog ref="faqDialog" :service="service" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import FaqDialog from '@/components/services/FaqDialog.vue';
    import _cloneDeep from 'lodash/cloneDeep';

    export default {
        components: {
            ConfirmDialog,
            FaqDialog,
        },

        props: {
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                faqSelected: null,
                statusWitch: null,
                loadingTable: null,
            };
        },

        computed: {
            ...mapState('faqs', ['faqs']),
            ...mapState('services', ['service']),
        },

        watch: {
            loading() {
                this.loadingTable = this.loading ? _cloneDeep(this.loading) : false;
            },
        },

        methods: {
            async updateStatus(faq) {
                this.faqSelected = faq;
                try {
                    this.loadingTable = true;
                    this.$api.faqs.update(this.faqSelected._id, { status: this.statusWitch ? 'active' : 'inactive' });
                    this.statusWitch = null;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingTable = true;
                }
            },

            onChange(faq) {
                this.statusWitch = faq;
            },

            async confirmDelete() {
                try {
                    this.loadingTable = true;
                    await this.$api.faqs.delete(this.faqSelected._id);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('faqs/fetchAll', { ...this.$route.query, serviceId: this.service._id });
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingTable = false;
                }
            },
        },
    };
</script>
