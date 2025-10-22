<template>
    <div>
        <div v-if="type === 'thumbnail'">
            <div class="flex items-center justify-center w-[48px] h-[48px] rounded-sm">
                <img
                    v-if="isImageAvailable && value.thumbnail"
                    :src="value.thumbnail"
                    alt="/"
                    class="rounded-md mx-auto h-[48px] w-[48px] object-cover"
                    @error="imageError"
                >
                <div v-else class="flex items-center justify-center w-[48px] h-[48px] rounded-sm border border-[#ebebeb]">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="m21.68 16.96-3.13-7.31c-1.06-2.48-3.01-2.58-4.32-.22l-1.89 3.41c-.96 1.73-2.75 1.88-3.99.33l-.22-.28c-1.29-1.62-3.11-1.42-4.04.43l-1.72 3.45C1.16 19.17 2.91 22 5.59 22h12.76c2.6 0 4.35-2.65 3.33-5.04ZM6.97 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="#8a8a8a"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </div>
            </div>
        </div>
        <div v-else-if="type === 'price'">
            {{ value.price | moneyFormat }}
        </div>
        <div v-else-if="type === 'name'">
            <nuxt-link :to="`/products/${value._id}`">
                <h4 class="font-bold">
                    {{ value.name }}
                </h4>
            </nuxt-link>
        </div>
        <div v-else-if="type === 'quantitySelled' || type === 'quantityInStock'">
            {{ value[type] + ` ${'sản phẩm' + (value[type] > 0 ? 's': '')}` }}
        </div>
        <div v-else-if="type === 'status'">
            <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[value.status]}]`">
                <span :class="`w-2 h-2 rounded-full bg-[${STATUS_COLOR[value.status]}]`" :style="`background-color: ${STATUS_COLOR[value.status]}`" />
                <span :style="`color: ${STATUS_COLOR[value.status]}`">{{ STATUS_LABEL[value.status] }}</span>
            </span>
        </div>
    </div>
</template>

<script>
    import { mapDataFromOptions } from '@/utils/data';
    import { PRODUCT_STATUS_OPTIONS } from '@/constants/products/status';

    export default {
        props: {
            type: String,
            value: Object,
        },
        data() {
            return {
                isImageAvailable: true,
            };
        },
        computed: {
            STATUS_LABEL() {
                return this.mapDataFromOptions(PRODUCT_STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(PRODUCT_STATUS_OPTIONS, 'value', 'color');
            },
        },
        methods: {
            mapDataFromOptions,
            imageError() {
                this.isImageAvailable = false;
            },
        },
    };
</script>
