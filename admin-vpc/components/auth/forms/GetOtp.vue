<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-4 w-full"
    >
        <a-form-model-item label="Email" prop="email">
            <a-input
                v-model="form.email"
                :disabled="showOtp"
                size="large"
                placeholder="Nhập email"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item
            v-if="showOtp"
            label="Nhập mã OTP được gửi vào email của bạn"
            prop="otp"
        >
            <a-input
                v-model="form.otp"
                size="large"
                placeholder="Nhập OTP"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            @click="handleSubmit"
        >
            Tiếp tục
        </a-button>
    </a-form-model>
</template>

<script>
    export default {
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                form: {
                    email: '',
                    otp: '',
                },
                showOtp: false,
                rules: {
                    email: [
                        {
                            required: true,
                            message: 'Vui lòng nhập email',
                            trigger: 'blur',
                        },
                    ],
                    otp: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mã otp',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        methods: {
            async handleSubmit() {
                if (!this.showOtp) {
                    try {
                        // send otp to email
                        await this.$api.auth.forgotPassword({
                            email: this.form.email,
                        });
                        this.$message.success('Đã gửi OTP vào email');
                        this.showOtp = true;
                    } catch (e) {
                        this.$handleError(e);
                    }
                } else {
                    try {
                        // verify otp and then emit to forgot-password.vue
                        const data = await this.$api.auth.verifyOtp(this.form);
                        this.$emit('submit', {
                            email: this.form.email,
                            token: data.data.token,
                        });
                        this.$message.success('Xác thực OTP thành công!');
                    } catch (e) {
                        this.$handleError(e);
                    }
                }
            },
        },
    };
</script>
