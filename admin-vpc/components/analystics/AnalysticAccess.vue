<template>
    <div class="p-4 pb-2 rounded-md min-h-full">
        <div v-if="loading">
            <Skeleton />
        </div>
        <div v-else>
            <Chart :data-chart="[40, 20, 20]" :labels="['Máy tính', 'Laptop', 'Điện thoại']" />
        </div>
    </div>
</template>

<script>
    import _sum from 'lodash/sum';
    import Skeleton from '@/components/analystics/Skeleton.vue';
    import Chart from '@/components/shared/Chart.vue';

    export default {
        components: {
            Skeleton,
            Chart,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                data: [],
            };
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
        },

        methods: {
            _sum,
            async fetchData() {
                try {
                    this.loading = true;
                    const { data: { data } } = await this.$api.analystics.getAnalysticAcess(this.$route.query);
                    this.data = data;
                    this.loading = false;
                } catch (error) {
                    this.loading = false;
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
<style scoped lang="scss">
.card-analystic {
    background-color:#fff;
    box-shadow: 0rem 0.125rem 0.25rem rgba(31,33,36,.1),0rem 0.0625rem 0.375rem rgba(31,33,36,.05);
}
.title-post-analystic {
 overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical
}

</style>
