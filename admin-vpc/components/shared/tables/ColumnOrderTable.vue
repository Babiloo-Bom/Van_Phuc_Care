<template>
    <div>
        <div v-if="type === 'code'">
            <span :class="`font-bold ${value.archived?.status ? 'text-[#a8a6a6]' : 'text-[#53c66e]'} ${value.status !== 'canceled' ? '' : 'line-through'}`">#{{ value.code }}</span>
        </div>
        <div v-else-if="type === 'createdAt'">
            <span :class="`${value.archived?.status ? 'text-[#a8a6a6]' : ''} ${value.status !== 'canceled' ? '' : 'line-through'}`">{{ value.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
        </div>
        <div v-else-if="type === 'customer'">
            <h4 :class="`${value.archived?.status ? 'text-[#a8a6a6]' : ''} ${value.status !== 'canceled' ? '' : 'line-through'} truncate`">
                {{ value.customer?.email }}
            </h4>
        </div>
        <div v-else-if="type === 'price'">
            <span :class="`${value.archived?.status ? 'text-[#a8a6a6]' : ''} ${value.status !== 'canceled' ? '' : 'line-through'}`">{{ totalBill(value) | currencyFormat }}</span>
        </div>
        <div v-else-if="type === 'products'">
            <span :class="`${value.archived?.status ? 'text-[#a8a6a6]' : ''} ${value.status !== 'canceled' ? '' : 'line-through'}`">{{ handleTotalProduct(value.products) + ` ${'sản phẩm' + (handleTotalProduct(value.products) > 0 ? 's': '')}`}}</span>
        </div>
        <div v-else-if="type === 'status'">
            <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[value.status]}]`">
                <span :class="`w-2 h-2 rounded-full bg-[${STATUS_COLOR[value.status]}]`" />
                <span :style="`color: ${STATUS_COLOR[value.status]}`">{{ STATUS_LABEL[value.status] }}</span>
            </span>
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
            value: Object,
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
            totalPrice(data) {
                return data.reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0);
            },
            totalBill(data) {
                const transportPrice = data.transportFee ? Number(data.transportFee.price) : 0;
                const productTotal = Number(this.totalPrice(data.products));

                if (data.discount) {
                    if (data.discount.type === 'percentage') {
                        const discountPercentage = Number(data.discount.price) / 100;
                        return productTotal * (1 - discountPercentage) + transportPrice;
                    } if (data.discount.type === 'amount') {
                        return productTotal - Number(data.discount.price) + transportPrice;
                    }
                }

                return productTotal + transportPrice;
            },
            handleTotalProduct(arr) {
                return arr.reduce((accumulator, currentValue) => accumulator + Number(currentValue.quantity), 0);
            },
        },
    };
</script>
