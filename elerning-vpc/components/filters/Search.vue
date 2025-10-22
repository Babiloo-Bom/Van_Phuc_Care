<template>
    <div>
        <div v-if="label" class="text-gray-80 mb-2 font-semibold">
            {{ label }}
        </div>
        <a-input-search
            v-model="searchKey"
            :placeholder="placeholder"
            class="search-filter"
            :size="size"
            :enter-button="false"
            :allow-clear="clearable"
            @keyup.native.enter="onSearch"
            @change="onSearch"
            @search="onSearch"
        />
    </div>
</template>

<script>
    import _assign from 'lodash/assign';
    import _map from 'lodash/map';
    import _omit from 'lodash/omit';
    import _debounce from 'lodash/debounce';

    export default {
        props: {
            label: String,
            value: String,
            icon: String,
            placeholder: {
                type: String,
                default: 'Tìm kiếm',
            },
            size: {
                type: String,
                default: 'default',
            },
            query: {
                type: String,
                default: 'searchKey',
            },
            clearable: {
                type: Boolean,
                default: true,
            },
            mode: {
                type: String,
                default: 'string',
            },
        },

        data() {
            return {
                searchDebounce: null,
                searchKey: this.$route.query[this.query] || this.value,
            };
        },

        watch: {
            '$route.query': {
                handler(query) {
                    this.searchKey = query[this.query];
                    this.onSearch();
                },
                deep: true,
                immediate: true,
            },
        },

        async mounted() {
            await this.onSearch();
        },

        methods: {
            async onSearch() {
                if (this.searchDebounce) {
                    await this.searchDebounce.cancel();
                }
                this.searchDebounce = _debounce(async () => {
                    if (this.mode === 'number' && !!this.searchKey) {
                        this.searchKey = this.searchKey.replace(/\D/g, '');
                    }
                    this.$emit('input', this.searchKey);
                    this.$emit('change', this.searchKey);
                    if (this.query && this.searchKey) {
                        this.$router.push({
                            query: _assign({}, _omit(this.$route.query, _map(this.options, 'value')), {
                                [this.query]: this.searchKey.trim(),
                                page: 1,
                            }),
                        });
                    }

                    if (!this.searchKey) {
                        this.$router.push({
                            query: _assign({}, _omit(this.$route.query, [this.query])),
                        });
                    }
                }, 200);
                await this.searchDebounce();
            },

            onChange() {
                if (!this.searchKey) {
                    this.$router.push({
                        query: _assign({}, _omit(this.$route.query, [this.query])),
                    });
                }
            },
        },
    };
</script>
