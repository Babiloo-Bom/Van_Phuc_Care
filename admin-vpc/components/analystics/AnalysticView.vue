<template>
    <div>
        <div class="p-4 pb-2 rounded-md card">
            <div class="flex items-start align-center justify-between">
                <div>
                    <h4 class="font-bold text-[14px] m-0 ">
                        Total Sale
                    </h4>
                    <p class="text-[20px] font-bold mt-1 mb-2">
                        {{ _sum(data.map(e => e.value)).toLocaleString('de-DE') }}
                    </p>
                </div>
            </div>
            <div v-if="loading">
                <Skeleton />
            </div>
            <div v-else>
                <LineChart
                    :data="data.map(e => e.value)"
                    :label="data.map(e => e.time)"
                    text="Người xem"
                    :max="Math.max(...(data.map(e => e.value)))"
                />
                <!-- <div class="min-h-[300px] flex items-center justify-center">
                    <p class="text-[14px] text-[#616161]">
                        Chưa có dữ liệu.
                    </p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import _sum from 'lodash/sum';
    import Skeleton from '@/components/dashboard/Skeleton.vue';
    import LineChart from '@/components/dashboard/LineChart.vue';

    export default {
        components: {
            Skeleton,
            LineChart,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                data: [
                    { time: '03/11/2023', value: 120000 },
                    { time: '03/12/2023', value: 130000 },
                    { time: '03/13/2023', value: 150000 },
                    { time: '03/14/2023', value: 118000 },
                    { time: '03/15/2023', value: 122000 },
                    { time: '03/16/2023', value: 128000 },
                    { time: '03/17/2023', value: 135000 },
                    { time: '03/18/2023', value: 140000 },
                    { time: '03/19/2023', value: 145000 },
                    { time: '03/20/2023', value: 138000 },
                    { time: '03/21/2023', value: 132000 },
                    { time: '03/22/2023', value: 126000 },
                    { time: '03/23/2023', value: 124000 },
                    { time: '03/24/2023', value: 121000 },
                    { time: '03/25/2023', value: 123000 },
                ],

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
                    // const { data: { data } } = await this.$api.analystics.getViews(this.$route.query);
                    // this.data = data;
                    this.loading = false;
                } catch (error) {
                    this.$handleError(error);
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
.row-post:hover a {
    color: #1351d8 !important;
}

</style>
