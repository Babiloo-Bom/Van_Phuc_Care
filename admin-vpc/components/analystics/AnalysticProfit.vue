<template>
    <div>
        <div class="card rounded-sm grid grid-cols-4 h-full">
            <div class="flex flex-col justify-between px-3">
                <div>
                    <h3 class="mb-1">
                        Profit
                    </h3>
                    <h2 class="font-bold text-[21px] mt-3">
                        $105,000.00
                    </h2>
                    <div class="flex items-center gap-2 text-prim-100">
                        <span class="flex flex-col items-center">
                            <i class="fas fa-chevron-up" />
                            <i class="fas fa-caret-up relative -top-2" />
                        </span>
                        <h4 class="font-semibold text-prim-100">
                            $1,400.00
                        </h4>
                    </div>
                    <p>Average per month</p>
                </div>
                <div class="flex justify-center">
                    <a-button class="!flex items-center justify-center gap-3">
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            d="M9 11v6l2-2M9 17l-2-2"
                            stroke="#484848"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /><path
                            d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
                            stroke="#484848"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /><path
                            d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
                            stroke="#484848"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /></svg>
                        <span class="font-[400] text-[#484848]">Download Report</span>
                    </a-button>
                </div>
            </div>
            <div class="col-span-3">
                <VueApexCharts
                    type="area"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                />
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        components: {
        },

        data() {
            return {
                series: [{
                    name: 'series2',
                    data: [11, 32, 45, 32, 34, 52, 41],
                }],
                chartOptions: {
                    chart: {
                        height: 350,
                        type: 'area',
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2,
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: ['2018-09-19T00:00:00.000Z', '2018-09-19T01:30:00.000Z', '2018-09-19T02:30:00.000Z', '2018-09-19T03:30:00.000Z', '2018-09-19T04:30:00.000Z', '2018-09-19T05:30:00.000Z', '2018-09-19T06:30:00.000Z'],
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm',
                        },
                    },
                },
            };
        },
    };
</script>
