<template>
    <div class="grid grid-cols-4 gap-4 grow">
        <SearchFilter
            class="col-span-2"
            :label="$t('shared.search')"
            :placeholder="$t('shared.content_search')"
            query="searchKey"
        />
        <SelectFilter
            class="col-span-2"
            :label="$t('shared.status')"
            :placeholder="$t('shared.status')"
            query="status"
            :options="ORDER_STATUS_OPTIONS"
        />
    </div>
</template>

<script>
    import { ORDER_STATUS_OPTIONS } from '@/constants/orders/status';
    import SearchFilter from '@/components/filters/Search.vue';
    import SelectFilter from '@/components/filters/Select.vue';

    export default {
        components: {
            SearchFilter,
            SelectFilter,
        },

        data() {
            return {
                ORDER_STATUS_OPTIONS,
            };
        },
    };
</script>
