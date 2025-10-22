<template>
    <div>
        <a-table
            :data-source="data"
            :pagination="false"
            :row-key="(row) => row._id"
            :loading="loading"
        >
            <a-table-column
                key="channel"
                title="Source"
                :width="120"
                data-index="salesChannel"
            >
                <template #default="salesChannel">
                    <span class="font-semibold uppercase">{{ salesChannel }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="orders"
                title="Orders"
                :width="200"
            >
                <template #default="record">
                    <div class=" flex items-center font-semibold uppercase">{{ formatNumber(record.orders) }} <span class="lowercase ml-1">{{ $t('sideBar.orders') }}</span>
                        <div class="mr-2 flex items-end mb-[5px]">
                            <svg
                                v-if="handleCompare(record.orders , record.ordersCompare).type === 'increase'"
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="#1351d8"
                            ><path
                                stroke="#1351d8"
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
                            <span :class="` -mb-[5px] ${handleCompare(record.orders , record.ordersCompare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">{{ handleCompare(record.orders , record.ordersCompare).value }}%</span>
                        </div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="products"
                title="Products"
                :width="200"
            >
                <template #default="record">
                    <div class=" flex items-center font-semibold uppercase">{{ formatNumber(record.products) }} <span class="lowercase ml-1">{{ $t('sideBar.products') }}</span>
                        <div class="mr-2 flex items-end mb-[5px]">
                            <svg
                                v-if="handleCompare(record.products , record.productsCompare).type === 'increase'"
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="#1351d8"
                            ><path
                                stroke="#1351d8"
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
                            <span :class="` -mb-[5px] ${handleCompare(record.products , record.productsCompare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">{{ handleCompare(record.products , record.productsCompare).value }}%</span>
                        </div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="value"
                title="Total"
                :width="230"
            >
                <template #default="record">
                    <div class=" flex items-center font-semibold uppercase">{{ formatNumber(record.total) }}
                        <div class="mr-2 flex items-end mb-[5px]">
                            <svg
                                v-if="handleCompare(record.total , record.totalCompare).type === 'increase'"
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="#1351d8"
                            ><path
                                stroke="#1351d8"
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
                            <span :class="` -mb-[5px] ${handleCompare(record.total , record.totalCompare).type === 'increase' ? 'text-[#53c66e]' : 'text-[#ff4d4f]'} font-[500]`">{{ handleCompare(record.total , record.totalCompare).value }}%</span>
                        </div>
                    </div>
                </template>
            </a-table-column>
        </a-table>
    </div>
</template>

<script>
    import { convertPrice } from '@/utils/data';

    export default {
        components: {
        },

        props: {
            data: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
            pagination: {
                type: Object,
                required: false,
            },
        },

        // async asyncData({ store, query }) {
        //     await store.dispatch('metrics/fetchAll', query);
        // },

        data() {
            return {
                convertPrice,
            };
        },

        computed: {
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
            handleCompare(value, countCompare) {
                const difference = value - countCompare;
                return {
                    type: difference >= 0 ? 'increase' : 'decrease',
                    value: (((difference * 100) / (countCompare || 1)).toFixed()).replace('-', ''),
                };
            },
        },
    };
</script>
