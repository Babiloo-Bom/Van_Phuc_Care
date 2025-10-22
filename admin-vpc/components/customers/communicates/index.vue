<template>
    <div class="flex items-stretch justify-start gap-2 flex-col">
        <div class="">
            <vue-editor v-model="comment" />
            <div class="flex items-center justify-end">
                <a-button
                    :loading="loadingSend"
                    type="primary"
                    class="!mt-2"
                    @click="submit()"
                >
                    <svg
                        v-if="!loadingSend"
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
        <div v-if="comments.length" class="mb-4 mt-4 pt-4 border-t-[1px] border-[#f2f2f2]">
            <Comments v-for="record in comments" :key="`comments_${record._id}`" :data="record" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { VueEditor } from 'vue2-editor';
    import Comments from '@/components/health-books/Comments.vue';

    export default {
        components: {
            Comments,
            VueEditor,
        },
        props: {
        },
        data() {
            return {
                loading: false,
                loadingSend: false,
                loadingComment: false,
                emptyData: false,
                loadingSave: false,
                loadingTimeline: false,
                comment: '',
                form: {
                },
                customToolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['image', 'code-block'],
                ],
                data: [],
                options: [],
                totalSpent: 0,
            };
        },
        computed: {
            ...mapState('customers', ['customer', 'transactions']),
            ...mapState('customers/comments', ['comments']),
        },
        mounted() {
            this.fetchCommunicates();
        },
        methods: {
            async fetchCommunicates() {
                try {
                    this.loadingComment = true;
                    await this.$store.dispatch('customers/comments/fetchAll', {
                        targetId: this.$route.params.id,
                    });
                } catch (error) {
                    this.emptyData = true;
                } finally {
                    this.loadingComment = false;
                }
            },

            async submit() {
                try {
                    this.loadingSend = true;
                    await this.$api.comments.create({
                        content: this.comment,
                        targetId: this.$route.params.id,
                    });
                    this.comment = '';
                    await this.fetchCommunicates();
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingSend = false;
                }
            },
        },
    };
</script>

<style lang="scss">
.detail-customer {
    button.back:hover {
        background-color: #e3e3e3 !important;
    }
}
.ql-snow .ql-toolbar button svg, .quillWrapper .ql-snow.ql-toolbar button svg {
    width: 16px !important;
    height: 16px !important;
}
.ql-toolbar.ql-snow {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.ql-container.ql-snow {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.ql-editor {
    min-height: 100px !important;
}
.ql-toolbar.ql-snow+.ql-container.ql-snow {
}
.quillWrapper .ql-snow.ql-toolbar {
    padding-top: 4px !important;
}
.quillWrapper .ql-snow.ql-toolbar .ql-formats {
    margin-bottom: 0 !important;
}
</style>
