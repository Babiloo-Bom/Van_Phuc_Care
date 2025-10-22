<template>
    <div>
        <div class="card">
            <div class="flex justify-between items-center flex-wrap gap-5">
                <ct-page-header text="Danh sách Phản hồi" />
                <button @click="$refs.feedbackDialog.open()">
                    <a-button type="primary">
                        <i class="fas fa-plus mr-2" /> Thêm Phản hồi
                    </a-button>
                </button>
            </div>
            <FeedbackTable
                class="mt-4"
                :feedbacks="feedbacks"
                :loading="loading"
                :pagination="pagination"
            />
            <FeedbackDialog ref="feedbackDialog" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import FeedbackTable from '@/components/feedbacks/Table.vue';
    import FeedbackDialog from '@/components/feedbacks/Dialog.vue';

    export default {
        components: {
            FeedbackTable,
            FeedbackDialog,
        },
        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
            };
        },
        computed: {
            ...mapState('feedbacks', ['feedbacks', 'pagination']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Phản hồi',
                link: '/feedbacks',
            }]);
        },

        methods: {

            async fetchData() {
                try {
                    this.loading = true;
                    if (this.feedbacks.length === 0) {
                        await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, createdBy: 'admin' });
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Phản hồi',
            };
        },
    };
</script>
