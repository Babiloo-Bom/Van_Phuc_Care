<template>
    <div>
        <div class="card mb-4">
            <h1>OK</h1>
        </div>
    </div>
</template>

<script>
    export default {
        layout: 'academy',
        components: {
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
        },

        watch: {
            '$route.query': {
            },
        },

        mounted() {
        },

        methods: {
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
                title: 'Workflow create',
            };
        },
    };
</script>
