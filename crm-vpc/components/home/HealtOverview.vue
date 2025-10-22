<template>
    <div v-if="Object.keys(data).length">
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-12 lg:col-span-4">
                <div class="grid grid-cols-1 gap-6">
                    <div>
                        <div class="grid grid-cols-3 items-start bg-[#f9fcff] p-4 rounded">
                            <div class="flex flex-col items-center justify-center">
                                <h4 class="text-prim-100 font-semibold mb-0 py-1">
                                    Cân nặng
                                </h4>
                                <div>
                                    <span class="text-3xl text-[28px] font-semibold">{{ data.weight || '--' }}</span>
                                    <span class="font-medium">kg</span>
                                </div>
                            </div>
                            <div
                                class="flex flex-col items-center justify-center relative after:absolute after:w-[1px] after:h-[70%] after:right-0 after:top-1/2 after:-translate-y-1/2 after:bg-gray-40
                                before:absolute before:w-[1px] before:h-[70%] before:left-0 before:top-1/2 before:-translate-y-1/2 before:bg-gray-40"
                            >
                                <h4 class="text-prim-100 font-semibold mb-0 py-1">
                                    Chiều dài
                                </h4>
                                <div>
                                    <span class="text-3xl text-[28px] font-semibold">{{ data.height || '--' }}</span>
                                    <span class="font-medium">cm</span>
                                </div>
                            </div>
                            <div class="flex flex-col items-center justify-center">
                                <h4 class="text-prim-100 font-semibold mb-0 py-1">
                                    Giới tính
                                </h4>
                                <div>
                                    <img
                                        v-if="data.gender === 'male'"
                                        class="w-[30px] h-[30px] object-cover"
                                        src="/images/male-icon.png"
                                        alt=""
                                    >
                                    <img
                                        v-else
                                        class="w-[30px] h-[30px] object-cover"
                                        src="/images/female-icon.png"
                                        alt=""
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-[#f9fcff] p-4 rounded">
                        <ul class="mb-0 grid grid-cols-1 gap-3">
                            <li class="border-b-[1px] border-solid border-gray-40 pb-2">
                                <div class="flex items-center justify-between mb-1">
                                    <h4 class="text-prim-100 font-semibold">
                                        Tình trạng da:
                                    </h4>
                                    <h4 v-if="data.skinConitionsTitle" class="font-semibold">
                                        {{ data.skinConitionsTitle }}
                                    </h4>
                                    <h4 v-else class="font-semibold">
                                        Đang cập nhật
                                    </h4>
                                </div>
                                <div v-html="data.skinConitionsDescription" />
                            </li>
                            <li class="border-b-[1px] border-solid border-gray-40 pb-2">
                                <div class="flex items-center justify-between mb-1">
                                    <h4 class="text-prim-100 font-semibold">
                                        Sức khỏe răng miệng:
                                    </h4>
                                    <h4 v-if="data.toothTitle" class="font-semibold">
                                        {{ data.toothTitle }}
                                    </h4>
                                    <h4 v-else class="font-semibold">
                                        Đang cập nhật
                                    </h4>
                                </div>
                                <div v-html="data.toothDescription" />
                            </li>
                            <li class="border-b-[1px] border-solid border-gray-40 pb-2">
                                <div class="flex items-center justify-between mb-1">
                                    <h4 class="text-prim-100 font-semibold">
                                        Dinh dưỡng:
                                    </h4>
                                    <h4 v-if="data.nutritionTitle" class="font-semibold">
                                        {{ data.nutritionTitle }}
                                    </h4>
                                    <h4 v-else class="font-semibold">
                                        Đang cập nhật
                                    </h4>
                                </div>
                                <div v-html="data.nutritionDescription" />
                            </li>
                            <li class="">
                                <div class="flex items-center justify-between mb-1">
                                    <h4 class="text-prim-100 font-semibold">
                                        Giấc ngủ:
                                    </h4>
                                    <h4 v-if="data.sleepingTitle" class="font-semibold">
                                        {{ data.sleepingTitle }}
                                    </h4>
                                    <h4 v-else class="font-semibold">
                                        Đang cập nhật
                                    </h4>
                                </div>
                                <div v-html="data.sleepingDescription" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-span-12 md:col-span-12 lg:col-span-8">
                <div class="bg-[#f9fcff] p-4 rounded grid grid-cols-1 gap-6">
                    <div>
                        <h4 class="font-semibold text-prim-100">
                            Sức khỏe tiêu hóa:
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div class="flex items-center gap-3">
                                <img class="h-auto scale-125 w-auto object-cover" src="/images/home/tieu-tien.png" alt="">
                                <div>
                                    <h5 class="font-semibold">
                                        Tần suất đại tiện:
                                    </h5>
                                    <div v-if="data.frequencyOfDefecation" v-html="data.frequencyOfDefecation" />
                                    <p v-else>
                                        Đang cập nhật
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <img class="h-auto scale-125 w-auto object-cover" src="/images/home/phan.png" alt="">
                                <div>
                                    <h5 class="font-semibold">
                                        Tình trạng phân:
                                    </h5>
                                    <div v-if="data.fecalCondition" v-html="data.fecalCondition" />
                                    <p v-else>
                                        Đang cập nhật
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <img class="h-auto scale-125 w-auto object-cover" src="/images/home/da-day.png" alt="">
                                <div>
                                    <h5 class="font-semibold">
                                        Vấn đề tiêu hóa
                                    </h5>
                                    <div v-if="data.digestiveProblems" v-html="data.digestiveProblems" />
                                    <p v-else>
                                        Đang cập nhật
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-prim-100">
                            Nhiệt độ cơ thể:
                            <span class="text-3xl" :style="{ color: getTemperatureColor(data.temperature) }">
                                {{ data.temperature }} &#176;
                            </span>
                        </h4>
                        <div class="mt-4 relative bar-chart">
                            <span class="absolute -top-5 right-2 text-sm font-semibold">Nhiệt độ</span>
                            <div class="relative sm:left-[-20px] md:left-[0] overflow-x-auto">
                                <div class="chartWrapper">
                                    <BarChart :data="chartData" :options="chartOptions" />
                                </div>
                            </div>
                            <span class="hidden md:block absolute bottom-1 left-[-3px] text-sm font-semibold">Ngày</span>
                        </div>
                    </div>
                    <div>
                        <div class="col-span-12 md:col-span-12 lg:col-span-8 mb-4 md:m-0">
                            <div v-if="data.healthCondition" class="flex flex-col md:flex-row items-start md:items-center justify-between">
                                <h4 class="font-semibold text-prim-100">
                                    Tình trạng sức khỏe:
                                </h4>
                                <h3 class="font-bold text-lg">
                                    {{ data.healthCondition }}
                                </h3>
                            </div>
                            <div v-if="data.vaccination" class="mt-4">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-semibold text-prim-100">
                                        Tiêm chủng:
                                    </h4>
                                    <h3 class="font-bold text-lg">
                                        {{ data.vaccination || '--' }}
                                    </h3>
                                </div>
                                <div>
                                    <div class="flex items-center justify-between">
                                        <span>Ngày tiêm:</span>
                                        <span class="font-semibold">{{ data.vaccinationDate || '--' }}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span>Mũi tiêm:</span>
                                        <span class="font-semibold">{{ data.vaccinationContent || '--' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="data.note" class="mt-2 bg-[#ebf5ff] rounded-md p-4">
                                <h4 class="font-semibold text-prim-100">
                                    Lưu ý:
                                </h4>
                                <div v-html="data.note" />
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-12 lg:col-span-4 mt-4">
                            <div v-if="data.methods">
                                <div class="flex items-center justify-between">
                                    <h4 class="font-semibold text-prim-100">
                                        Phương pháp:
                                    </h4>
                                </div>
                                <div class="mt-1" v-html="data.methods" />
                            </div>
                            <div v-if="data.symptom" class="border-t-[1px] border-solid border-gray-40 pt-2 mt-4">
                                <div>
                                    <h4 class="font-semibold text-prim-100">
                                        Tập vận động và kỹ năng:
                                    </h4>
                                </div>
                                <div class="mt-1" v-html="data.symptom" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!informations?.isAcceptedHealthBook" class="col-span-12">
                <div class="flex flex-col justify-center items-center gap-3 mt-6">
                    <a-checkbox :checked="acceptInfor" @change="({ target }) => acceptInfor = target.checked">
                        Tôi đã kiểm tra và xác nhận thông tin sức khỏe của của bé
                    </a-checkbox>
                    <div>
                        <a-button
                            :disabled="!acceptInfor"
                            type="primary"
                            class="w-[140px]"
                            @click="handleAccepted"
                        >
                            Đồng ý
                        </a-button>
                        <a-button :disabled="!acceptInfor" class="w-[140px]" @click="handleUnAccept">
                            Không đồng ý
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex justify-center items-center flex-col mt-4">
        <!-- <a-empty v-if="registeredService?.length" description="Không có dữ liệu" /> -->
        <div>
            <div v-if="_isEmpty(informations) && temperature.length" class="h-[200px] flex flex-col items-center justify-center">
                <h3 class="!mb-3 text-3xl text-[#868686] font-light">
                    Dữ liệu đang được cập nhật. Ba mẹ quay lại sau nha!
                </h3>
                <!-- <a-button type="primary" @click="seeDataYesterday">
                    Xem dữ liệu gần nhất
                </a-button> -->
            </div>
            <div v-else class="h-[200px] flex flex-col items-center justify-center">
                <h3 class="!mb-3 text-3xl text-[#868686] font-light">
                    Bạn chưa đăng ký sử dụng dịch vụ
                </h3>
                <nuxt-link class="py-1 !mt-4 inline-block px-6 font-semibold !text-white bg-prim-100 rounded-sm" to="/dich-vu">
                    Đến trang dịch vụ
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import BarChart from '@/components/shared/BarChart';
    import moment from 'moment';

    export default {
        components: {
            BarChart,
        },

        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                acceptInfor: false,
                isAccepted: false,
                dataCount: 30,
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label(tooltipItems) {
                                return `Nhiệt độ: ${tooltipItems.yLabel}`;
                            },
                            title(tooltipItem, data) {
                                return `Ngày ${data.labels[tooltipItem[0].index]}`;
                            },
                        },
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false,
                            },
                            gridLines: {
                                display: false,
                            },
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: false,
                                suggestedMin: 36,
                                steps: 1,
                                stepValue: 36,
                                max: 41,
                                min: 35,
                                fixedStepSize: 1,
                                labelOffset: -10,
                                padding: 0,
                            },
                            autoSkipPadding: 1,
                        }],
                    },
                },
            };
        },

        computed: {
            ...mapState('informations', ['informations', 'temperature']),
            ...mapState('services', ['registeredService']),
            chartData() {
                const dataHandled = this.last15DaysRecords();
                console.log(dataHandled);
                return {
                    labels: dataHandled?.map((e) => e.recordedAt.split('/')[0]),
                    datasets: [{
                        data: dataHandled?.map((e) => e.temperature),
                        // eslint-disable-next-line no-nested-ternary
                        backgroundColor: dataHandled?.map(({ temperature }) => (temperature < 37 ? '#10e561' : temperature >= 37 && temperature <= 37.3 ? '#ffa439' : '#c81010')),
                    }],
                };
            },
        },

        methods: {
            moment,
            _isEmpty,

            handleUnAccept() {
                this.acceptInfor = false;
                this.$message.info('Yêu cầu của bạn đã được gửi!');
            },
            getDaysInMonth(dateString) {
                // eslint-disable-next-line no-unused-vars
                const [day, month, year] = dateString.split('/').map(Number);
                const numDays = new Date(year, month, 0).getDate();
                const daysInMonth = [];

                for (let i = 1; i <= numDays; i += 1) {
                    const formattedDate = `${i.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
                    daysInMonth.push(formattedDate);
                }

                return daysInMonth;
            },

            last15DaysRecords() {
                const { date } = this.$route.query;
                const last15DaysArray = [];
                // eslint-disable-next-line no-restricted-syntax
                for (const day of this.getDaysInMonth(date)) {
                    const record = this.temperature?.find((e) => e.recordedAt === day);
                    if (record) {
                        last15DaysArray.push({
                            recordedAt: record.recordedAt,
                            temperature: record?.temperature ? record?.temperature.toString().replace(',', '.') : '0',
                        });
                    } else {
                        last15DaysArray.push({
                            recordedAt: day,
                            temperature: '0',
                        });
                    }
                }

                return last15DaysArray;
            },
            async handleAccepted() {
                try {
                    this.loading = true;
                    await this.$api.informations.updateHealthBook(this.informations._id, {
                        isAcceptedHealthBook: true,
                    });
                    this.$message.success('Cảm ơn bạn đã xác nhận');
                    await this.$store.dispatch('informations/fetchHealthBook', { ...this.$route.query });
                    this.isAccepted = true;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loading = false;
                }
            },

            seeDataYesterday() {
                this.$router.push({
                    path: '/',
                    query: {
                        date: moment().subtract(1, 'days').format('DD/MM/YYYY'),
                    },
                });
            },

            getTemperatureColor(temperature) {
                if (temperature <= 36.6) {
                    return '#FFA53B'; // Cam
                } if (temperature > 36.6 && temperature <= 37) {
                    return '#44EC87'; // Xanh lá
                } if (temperature > 37 && temperature <= 37.3) {
                    return '#FFA53B'; // Cam
                } if (temperature > 37.3) {
                    return '#D20D0D'; // Đỏ
                }
                return '#44EC87'; // Default color (black) in case of invalid input
            },
        },
    };
</script>

<style lang="scss">
    p, h4, h5, h3 {
        @apply m-0
    }
    .chartWrapper {
        @apply relative w-[1200px] sm:w-auto;
    }
</style>
