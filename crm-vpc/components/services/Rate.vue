<template>
    <div class="py-4 grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-4 rounded-[6px] border-[1px] border-[#1a75bb42] p-4">
            <h4 class="text-[#1A75BB] text-[18px] font-[600] m-0 text-center mb-4 pb-4 border-b-[1px] border-[#1a75bb42]">
                Đánh giá của khách hàng
            </h4>
            <div class="flex items-center gap-4 mb-4 justify-center">
                <p class="font-bold text-[50px] m-0" style="line-height: normal">
                    {{ calculateAveragePrice(feedbacks || []) }}
                </p>
                <div>
                    <a-rate style="fontSize: 14px;color: #FEA51E; marginRight: 0px" :default-value="5" disabled />
                    <p class="m-0 mt-[1px]">
                        ({{ feedbacks?.length }} phản hồi)
                    </p>
                </div>
            </div>
            <div v-for="index in [5,4,3,2,1]" :key="`progress_${index}`" class="flex items-center gap-1 mb-1 px-4">
                <span>{{ index }}</span>
                <svg
                    viewBox="64 64 896 896"
                    data-icon="star"
                    width="1em"
                    height="1em"
                    fill="#FEA51E"
                    aria-hidden="true"
                    focusable="false"
                    class="mr-1"
                ><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" /></svg>
                <a-progress
                    :percent="ratePercentage[index] || 0"
                    stroke-color="#FEA51E"
                    :stroke-width="4"
                    :show-info="false"
                />
                <span class="min-w-[20px]">
                    {{ (rateCount[index] || 0)?.toLocaleString('de-DE') }}
                </span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-8">
            <Feedback />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Feedback from '@/components/services/Feedback.vue';

    export default {
        components: {
            Feedback,
        },
        props: {
        },

        data() {
            return {
                rateCount: {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0,
                },
            };
        },
        computed: {
            ...mapState('feedbacks', ['feedbacks']),
            ratePercentage() {
                const totalReviews = this.feedbacks?.length;
                // Calculate the percentage for each rate
                const percentage = {};
                Object.keys(this.rateCount).forEach((rate) => {
                    percentage[rate] = (this.rateCount[rate] / totalReviews) * 100;
                });
                return percentage;
            },
        },
        watch: {
            feedbacks: {
                handler() {
                    this.rateCount = {
                        5: this.feedbacks?.filter((e) => e.rate === 5).length,
                        4: this.feedbacks?.filter((e) => e.rate === 4).length,
                        3: this.feedbacks?.filter((e) => e.rate === 3).length,
                        2: this.feedbacks?.filter((e) => e.rate === 2).length,
                        1: this.feedbacks?.filter((e) => e.rate === 1).length,
                    };
                },
            },
        },
        methods: {
            calculateAveragePrice(data) {
                if (!data || data.length === 0) {
                    return 0; // Return 0 if the array is empty or undefined
                }

                const total = data?.reduce((acc, product) => acc + product.rate, 0);
                const average = total / data.length;

                // If you want to round the average to 2 decimal places, you can use the following line
                // const roundedAverage = Math.round(average * 100) / 100;

                return average;
            },
        },
    };
</script>
<style>
</style>
