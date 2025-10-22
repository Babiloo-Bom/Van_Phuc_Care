<template>
    <div class="card !p-0">
        <div class=" bg-white rounded-sm">
            <div class="bg-[#fafafa] flex justify-between">
                <div :class="`w-[calc(100%)] grid grid-cols-7`">
                    <div
                        v-for="(day, index) of 7"
                        :key="index"
                        :class="`py-3 px-4`"
                        style="border-width: 0 1px; border-style:solid; border-color: #f2f2f2"
                    >
                        <div :class="`rounded-md cursor-pointer flex items-center justify-center py-3 flex-col ${index === dateIndex - 1 ? 'bg-[#1a5ce4]' : 'bg-transparent'}`">
                            <span :class="`text-[16px]  ${index === dateIndex - 1 ? 'bg-[#1a5ce4] text-[#fefbfc]' : 'bg-transparent text-[#1d1b5c]'} font-bold mt-1`">{{ week[index] }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="`w-[calc(100%)] grid grid-cols-7 g-[#fafafa] justify-between h-[110px]`">
                <div
                    v-for="index of (startDayIndex)"
                    :key="`before_month_${index}`"
                    :class="`relative p-1 cursor-pointer flex items-center justify-center flex-col gap-1 bg-[#fff] h-[110px]`"
                    style="border: 1px solid #f2f2f2"
                >
                    <span class="text-[16px] font-bold absolute top-3 left-3 text-[#bbbbbb]">{{ latestDay[index - 1] }}</span>
                </div>
                <div
                    v-for="(day, index) of dayOfMonth"
                    :key="`current_month_${index+1}`"
                    :class="`relative p-1 cursor-pointer flex items-center justify-center flex-col gap-1 bg-[#fff] h-[110px]`"
                    style="border: 1px solid #f2f2f2"
                >
                    <span v-if="index+1 === date" class="text-[16px] font-bold absolute top-3 left-3 p-[5px] bg-[#0C76BC] text-[#fff] rounded-full">{{ index+1 }}</span>
                    <span v-else class="text-[16px] font-bold absolute top-3 left-3">{{ index+1 }}</span>
                    <div v-if="getRecord(day)" class="w-[calc(100%-20px)] flex items-center justify-center">
                        <a-button :class="`px-[10px] py-[2px] !rounded-lg ${colorStatus(getRecord(day).startAt)}`" @click="openDialog(getRecord(day))">
                            {{ getRecord(day).startAt }}
                        </a-button>
                        <span v-if="getRecord(day).endAt" class="mx-1"><svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            stroke="#030303"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="1.5"
                            d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83"
                        /></svg></span>
                        <a-button v-if="getRecord(day).endAt" :class="`px-[10px] py-[2px] !rounded-lg ${colorStatus(getRecord(day).endAt)}`" @click="$refs.dialog.open()">
                            {{ getRecord(day).endAt }}
                        </a-button>
                    </div>
                </div>
                <div
                    v-for="index of (42 - dayOfMonth.length - startDayIndex)"
                    :key="`next_month_${index}`"
                    :class="`relative p-1 cursor-pointer flex items-center justify-center flex-col gap-1 bg-[#fff] h-[110px]`"
                    style="border: 1px solid #f2f2f2"
                >
                    <span class="text-[16px] font-bold absolute top-3 left-3 text-[#bbbbbb]">{{ index }}</span>
                </div>
            </div>
        </div>
        <Dialog ref="dialog" :record="recordSelected" />
    </div>
</template>

<script>
    import moment from 'moment';
    import Dialog from '@/components/shared/Calendar/Dialog.vue';

    export default {
        components: {
            Dialog,
        },
        props: {
            title: {
                type: String,
            },
            data: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                week: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                dateIndex: moment().weekday(),
                year: 2023,
                month: 8,
                date: moment().date(),
                startDayIndex: null,
                dayOfMonth: [],
                days: [],
                latestDay: [],
                recordSelected: {},
            };
        },
        mounted() {
            this.startDayIndex = this.getStartDayIndex(this.year, this.month) - 1;
            this.dayOfMonth = this.getDaysInCurrentMonth(this.year, this.month);
            this.days = this.getAllDaysFormatted(this.year, this.month);
            this.latestDay = this.getXDaysBeforeLastDay(this.year, this.month, this.startDayIndex);
        },
        methods: {
            moment,
            getStartDayIndex(year, month) {
                const firstDayOfMonth = moment({ year, month: month - 1, day: 1 }); // Month is 0-based in Moment.js
                return firstDayOfMonth.day(); // 0 for Sunday, 1 for Monday, and so on
            },
            getDaysInCurrentMonth(year, month) {
                const daysInMonth = moment({ year, month: month - 1, day: 1 }).daysInMonth();
                const daysArray = [];

                for (let day = 1; day <= daysInMonth; day += 1) {
                    daysArray.push(moment({ year, month: month - 1, day }).format('DD/MM/YYYY'));
                }

                return daysArray;
            },
            getAllDaysFormatted(year, month) {
                const currentDate = moment({ year, month, day: 1 });
                const daysInMonth = currentDate.daysInMonth();
                const daysArray = [];

                for (let day = 1; day <= daysInMonth; day += 1) {
                    const formattedDay = currentDate.clone().date(day).format('DD/MM/YYYY');
                    daysArray.push(formattedDay);
                }

                return daysArray;
            },
            getXDaysBeforeLastDay(year, month, x) {
                const lastDayOfMonth = moment({
                    year,
                    month: month - 2,
                }).endOf('month');
                const dateArray = [];
                for (let i = 0; i < x; i += 1) {
                    const targetDate = lastDayOfMonth.clone().subtract(i, 'days');
                    dateArray.unshift(targetDate.date());
                }
                return dateArray;
            },
            getRecord(day) {
                return this.data.find((e) => e.day === day);
            },
            colorStatus(day) {
                if (Number(day.split(':')[0]) < 8 || (Number(day.split(':')[0]) === 8 && Number(day.split(':')[1]) === 0) || Number(day.split(':')[0]) >= 17) {
                    return '!bg-[#18954d] !text-[#fff]';
                }
                return '!bg-[#fcbd15] !text-[#fff]';
            },
            openDialog(record) {
                this.$refs.dialog.open();
                this.recordSelected = record;
            },
        },
    };
</script>
