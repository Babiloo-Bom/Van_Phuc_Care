<template>
    <div>
        <div v-if="label" class="text-gray-80 mb-2 font-semibold">
            {{ label }}
        </div>
        <a-select
            v-model="data"
            class="w-full"
            :size="size"
            :placeholder="placeholder"
            :allow-clear="clearable"
            show-search
            :disabled="disabled"
            :not-found-content="notFoundContent"
            @change="onChange"
        >
            <a-select-option
                v-for="(item, index) in options"
                :key="index"
                :value="item[optionValue]"
            >
                {{ item[optionLabel] }}
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
    import _assign from 'lodash/assign';
    import _omit from 'lodash/omit';

    export default {
        props: {
            label: String,
            options: {
                type: Array,
                required: true,
            },
            query: {
                type: String,
                required: true,
            },
            placeholder: {
                type: String,
                default: 'Tất cả',
            },
            size: {
                type: String,
                default: 'default',
            },
            clearable: {
                type: Boolean,
                default: true,
            },
            selectDefault: {
                type: Boolean,
                default: false,
            },
            optionLabel: {
                type: String,
                default: 'label',
            },
            optionValue: {
                type: String,
                default: 'value',
            },
            notFoundContent: {
                type: String,
                default: 'Không có dữ liệu',
            },
            disabled: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            const defaultValue = this.$route.query[this.query] || (this.selectDefault ? this.options[0][this.optionValue] : undefined);

            return {
                data: /^-?\d+$/.test(defaultValue) ? Number(defaultValue) : defaultValue,
            };
        },

        watch: {
            '$route.query': {
                handler(query) {
                    const data = query[this.query];

                    this.data = /^-?\d+$/.test(data) ? Number(data) : data;
                },
                deep: true,
                immediate: true,
            },
        },

        methods: {
            onChange() {
                this.$emit('change', this.data);
                if (this.data || this.data === 0) {
                    this.$router.push({
                        query: _assign({}, this.$route.query, {
                            [this.query]: this.data,
                            page: 1,
                        }),
                    });
                } else {
                    this.$router.push({
                        query: _assign({}, _omit(this.$route.query, [this.query]), {
                            page: 1,
                        }),
                    });
                }
            },
        },
    };
</script>
