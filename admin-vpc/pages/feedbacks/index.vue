<template>
    <div>
        <div class="card mb-4">
            <div class="flex justify-between items-end">
                <FeedbacksFilter />
            </div>
        </div>
        <div class="card">
            <Table
                :data="feedbacks"
                :loading="loading || loadingTable"
            />
            <ct-pagination :data="pagination" />
        </div>
        <Dialog ref="dialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import Table from '@/components/feedbacks/Table.vue';
    import Dialog from '@/components/feedbacks/Dialog.vue';
    import FeedbacksFilter from '@/components/feedbacks/Filter.vue';

    export default {
        components: {
            Table,
            Dialog,
            FeedbacksFilter,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
                loadingTable: false,
            };
        },

        computed: {
            ...mapState('feedbacks', ['feedbacks', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, createdBy: 'customer' });
                    this.loadingTable = false;
                    if (this.$route.query) {
                        this.search = true;
                    } else {
                        this.search = false;
                    }
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Phản hồi & Đánh giá',
                link: '/feedbacks',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, createdBy: 'customer' });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Phản hồi & Đánh giá',
            };
        },
    };
</script>
