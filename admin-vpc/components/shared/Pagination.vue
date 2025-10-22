<template>
    <div v-if="data.total" class="flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-2 order-2 lg:order-1">
            <a-select
                :value="pagination.pageSize || 20"
                class="w-auto"
                size="small"
                @change="(pageSize) => changePerPage(pageSize)"
            >
                <a-select-option v-for="pageSize in PAGINATION_CONFIG.PER_PAGE_OPTIONS" :key="pageSize" :value="pageSize">
                    {{ pageSize }} kết quả/trang
                </a-select-option>
            </a-select>
        </div>
        <a-pagination
            v-if="pagination && pagination.limit"
            v-model.number="pagination.page"
            class="ct-pagination order-1 lg:order-2 flex justify-center w-full lg:w-auto"
            :total="pagination.total"
            :page-size="pagination.limit"
            show-less-items
            @change="handleChangePage"
        />
        <div class="flex items-center gap-2 order-3 lg:order-3">
            <span class="whitespace-nowrap">Trang</span> <a-input-number
                v-model="goTo"
                class="!w-16 !text-center"
                size="small"
                :min="1"
                @pressEnter="handleChangePage(goTo)"
            />
        </div>
    </div>
</template>

<script>
    import _assign from 'lodash/assign';
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';
    import PAGINATION_CONFIG from '@/configs/pagination';

    export default {
        props: {
            router: {
                type: Boolean,
                default: true,
            },
            data: {
                type: Object,
                required: true,
            },
            isQuery: {
                type: Boolean,
                default: true,
            },
            query: {
                type: String,
                default: 'page',
            },
            limitQuery: {
                type: String,
                default: 'limit',
            },
        },

        data() {
            return {
                PAGINATION_CONFIG,
                pagination: _cloneDeep({
                    ...this.data,
                    page: parseInt(this.data?.page, 10),
                    pageSize: parseInt(this.data?.pageSize, 10),
                }),
                goTo: 1,
            };
        },

        watch: {
            data(value) {
                this.pagination = _cloneDeep({
                    ...value,
                    page: parseInt(value.page, 10),
                    pageSize: parseInt(value.limit, 10),
                });
                console.log(this.pagination);
                this.goTo = +value.page;
            },
        },

        methods: {
            handleChangePage(page) {
                if (this.isQuery) {
                    this.pushParam({
                        [this.query]: Number.isInteger(page) ? page : undefined,
                    });
                } else {
                    this.$emit('changePage', { page });
                }
            },

            changePerPage(pageSize) {
                if (this.isQuery) {
                    this.pushParam({
                        [this.limitQuery]: pageSize,
                        [this.query]: 1,
                    });
                } else {
                    this.$emit('changePage', { pageSize });
                }
            },

            pushParam(params) {
                this.$emit('change', {
                    ...this.pagination,
                    ...params,
                });
                if (this.router) {
                    const path = this.$route.path;

                    const otherParams = _omit(this.$route.query, Object.keys(params));
                    const query = _assign({}, otherParams, params);

                    this.$router.push({ path, query });
                }
            },
        },
    };
</script>

<style lang="scss">
    .ant-pagination-item {
        @apply overflow-hidden;
        &-link {
            i {
                top: -3px;
                @apply relative;
            }
        }
        &-active {
            @apply bg-prim-100;
            a {
                color: white !important;
            }
        }
    }
</style>
