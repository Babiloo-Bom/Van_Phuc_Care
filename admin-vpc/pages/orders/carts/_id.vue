<template>
    <div>
        <div v-if="!loading" class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-order">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/orders/carts')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full flex-wrap gap-3">
                    <div class="flex items-center flex-wrap">
                        <h5 class="my-0 sm:text-[20px] font-bold text-[#53c66e] text-lg !mr-2">
                            #{{ form._id }}
                        </h5>
                        <span class="mr-2 lg:inline hidden">-</span>
                        <span v-if="form._id"> {{ form.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a-button type="dashed" class="gap-2 !p-4 !flex items-center justify-center !h-[23px] !bg-[transparent]" @click="copyCheckoutURL(form._id)">
                            <span class="text-[#161a21] font-[500]">Copy URL</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                d="M8 12.2h7M8 16.2h4.38M10 6h4c2 0 2-1 2-2 0-2-1-2-2-2h-4C9 2 8 2 8 4s1 2 2 2Z"
                                stroke="#161a21"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /><path
                                d="M16 4.02c3.33.18 5 1.41 5 5.98v6c0 4-1 6-6 6H9c-5 0-6-2-6-6v-6c0-4.56 1.67-5.8 5-5.98"
                                stroke="#161a21"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /></svg>
                        </a-button>
                        <a-dropdown v-if="form._id" placement="bottomRight">
                            <template #overlay>
                                <a-menu @click="handleActionOrder">
                                    <a-menu-item key="printOrder">
                                        <span class="">{{ $t('order.print_packing_slip') }}</span>
                                    </a-menu-item>
                                    <a-menu-item key="cancelOrder">
                                        <span class="text-[#ff4d4f]">{{ $t('shared.cancel') }} <span class="lowercase">{{ $t('order.name') }}</span></span>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button type="primary" class="gap-2 !p-4 !flex items-center justify-center !h-[23px] !border-0 !bg-[#53c66e]">
                                <span class="text-[#fff] font-[500]">{{ $t('shared.update') }} <span class="lowercase">{{ $t('order.name') }}</span></span>
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 !mb-[1px] w-[18px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#fff" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                            </a-button>
                        </a-dropdown>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-12 mt-4 gap-5">
                <div class="lg:col-span-8 col-span-12">
                    <div class="card overflow-scroll">
                        <div v-if="form.items?.length" class="min-w-[390px]">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-5">
                                    <h6 class="font-bold">
                                        {{ $t('shared.product') }}
                                    </h6>
                                </div>
                                <div class="col-span-3">
                                    <h6 class="text-center font-bold">
                                        {{ $t('shared.quantity') }}
                                    </h6>
                                </div>
                                <div class="col-span-4">
                                    <h6 class="text-center font-bold">
                                        {{ $t('shared.total') }}
                                    </h6>
                                </div>
                            </div>
                            <div
                                v-for="(record) in form.items"
                                :key="record._id"
                                class="grid grid-cols-12 gap-4 py-3 items-center"
                                style="border-top: 1px solid #ebebeb"
                            >
                                <div class="col-span-5 flex items-start gap-2">
                                    <img
                                        class="w-[60px] h-[60px] rounded-md p-2"
                                        style="border: 1px solid #ced4da;"
                                        :src="record.thumbnail"
                                        alt="/"
                                    >
                                    <div>
                                        <h6 class="m-0">
                                            {{ record.name }}
                                        </h6>
                                        <p class="m-0">
                                            {{ Number(record.price).toLocaleString('de-DE') }} đ
                                        </p>
                                    </div>
                                </div>
                                <div class="col-span-3 flex items-center justify-center">
                                    <span>{{ record.number }}</span>
                                </div>
                                <div class="col-span-4  flex items-center justify-center">
                                    <p class="m-0 text-center">
                                        {{ (parseInt(record.number || 1) * parseInt(record.price)).toLocaleString('de-DE') }} đ
                                    </p>
                                </div>
                                <div v-if="!form._id" class="col-span-1">
                                    <a-button type="text" class="!p-1 !w-[31px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="removeProductFromOrder(record._id)">
                                        <svg
                                            viewBox="0 0 20 20"
                                            class="!m-0 w-[23px] h-[23px]"
                                            focusable="false"
                                            aria-hidden="true"
                                        ><path fill="#8e8e8e" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#8e8e8e" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#8e8e8e" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card mt-4">
                        <div class="w-full pr-4">
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="text-[14px] m-0 font-[600]">
                                    {{ $t('other.payment') }}
                                </h4>
                            </div>
                        </div>
                        <div class="rounded-sm p-3 mx-1" style="border:1px solid #e3e3e3">
                            <div class="flex items-center justify-between mb-3">
                                <p class="m-0">
                                    {{ $t('other.subtotal') }}
                                </p>
                                <p class="m-0">
                                    {{ totalPrice(form.items).toLocaleString('de-DE') }} đ
                                </p>
                            </div>
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex gap-[6px]">
                                    <p class="m-0">
                                        {{ $t('other.discount') }}
                                    </p>
                                    <p v-if="form.discount" class="m-0">
                                        - {{ form.discount.name }}
                                    </p>
                                </div>
                                <p v-if="form.discount" class="m-0">
                                    {{ Number(form.discount.price).toLocaleString('de-DE') }}
                                    {{ form.discount.type === 'percentage' ? '%' : 'đ' }}
                                </p>
                                <p v-else class="m-0">
                                    0 đ
                                </p>
                            </div>
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex gap-[6px]">
                                    <p class="m-0">
                                        {{ $t('other.shipping_fee') }}
                                    </p>
                                    <p v-if="form.transportFee" class="m-0">
                                        - {{ form.transportFee.name }}
                                    </p>
                                </div>
                                <p class="m-0">
                                    {{ (form.transportFee ? form.transportFee.price : 0).toLocaleString('de-DE') }} đ
                                </p>
                            </div>
                            <div class="flex items-center justify-between">
                                <p class="m-0 font-bold text-[15px]">
                                    {{ $t('shared.total') }}
                                </p>
                                <p class="m-0 font-bold text-[15px]">
                                    {{ totalBill(form).toLocaleString('de-DE') }} đ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-4 col-span-12">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <h4 class="m-0 text-[14px] font-[600]">
                                {{ $t('other.note') }}
                            </h4>
                            <a-button type="text" class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]" @click="editNotes">
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 w-[23px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#8e8e8e" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                            </a-button>
                        </div>
                        <div class="mt-3 pt-3" style="border-top: 1px solid #e3e3e3">
                            <p v-if="!showEditNote" class="m-0">
                                {{ form.notes ? form.notes : $t('other.note_empty') }}
                            </p>
                            <div v-else>
                                <a-textarea
                                    v-model="form.notes"
                                    :placeholder="$t('other.typing_note')"
                                    :auto-size="{ minRows: 4, maxRows: 5 }"
                                    @blur="submitNotes"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="card mt-4 !pb-[1px]">
                        <div class="flex items-center justify-between">
                            <h4 class="m-0 text-[14px] font-[600]">
                                {{ $t('customer.name') }}
                            </h4>
                        </div>
                        <div class="mt-3" style="border-top: 1px solid #e3e3e3">
                            <div class="pt-2 mt-1">
                                <p>Email: {{ form.customer ? form.customer.email : '--' }}</p>
                                <p>{{ 'Số điện thoại' }}: {{ form.customer ? form.customer.phone : '--' }}</p>
                                <p>{{ 'Địa chỉ' }}: {{ form.customer ? form.customer.address : '--' }}</p>
                            </div>
                            <div class="pt-4 mt-1" style="border-top: 1px solid #ced4da">
                                <p>{{ $t('other.note') }}: {{ form.customer?.note ? form.customer.note : $t('other.note_empty') }}</p>
                            </div>
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
                loadingCreate: false,
                loadingTimeline: false,
                form: {
                    products: [],
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
            ...mapState('orders/carts', ['cart']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Chi tiết giỏ hàng',
                link: '/orders',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.$route.params.id !== 'create') {
                        await this.$store.dispatch('orders/carts/fetchDetail', this.$route.params.id);
                        this.form = _cloneDeep(this.cart);
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            editNotes() {
                this.showEditNote = true;
            },
            submitNotes() {
                this.showEditNote = false;
            },
            totalPrice(data) {
                return (data || []).reduce((accumulator, product) => accumulator + (product.price * product.number), 0);
            },

            totalBill(data) {
                const transportPrice = data?.transportFee ? Number(data?.transportFee.price) : 0;
                const productTotal = Number(this.totalPrice(data.items));

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

            handleActionInforBill(value) {
                if (value.key === 'discount') {
                    this.$refs.discountModal.open();
                } else if (value.key === 'transportFee') {
                    this.$refs.transportFeeModal.open();
                } else {
                    // eslint-disable-next-line no-console
                    console.log(value.key);
                }
            },
            async createOrder() {
                try {
                    this.loadingCreate = true;
                    await this.$store.dispatch('orders/create', {
                        ...this.form,
                        customer: {
                            _id: this.form.customer._id,
                            fullname: this.form.customer.fullname,
                            email: this.form.customer.email,
                            address: this.form.customer.address,
                            phone: this.form.customer.phone,
                            notes: this.form.customer.notes,
                        },
                    });
                    this.loadingCreate = false;
                    this.$store.dispatch('orders/fetchAll');
                    this.$router.push(`/orders/${this.order.code}`);
                } catch (e) {
                    this.$handleError(e);
                }
            },
            copyCheckoutURL(id) {
                try {
                    const input = document.createElement('input');
                    input.setAttribute('value', `${this.$auth.user.domain}/checkout/${id}`);
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                    this.$message.success('Copy thành công!');
                } catch (error) {
                    this.$message.error('Có lỗi xảy ra vui lòng thử lại sau');
                }
            },
            async handleActionOrder(value) {
                if (value.key === 'cancelOrder') {
                    this.$refs.cancelOrderModal.open();
                } else if (value.key === 'printOrder') {
                    this.$refs.html2Pdf.generatePdf();
                } else {
                    // eslint-disable-next-line no-console
                    console.log('Notfound Key');
                }
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
