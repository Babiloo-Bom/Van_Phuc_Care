<template>
    <div class="pb-2 rounded-md min-h-full">
        <div class="card min-h-[433px]">
            <div class="mb-3 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <h4 class="font-bold text-[14px] m-0 ">
                    {{ $t('analystic.top_selled_items') }}
                </h4>
                <div v-if="dataHandled.length && !loading" class="!flex !items-center !justify-end">
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
            <div v-if="loading" class="h-[373px]">
                <Skeleton />
            </div>
            <div v-else>
                <a-table
                    v-if="dataHandled.length"
                    :data-source="dataHandled"
                    :pagination="false"
                    :row-key="(row) => row._id"
                    :loading="loading"
                >
                    <a-table-column
                        key="product"
                        title="Item"
                        :width="350"
                    >
                        <template #default="product">
                            <div class="flex items-start gap-3">
                                <div class="flex items-center justify-center w-[48px] h-[48px] rounded-sm">
                                    <img
                                        v-if="!isImageAvailable.includes(product._id)"
                                        :id="product._id"
                                        :src="product.thumbnail"
                                        alt="/"
                                        class="rounded-md mx-auto h-[48px] w-[48px] object-cover"
                                        @error="imageError"
                                    >
                                    <div v-else class="flex items-center justify-center w-[48px] h-[48px] rounded-sm border border-[#ebebeb]">
                                        <svg
                                            class="transition-all duration-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        ><path
                                            d="m21.68 16.96-3.13-7.31c-1.06-2.48-3.01-2.58-4.32-.22l-1.89 3.41c-.96 1.73-2.75 1.88-3.99.33l-.22-.28c-1.29-1.62-3.11-1.42-4.04.43l-1.72 3.45C1.16 19.17 2.91 22 5.59 22h12.76c2.6 0 4.35-2.65 3.33-5.04ZM6.97 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                            stroke="#8a8a8a"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg>
                                    </div>
                                </div>
                                <div class="flex flex-col items-start justify-between sm:flex-row sm:items-center w-[calc(100%-56px)]">
                                    <div class="">
                                        <h5 class="font-semibold m-0">
                                            {{ product.name }}
                                        </h5>
                                        <p class="!mb-0 sm:mb-3 text-[#666666]">
                                            {{ product.price.toLocaleString('de-DE') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column
                        key="rate"
                        title="Rate"
                        :width="100"
                    >
                        <template #default="product">
                            <p class="m-0">
                                {{ product.percentageSelled.toFixed(2) }}%
                            </p>
                        </template>
                    </a-table-column>
                    <a-table-column
                        key="quantity"
                        title="Quantity"
                        :width="100"
                    >
                        <template #default="product">
                            <p class="m-0">
                                {{ product.quantity }} {{ $t('shared.selled') }}
                            </p>
                        </template>
                    </a-table-column>
                    <a-table-column
                        key="action"
                        title="Action"
                        :width="150"
                        align="right"
                    >
                        <template #default="product">
                            <nuxt-link :to="`/id=${product._id}`" class="text-right">
                                Detail report
                            </nuxt-link>
                        </template>
                    </a-table-column>
                </a-table>
                <div v-else class="flex items-center justify-center flex-col h-[300px]">
                    <img class="w-[200px]" src="/images/not-chart.jpg" alt="/">
                    <h5 class="font-[600] text-[16px] m-0">
                        You don't have any products yet
                    </h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Skeleton from '@/components/analystics/Skeleton.vue';

    export default {
        components: {
            Skeleton,
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
        },

        data() {
            return {
                isImageAvailable: [],
                dataHandled: [],
            };
        },
        watch: {
            data: {
                handler(value) {
                    this.calculatePercentage(value);
                },
            },
        },
        methods: {
            imageError(e) {
                this.isImageAvailable = [...this.isImageAvailable, e.target.id];
            },
            calculatePercentage(value) {
                const totalQuantitySelled = value?.reduce((total, product) => total + product.quantity, 0);

                this.dataHandled = value.map((product) => ({
                    ...product,
                    percentageSelled: (product.quantity / totalQuantitySelled) * 100,
                }));
            },
        },
    };
</script>
<style>
ul.ant-rate>li.ant-rate-star.ant-rate-star-full {
    margin-right: 3px !important;
}
</style>
