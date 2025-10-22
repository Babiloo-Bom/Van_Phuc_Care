<template>
    <div class="grid grid-cols-4 gap-4 w-[50%] min-w-[350px]">
        <SearchFilter
            class="col-span-2"
            label="Tìm kiếm"
            placeholder="Tìm kiếm theo tên, nội dung..."
            query="searchKey"
        />
        <DateRangeFilter
            class="col-span-2"
            label="Chọn ngày"
            query=""
            value-format="YYYY-MM-DD"
        />
    </div>
</template>

<script>
    import SearchFilter from '@/components/filters/Search.vue';
    import DateRangeFilter from '@/components/filters/DateRange.vue';

    export default {
        components: {
            SearchFilter,
            DateRangeFilter,
        },

        data() {
            return {
            };
        },
    };
</script>
