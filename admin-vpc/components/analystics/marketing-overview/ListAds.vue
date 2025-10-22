<template>
    <div>
        <a-table
            v-if="ads.length"
            :data-source="ads"
            :pagination="false"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer mt-4 !text-[13px]"
            :row-selection="{ selectedRowKeys: campainSelected, onChange: onSelectChange }"
            @expandRowByClick="handleRowClick"
        >
            <a-table-column
                key="campain"
                title="Campain"
                :width="250"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col items-start justify-between sm:flex-row sm:items-center w-[calc(100%-56px)]">
                            <div class="">
                                <h5 class="font-semibold m-0 truncate">
                                    {{ campain.name }}
                                </h5>
                            </div>
                        </div>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="view"
                title="View"
                :width="100"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <p class="font-semibold m-0">
                            {{ campain.view || '--' }}
                        </p>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="like"
                title="Like"
                :width="100"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <p class="font-semibold m-0">
                            {{ campain.like || '--' }}
                        </p>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="comments"
                title="Comments"
                :width="100"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <p class="font-semibold text-center m-0">
                            {{ campain.comments || '--' }}
                        </p>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="shareds"
                title="Shares"
                :width="100"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <p class="font-semibold m-0">
                            {{ campain.shareds || '--' }}
                        </p>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="orders"
                title="Orders"
                :width="100"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <p class="font-semibold m-0">
                            {{ campain.orders || '--' }}
                        </p>
                    </div>
                </template>
            </a-table-column>
            <a-table-column
                key="revenues"
                title="Revenues"
                :width="100"
            >
                <template #default="campain">
                    <div class="flex items-center gap-3">
                        <p class="font-semibold m-0">
                            {{ campain.revenues || '--' }}
                        </p>
                    </div>
                </template>
            </a-table-column>
        </a-table>
        <div v-else class="flex items-center justify-center flex-col">
            <img class="w-[350px] h-full mb-2" src="/images/facebook-ads-empty.png" alt="/">
            <h4 class="font-[600] text-[18px] text-center m-0">
                You don't have any ads yet
            </h4>
            <p class="font-[400] text-[14px] text-center">
                Ads created by GensTech AI help you increase revenue effectively
            </p>
            <div class="flex items-center mt-2 gap-4">
                <a-button type="primary" class="!rounded-sm " @click="$router.push({ query: { action: 'create-ads' } });">
                    Let's Start
                </a-button>
                <a-button type="outline" class="!rounded-sm ">
                    Get to Know GenAds's AI
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        props: {
            loading: {
                type: Boolean,
                default: () => false,
            },
        },
        computed: {
            ...mapState('facebook', ['page', 'ads', 'campainSelected']),
        },
        mounted() {
            this.addClickListenersToRows();
        },
        methods: {
            onSelectChange(selectedRowKeys) {
                this.selectedCampain(selectedRowKeys);
            },
            addClickListenersToRows() {
                // Get all table rows
                const rows = document.querySelectorAll('.ant-table-row');
                // Attach a click event listener to each row
                rows.forEach((row, index) => {
                    row.addEventListener('click', () => {
                        this.handleRowClick(this.ads[index]); // Pass the clicked row data
                    });
                });
            },
        },
    };
</script>
