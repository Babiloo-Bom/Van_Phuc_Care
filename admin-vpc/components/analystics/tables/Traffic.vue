<template>
    <div>
        <a-table
            :data-source="pages"
            :pagination="false"
            :scroll="{ x: 700 }"
            :row-key="(row) => row._id"
            :loading="loading"
        >
            <a-table-column
                key="page"
                title="Page"
                :width="150"
            >
                <template #default="page">
                    <span class="!font-bold">{{ `/${page.slug}` }}</span>
                </template>
            </a-table-column>
            <a-table-column
                key="share"
                title="Average response time"
                :width="120"
            >
                <template #default="page">
                    <span v-if="page.response_time" class="font-medium flex items-center" :class="[+share <= 50 ? 'text-warning-100' : +share > 50 && +share <= 70 ? 'text-success-100' : 'text-danger-100']">
                        <span class="w-2 h-2 rounded-full mr-1 relative -top-[1px]" :class="[+share <= 50 ? 'bg-warning-100' : +share > 50 && +share <= 70 ? 'bg-success-100' : 'bg-danger-100']" /> {{ share }}%
                    </span>
                    <span v-else>--</span>
                </template>
            </a-table-column>
            <a-table-column
                key="preview"
                title="Session"
                :width="100"
            >
                <template #default="page">
                    <span class="">
                        {{ convertPrice(+page.view) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                key="nearest_access"
                data-index="createdAt"
                title="Nearest access"
                :width="100"
            >
                <template #default="createdAt">
                    <span class="block">{{ createdAt | dateFormat('h:mm:ss') }}</span>
                    <span class="block">{{ createdAt | dateFormat('dd/MM/yyyy') }}</span>
                </template>
            </a-table-column>
        </a-table>
        <ct-pagination v-if="pagination.total > 12" :data="pagination" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { convertPrice } from '@/utils/data';

    export default {
        components: {
        },

        props: {
            traffics: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                loading: false,
                convertPrice,
            };
        },
        computed: {
            ...mapState('pages', ['pages', 'pagination']),
        },

        methods: {
        },
    };
</script>
