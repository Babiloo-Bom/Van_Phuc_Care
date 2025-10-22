<template>
    <div>
        <div class="card mb-4">
            <div class="flex justify-between items-end">
                <HealthBooksFilter />
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
                :data="books"
                :loading="loading || loadingTable"
            />
            <ct-pagination :data="pagination" />
        </div>
        <Dialog ref="dialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from 'moment';
    import { mapDataFromOptions } from '@/utils/data';
    import Table from '@/components/health-books/Table.vue';
    import Dialog from '@/components/health-books/Dialog.vue';
    import HealthBooksFilter from '@/components/health-books/Filter.vue';

    export default {
        layout: 'account',
        components: {
            Table,
            Dialog,
            HealthBooksFilter,
        },

        async fetch() {
            if (!this.$route.query.date) {
                this.$router.push({ query: { date: moment().format('DD/MM/YYYY') } });
            } else {
                await this.fetchData();
            }
        },
        data() {
            return {
                loading: false,
                loadingTable: false,
            };
        },

        computed: {
            ...mapState('health-book', ['books', 'pagination']),
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('health-book/fetchAll', { ...this.$route.query });
                    this.loadingTable = false;
                    if (this.$route.query) {
                        this.search = true;
                    } else {
                        this.search = false;
                    }
                    this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                        label: `Sổ sức khỏe điện tử (${this.$route.query.date})`,
                        link: '/',
                    }]);
                },
            },
        },
        mounted() {
            // this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
            //     label: `Sổ sức khỏe điện tử (${this.$route.query.date})`,
            //     link: '/',
            // }]);
            // const ws = new WebSocket('ws://api.gensi.vn');
            // ws.onopen = () => {
            //     console.log('WebSocket connection opened');
            // };

            // ws.onclose = () => {
            //     console.log('WebSocket connection closed');
            // };

            // ws.onerror = (error) => {
            //     console.error('WebSocket error:', error);
            // };
            // ws.onmessage = (event) => {
            //     const data = JSON.parse(event.data);
            //     this.showNotification(data);
            // };
        },

        methods: {
            mapDataFromOptions,
            showNotification(data) {
                console.log(data);
                // eslint-disable-next-line no-new
                new Notification('Database Change', { body: data });
                // Display browser notification or update UI
                // Example:
                // new Notification('Database Change', { body: `Data: ${data}` });
            },

            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('health-book/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            requestNotificationPermission() {
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission();
                }
            },
        },

        head() {
            return {
                title: 'Sổ sức khỏe điện tử',
            };
        },
    };
</script>
