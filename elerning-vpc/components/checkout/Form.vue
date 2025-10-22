<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
    >
        <div>
            <h3 class="text-xl font-medium">
                Thông tin khách hàng
            </h3>
            <a-form-model-item prop="fullname">
                <a-input v-model="form.fullname" placeholder="Họ và tên" />
            </a-form-model-item>
            <a-form-model-item prop="email">
                <a-input v-model="form.email" placeholder="Nhập Email" />
            </a-form-model-item>
            <a-form-model-item prop="phoneNumber">
                <a-input v-model="form.phoneNumber" placeholder="Số điện thoại" />
            </a-form-model-item>
            <a-form-model-item>
                <a-input v-model="form.address" placeholder="Địa chỉ" />
            </a-form-model-item>
        </div>
        <div class="mt-6">
            <h3 class="text-xl font-medium">
                Phương thức thanh toán
            </h3>
            <div>
                <a-radio-group v-model="form.paymentMethod" class="!w-full">
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

                <div v-if="form.paymentMethod === PAYMENT_METHODS.CARD" class="flex items-start space-x-4 sm:space-x-6 mt-4">
                    <div class="flex-1">
                        <a-form-model-item prop="cardNumber">
                            <a-input v-model="form.cardNumber" placeholder="Số thẻ" />
                        </a-form-model-item>
                        <a-form-model-item prop="nameInCard">
                            <a-input v-model="form.nameInCard" placeholder="Họ tên chủ thẻ" />
                        </a-form-model-item>
                        <div class="grid grid-cols-2 gap-4">
                            <a-form-model-item prop="exprienceDate">
                                <a-input v-model="form.exprienceDate" placeholder="Ngày hết hạn" />
                            </a-form-model-item>
                            <a-form-model-item prop="cvc">
                                <a-input
                                    v-model="form.cvc"
                                    placeholder="CVC"
                                    name="ccnum"
                                    x-autocompletetype="cc-number"
                                />
                            </a-form-model-item>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import {
        PAYMENT_METHODS, PAYMENT_METHODS_OPTIONS,
    } from '@/constants/checkout';
    import { validEmail, phoneValidator } from '@/utils/form';

    const defaultForm = {
        fullname: '',
        email: '',
        phoneNumber: '',
        address: '',
        cardNumber: '',
        exprienceDate: '',
        cvc: '',
        paymentMethod: PAYMENT_METHODS.QR,
        domain: 'vanphuccare.gensi.vn',
    };

    export default {
        data() {
            return {
                PAYMENT_METHODS,
                PAYMENT_METHODS_OPTIONS,
                form: this.$auth.user?.email ? _cloneDeep({
                    email: this.$auth.user.email,
                    id: this.$auth.user._id,
                    phoneNumber: this.$auth.user.phone,
                    address: this.$auth.user.address,
                    paymentMethod: PAYMENT_METHODS.QR,
                    domain: 'vanphuccare.gensi.vn',
                    fullname: this.$auth.user.fullname || this.$auth.user.fullName || `${this.$auth.user.firstName} ${this.$auth.user.lastName}`,
                }) : _cloneDeep(defaultForm),
                rules: {
                    fullname: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    email: [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: validEmail,
                        message: 'Vui lòng nhập đúng định dạng email',
                        trigger: ['change'],
                    }],
                    phoneNumber: [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: phoneValidator,
                        message: 'Định dạng số điện thoại không phù hợp',
                        trigger: ['change'],
                    }],
                    cardNumber: [{ required: true, message: 'Vui lòng nhập số thẻ thanh toán', trigger: 'change' }],
                    nameInCard: [{ required: true, message: 'Vui lòng nhập tên chủ thẻ', trigger: 'change' }],
                    exprienceDate: [{ required: true, message: 'Vui lòng nhập ngày hết hạn', trigger: 'change' }],
                    cvc: [{ required: true, message: 'Vui lòng nhập', trigger: 'change' }],
                },
            };
        },

        methods: {
            submit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$emit('submit', {
                            ...this.form,
                            inforCard: this.form.paymentMethod === PAYMENT_METHODS.CARD ? this.inforCard : undefined,
                        });
                    }
                });
            },
        },
    };
</script>
