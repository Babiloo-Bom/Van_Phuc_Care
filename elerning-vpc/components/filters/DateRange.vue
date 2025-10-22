<template>
    <div>
        <div v-if="label" class="mb-2 font-semibold">
            {{ label }}
        </div>
        <div>
            <a-range-picker
                v-model="selectedValue"
                class="w-full"
                :allow-clear="allowClear"
                :ranges="presetRanges"
                :placeholder="['Từ ngày', 'Đến ngày']"
                :size="size"
                :default-value="defaultValue"
                format="DD/MM/YYYY"
                :value-format="valueFormat"
                @change="onFilter"
            >
                <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import _assign from 'lodash/assign';
    import _omit from 'lodash/omit';
    import _split from 'lodash/split';

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
            customHandler: {
                type: Boolean,
                default: false,
            },
            size: {
                type: String,
                default: 'default',
            },
            separator: {
                type: String,
            },
            prefix: {
                type: String,
                default: 'from',
            },
            suffix: {
                type: String,
                default: 'to',
            },
            value: {
                type: Array,
                default: () => [],
            },
            defaultValue: {
                type: Array,
                default: () => [],
            },
            valueFormat: {
                type: String,
                default: 'x',
            },
        },

        data() {
            let selectedValue = '';
            if (this.separator) {
                selectedValue = this.$route.query[this.query] ? _split(this.$route.query[this.query], this.separator, 2) : this.defaultValue;
            } else {
                selectedValue = [
                    this.$route.query[`${this.query}${this.prefix}`],
                    this.$route.query[`${this.query}${this.suffix}`],
                ] || this.defaultValue;
            }

            return {
                selectedValue,
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
                    let dates = [];
                    if (this.separator) {
                        dates = _split(query[this.query], this.separator, 2);
                    } else {
                        dates = [
                            this.$route.query[`${this.query}${this.prefix}`],
                            this.$route.query[`${this.query}${this.suffix}`],
                        ] || [];
                    }
                    this.$emit('input', dates);
                    this.selectValue = dates;
                },
                deep: true,
                immediate: true,
            },

            value(data) {
                this.selectValue = data;
            },
        },

        methods: {
            onFilter(dates, dateStrings) {
                if (dateStrings[0] === '' || dateStrings[1] === '') {
                    this.clear();
                } else {
                    const from = dates[0];
                    const to = dates[1];

                    if (this.customHandler) {
                        this.$emit('onChange', { from, to });
                    } else {
                        const query = this.separator
                            ? {
                                [this.query]: `${from}${this.separator}${to}`,
                            }
                            : {
                                [`${this.query}${this.prefix}`]: from,
                                [`${this.query}${this.suffix}`]: to,
                            };

                        this.$router.push({
                            query: _assign({}, this.$route.query, query),
                        });
                    }
                }
            },

            clear() {
                this.$router.push({
                    query: _assign({}, _omit(this.$route.query, [`${this.query}${this.prefix}`, `${this.query}${this.suffix}`]), {}),
                });
            },
        },
    };
</script>
