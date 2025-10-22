<template>
    <div>
        <div class="card mb-4 flex items-end justify-between">
            <div>
                <p class="m-0 mb-2 text-[16px] text-[#949494]">
                    Lịch khám
                </p>
                <div class="flex items-center gap-4">
                    <h1 class="m-0 mt-1 text-[20px] font-bold">
                        Tháng {{ moment().format("MM/YYYY") }}
                    </h1>
                    <div
                        class="cursor-pointer "
                        @click="handleOpenCalendar"
                    >
                        <a-date-picker
                            v-model="selectedMonth"
                            mode="month"
                            class="text-[#fff] custom-date-picker-month"
                            placeholder=""
                            @change="updateMonth"
                        />
                    </div>
                </div>
            </div>
            <div class="flex gap-3">
                <a-button
                    class="px-2"
                    :type="formatCalendar ==='day' ? 'primary' : 'outline'"
                    @click="optionsCalendar('day')"
                >
                    {{ 'Ngày' }}
                </a-button>
                <a-button
                    class="px-2"
                    :type="formatCalendar ==='week' ? 'primary' : 'outline'"
                    @click="optionsCalendar('week')"
                >
                    {{ 'Tuần' }}
                </a-button>
                <a-button
                    class="px-2"
                    :type="formatCalendar ==='month' ? 'primary' : 'outline'"
                    @click="optionsCalendar('month')"
                >
                    {{ 'Tháng' }}
                </a-button>
            </div>
        </div>
        <div v-if="formatCalendar ==='day'">
            <DayLayout />
        </div>
        <div v-if="formatCalendar ==='week'">
            <WeekLayout />
        </div>
        <div v-if="formatCalendar ==='month'">
            <MonthLayout :data="dataHandledMonth"/>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import DayLayout from '@/components/shared/Calendar/DayLayout.vue';
    import WeekLayout from '@/components/shared/Calendar/WeekLayout.vue';
    import MonthLayout from '@/components/shared/Calendar/MonthLayout.vue';

    export default {
        components: {
            DayLayout,
            WeekLayout,
            MonthLayout,
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
                formatCalendar: 'month',
                selectedMonth: undefined,
                dataHandledMonth: [],
            };
        },
        watch: {
            data() {
                this.dataHandledMonth = this.data.map((e) => ({
                    startAt: moment(e.createdAt).format('HH:mm:ss'),
                    endAt: '',
                    email: e.email,
                    fullname: e.fullname,
                    symptom: e.symptom,
                    day: moment(e.createdAt).format('DD/MM/YYYY'),
                }));
            },
        },
        methods: {
            moment,
            optionsCalendar(type) {
                this.formatCalendar = type;
            },
            updateMonth(value) {
                console.log(value);
            },
            handleOpenCalendar() {
                const monthPanelMonths = document.querySelectorAll('.ant-calendar-month-panel-month');
                monthPanelMonths.forEach((month) => {
                    if (month.innerHTML === 'Jan') {
                        month.innerHTML = 'Tháng 1';
                    } else if (month.innerHTML === 'Feb') {
                        month.innerHTML = 'Tháng 2';
                    } else if (month.innerHTML === 'Mar') {
                        month.innerHTML = 'Tháng 3';
                    } else if (month.innerHTML === 'Apr') {
                        month.innerHTML = 'Tháng 4';
                    } else if (month.innerHTML === 'May') {
                        month.innerHTML = 'Tháng 5';
                    } else if (month.innerHTML === 'Jun') {
                        month.innerHTML = 'Tháng 6';
                    } else if (month.innerHTML === 'Jul') {
                        month.innerHTML = 'Tháng 7';
                    } else if (month.innerHTML === 'Aug') {
                        month.innerHTML = 'Tháng 8';
                    } else if (month.innerHTML === 'Sep') {
                        month.innerHTML = 'Tháng 9';
                    } else if (month.innerHTML === 'Oct') {
                        month.innerHTML = 'Tháng 10';
                    } else if (month.innerHTML === 'Nov') {
                        month.innerHTML = 'Tháng 11';
                    } else if (month.innerHTML === 'Dec') {
                        month.innerHTML = 'Tháng 12';
                    } else {
                        console.log('ok');
                    }
                });
            },
        },
    };
</script>
<style>
.custom-date-picker-month {
    width: 40px;
}
</style>
