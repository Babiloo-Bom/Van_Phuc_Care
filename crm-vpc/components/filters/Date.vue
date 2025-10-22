<template>
    <div>
        <div v-if="label" class="text-gray-80">
            {{ label }}
        </div>
        <div>
            <a-date-picker
                v-model="selectedValue"
                class="w-full"
                :allow-clear="allowClear"
                :placeholder="placeholder"
                :size="size"
                :default-value="defaultValue"
                :format="format"
                :value-format="valueFormat"
                :disabled-date="disabledDate"
                @change="onFilter"
            >
                <a-icon v-if="suffixIcon" slot="suffixIcon" type="calendar" />
                <div v-else slot="suffixIcon" />
            </a-date-picker>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import _assign from 'lodash/assign';
    import _omit from 'lodash/omit';

    export default {
        model: {
            prop: 'value',
        },

        props: {
            query: String,
            label: String,
            allowClear: {
                type: Boolean,
                default: true,
            },
            disabledDate: {
                type: Function,
                default: null,
            },
            placeholder: {
                type: String,
                default: 'Nhập nội dung',
            },
            customHandler: {
                type: Boolean,
                default: false,
            },
            size: {
                type: String,
                default: 'default',
            },
            value: {
                type: String,
                default: null,
            },
            defaultValue: {
                type: String,
                default: null,
            },
            format: {
                type: String,
                default: 'DD/MM/YYYY',
            },
            valueFormat: {
                type: String,
                default: 'DD/MM/YYYY',
            },
            suffixIcon: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                selectedValue: this.$route.query[this.query] || this.defaultValue,
            };
        },

        computed: {
            presetRanges() {
                return {
                    'Hôm nay': [moment(), moment()],
                    'Tuần này': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                    'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                    'Năm này': [moment().startOf('year'), moment().endOf('year')],
                };
            },
        },

        watch: {
            '$route.query': {
                handler(query) {
                    this.$emit('input', query[this.query]);
                    this.selectValue = query[this.query];
                },
                deep: true,
                immediate: true,
            },

            value(data) {
                this.selectValue = data;
            },
        },

        methods: {
            onFilter(date) {
                if (!date) {
                    this.clear();
                } else if (this.customHandler) {
                    this.$emit('onChange', date);
                } else {
                    this.$router.push({
                        query: _assign({}, this.$route.query, {
                            [this.query]: date,
                        }),
                    });
                }
            },

            clear() {
                this.$router.push({
                    query: _assign({}, _omit(this.$route.query, [this.query]), {}),
                });
            },
        },
    };
</script>
