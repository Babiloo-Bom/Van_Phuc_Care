<template>
    <a-drawer
        placement="right"
        :visible="visible"
        width="600px"
        :mask-closable="true"
        @close="close"
    >
        <div class="min-h-[65px] py-3 px-4 border-b border-[#ececec]">
            <div>
                <h6 class="m-0 font-bold text-[18px]">
                    {{ `Ticket ${ticket._id}` }}
                </h6>
                <p class="m-0">
                    Ngày tạo: {{ ticket.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}
                </p>
            </div>
        </div>
        <div class="comment-ticket">
            <div class="flex items-stretch justify-start gap-2 flex-col">
                <div v-if="comments.length" class="pb-4 h-[calc(100vh - 300px)] overflow-auto flex flex-col-reverse">
                    <Comments v-for="record in comments" :key="`comments_${record._id}`" :data="record" />
                </div>
                <div class="absolute bottom-0 bg-[#fff]">
                    <vue-editor v-model="comment" />
                    <div class="flex items-center justify-end">
                        <a-button
                            :loading="loading"
                            type="primary"
                            class="!mt-2"
                            @click="submit()"
                        >
                            <svg
                                v-if="!loading"
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="m9.51 4.23 8.56 4.28c3.84 1.92 3.84 5.06 0 6.98l-8.56 4.28c-5.76 2.88-8.11.52-5.23-5.23l.87-1.73c.22-.44.22-1.17 0-1.61l-.87-1.74C1.4 3.71 3.76 1.35 9.51 4.23ZM5.44 12h5.4"
                                stroke="#fff"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import { mapState } from 'vuex';
    import Comments from '@/components/health-books/Comments.vue';

    export default {
        components: {
            Comments,
        },

        data() {
            return {
                visible: false,
                loading: false,
                lesson: null,
                action: null,
                emptyData: false,
                ticket: {},
                loadingComment: false,
                comment: '',
            };
        },

        computed: {
            ...mapState('tickets/comments', ['comments']),
        },
        methods: {
            _isEmpty,
            async fetchCommunicates() {
                try {
                    this.loadingComment = true;
                    await this.$store.dispatch('tickets/comments/fetchAll', {
                        targetId: this.ticket._id,
                    });
                } catch (error) {
                    this.emptyData = true;
                } finally {
                    this.loadingComment = false;
                }
            },

            async open(record) {
                this.visible = true;
                this.ticket = record;
                this.fetchCommunicates();
            },

            close() {
                this.visible = false;
            },
            async submit() {
                try {
                    this.loading = true;
                    await this.$api.comments.create({
                        content: this.comment,
                        targetId: this.ticket._id,
                    });
                    this.comment = '';
                    this.fetchCommunicates();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="scss">
.ant-form-item-children, .ant-input-number {
    @apply block w-full
}
.ant-drawer-body {
    padding: 4px;
}
.ant-drawer-content-wrapper {
    max-width: 100%;
}
.comment-ticket {
    .ql-editor {
        max-height: 80px !important;
        min-height: 80px !important;
    }
}
</style>
