<template>
    <div class="bg-white mt-12 rounded px-4 py-4 md:mt-[60px] md:px-8 md:py-4 md:pt-4 card-main lg:mt-[60px] xl:mt-[60px]">
        <div v-if="!loading">
            <div class="flex flex-col md:flex-row justify-between items-center relative -top-[50px]">
                <div class="flex gap-4 items-center">
                    <div class="w-[80px] h-[80px]  lg:w-[150px] lg:h-[150px] rounded-full border-[8px] border-solid bg-[#fff] border-white overflow-hidden">
                        <img
                            class="w-full h-full object-cover rounded-full"
                            :src="informations?.avatar || '/images/logo-vanphuc.jpg'"
                            alt=""
                        >
                    </div>
                    <div>
                        <h2 class="text-xl md:text-2xl lg:text-4xl font-bold text-prim-100 mb-1">
                            {{ informations?.name }}
                        </h2>
                        <p v-if="informations?.dob" class="text-base mb-0">
                            Ngày sinh: {{ informations?.dob }} - {{ calculateDateDifference(informations?.dob) }}
                        </p>
                    </div>
                </div>
                <div v-if="parseInt(tab) === 1" class="text-right pt-1 flex items-center gap-3">
                    <h3 class="text-prim-100 font-semibold mb-0">
                        Tìm kiếm theo ngày:
                    </h3>
                    <div class="mb-0 bg-prim-100 text-white rounded-sm py-1 px-3">
                        <!-- {{ moment().format('DD/MM/YYYY') }} -->
                        <SelectDate
                            :suffix-icon="false"
                            class="custom-picker"
                            placeholder="Chọn ngày"
                            :allow-clear="false"
                            value-format="DD/MM/YYYY"
                            format="DD/MM/YYYY"
                            :default-value="moment().format('DD/MM/YYYY')"
                            :disabled-date="(current) => current && moment(current).isAfter(moment())"
                            query="date"
                        />
                    </div>
                </div>
            </div>
            <div class="relative -top-[40px]">
                <a-tabs default-active-key="1" @change="handleChange">
                    <a-tab-pane key="1" tab="Tổng quan sức khỏe">
                        <HealtOverview :data="informations" />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Lịch tiêm" force-render>
                        <VaccinationSchedule :injected="injected" />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Hỗ trợ khách hàng">
                        <!-- <ChatLayout /> -->
                        <Tickets />
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import moment from 'moment';
    import HealtOverview from '@/components/home/HealtOverview.vue';
    import VaccinationSchedule from '@/components/home/VaccinationSchedule.vue';
    import Tickets from '@/components/home/Tickets.vue';
    // import ChatLayout from '@/components/home/chats/ChatLayout.vue';
    import SelectDate from '@/components/filters/Date.vue';

    export default {
        components: {
            HealtOverview,
            VaccinationSchedule,
            Tickets,
            SelectDate,
            // ChatLayout,
        },
        async fetch() {
            this.fetchData();
        },

        data() {
            return {
                loading: false,
                injected: [],
                tab: 1,
            };
        },

        computed: {
            ...mapState('informations', ['informations', 'temperature']),
        },

        watch: {
            '$route.query.date': {
                handler() {
                    if (!this.$route.query.date) {
                        this.$router.push({
                            path: '/',
                            query: {
                                date: moment().format('DD-MM/YYYY'),
                            },
                        });
                    }
                    if (this.$route.query.date) {
                        this.fetchTemperature();
                    }
                    this.fetchData();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Sổ sức khỏe điện tử',
                link: '/',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3.5 18V7c0-4 1-5 5-5h7c4 0 5 1 5 5v10c0 .14 0 .28-.01.42" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.35 15H20.5v3.5c0 1.93-1.57 3.5-3.5 3.5H7c-1.93 0-3.5-1.57-3.5-3.5v-.65C3.5 16.28 4.78 15 6.35 15ZM8 7h8M8 10.5h5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }]);
            this.$router.push({
                path: '/',
                query: {
                    date: moment().format('DD/MM/YYYY'),
                },
            });
        },

        methods: {
            moment,
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('informations/fetchHealthBook', { ...this.$route.query });
                    const date = moment(this.informations.recordedAt, 'DD/MM/YYYY', true);
                    if (date.isValid()) {
                        this.$router.push({
                            path: '/',
                            query: {
                                date: date.format('DD/MM/YYYY'),
                            },
                        });
                    } else {
                        console.warn('Invalid recordedAt date format:', this.informations.recordedAt);
                    }
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loading = false;
                }
            },

            async fetchTemperature() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('informations/fetchTemperature', { ...this.$route.query });
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loading = false;
                }
            },

            async fetchVaccinSchedule() {
                try {
                    this.loadingSchedule = true;
                    const { data: { injected } } = await this.$api.informations.getInjected(this.$auth.user.email);
                    this.injected = injected;
                } catch (error) {
                    console.log(error);
                } finally {
                    this.loadingSchedule = false;
                }
            },
            calculateDateDifference(inputDate) {
                const date = moment(inputDate, 'DD/MM/YYYY');
                const today = moment();

                // Calculate the difference in days
                const daysDifference = today.diff(date, 'days');

                if (daysDifference < 30) {
                    return `${daysDifference} ngày tuổi`;
                }
                // Calculate the difference in months
                const monthsDifference = today.diff(date, 'months');
                return `${monthsDifference} tháng tuổi`;
            },
            handleChange(e) {
                this.tab = e;
                if (e === '2') {
                    this.fetchVaccinSchedule();
                }
            },
        },

        head() {
            return {
                title: 'Vạn Phúc Care',
            };
        },
    };
</script>
<style lang="scss">
.card-main > .ant-tabs-nav {
    font-weight: 500;
}

.card-main .ant-tabs-nav .ant-tabs-tab-active  {
    font-weight: 600 !important;
}
.custom-picker {
    .ant-calendar-picker-input {
        @apply p-0 h-6 w-24 bg-transparent border-transparent text-center text-white #{!important}
    }
    .ant-calendar-picker-input {
        @apply placeholder:text-white #{!important}
    }
}
</style>
