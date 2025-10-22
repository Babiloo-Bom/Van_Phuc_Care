<template>
    <div class="">
        <div v-if="!loading">
            <div v-if="data?.length" class="">
                <div class=" overflow-auto">
                    <div v-for="(source, index) in (data || [])" :key="`source_${index}`" class="py-2 px-2">
                        <div class="flex items-center justify-between">
                            <p class="m-0">
                                <span class="capitalize">{{ source.slug[0] }}</span>{{ source.slug.substring(1) }}
                            </p>
                            <div class="flex items-center">
                                <div class="mr-2 flex items-end mb-[3px]">
                                    <svg
                                        v-if="handleCompare(source.count , source.countCompare).type === 'increase'"
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="#53c66e"
                                    ><path
                                        stroke="#53c66e"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="1.5"
                                        d="M18.07 9.57L12 3.5 5.93 9.57M12 20.5V3.67"
                                    /></svg>
                                    <svg
                                        v-else
                                        class="transition-all duration-300"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="#ff4d4f"
                                    ><path
                                        stroke="#ff4d4f"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="10"
                                        stroke-width="1.5"
                                        d="M18.07 14.43L12 20.5l-6.07-6.07M12 3.5v16.83"
                                    /></svg>
                                    <span :class="` -mb-[5px] ${handleCompare(source.count , source.countCompare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">{{ handleCompare(source.count , source.countCompare).value }}%</span>
                                </div>
                                <span
                                    class="font-bold min-w-[40px] text-right"
                                    style="border-left: 1px solid #dce1e5;
                        padding-left: 6px;
                        line-height: 14px;"
                                >{{ formatNumber(source.count) }}</span>
                            </div>
                        </div>
                        <a-progress
                            :percent="handlePercent(source.count)"
                            :show-info="false"
                            stroke-color="#1351d8"
                        />
                    </div>
                </div>
                <!-- <div class="!flex !items-center !justify-end">
                    <a-button type="link" class="!flex !items-center !justify-end gap-2 mt-4 !p-0">
                        <span>View detail</span>
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            stroke="#1351d8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="1.5"
                            d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"
                        /></svg>
                    </a-button>
                </div> -->
            </div>
            <div v-else class="flex items-center justify-center flex-col h-[300px]">
                <img class="w-[200px]" src="/images/not-chart.jpg" alt="/">
                <h5 class="font-[600] text-[16px] m-0">
                    No sessions
                </h5>
            </div>
        </div>
        <div v-else class="">
            <Skeleton />
        </div>
    </div>
</template>

<script>
    import Skeleton from '@/components/analystics/Skeleton.vue';

    export default {
        components: {
            Skeleton,
        },
        props: {
            title: {
                type: String,
            },
            data: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
            };
        },
        methods: {
            handlePercent(value) {
                return (value * 100) / this.data.reduce((accumulator, record) => accumulator + record.count, 0);
            },
            handleCompare(value, countCompare) {
                const difference = value - countCompare;
                return {
                    type: difference >= 0 ? 'increase' : 'decrease',
                    value: (((difference * 100) / (countCompare || 1)).toFixed()).replace('-', ''),
                };
            },
            formatNumber(number) {
                if (number < 1000) {
                    return number;
                } if (number < 1000000) {
                    return `${(Math.round((number / 1000) * 10) / 10).toFixed(1)}k`;
                }
                return `${(Math.round((number / 1000000) * 10) / 10).toFixed(1)}M`;
            },
        },
    };
</script>
<style scoped>
</style>
