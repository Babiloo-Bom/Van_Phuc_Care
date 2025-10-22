<template>
    <div>
        <div class="bg-[#f4f7f9] py-0 md:py-20">
            <div class="container bg-white pt-6 pb-6 rounded-md">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div class="checkout-form">
                            <PaymentForm ref="PaymentForm" @submit="submitForm" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3 class="text-xl font-medium mb-0">
                                Giỏ hàng
                            </h3>
                            <h4 class="text-lg font-medium">
                                Khóa học/Sản phẩm đăng ký
                            </h4>
                            <div class="flex flex-col gap-6 mt-4">
                                <div v-for="(_course, index) in cart" :key="`items_cart_${index}`" class="flex justify-between gap-6 border-t-[1px] border-solid border-gray-80 pt-6 flex-wrap last:border-b-[1px] last:pb-6">
                                    <div class="w-[120px] h-[80px] order-1 md:order-none">
                                        <img
                                            class="w-full h-full object-cover rounded-sm"
                                            :src="_course.thumbnail"
                                            alt=""
                                        >
                                    </div>
                                    <div class="w-full sm:w-auto sm:flex-1 order-2 md:order-none">
                                        <h3 class="mb-2 font-medium text-lg">
                                            {{ _course.title }}
                                        </h3>
                                        <a-rate
                                            style="fontSize: 14px;color: #FFD74B; marginRight: 0px"
                                            :default-value="5"
                                            disabled
                                        />
                                        <span class="relative top-0.5 ml-2 inline-block text-[#868686]">({{ (_course.reviewsCount || 0)?.toLocaleString('en-US') }} lượt đánh giá)</span>
                                    </div>
                                    <div class="order-3 md:order-none">
                                        <h3 v-if="_course.price" class="text-xl mb-0 font-bold text-prim-100 text-end">
                                            {{ Number(_course.price).toLocaleString('de-DE') || 0 }}đ
                                        </h3>
                                        <h3 v-else class="text-xl mb-0 font-bold text-[#15CF74] text-end">
                                            Miễn phí
                                        </h3>
                                        <h3 class="text-xl mb-0 line-through font-light text-[#868686]">
                                            {{ Number(_course.priceSale).toLocaleString('de-DE') || 0 }}đ
                                        </h3>
                                        <div
                                            class="text-danger-100 mt-2 text-right cursor-pointer"
                                            @click="() => {
                                                $refs.ConfirmDialog.open(),
                                                courseSelected = _course
                                            }"
                                        >
                                            Xóa
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-start justify-between mt-6">
                                <div>
                                    <h2 class="text-2xl font-bold">
                                        Tổng cộng:
                                    </h2>
                                </div>
                                <div class="text-right">
                                    <h3 class="text-2xl mb-0 font-bold text-prim-100">
                                        {{ calculateTotal(cart, 'price').toLocaleString('de-DE') }}đ
                                    </h3>
                                    <h3 class="text-lg mb-0 font-light text-[#868686]">
                                        Tiết kiệm: {{ (calculateTotal(cart, 'priceSale') - calculateTotal(cart, 'price')).toLocaleString('de-DE') }}đ
                                    </h3>
                                </div>
                            </div>
                            <div class="mt-4">
                                <a-button
                                    :loading="loading"
                                    class="!w-[180px] !h-[45px] !rounded-sm !bg-prim-100 !text-white !text-xl !font-bold !text-center !cursor-pointer"
                                    @click="$refs.PaymentForm.submit()"
                                >
                                    Thanh toán
                                </a-button>
                                <p class="mb-0 mt-2 font-semibold">
                                    Bạn sẽ truy cập vào học ngay sau hoàn tất thanh toán bằng VNPay
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xác nhận"
            content="Bạn chắc chắn xóa khóa học này chứ"
            @confirm="() => removeProduct(courseSelected)"
        />
        <PaymentDialog ref="PaymentDialog" :loading="loading" @submit="createTransaction" />
        <ConfirmAuth
            ref="confirmAuth"
        />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import PaymentForm from '@/components/checkout/Form.vue';
    import PaymentDialog from '@/components/checkout/Dialog.vue';
    import ConfirmAuth from '@/components/auth/dialogs/AskLogin.vue';
    import {
        PAYMENT_METHODS,
    } from '@/constants/checkout';
    import {
        convertToFormData,
    } from '@/utils/form';

    export default {
        auth: false,
        components: {
            ConfirmDialog,
            PaymentForm,
            PaymentDialog,
            ConfirmAuth,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                courseSelected: null,
                loading: false,
                form: null,
            };
        },

        computed: {
            ...mapState('courses', ['cart']),
        },

        methods: {
            async submitForm(form) {
                this.form = form;
                if (form.paymentMethod === PAYMENT_METHODS.QR) {
                    this.$refs.PaymentDialog.open();
                } else {
                    try {
                        this.loading = true;
                        const { data: { data } } = await this.$api.payment.vnpay({
                            ...form,
                        });
                        window.location.replace(data);
                    } catch (error) {
                        this.$message.error('Thanh toán thất bại!');
                    } finally {
                        this.loading = false;
                    }
                }
            },
            async createTransaction(resultFile) {
                if (this.$auth.user) {
                    try {
                        this.loading = true;
                        const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({ files: resultFile }));
                        await this.$api.transactions.create({
                            title: 'Thanh toán giỏ hàng [Khóa học]',
                            items: [...this.cart],
                            customer: {
                                ...this.form,
                            },
                            total: this.calculateTotal(this.cart, 'price'),
                            paymentConfirmation: fileAttributes[0]?.source,
                            registerId: this.$auth.user?._id,
                            target: 'academy',
                            type: PAYMENT_METHODS.QR,
                            origin: 'vanphuccare.gensi.vn',
                        });
                        this.$refs.PaymentDialog.close();
                        this.$message.success('Thanh toán thành công, hãy đợi xét duyệt từ Vanphuccare');
                        this.$store.dispatch('courses/resetState');
                        this.$router.push('/');
                    } catch (error) {
                        this.$message.error('Thanh toán thất bại!');
                    } finally {
                        this.loading = false;
                    }
                } else {
                    this.$refs.confirmAuth.open();
                }
            },

            resetForm() {
                this.$refs.form.resetFields();
                this.form = _cloneDeep({ ...this.currentUser, password: '' });
            },

            calculateTotal(arr, key) {
                return arr.reduce((acc, item) => acc + Number(item[key]), 0);
            },

            async removeToCart(course) {
                await this.$store.dispatch('courses/removeToCart', course);
            },

            async fetchData() {
                try {
                    this.loading = true;
                    if (!this.cart.length) {
                        this.$message.info('Chưa có sản phẩm nào trong giỏ hàng');
                        this.$router.push('/');
                    }
                    await this.$store.dispatch('courses/fetchCart');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>
<style lang="scss">
    .checkout-form {
        .ant-form-item label::after {
            display: none !important;
        }
        .ant-form-item-control {
            @apply leading-[50px];
        }
        .ant-input {
            @apply h-[45px] px-4
        }
        .ant-form-item label {
            @apply uppercase font-medium
        }
    }
</style>
