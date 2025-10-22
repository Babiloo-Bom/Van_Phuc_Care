<template>
    <div class="card !p-0">
        <div class=" bg-white rounded-sm">
            <div class="bg-[#fafafa] flex justify-between">
                <div class="w-[65px] flex items-center  justify-start flex-col cursor-pointer">
                    <a-button type="text" class="!outline-none !border-0 !bg-transparent !h-[90px]" @click="onPrevButtonClick()">
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="css-i6dzq1"
                        ><polyline points="15 18 9 12 15 6" /></svg>
                    </a-button>
                    <div v-for="time in 24" :key="`time_${time}`" class="bg-[#fafafa] flex justify-between h-[100px]">
                        <div class="w-[65px] flex items-center justify-center text-[#87868a]">
                            {{ `${((5 + time) % 24).toString().padStart(2, '0')}:00` }}
                        </div>
                    </div>
                </div>
                <div :class="`w-[calc(100%-130px)] grid grid-cols-7`">
                    <div
                        v-for="(day, index) of currentWeekDays"
                        :key="index"
                        style="border-width: 0 1px; border-style:solid; border-color: #f2f2f2"
                    >
                        <div class="px-3 py-4">
                            <div :class="`rounded-md cursor-pointer flex items-center justify-center py-1 flex-col ${(index === dateIndex - 1 && day === currentDay ) ? 'bg-[#1a5ce4]' : 'bg-transparent'}`">
                                <span :class="`text-[16px]  ${(index === dateIndex - 1 && day === currentDay) ? 'bg-[#1a5ce4] text-[#fefbfc]' : 'bg-transparent text-[#1d1b5c]'} font-bold mt-1`">{{ week[index] }}</span>
                                <span :class="`text-[12px] ${(index === dateIndex - 1 && day === currentDay) ? 'bg-[#1a5ce4] text-[#d0d0e4]' : 'bg-transparent text-[#949494]'} `">{{ day }}</span>
                            </div>
                        </div>
                        <div v-for="time in 24" :key="`time_${time}`" class="bg-[#fafafa] flex justify-between">
                            <div :class="`w-[100%] grid grid-cols-1`">
                                <div
                                    :class="`p-1 cursor-pointer flex items-center justify-start flex-col gap-1 bg-[#fff] h-[100px]`"
                                    style="border-width: 1px 0 1px 0;border-style: solid; border-color: #f2f2f2"
                                >
                                    <a-button v-if="checkShowTaskInCalendar(time, data.find(e => e.day === day))" type="primary" class="text-left w-full bg-[#1a77ba] py-[2px] px-[10px] !rounded-lg text-[#fff]">
                                        08:00 - 17:00
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-[65px] flex items-center  justify-start flex-col cursor-pointer">
                    <a-button type="text" class="!outline-none !border-0 !bg-transparent !h-[90px]" @click="onNextButtonClick()">
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            stroke="currentColor"
                            stroke-width="2"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="css-i6dzq1"
                        ><polyline points="9 18 15 12 9 6" /></svg>
                    </a-button>
                    <div v-for="time in 24" :key="`time_${time}`" class="bg-[#fafafa] flex justify-between h-[100px]">
                        <div class="w-[65px] flex items-center justify-center text-[#87868a]">
                            {{ `${((5 + time) % 24).toString().padStart(2, '0')}:00` }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        props: {
            title: {
                type: String,
            },
        },
        data() {
            return {
                week: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                formatCalendar: 'week',
                dateIndex: moment().weekday(),
                currentWeek: [],
                currentWeekStart: moment().startOf('isoWeek'),
                currentWeekDays: [],
                currentDay: moment().format('DD/MM/YYYY'),
                data: [
                    {
                        day: '23/08/2023',
                        title: 'Tư vấn bệnh nhân',
                        startAt: '08:00:00',
                        endAt: '16:59:00',
                    },
                ],
            };
        },
        mounted() {
            this.currentWeekDays = this.getWeekArray(this.currentWeekStart);
        },
        methods: {
            moment,
            getWeekArray(startOfWeek) {
                const daysArray = [];
                for (let i = 0; i < 7; i += 1) {
                    daysArray.push(startOfWeek.clone().add(i, 'days').format('DD/MM/YYYY'));
                }
                return daysArray;
            },
            onNextButtonClick() {
                this.currentWeekStart = this.currentWeekStart.clone().add(1, 'weeks');
                this.currentWeekDays = this.getWeekArray(this.currentWeekStart);
            },
            onPrevButtonClick() {
                this.currentWeekStart = this.currentWeekStart.clone().subtract(1, 'weeks');
                this.currentWeekDays = this.getWeekArray(this.currentWeekStart);
            },
            checkShowTaskInCalendar(time, task) {
                if (task) {
                    return Number(((5 + time) % 24).toString().padStart(2, '0')) === Number(task.startAt.split(':')[0]);
                }
            },
        },
    };
</script>
