<!-- eslint-disable vue/no-unused-components -->
<template>
    <div class="flex flex-col items-center">
        <a-alert
            v-if="error"
            class="!mt-3 w-full"
            :message="error"
            type="warning"
            show-icon
        />
        <LoginForm
            :loading="loading"
            class="!mt-3 min-w-[200px] max-w-md w-full"
            @submit="login"
        />
        <div class="mt-5 flex justify-end w-full px-6">
            <span class="hover:underline cursor-pointer" @click="$refs.ConfirmDialog.open()">
                Quên mật khẩu ?
            </span>
        </div>

        <ConfirmDialog ref="ConfirmDialog" title="Quên mật khẩu" :footer="false">
            <div class="text-center">
                <h2 class="text-center mb-3">
                    Để được cấp lại mật khẩu vui lòng liên hệ số điện thoại
                </h2>
                <a class="text-3xl" href="tel:0963395763">0963395763</a>
            </div>
        </ConfirmDialog>
    </div>
</template>

<script>
    import LoginForm from '@/components/auth/forms/Login.vue';
    import { message } from 'ant-design-vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        layout: 'auth',

        auth: 'guest',

        components: {
            ConfirmDialog,
            LoginForm,
        },

        data() {
            return {
                encryptor: null,
                loading: false,
                error: null,
            };
        },

        mounted() {
            // encrypt password
            const { JSEncrypt } = require('jsencrypt');
            this.encryptor = (msg) => {
                const encrypt = new JSEncrypt();
                encrypt.setPublicKey(process.env.RSA_PUBLIC_KEY);

                return encrypt.encrypt(msg);
            };
        },

        methods: {
            login(form) {
                this.loading = true;

                this.$auth
                    .loginWith('local', {
                        data: {
                            ...form,
                            origin: 'vanphuccare.gensi.vn',
                        },
                    })
                    .then(async () => {
                        // login success and set data into localStorage
                        this.$auth.$storage.setLocalStorage('data', {
                            ...form,
                            origin: 'vanphuccare.gensi.vn',
                        });
                        message.success('Đăng nhập thành công');
                        this.$router.push('/');
                    })
                    .catch((error) => {
                        this.$handleError(error, (_error) => {
                            const errorData = _error?.response?.data;
                            this.error = 'Tên đăng nhập hoặc mật khẩu không chính xác';
                            if (errorData?.code === 401) {
                                this.$forceUpdate();
                            }
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
        },

        head() {
            return {
                title: 'Đăng nhập',
            };
        },
    };
</script>
