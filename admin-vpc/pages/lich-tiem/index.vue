<template>
    <div>
        <div class="card mb-4">
            <div class="flex justify-between items-end">
                <ScheduleVaccinsFilter />
                <div class="flex items-center gap-4">
                    <a-button type="primary" class="!flex items-center gap-2 justify-center" @click="$refs.dialog.open()">
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
                        {{ 'Tạo mới' }}
                    </a-button>
                </div>
            </div>
        </div>
        <div class="card">
            <Table
                :schedules="schedules"
                :loading="loadingTable"
            />
            <ct-pagination :data="pagination" />
        </div>
        <Dialog ref="dialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import Table from '@/components/schedule-vaccins/Table.vue';
    import Dialog from '@/components/schedule-vaccins/Dialog.vue';
    import ScheduleVaccinsFilter from '@/components/schedule-vaccins/Filter.vue';

    export default {
        layout: 'account',
        components: {
            Table,
            Dialog,
            ScheduleVaccinsFilter,
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
            ...mapState('schedule-vaccins', ['schedules', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('schedule-vaccins/fetchAll', { ...this.$route.query });
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
                label: 'Lịch tiêm',
                link: '/lich-tiem',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('schedule-vaccins/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Lịch tiêm',
            };
        },
    };
</script>
