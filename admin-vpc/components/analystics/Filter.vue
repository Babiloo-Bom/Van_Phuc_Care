<template>
    <div class="grid grid-cols-2 gap-4 w-[50%] min-w-[350px]">
        <div class="flex gap-2 items-center">
            <div class="font-semibold" style="min-width: max-content">
                {{ $t('analystic.range_times') }}
            </div>
            <DateRangeFilter
                class="col-span-2 min-w-[240px]"
                label=""
                query=""
                value-format="YYYY-MM-DD"
                :default-value="[$route.query.from || undefined, $route.query.to || undefined]"
            />
        </div>
    </div>
</template>

<script>
    import DateRangeFilter from '@/components/filters/DateRange.vue';

    export default {
        components: {
            DateRangeFilter,
        },

        data() {
            return {
            };
        },
    };
</script>
