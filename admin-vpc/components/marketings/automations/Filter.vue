<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SearchFilter
            class="col-span-2"
            label="Tìm kiếm"
            placeholder="Nhập nội dung tìm kiếm"
            query="searchKey"
        />
    </div>
</template>

<script>
    import { CUSTOMER_STATUS_OPTIONS } from '@/constants/customers/status';
    import SearchFilter from '@/components/filters/Search.vue';

    export default {
        components: {
            SearchFilter,
        },

        data() {
            return {
                CUSTOMER_STATUS_OPTIONS,
            };
        },
    };
</script>
