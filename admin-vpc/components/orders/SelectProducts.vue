<template>
    <div class="flex items-end justify-between">
        <div class="w-full pr-4">
            <h4 class="text-[14px] font-[600]">
                {{ 'Sản phẩm' }}
            </h4>
            <a-select
                v-model="productsSelected"
                show-search
                mode="multiple"
                :placeholder="`Chọn sản phẩm`"
                style="width: 100%;"
                :filter-option="true"
            >
                <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0;" />
                    <div
                        style="padding: 4px 8px; cursor: pointer;"
                        @mousedown="e => e.preventDefault()"
                    >
                        <a-button type="" class="mb-1 !flex items-center !w-full gap-2 justify-center" @click="$router.push('/products/create')">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="m-0"
                            ><line
                                x1="12"
                                y1="5"
                                x2="12"
                                y2="19"
                            /><line
                                x1="5"
                                y1="12"
                                x2="19"
                                y2="12"
                            /></svg>
                            {{ 'Tạo sản phẩm' }}
                        </a-button>
                    </div>
                </div>
                <a-select-option v-for="product in products" :key="product._id" :value="JSON.stringify(product)">
                    <div class="flex items-center gap-2">
                        <img
                            class="w-[60px] h-[60px] rounded-md p-2"
                            style="border: 1px solid #ced4da;"
                            :src="product.thumbnail"
                            alt="/"
                        >
                        <div>
                            <h6 class="m-0">
                                {{ product.name }}
                            </h6>
                            <p class="m-0">
                                {{ Number(product.price) | currencyFormat }}
                            </p>
                        </div>
                    </div>
                </a-select-option>
            </a-select>
        </div>
        <a-button
            :loading="loading"
            class="min-w-[135px]"
            type="primary"
            :disabled="!productsSelected.length"
            @click="submit"
        >
            {{ 'Thêm sản phẩm' }}
        </a-button>
    </div>
</template>

<script>

    export default {
        components: {
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes,
            },
        },

        props: {
            data: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                loading: false,
                productsSelected: [],
                products: this.data ? this.data : [],
            };
        },

        watch: {
            data(value) {
                this.products = value;
            },
        },

        methods: {
            submit() {
                this.$emit('submit', this.productsSelected);
                this.productsSelected = [];
            },
        },
    };
</script>
