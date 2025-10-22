<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            class="col-span-2"
            label="Tìm kiếm"
            placeholder="Nhập nội dung tìm kiếm"
            query="searchKey"
        />
        <SelectFilter
            class="col-span-2"
            label="Trạng thái"
            placeholder="Trạng thái"
            query="status"
            :options="TRANSACTION_STATUS_OPTIONS"
        />
    </div>
</template>

<script>
    import { TRANSACTION_STATUS_OPTIONS } from '@/constants/transactions/status';
    import SearchFilter from '@/components/filters/Search.vue';
    import SelectFilter from '@/components/filters/Select.vue';

    export default {
        components: {
            SearchFilter,
            SelectFilter,
        },

        data() {
            return {
                TRANSACTION_STATUS_OPTIONS,
            };
        },
    };
</script>
