<template>
    <div class="card !p-0">
        <div class=" bg-white rounded-sm">
            <div class="bg-[#fafafa] flex justify-between">
                <div class="w-[65px] flex items-center justify-center">
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
                </div>
                <div :class="`w-[calc(100%-130px)] grid grid-cols-1`">
                    <div
                        :key="index"
                        :class="`py-3 px-4`"
                        style="border-width: 0 1px; border-style:solid; border-color: #f2f2f2"
                    >
                        <div :class="`rounded-md cursor-pointer flex items-center justify-center py-1 flex-col bg-transparent`">
                            <span :class="`text-[16px] bg-transparent text-[#1d1b5c] font-bold mt-1`">{{ week[dateIndex] }}</span>
                            <span :class="`text-[12px] bg-transparent text-[#949494]`">{{ moment().format('DD/MM/YYYY') }}</span>
                        </div>
                    </div>
                </div>
                <div class="w-[65px] flex items-center justify-center">
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
                </div>
            </div>
            <div v-for="time in 24" :key="`time_${time}`" class="bg-[#fafafa] flex justify-between h-[80px]">
                <div class="w-[65px] flex items-center justify-center text-[#87868a]">
                    {{ `${((5 + time) % 24).toString().padStart(2, '0')}:00` }}
                </div>
                <div :class="`w-[calc(100%-130px)] grid grid-cols-1`">
                    <div
                        v-for="index of 1"
                        :key="index"
                        :class="`p-1 cursor-pointer flex items-center justify-center flex-col gap-1 bg-[#fff]`"
                        style="border: 1px solid #f2f2f2"
                    />
                </div>
                <div class="w-[65px] flex items-center justify-center text-[#87868a]">
                    {{ `${((5 + time) % 24).toString().padStart(2, '0')}:00` }}
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
                formatCalendar: 'day',
                dateIndex: moment().weekday() - 1,
                currentWeek: [],
            };
        },
        mounted() {
            this.renderCalendar();
        },
        methods: {
            moment,
            renderCalendar() {
                const currentDate = moment();
                const startOfWeek = currentDate.clone().startOf('isoWeek');
                for (let i = 0; i < 1; i += 1) {
                    const day = startOfWeek.clone().add(i, 'days');
                    this.currentWeek.push(day.format('DD/MM/YYYY'));
                }
            },
        },
    };
</script>
