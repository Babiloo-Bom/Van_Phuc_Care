<template>
    <div>
        <div v-if="type === 'date'">
            <span :class="`font-[600]`">{{ value[0] }}</span>
        </div>
        <div v-else-if="type === 'sessions'">
            <span :class="`font-[400]`">{{ value[1] }}</span>
        </div>
    </div>
</template>

<script>
    import { mapDataFromOptions } from '@/utils/data';
    import {
        ORDER_STATUS_OPTIONS,
    } from '@/constants/orders/status';

    export default {
        props: {
            type: String,
            value: {
                type: null,
            },
        },
        computed: {
            STATUS_LABEL() {
                return this.mapDataFromOptions(ORDER_STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(ORDER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        methods: {
            mapDataFromOptions,
        },
    };
</script>
