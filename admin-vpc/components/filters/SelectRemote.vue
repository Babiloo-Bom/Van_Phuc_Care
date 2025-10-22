<template>
    <div>
        <div v-if="label" class="text-gray-80 mb-2 font-semibold">
            {{ label }}
        </div>
        <a-select
            v-model="selectValue"
            class="w-full"
            :class="[bordered ? '' : 'border-0']"
            :show-search="showSearch"
            :bordered="bordered"
            :loading="loading"
            :mode="mode"
            :placeholder="placeholder"
            :size="size"
            show-arrow
            :allow-clear="allowClear"
            :disabled="disabled"
            :filter-option="false"
            :not-found-content="null"
            @change="handleSelect"
            @search="handleSearch"
        >
            <a-select-option v-for="(item, index) in options" :key="`${storeProp}-${index}`" :value="item.value">
                {{ item.label }}
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
    import _assign from 'lodash/assign';
    import _debounce from 'lodash/debounce';
    import _get from 'lodash/get';
    import _omit from 'lodash/omit';
    import _map from 'lodash/map';
    import _join from 'lodash/join';
    import _remove from 'lodash/remove';
    import _split from 'lodash/split';
    import { mapState } from 'vuex';

    export default {
        model: {
            prop: 'value',
        },

        props: {
            label: String,
            placeholder: {
                type: String,
                default: 'Tất cả',
            },
            allowClear: {
                type: Boolean,
                default: true,
            },
            showSearch: {
                type: Boolean,
                default: true,
            },
            defaultFirst: {
                type: Boolean,
                default: false,
            },
            optionValue: {
                type: String,
                default: 'value',
            },
            optionLabel: {
                type: String,
                default: 'label',
            },
            searchKey: {
                type: String,
                default: 'keyWord',
            },
            size: {
                type: String,
                default: 'default',
            },
            fetchUrl: String,
            store: {
                type: String,
                required: true,
            },
            storeProp: {
                type: String,
                required: true,
            },
            value: [Object, String, Number, Array],
            router: {
                type: Boolean,
                default: false,
            },
            query: {
                type: String,
                default: 'q',
            },
            mode: {
                type: String,
                default: 'default',
            },
            bordered: {
                type: Boolean,
                default: true,
            },
            searchParams: Object,
            autoFetch: {
                type: Boolean,
                default: true,
            },
            customOptions: {
                type: Array,
                default: () => [],
            },
            showSelectAll: {
                type: Boolean,
                default: false,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            customHandler: Function,
        },

        data() {
            const defaultValue = this.router
                ? this.$route.query[this.query] || undefined
                : this.value;

            return {
                data: [],
                options: [],
                selectionItems: [],
                isSelectedAll: false,
                loading: false,
                fetchDebounce: null,
                selectValue: /^-?\d+$/.test(defaultValue) ? parseInt(defaultValue, 10) : defaultValue,
            };
        },

        computed: {
            ...mapState({
                state(state) {
                    return _get(state, `[${this.store}].${this.storeProp}`);
                },
            }),
        },

        watch: {
            '$route.query': {
                handler(query) {
                    if (this.router) {
                        if (/^-?\d+$/.test(query[this.query])) {
                            this.selectValue = parseInt(query[this.query], 10);
                        } else if (query[this.query]?.includes(',')) {
                            this.selectValue = _map(_split(query[this.query], ','), (value) => parseInt(value, 10));
                        } else {
                            this.selectValue = query[this.query];
                        }
                        this.$emit('input', this.selectValue);
                    }
                },
                deep: true,
                immediate: true,
            },

            value(data) {
                this.selectValue = data;
            },
        },

        async mounted() {
            if (this.autoFetch) {
                await this.fetchData();
            }
            if (this.defaultFirst) {
                this.$emit('input', this.options[0]?.value);
            }

            this.selectionItems = [...this.customOptions, ...this.state];
            this.options = _map(this.selectionItems, (option) => ({
                label: _get(option, this.optionLabel),
                value: _get(option, this.optionValue),
            }));
            _remove(this.options, (option) => !option.label || !option.value);
        },

        methods: {
            async fetchData(searchStr, params) {
                try {
                    this.loading = true;
                    if (this.fetchUrl) {
                        await this.$store.dispatch(this.fetchUrl, {
                            ...this.searchParams,
                            ...params,
                            query: {
                                [this.searchKey]: searchStr,
                                ...this.searchParams?.query,
                                ...params,
                            },
                        });
                    }
                    this.selectionItems = [...this.customOptions, ...this.state];

                    this.options = _map(this.selectionItems, (option) => ({
                        label: _get(option, this.optionLabel),
                        value: _get(option, this.optionValue),
                    }));
                    _remove(this.options, (option) => !option.label || !option.value);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async selectAll() {
                const allValue = _map(this.options, 'value');
                await this.$emit('input', allValue);
            },

            handleSelect(value) {
                this.$emit('input', value);
                this.$emit('change', value);

                const queryValue = Array.isArray(value) && value.length > 0 ? _join(value, ',') : value;

                if (this.router) {
                    if (queryValue) {
                        this.$router.push({
                            query: _assign({}, this.$route.query, {
                                [this.query]: queryValue,
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
                } else if (this.customHandler) {
                    this.customHandler(value, this.selectionItems.find((option) => _get(option, this.optionValue) === value));
                }
            },

            handleSelectAll(event) {
                event?.domEvent?.preventDefault();
                this.isSelectedAll = true;
            },

            async handleSearch(searchStr) {
                if (this.fetchDebounce) {
                    await this.fetchDebounce.cancel();
                }
                this.fetchDebounce = _debounce(async () => {
                    await this.fetchData(searchStr);
                }, 200);
                await this.fetchDebounce();
                await this.$forceUpdate();
            },
        },
    };
</script>
