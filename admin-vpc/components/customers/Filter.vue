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
            placeholder="Trạng thái tài khoản"
            query="status"
            :options="CUSTOMER_STATUS_OPTIONS"
        />
    </div>
</template>

<script>
    import { CUSTOMER_STATUS_OPTIONS } from '@/constants/customers/status';
    import SearchFilter from '@/components/filters/Search.vue';
    import SelectFilter from '@/components/filters/Select.vue';

    export default {
        components: {
            SearchFilter,
            SelectFilter,
        },

        data() {
            return {
                CUSTOMER_STATUS_OPTIONS,
            };
        },
    };
</script>
