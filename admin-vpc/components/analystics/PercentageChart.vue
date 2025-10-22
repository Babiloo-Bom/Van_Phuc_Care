<template>
    <div class=" bg-white rounded-sm h-[calc(100%-16px)] flex items-center justify-center relative">
        <VueApexCharts
            type="donut"
            width="346"
            :options="chartOptions"
            :series="series"
        />
        <div
            v-if="series?.length > 0"
            class="absolute text-center w-[120px]"
            :style="`transform: translate(-50%, -50%);top: 49%; left: ${ values.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0) < 1000 ? '34' : '37'}%;`"
        >
            <span
                class="font-bold"
                style="font-size:24px"
            >{{ formatNumber(series.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0)) }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
            },
            legendPosition: {
                type: String,
            },
            labels: {
                type: Array,
                default: () => [],
            },
            values: {
                type: Array,
                default: () => [],
            },
            name: {
                type: String,
            },
        },
        data() {
            return {
                series: this.values || [0, 0],
                chartOptions: {
                    chart: {
                        type: 'donut',
                    },
                    legend: {
                        position: this.legendPosition || 'bottom',
                    },
                    labels: this.labels || ['New customer', 'Returning'],
                    theme: {
                        monochrome: {
                            enabled: true,
                            color: '#1351d8',
                        },
                    },

                    plotOptions: {
                        pie: {
                            offsetY: 0,
                            offsetX: 0,
                            // dataLabels: {
                            //     offset: 0,
                            //     minAngleToShowLabel: 10,
                            // },
                            dataLabels: {
                                minAngleToShowLabel: 10,
                                formatter(val, opts) {
                                    const index = opts.seriesIndex;
                                    return `${this.labels[index]} -  record`;
                                },
                            },
                        },
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 300,
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    }],
                },

            };
        },
        mounted() {
            const legendSeriesElements = document.querySelectorAll(`.${this.name} .apexcharts-legend-series`);
            legendSeriesElements.forEach((legendSeries, index) => {
                legendSeries.insertAdjacentHTML('afterend', `<span style="margin-bottom: 14px;font-size: 12px;font-weight: 700;margin-left: 19px;">${this.formatNumber(this.values[index])}</span>`);
            });
        },
        methods: {
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
