<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :centered="true"
        :width="800"
        :title="_isEmpty(transaction) ? 'Tạo giao dịch' : 'Chỉnh sửa giao dịch'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :rules="rules"
            :colon="false"
        >
            <div class="grid grid-cols-1 gap-y-4 mb-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-model-item label="Tên giao dịch" prop="title">
                        <a-input v-model="form.title" placeholder="Nhập tên giao dịch" />
                    </a-form-model-item>
                    <a-form-model-item label="Loại hình" prop="type">
                        <a-input v-model="form.type" placeholder="Chọn loại giao dịch" />
                    </a-form-model-item>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a-form-model-item label="Tên khách hàng" prop="customer.fullname">
                        <a-input v-model="form.customer.fullname" placeholder="Nhập tên khách hàng" />
                    </a-form-model-item>
                    <a-form-model-item label="Email" prop="customer.email">
                        <a-input v-model="form.customer.email" placeholder="Nhập email khách hàng" />
                    </a-form-model-item>
                </div>
                <a-form-model-item label="Địa chỉ" prop="customer.address">
                    <a-input v-model="form.customer.address" placeholder="Nhập địa chỉ" />
                </a-form-model-item>
            </div>
            <a-tabs
                default-active-key="1"
                type="card"
                class="mt-4"
            >
                <a-tab-pane key="1" tab="Phương thức thanh toán" force-render>
                    <a-radio-group v-model="form.customer.paymentMethod" class="!w-full" @change="changePymentMethod">
                        <div class="flex justify-between flex-wrap gap-y-2">
                            <a-radio
                                v-for="method in PAYMENT_METHODS_OPTIONS"
                                :key="method.value"
                                class="w-full sm:w-1/2"
                                :value="method.value"
                            >
                                {{ method.label }}
                            </a-radio>
                        </div>
                    </a-radio-group>

                    <div v-if="form.customer.paymentMethod === PAYMENT_METHODS.CARD" class="flex items-start space-x-4 sm:space-x-6 mt-4">
                        <div class="flex-1">
                            <a-form-model-item prop="cardNumber">
                                <a-input v-model="form.customer.cardNumber" placeholder="Số thẻ" />
                            </a-form-model-item>
                            <a-form-model-item prop="nameInCard">
                                <a-input v-model="form.customer.nameInCard" placeholder="Họ tên chủ thẻ" />
                            </a-form-model-item>
                            <div class="grid grid-cols-2 gap-4">
                                <a-form-model-item prop="exprienceDate">
                                    <a-input v-model="form.customer.exprienceDate" placeholder="Ngày hết hạn" />
                                </a-form-model-item>
                                <a-form-model-item prop="cvc">
                                    <a-input
                                        v-model="form.customer.cvc"
                                        placeholder="CVC"
                                        name="ccnum"
                                        x-autocompletetype="cc-number"
                                    />
                                </a-form-model-item>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <a-form-model-item label="Tổng tiền" prop="total">
                            <a-input v-model="form.total" placeholder="Nhập tổng giá tiền" />
                        </a-form-model-item>

                        <div class="mt-4">
                            <span class="text-base font-semibold">Hình ảnh chứng thực</span>
                            <div class="flex flex-col items-center gap-y-5 w-full">
                                <img
                                    v-if="form.paymentConfirmation"
                                    :src="form.paymentConfirmation"
                                    onerror="this.src='/images/avatar-empty.webp'"
                                    alt=""
                                    class="w-full h-[340px] rounded-md object-cover"
                                >
                                <div v-else class="w-full h-[340px] bg-gray-20 rounded-md border-dashed border border-gray-400 flex justify-center items-center">
                                    <span><i class="fas fa-plus" /></span>
                                </div>
                                <div class="flex gap-x-2">
                                    <a-upload
                                        :show-upload-list="false"
                                        action=""
                                        class="mx-auto block text-center"
                                        :transform-file="handlerThumbnail"
                                    >
                                        <div class="flex gap-x-2">
                                            <img src="/images/upload.svg" alt="avatar">
                                            Tải lên ảnh chứng thực
                                        </div>
                                    </a-upload>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Sản phẩm" force-render>
                    <div class="flex flex-col lg:flex-row">
                        <div class="w-full lg:w-[60%] xl:w-[55%] divide-y divide-gray-50/70">
                            <template v-if="cart?.length > 0">
                                <div v-for="(_course, index) in cart" :key="`items_cart_${index}`" class="flex justify-between gap-4 flex-wrap py-4">
                                    <div class="w-[120px] h-[80px] order-1 md:order-none">
                                        <img
                                            v-if="_course.thumbnail"
                                            class="w-full h-full object-cover rounded-sm"
                                            :src="_course.thumbnail"
                                            alt=""
                                        >
                                    </div>
                                    <div class="w-full sm:w-auto sm:flex-1 order-3 md:order-none">
                                        <h3 class="mb-2 font-medium">
                                            {{ _course.title }}
                                        </h3>
                                        <div class="order-2 md:order-none">
                                            <h3 v-if="_course.price" class="mb-0 font-bold text-prim-100">
                                                {{ Number(_course.price).toLocaleString('de-DE') || 0 }}đ
                                            </h3>
                                            <h3 v-else class="mb-0 font-bold text-[#15CF74]">
                                                Miễn phí
                                            </h3>
                                            <h3 class="mb-0 line-through font-light text-[#868686]">
                                                {{ Number(_course.priceSale).toLocaleString('de-DE') || 0 }}đ
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <a-empty v-else description="Không có dữ liệu" />
                        </div>
                        <div class="border-t lg:border-t-0 lg:border-l border-gray-50/70 my-10 lg:my-0 lg:mx-5 flex-shrink-0" />
                        <div class="flex-1">
                            <div class="inherit md:sticky top-28">
                                <div class="mt-7 text-sm text-gray-50 divide-y divide-gray-50/70">
                                    <div class="flex justify-between pb-4">
                                        <span class="text-gray-70">Số sản phẩm</span>
                                        <span class="text-gray-100">{{ dashboard.countCart }} sản phẩm</span>
                                    </div>
                                    <!-- <div class="flex justify-between py-4">
                                        <span class="text-gray-70">Phí vận chuyển</span>
                                        <span class="text-prim-100">Miễn phí vận chuyển</span>
                                    </div> -->
                                    <div class="flex justify-between text-gray-100 text-base pt-4">
                                        <span class="text-gray-100 ">Thành tiền</span>
                                        <span class="text-gray-100 ">{{ dashboard.sumPrice | currencyFormat }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(transaction) ? "Tạo mới" : "Thay đổi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';
    import {
        PAYMENT_METHODS, PAYMENT_METHODS_OPTIONS,
    } from '@/constants/checkout';
    import {
        validEmail, phoneValidator,
        convertToFormData,
    } from '@/utils/form';
    import _cloneDeep from 'lodash/cloneDeep';

    const defaultForm = {
        title: '',
        customer: {
            fullname: '',
            email: '',
            phoneNumber: '',
            address: '',
            cardNumber: '',
            exprienceDate: '',
            cvc: '',
            paymentMethod: PAYMENT_METHODS.QR,
        },
        total: 0,
        paymentConfirmation: null,
    };
    export default {
        components: {
        },
        props: {
        },
        data() {
            return {
                previewVisible: false,
                visible: false,
                loading: false,
                room: null,
                cart: [],

                form: {
                    title: '',
                    customer: {},
                    email: '',
                    address: '',
                    type: '',
                    total: 0,
                    _id: '',
                },
                PAYMENT_METHODS,
                PAYMENT_METHODS_OPTIONS,
                resultFile: null,
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    'customer.fullname': [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    'customer.email': [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: validEmail,
                        message: 'Vui lòng nhập đúng định dạng email',
                        trigger: ['change'],
                    }],
                    'customer.phoneNumber': [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: phoneValidator,
                        message: 'Định dạng số điện thoại không phù hợp',
                        trigger: ['change'],
                    }],
                    'customer.cardNumber': [{ required: true, message: 'Vui lòng nhập số thẻ thanh toán', trigger: 'change' }],
                    'customer.nameInCard': [{ required: true, message: 'Vui lòng nhập tên chủ thẻ', trigger: 'change' }],
                    'customer.exprienceDate': [{ required: true, message: 'Vui lòng nhập ngày hết hạn', trigger: 'change' }],
                    'customer.cvc': [{ required: true, message: 'Vui lòng nhập', trigger: 'change' }],
                },
                transaction: null,
            };
        },
        computed: {
            dashboard() {
                const cart = this.cart;
                const sumPrice = cart ? cart.map((item) => (+item.price)).reduce((a, b) => a + b, 0) : 0;
                const countCart = cart ? cart?.length : 0;
                return {
                    cart,
                    sumPrice,
                    countCart,
                };
            },
        },
        watch: {
            transaction() {
                this.form = this.transaction ? _cloneDeep({
                    ...this.transaction,
                    customer: this.transaction.customer || {},
                }) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,
            open(transaction) {
                this.transaction = transaction || {};
                this.visible = true;
                this.cart = transaction.items || [];
            },

            close() {
                this.visible = false;
            },

            changePymentMethod(e) {
                this.form.paymentMethod = e.target.value;
            },

            handlerThumbnail(file) {
                this.resultFile = file;
                this.form.paymentConfirmation = URL.createObjectURL(file);
            },

            async create() {
                try {
                    await this.$api.transactions.create({ ...this.form, status: 'active' });
                    this.$message.success('Thêm thông tin giao dịch thành công');
                } catch (error) {
                    this.$handleError(error);
                }
            },
            async update() {
                try {
                    await this.$api.transactions.update(this.transaction._id, _omit(this.form, ['_id']));
                    this.$message.success('Sửa thông tin giao dịch thành công');
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.resultFile) {
                                const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({ files: this.resultFile }));
                                this.form.paymentConfirmation = fileAttributes[0]?.source;
                            }
                            if (!this.form._id) {
                                await this.create();
                            } else {
                                await this.update();
                            }
                            this.close();
                            await this.$store.dispatch('transactions/fetchAll', this.$route.query);
                        } catch (error) {
                            console.log(error);
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>
<style lang="scss">
.add-customer .ant-form .ant-form-item {
    margin-bottom: 10px !important;
}
</style>
