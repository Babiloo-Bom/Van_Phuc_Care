<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            class="col-span-2"
            label="Tìm kiếm"
            placeholder="Nhập nội dung tìm kiếm"
            query="searchKey"
        />
        <Date
            class="col-span-2"
            label="Chọn ngày"
            query="date"
            value-format="DD/MM/YYYY"
        />
    </div>
</template>

<script>
    import SearchFilter from '@/components/filters/Search.vue';
    import Date from '@/components/filters/Date.vue';

    export default {
        components: {
            SearchFilter,
            Date,
        },

        data() {
            return {
            };
        },
    };
</script>
