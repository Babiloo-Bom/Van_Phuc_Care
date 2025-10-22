<template>
    <div>
        <a-table
            :data-source="feedbacks"
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
                    (text, record, index) =>index + 1"
            />
            <a-table-column
                key="avatar"
                title="Ảnh đại diện"
                :width="120"
            >
                <template #default="record">
                    <a-avatar
                        v-if="record.avatar"
                        :src="record.avatar"
                        alt=""
                        class="rounded-full w-16 h-16 object-cover"
                    />
                    <a-avatar v-else class="rounded-full w-16 h-16 object-cover">
                        {{ record.fullname }}
                    </a-avatar>
                </template>
            </a-table-column>
            <a-table-column
                key="fullname"
                title="Tên hiển thị"
                :width="150"
                data-index="fullname"
            />
            <a-table-column
                key="content"
                title="Nội dung"
                :width="300"
                data-index="content"
            />
            <a-table-column
                key="status"
                title="Hiển thị"
                :width="120"
                align="center"
            >
                <template #default="feedback">
                    <a-switch
                        :default-checked="feedback.status === 'active' ? true : false"
                        @click="updateStatus(feedback)"
                        @change="onChange"
                    />
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                data-index="createdAt"
                title="Ngày tạo"
                align="center"
                :width="130"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('HH:mm dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                title="Thao tác"
                align="center"
                :width="100"
                fixed="right"
            >
                <template #default="feedback">
                    <a-button
                        type="primary"
                        shape="circle"
                        @click="() => {
                            feedbackSelected = feedback,
                            $refs.feedbackDialog.open(feedback)
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
                            feedbackSelected = feedback,
                            $refs.confirmDelete.open()}"
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
            :loading="loadingDelete"
            title="Xóa phản hồi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <FeedbackDialog ref="feedbackDialog" :feedback="feedbackSelected" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import FeedbackDialog from '@/components/feedbacks/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            FeedbackDialog,
        },

        props: {
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
                feedbackSelected: null,
                statusWitch: null,
                loadingDelete: false,
            };
        },
        computed: {
            ...mapState('feedbacks', ['feedbacks']),
        },

        watch: {
        },
        methods: {
            async updateStatus(feedback) {
                this.feedbackSelected = feedback;
                try {
                    this.$api.feedbacks.update(this.feedbackSelected._id, { status: this.statusWitch ? 'active' : 'inactive' });
                    this.statusWitch = null;
                } catch (e) {
                    this.$handleError(e);
                }
            },
            onChange(feedback) {
                this.statusWitch = feedback;
            },
            async confirmDelete() {
                try {
                    this.loadingDelete = true;
                    await this.$api.feedbacks.delete(this.feedbackSelected._id);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, serviceId: this.service._id });
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingDelete = false;
                }
            },
        },
    };
</script>
