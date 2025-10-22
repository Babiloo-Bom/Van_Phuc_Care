<template>
    <div>
        <div class="card mb-4">
            <div class="flex justify-between items-end">
                <ServicesFilter />
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
                :registers="registers"
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
    import Table from '@/components/registers/Table.vue';
    import Dialog from '@/components/registers/Dialog.vue';
    import ServicesFilter from '@/components/registers/Filter.vue';

    export default {
        components: {
            Table,
            Dialog,
            ServicesFilter,
        },

        data() {
            return {
                loading: false,
                loadingTable: false,
                search: false,
                checking: false,
                lectureEmit: null,
                contractEmit: null,
            };
        },

        computed: {
            ...mapState('registers', ['registers', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('registers/fetchAll', { ...this.$route.query });
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
                label: 'Hợp đồng',
                link: '/dich-vu/registered',
            }]);
        },

        methods: {
            mapDataFromOptions,
        },

        head() {
            return {
                title: 'Hợp đồng',
            };
        },
    };
</script>
