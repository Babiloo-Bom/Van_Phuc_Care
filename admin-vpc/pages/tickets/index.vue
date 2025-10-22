<template>
    <div v-if="!checking && !loading">
        <div v-if="tickets?.length || search">
            <div class="card mb-4">
                <div class="flex justify-between items-end">
                    <TicketsFilter />
                    <div class="flex items-center gap-4">
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
            </div>
            <div class="card">
                <Table
                    :data="tickets"
                    :loading="loading || loadingTable"
                />
                <ct-pagination :data="pagination" />
            </div>
            <Dialog ref="dialog" />
        </div>
        <div v-else>
            <Empty />
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full min-h-[450px]">
        <span class="genstech-loader" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import Empty from '@/components/tickets/Empty.vue';
    import Table from '@/components/tickets/Table.vue';
    import Dialog from '@/components/tickets/Dialog.vue';
    import TicketsFilter from '@/components/tickets/Filter.vue';

    export default {
        components: {
            Table,
            Dialog,
            Empty,
            TicketsFilter,
        },

        async fetch() {
            this.checking = true;
            await this.fetchData();
            this.checking = false;
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
            ...mapState('tickets', ['tickets', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('tickets/fetchAll', { ...this.$route.query });
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
                label: 'Support tickets',
                link: '/tickets',
            }]);
        },

        methods: {
            mapDataFromOptions,

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('tickets/fetchAll', { ...this.$route.query });
                    if (this.$route.query) {
                        this.search = true;
                    } else {
                        this.search = false;
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
                title: 'Support tickets',
            };
        },
    };
</script>
