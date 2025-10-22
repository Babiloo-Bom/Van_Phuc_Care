<template>
    <div>
        <div class="card mb-4">
            <div class="flex justify-between items-end">
                <CoursesFilter />
                <div class="flex items-center gap-4">
                    <nuxt-link to="/khoa-hoc/tao-moi">
                        <a-button type="primary" class="!flex items-center gap-2 justify-center">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="m-0"
                            ><line
                                x1="12"
                                y1="5"
                                x2="12"
                                y2="19"
                            /><line
                                x1="5"
                                y1="12"
                                x2="19"
                                y2="12"
                            /></svg>
                            Thêm khóa học
                        </a-button>
                    </nuxt-link>
                </div>
            </div>
        </div>
        <div class="card">
            <Table
                :courses="courses"
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
    import Table from '@/components/courses/Table.vue';
    import Dialog from '@/components/courses/Dialog.vue';
    import CoursesFilter from '@/components/services/Filter.vue';

    export default {
        layout: 'academy',
        components: {
            Table,
            Dialog,
            CoursesFilter,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
                loadingTable: false,
                search: false,
                checking: false,
            };
        },

        computed: {
            ...mapState('courses', ['courses', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('courses/fetchAll', { ...this.$route.query });
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
                label: 'Danh sách khóa học',
                link: '/khoa-hoc',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('courses/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Danh sách khóa học',
            };
        },
    };
</script>
