<template>
    <div class="pb-2 rounded-md min-h-full">
        <div :class="`card ${data.length ? 'h-[446px]' : 'h-[433px]'}`">
            <div class="mb-3 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <h4 class="font-bold text-[14px] m-0 ">
                    {{ $t('analystic.top_paying_customers') }}
                </h4>
                <div v-if="data.length && !loading" class="!flex !items-center !justify-end">
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
            <div v-if="loading" class="h-[373px] top-customer">
                <Skeleton />
            </div>
            <div v-else class="">
                <a-table
                    v-if="data.length"
                    :data-source="data"
                    :pagination="false"
                    :row-key="(row) => row._id"
                    :loading="loading"
                >
                    <a-table-column
                        key="avatar"
                        title="Customer"
                        :width="250"
                    >
                        <template #default="customer">
                            <div class="flex items-center gap-3">
                                <div v-if="customer.avatar" class="flex items-center justify-center w-[48px] h-[48px] rounded-sm">
                                    <img
                                        v-if="!isImageAvailable.includes(customer._id)"
                                        :id="customer._id"
                                        :src="customer.avatar"
                                        alt="/"
                                        class="rounded-full mx-auto h-[48px] w-[48px] object-cover"
                                        @error="imageError"
                                    >
                                </div>
                                <a-avatar v-else>
                                    {{ customer.firstname?.charAt(0) }}{{ customer.lastname?.charAt(0) }}
                                </a-avatar>
                                <div class="flex flex-col items-start justify-between sm:flex-row sm:items-center w-[calc(100%-56px)]">
                                    <div class="">
                                        <h5 class="font-semibold m-0">
                                            {{ customer.firstname }} {{ customer.lastname }}
                                        </h5>
                                        <p class="!mb-0 text-[#666666]">
                                            {{ customer.email }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column
                        key="rate"
                        title=""
                        align="right"
                    >
                        <template #default="customer">
                            <h5 class="font-semibold m-0 text-right">
                                {{ (customer?.total_spent || 0).toLocaleString('de-DE') }} {{ contacts?.currency }}
                            </h5>
                            <p class="!mb-0 text-[#666666] text-right">
                                Orders: {{ customer?.total_order || 0 }}
                            </p>
                        </template>
                    </a-table-column>
                </a-table>
                <div v-else class="flex items-center justify-center flex-col h-[300px]">
                    <img class="w-[200px]" src="/images/not-chart.jpg" alt="/">
                    <h5 class="font-[600] text-[16px] m-0">
                        You don't have any customers yet
                    </h5>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
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
        async fetch() {
            if (this.contacts === null) {
                // await this.$store.dispatch('settings/contacts/fetchDetail');
            }
        },

        data() {
            return {
                isImageAvailable: [],
            };
        },
        computed: {
            ...mapState('settings/contacts', ['contacts']),
        },
        watch: {},
        methods: {
            imageError(e) {
                this.isImageAvailable = [...this.isImageAvailable, e.target.id];
            },
        },
    };
</script>
<style>
ul.ant-rate>li.ant-rate-star.ant-rate-star-full {
    margin-right: 3px !important;
}
.sales-overview  .top-customer .card-img-loading {
    padding-bottom: 108%;
}
</style>
