<template>
    <div>
        <div v-if="!loading" class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-order">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push(`/orders/${$route.params.id}`)">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                        <h4 class="m-0 text-[20px] font-bold ">
                            {{ $t('order.refund') }}
                        </h4>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12 mt-4 gap-5">
                <div class="col-span-8">
                    <div class="card">
                        <h4 class="text-[14px] m-0 !mb-3 font-[600]">
                            {{ $t('order.reason_for_refund') }}
                        </h4>
                        <a-textarea
                            v-model="form.notes"
                            :placeholder="$t('other.typing_note')"
                            :auto-size="{ minRows: 8, maxRows: 8 }"
                        />
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="card !pb-[1px]">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="m-0 text-[14px] font-[600]">
                                {{ $t('order.summary') }}
                            </h4>
                        </div>
                        <div class="pt-3 mb-3" style="border-top: 1px solid #e3e3e3">
                            <h4 class="m-0 text-[14px] font-[600] !mb-2">
                                {{ $t('order.refund_amount') }}
                            </h4>
                            <a-input
                                v-model="form.totalRefund"
                                class=""
                                size="large"
                                addon-after="VNĐ"
                                :placeholder="$t('form.enter_amount')"
                            />
                        </div>
                        <div class="mt-5 py-3" style="border-top: 1px solid #e3e3e3">
                            <a-button
                                :loading="loadingRefund"
                                class="w-full"
                                type="primary"
                                :disabled="!((totalBill(form) > (Number(form.totalRefund))) && Number(form.totalRefund) > 0 && form.notes !== '')"
                                @click="createRefund"
                            >
                                {{ $t('order.refund') }}
                            </a-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-full">
            <div class="race-by " />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';

    export default {
        components: {
        },
        props: {
        },
        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
                loadingRefund: false,
                loadingTimeline: false,
                form: {
                    products: [],
                    totalRefund: 0,
                    customer: null,
                    transportFee: null,
                    discount: null,
                    payment: {
                        status: false,
                    },
                    notes: '',
                },
                data: [],
                productsSelected: [],
                fetching: false,
                showEditNote: false,
            };
        },
        computed: {
            ...mapState('orders', ['order']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
            order(newValue) {
                this.form = _cloneDeep({
                    ...newValue,
                    products: newValue.products.map((e) => ({ ...e, quantityReturn: 0 })),
                });
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: this.$t('order.refund'),
                link: `/orders/${this.$route.params.id}/refund`,
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('orders/fetchDetail', this.$route.params.id);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async createRefund() {
                try {
                    this.loadingRefund = true;
                    await this.$store.dispatch('orders/refund', {
                        notes: this.form.notes,
                        totalRefund: Number(this.form.totalRefund),
                        code: Number(this.$route.params.id),
                        timeline: `${this.$t('order.refundable')} ${this.form.totalRefund} USD`,
                    });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingRefund = false;
                }
            },
            handleNumberInput(id) {
                // Find the index of the product with the specified _id
                const productIndex = this.form.products.findIndex((product) => product._id === id);

                // If the product is found in the array, update its quantity
                if (productIndex !== -1 && this.form.products[productIndex].quantityReturn < 0) {
                    this.form.product[productIndex].quantityReturn = 0;
                    // if (this.form.products[productIndex].quantityReturn < this.form.products[productIndex].quantity) {
                    //     return true; // Return true to indicate that the update was successful
                    // }
                    return true; // Return true to indicate that the update was successful
                }
                return false; // Return false to indicate that the product was not found
            },
            totalPrice(data) {
                return (data || []).reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0);
            },

            totalBill(data) {
                const transportPrice = data.transportFee ? Number(data?.transportFee.price) : 0;
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
        },

        head() {
            return {
                title: this.$route.params.id ? this.$t('order.detail') : this.$t('order.create'),
            };
        },
    };
</script>
<style lang="scss">
.detail-order {
    button.back:hover {
        background-color: #e3e3e3 !important;
    }
}
.ant-select-dropdown-menu-item {
    padding: 5px 10px !important;
}
.ant-select-selection--multiple .ant-select-selection__choice__content {
    img {
        display: none;
    }
}
</style>
