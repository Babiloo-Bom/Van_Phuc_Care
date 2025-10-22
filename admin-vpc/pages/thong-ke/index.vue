<template>
    <div>
        <div
            class="!mx-auto block p-3 pt-0 w-full h-full"
            style="position: absolute;
                    background: #00000075;
                    z-index: 999;
                    width: 100%;
                    transform: translate(-50%, 0);
                    left: 50%;"
        />
        <div
            class="!mx-auto block fixed p-3 pt-0 w-fit h-fit"
            style="
                    z-index: 9999;
                    transform: translate(-50%, 0);
                    top: 40%;
                    left: 57%;"
        >
            <a-button
                class="!flex items-center justify-center gap-2 !h-14 !my-3 !px-6 mx-auto cursor-pointer !w-fit card !rounded-full"
                @click="windowOpenLink"
            >
                <img class="w-8 h-8" src="https://cdn.synck.io.vn/favicon.png" alt="google">
                <span class="font-bold text-[16px]">Upgrade System</span>
            </a-button>
            <p class="!text-[#fff] text-[12px]">
                <i>*Thông tin mang tính chất minh họa</i>
            </p>
        </div>
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 traffic-overview h-screen overflow-hidden">
            <div class="flex items-center justify-start gap-3 mt-4">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                        <h4 class="m-0 text-[20px] font-bold">
                            {{ `Thống kê` }}
                        </h4>
                    </div>
                    <div class="w-[300px]">
                        <DateRange
                            :default-value="[moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]"
                            query=""
                            prefix="from"
                            suffix="to"
                            value-format="MMM DD, YYYY"
                        />
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12 gap-4 mt-4">
                <div class="sm:col-span-8 col-span-12">
                    <div class="card grid lg:grid-cols-3 grid-cols-1 gap-3 lg:gap-4">
                        <div class="flex flex-col items-center py-1">
                            <p class="m-0 text-[12px]">
                                Lượt truy cập
                            </p>
                            <div v-if="!loading" class="flex items-end gap-1">
                                <h6 class="m-0 font-bold text-[18px]" style=" ">
                                    {{ formatNumber(525000) }}
                                </h6>
                                <div class="mr-2 flex items-end mb-[3px]">
                                    <svg
                                        v-if="handleCompare(totalSessions.current , totalSessions.compare).type === 'increase'"
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
                                    <span :class="`text-[12px] -mb-[5px] ${handleCompare(totalSessions.current , totalSessions.compare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">
                                        {{ 38 }}%
                                    </span>
                                </div>
                            </div>
                            <div v-else class="h-[20px] w-25">
                                <Skeleton />
                            </div>
                        </div>
                        <div class="flex flex-col items-center pt-4 lg:pt-0 py-1 px-2 lg:border-l-2 lg:border-t-0 border-t-2 border-[#dce1e5]">
                            <p class="m-0 text-[12px]">
                                Lượt tương tác
                            </p>
                            <div v-if="!loading" class="flex items-end gap-1">
                                <h6 class="m-0 font-bold text-[18px]">
                                    {{ formatNumber(121010) }}
                                </h6>
                                <div class="mr-2 flex items-end mb-[3px]">
                                    <svg
                                        v-if="handleCompare(totalSessions.unique , totalSessions.uniqueCompare).type === 'increase'"
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
                                    <span :class="`text-[12px] -mb-[5px] ${handleCompare(totalSessions.unique , totalSessions.uniqueCompare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">
                                        {{ 11 }}%
                                    </span>
                                </div>
                            </div>
                            <div v-else class="h-[20px] w-25">
                                <Skeleton />
                            </div>
                        </div>
                        <div class="flex flex-col items-center pt-4 lg:pt-0 py-1 px-2 lg:border-l-2 border-t-2 lg:border-t-0 border-[#dce1e5]">
                            <p class="m-0 text-[12px] ">
                                Thời gian phiên
                            </p>
                            <div v-if="!loading" class="flex items-end gap-1">
                                <h6 class="m-0 font-bold text-[18px]">
                                    {{ '2m 6s' }}
                                </h6>
                                <div class="mr-2 flex items-end mb-[3px]">
                                    <svg
                                        v-if="handleCompare(avgSessionsDuration.current , avgSessionsDuration.compare).type === 'increase'"
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
                                    <span :class="`text-[12px] -mb-[5px] ${handleCompare(avgSessionsDuration.current , avgSessionsDuration.compare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">
                                        {{ 6 }}%
                                    </span>
                                </div>
                            </div>
                            <div v-else class="h-[20px] w-25">
                                <Skeleton />
                            </div>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-[14px] m-0 ">
                                {{ 'Tổng quát' }}
                            </h4>
                        <!-- <div v-if="sessionsOvertime?.length && !loading" class="!flex !items-center !justify-end">
                            <a-button type="link" class="!flex !items-center !justify-end gap-2 !p-0" @click="$router.push('/analystics/reports/sessions-overtime')">
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
                        <div v-if="!loading" class="max-h-[404px]">
                            <VueApexCharts
                                v-if="true"
                                type="area"
                                height="400"
                                :options="chartOptions"
                                :series="series"
                            />
                            <div v-else class="flex items-center justify-center flex-col h-[404px]">
                                <img class="w-[200px]" src="/images/not-chart.jpg" alt="/">
                            </div>
                        </div>
                        <div v-else class="traffic-chart h-[404px]">
                            <Skeleton />
                        </div>
                    </div>
                </div>
                <div class="sm:col-span-4 col-span-12">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-[14px] m-0 ">
                                {{ 'Khách hàng quay lại' }}
                            </h4>
                        <!-- <div v-if="totalSessions.current > 0 && !loading" class="!flex !items-center !justify-end">
                            <a-button type="link" class="!flex !items-center !justify-end gap-2 !p-0">
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
                        <div v-if="!loading" class="new_returning">
                            <PercentageChart
                                v-if="true"
                                legend-position="right"
                                :values="[10, 20]"
                                :labels="['KH mới', 'KH quay lại']"
                                name="new_returning"
                            />
                            <div v-else class="flex items-center justify-center flex-col h-[217px]">
                                <img class="w-[200px]" src="/images/not-chart.jpg" alt="/">
                            </div>
                        </div>
                        <div v-else class="traffic-chart h-[213px]">
                            <Skeleton />
                        </div>
                    </div>
                    <div class="card mt-4 h-[285px]">
                        <div class="flex items-center justify-between">
                            <h4 class="font-bold text-[14px] m-0 ">
                                {{ 'Truy cập theo thiết bị' }}
                            </h4>
                            <div v-if="true" class="!flex !items-center !justify-end">
                                <a-button type="link" class="!flex !items-center !justify-end gap-2 !p-0">
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
                            </div>
                        </div>
                        <div v-if="!loading" class="session_device">
                            <PercentageChart
                                v-if="true"
                                legend-position="right"
                                :values="[1,1,1]"
                                :labels="['Máy tính', 'Di động', 'Khác']"
                                name="session_device"
                            />
                            <div v-else class="flex items-center justify-center flex-col h-[217px]">
                                <img class="w-[200px]" src="/images/not-chart.jpg" alt="/">
                            </div>
                        </div>
                        <div v-else class="traffic-chart h-[213px]">
                            <Skeleton />
                        </div>
                    </div>
                </div>
                <div class="col-span-12 grid sm:grid-cols-3 gap-4">
                    <div class="card py-2">
                        <h4 class="font-bold text-[14px] m-0 pb-3 mb-2" style="border-bottom: 1px solid #dce1e5">
                            {{ 'Lượt truy cập theo vùng' }}
                        </h4>
                        <TrafficSource
                            :data="[
                                {
                                    slug: 'Hà Nội',
                                    count: 1600,
                                    countCompare: 470,
                                },
                                {
                                    slug: 'Hồ Chí Minh',
                                    count: 2510,
                                    countCompare: 1500,
                                },
                                {
                                    slug: 'Đà Nẵng',
                                    count: 850,
                                    countCompare: 250,
                                },
                                {
                                    slug: 'Huế',
                                    count: 620,
                                    countCompare: 180
                                },
                                {
                                    slug: 'Hải Phòng',
                                    count: 1200,
                                    countCompare: 350
                                }
                            ]"
                            :loading="loading"
                        />
                    </div>
                    <div class="card py-2">
                        <h4 class="font-bold text-[14px] m-0 pb-3 mb-2" style="border-bottom: 1px solid #dce1e5">
                            {{ 'Doanh thu theo vùng' }}
                        </h4>
                        <TrafficSource
                            :data="[
                                {
                                    slug: 'Hà Nội',
                                    count: 142365789,
                                    countCompare: 100452301
                                },
                                {
                                    slug: 'Hồ Chí Minh',
                                    count: 235788945,
                                    countCompare: 188945678
                                },
                                {
                                    slug: 'Đà Nẵng',
                                    count: 115632445,
                                    countCompare: 73690123
                                },
                                {
                                    slug: 'Huế',
                                    count: 188743654,
                                    countCompare: 123456789
                                },
                                {
                                    slug: 'Hải Phòng',
                                    count: 199999999,
                                    countCompare: 135790246
                                }]"
                            :loading="loading"
                        />
                    </div>
                    <div class="card py-2">
                        <h4 class="font-bold text-[14px] m-0 pb-3 mb-2" style="border-bottom: 1px solid #dce1e5">
                            {{ 'Tỷ lệ chuyển đổi' }}
                        </h4>
                        <TrafficSource
                            :data="[
                                {
                                    slug: 'Hà Nội',
                                    count: 0.705,
                                    countCompare: 0.8,
                                },
                                {
                                    slug: 'Hồ Chí Minh',
                                    count: 0.802,
                                    countCompare: 0.8,
                                },
                                {
                                    slug: 'Đà Nẵng',
                                    count: 0.636,
                                    countCompare: 0.5,
                                },
                                {
                                    slug: 'Huế',
                                    count: 0.654,
                                    countCompare: 0.6,
                                },
                                {
                                    slug: 'Hải Phòng',
                                    count: 0.679,
                                    countCompare: 0.8,
                                }]"
                            :loading="loading"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TrafficSource from '@/components/analystics/TrafficSource.vue';
    import PercentageChart from '@/components/analystics/PercentageChart.vue';
    import DateRange from '@/components/filters/DateRange.vue';
    import Skeleton from '@/components/analystics/Skeleton.vue';
    import moment from 'moment';
    import { mapState } from 'vuex';

    export default {
        components: {
            TrafficSource,
            PercentageChart,
            DateRange,
            Skeleton,
        },
        props: {
            title: {
                type: String,
            },
        },
        async fetch() {
            if (!this.$route.query.from || !this.$route.query.to) {
                this.$router.push({
                    query: {
                        from: moment().subtract(1, 'months').format('YYYY-MM-DD'),
                        to: moment().format('YYYY-MM-DD'),
                    },
                });
            } else {
                this.fetchData();
            }
        },
        data() {
            return {
                chartOptions: {
                    chart: {
                        height: 300,
                        type: 'area',
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    theme: {
                        monochrome: {
                            enabled: true,
                            color: '#1351d8',
                        },
                    },
                    plotOptions: {
                        area: {
                            horizontal: false,
                        },
                    },
                    stroke: {
                        curve: 'straight',
                        width: 2.5,
                        lineCap: 'round', // Adds rounded corners
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        },
                    },
                    yaxis: {
                        labels: {
                            formatter(val) {
                                return (val).toLocaleString('de-DE');
                            },
                        },
                        tooltip: {
                            enabled: false,
                        },
                    },
                    xaxis: {
                        type: 'datetime',
                        tooltip: {
                            enabled: false,
                        },
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yyyy',
                        },
                    },
                },
                loading: false,
                loadingCustomer: false,
                productsTop: [],
                customersTop: [],
                data: null,
                sessionsOvertimeHandled: [
                ],
            };
        },
        computed: {
            ...mapState('analystics', ['pagesBySession', 'sourcesBySession', 'avgSessionsDuration', 'countryBySession', 'sessionsOvertime', 'sessionsByDevice', 'totalSessions']),
            series() {
                return [{
                    name: 'Total',
                    data: [
                        {
                            value: 1,
                            label: 1,
                        },
                    ],
                }];
            },
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchTrafficSource();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Thống kê',
                link: '/thong-ke',
            }]);
        },

        methods: {
            moment,
            windowOpenLink() {
                window.open('https://synck.io.vn/', '_blank');
            },
            fetchData() {
                if (this.sessionsOvertime === null) {
                    this.fetchTrafficSource();
                }
            },
            handleSessionsOvertime(from, to) {
                const startDate = moment(from);
                const endDate = moment(to);

                const dateArray = [];
                const currentDate = startDate;

                while (currentDate.isSameOrBefore(endDate)) {
                    dateArray.push({
                        value: 0,
                        date: (currentDate.format()).split('T')[0],
                    });
                    currentDate.add(1, 'days');
                }
                return dateArray?.map((e) => [e.date, e.value]);
            },
            mergeArrays(array1, array2) {
                const mergedDict = {};

                // Update values from array1
                array1.forEach(([date, value]) => {
                    this.$set(mergedDict, date, (mergedDict[date] || 0) + value);
                });

                // Update values from array2
                array2.forEach(([date, value]) => {
                    this.$set(mergedDict, date, (mergedDict[date] || 0) + value);
                });

                // Convert the dictionary back to an array
                const mergedArray = Object.entries(mergedDict).map(([date, value]) => [date, value]);

                // Sort the merged array by date
                return mergedArray.sort((a, b) => a[0].localeCompare(b[0]));
            },
            classifyDevices(data) {
                let mobileCount = 0;
                let laptopCount = 0;
                let otherCount = 0;

                data.forEach((entry) => {
                    if (['iOS', 'Android'].includes(entry.browser)) {
                        mobileCount += entry.count;
                    } else if (['Windows', 'Mac OS X', 'Linux', 'Chrome OS'].includes(entry.browser)) {
                        laptopCount += entry.count;
                    } else {
                        otherCount += entry.count;
                    }
                });

                return [
                    { device: 'Mobile', count: mobileCount },
                    { device: 'Laptop', count: laptopCount },
                    { device: 'Other', count: otherCount },
                ];
            },
            async fetchTrafficSource() {
                try {
                    this.loading = true;
                    const query = {
                        from: moment().subtract(1, 'months').format('MMM DD, YYYY'),
                        to: moment().format('MMM DD, YYYY'),
                    };
                    const {
                        data: {
                            data: {
                                sessionsOvertime, pageBySessions, countryBySession, avgSessionsDuration, sourceBySession, sessionsByDevice, totalSessions,
                            },
                        },
                    } = await this.$api.analystics.getDemographics({ ...query, ...this.$route.query });
                    this.$store.dispatch('analystics/setSessionsOvertime', sessionsOvertime);
                    this.$store.dispatch('analystics/setPageBySessions', pageBySessions);
                    this.$store.dispatch('analystics/setCountryBySessions', countryBySession);
                    this.$store.dispatch('analystics/setSourceBySession', sourceBySession);
                    this.$store.dispatch('analystics/setTotalSessions', totalSessions);
                    this.$store.dispatch('analystics/setAvgSessionsDuration', avgSessionsDuration);
                    const dailyData = this.handleSessionsOvertime(this.$route.query.from, this.$route.query.to);
                    this.sessionsOvertimeHandled = this.mergeArrays(dailyData, sessionsOvertime);
                    this.$store.dispatch('analystics/setSessionsByDevice', this.classifyDevices(sessionsByDevice));
                    this.loading = false;
                } catch (error) {
                    // this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            formatNumber(number) {
                if (number < 1000) {
                    return number;
                } if (number < 1000000) {
                    return `${(Math.round((number / 1000) * 10) / 10).toFixed(1)}k`;
                }
                return `${(Math.round((number / 1000000) * 10) / 10).toFixed(1)}M`;
            },
            formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.round(seconds % 60);
                return `${minutes}m ${remainingSeconds}s`;
            },
            handleCompare(value, countCompare) {
                const difference = value - countCompare;
                return {
                    type: difference >= 0 ? 'increase' : 'decrease',
                    value: (((difference * 100) / (countCompare || 1)).toFixed()).replace('-', ''),
                };
            },
            addDaysToDate(startDate, numberOfDaysToAdd) {
                // Create a moment object from the start date
                const momentStartDate = moment(startDate);

                // Use the add method to add the specified number of days
                const newDate = momentStartDate.add(numberOfDaysToAdd, 'days');

                // Format the new date as a string
                const newDateString = newDate.format('MMM DD, YYYY');

                return newDateString;
            },
        },
        head() {
            return {
                title: 'Thống kê',
            };
        },
    };
</script>
<style>
.apexcharts-toolbar {
    display: none !important;
}
.traffic-overview .ant-progress-line {
    top: -5px;
}
.traffic-overview .card-loading {
    height: 100%;
    min-width: 100px;
    min-height: 20px;
}
.traffic-overview .card-img-loading {
    padding-bottom: 100%;
}
</style>
