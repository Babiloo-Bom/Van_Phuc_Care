<template>
    <a-form-model
        v-if="!showVerification"
        ref="form"
        :model="form"
        :rules="rules"
        class="w-full  custom-form"
    >
        <div class="grid grid-cols-1 gap-2.5 ">
            <a-form-model-item prop="email">
                <a-input
                    v-model="form.email"
                    size="large"
                    placeholder="Địa chỉ Email"
                    @keyup.native.enter="handleSubmit"
                />
            </a-form-model-item>
            <a-form-model-item prop="password">
                <a-input-password
                    v-model="form.password"
                    size="large"
                    placeholder="Mật khẩu"
                    @keyup.native.enter="handleSubmit"
                />
            </a-form-model-item>
            <a-form-model-item prop="repeat_password">
                <a-input-password
                    v-model="form.repeat_password"
                    size="large"
                    placeholder="Lặp lại Mật khẩu"
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
                {{ 'Đăng ký tài khoản' }}
            </a-button>
        </div>
    </a-form-model>
    <a-form-model
        v-else
        ref="formVerify"
        :model="formVerify"
        :rules="rulesVerify"
        class="space-y-4 w-full"
    >
        <a-form-model-item label="Mã xác thực" prop="otp">
            <a-input
                v-model="formVerify.otp"
                size="large"
                placeholder="Nhập mã xác thực"
                @keyup.native.enter="handleSubmitVerify"
            />
        </a-form-model-item>
        <a-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            :disabled="formVerify.otp === ''"
            @click="handleSubmitVerify"
        >
            {{ 'Xác thực' }}
        </a-button>
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import { validEmail, passwordValidtor } from '@/utils/form';

    const defaultForm = {
        email: '',
        password: '',
    };

    export default {
        data() {
            return {
                loading: false,
                form: _cloneDeep(defaultForm),
                formVerify: {
                    otp: null,
                },
                showVerification: false,
                rulesVerify: {
                    otp: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mã xác thực',
                            trigger: 'blur',
                        },
                    ],
                },
                rules: {
                    email: [
                        {
                            required: true,
                            message: 'Vui lòng nhập email',
                            trigger: 'blur',
                        },
                        {
                            validator: validEmail,
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                            trigger: 'blur',
                        },
                        {
                            validator: passwordValidtor,
                            min: 8,
                        },
                    ],
                    repeat_password: [
                        {
                            required: true,
                            message: 'Vui lòng không để trống',
                            trigger: 'blur',
                        },
                        {
                            validator: passwordValidtor,
                            min: 8,
                        },
                    ],
                },
            };
        },
        mounted() {
        },

        methods: {
            handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            await this.$axios.post('/a/sessions', {
                                ...this.form,
                                domain: 'vanphuccare.gensi.vn',
                            });
                            this.showVerification = true;
                            this.loading = false;
                        } catch (error) {
                            this.$handleError(error, (_error) => {
                                const errorData = _error?.response?.data;
                                this.error = 'Email đã được sử dụng, vui lòng nhập email khác!';
                                if (errorData?.code === 401) {
                                    console.log(errorData);
                                }
                            });
                            this.loading = false;
                        }
                    }
                });
            },

            handleSubmitVerify() {
                this.$refs.formVerify.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            await this.$axios.post('/a/sessions/verify_email', {
                                ...this.formVerify,
                                email: this.form.email,
                                origin: 'vanphuccare.gensi.vn',
                            });
                            await this.$auth
                                .loginWith('local', {
                                    data: {
                                        ...this.form,
                                        username: this.form.email,
                                        password: this.form.password,
                                        origin: 'vanphuccare.gensi.vn',
                                    },
                                })
                                .then(async () => {
                                    // login success and set data into localStorage
                                    this.$auth.$storage.setLocalStorage('data', this.form);
                                    this.$message.success('Đăng nhập thành công');
                                    this.$router.push('/');
                                })
                                .catch(() => {
                                    this.loading = false;
                                })
                                .finally(() => {
                                    this.loading = false;
                                });
                            this.loading = false;
                        } catch (error) {
                            this.loading = false;
                            this.$handleError(error, (_error) => {
                                const errorData = _error?.response?.data;
                                this.error = 'Mã xác thực không chính xác!';
                                if (errorData?.code === 401) {
                                    console.log(errorData);
                                }
                            });
                        }
                    }
                });
            },
        },
    };
</script>
