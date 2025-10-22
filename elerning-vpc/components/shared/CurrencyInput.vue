<template>
    <a-input-number
        ref="input"
        v-model="inputValue"
        :size="size"
        :min="0"
        :disabled="disabled"
        class="block !w-full"
        :formatter="value => value ? `${value}${symbol}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : undefined"
        :parser="value => value.replace(new RegExp(`\\${symbol}\\s*|(\\.*)`, 'g'), '')"
        :placeholder="placeholder"
        @change="handleChange"
    />
</template>

<script>
    export default {
        model: {
            prop: 'value',
        },

        props: {
            value: {
                type: Number,
                default: null,
            },
            size: String,
            min: {
                type: Number,
                default: undefined,
            },
            max: {
                type: Number,
                default: undefined,
            },
            symbol: {
                type: String,
                default: '₫',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: 'Nhập nội dung',
            },
        },

        data() {
            return {
                inputValue: /^-?\d+$/.test(this.value) ? parseInt(this.value, 10) : this.value,
            };
        },

        watch: {
            value(data) {
                this.inputValue = data;
            },
        },

        methods: {
            handleChange(value) {
                this.$emit('input', value);
                this.$emit('change', value);
            },
        },
    };
</script>
