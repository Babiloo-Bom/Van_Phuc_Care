<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            class="col-span-1"
            label="Tìm kiếm"
            placeholder="Nhập nội dung tìm kiếm"
            query="searchKey"
        />
        <SelectFilter
            class="col-span-1"
            label="Trạng thái"
            placeholder="Trạng thái ticket"
            query="status"
            :options="TICKET_STATUS_OPTIONS"
        />
        <DateRangeFilter
            class="col-span-1"
            label="Chọn ngày"
            query=""
            value-format="YYYY-MM-DD"
        />
    </div>
</template>

<script>
    import { TICKET_STATUS_OPTIONS } from '@/constants/tickets/status';
    import SearchFilter from '@/components/filters/Search.vue';
    import DateRangeFilter from '@/components/filters/DateRange.vue';
    import SelectFilter from '@/components/filters/Select.vue';

    export default {
        components: {
            SearchFilter,
            DateRangeFilter,
            SelectFilter,
        },

        data() {
            return {
                TICKET_STATUS_OPTIONS,
            };
        },
    };
</script>
