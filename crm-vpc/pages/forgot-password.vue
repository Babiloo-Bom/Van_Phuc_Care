<!-- eslint-disable vue/no-unused-components -->
<template>
    <div class="relative h-screen">
        <div
            class="absolute flex-grow hidden md:block !bg-cover !bg-center w-full h-full"
            style="background: url('/images/background-auth.png')"
        />
        <div
            class="absolute flex-grow hidden md:block !bg-cover !bg-center w-full h-full bg-[#003258] opacity-90"
        />
        <div class="absolute auth-layout grid grid-cols-1 md:grid-cols-2 top-1/2 left-1/2 w-screen md:w-[80vw] max-w-[865px] bg-[#fff] rounded-md h-[100vh] md:h-[455px]" style="transform: translate(-50%, -50%)">
            <div class="flex flex-col items-center justify-center w-full gap-4">
                <img src="/images/logo-auth.png" alt="/">
                <img class="w-[177px] h-[177px] rounded-full mt-1 hidden md:block" src="/images/image-auth.png" alt="/">
                <h3 class="text-[20px] mb-0.5 font-bold text-[#0C76BC]  hidden md:block">
                    Sổ sức khỏe điện tử
                </h3>
                <div class="grid grid-cols-2 gap-2">
                    <img src="/images/app-store.png" alt="/">
                    <img src="/images/ch-play.png" alt="/">
                </div>
            </div>
            <div class="p-4 flex items-center justify-center flex-col">
                <GetOtpForm
                    v-if="!showNewPasswordInput"
                    :loading="loading"
                    class="!mt-3 min-w-[200px] max-w-md w-full"
                    @submit="showPasswordInput"
                />
                <ForgotPassWordForm
                    v-if="showNewPasswordInput"
                    class="!mt-3 min-w-[200px] max-w-md w-full"
                    @submit="newPassword"
                />
                <div class="w-full flex items-center justify-between">
                    <a-button type="link" class="float-right !p-0 !underline !mt-4" @click="returnLogin">
                        Đăng ký/Đăng nhập
                    </a-button>
                    <a-button type="link" class="float-right !p-0 !underline !mt-4" @click="returnMainWebsite">
                        Về trang chủ >
                    </a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GetOtpForm from '@/components/auth/forms/GetOtp.vue';
    import ForgotPassWordForm from '@/components/auth/forms/NewPassword.vue';

    export default {
        layout: 'auth',
        auth: 'guest',

        components: {
            ForgotPassWordForm,
            GetOtpForm,
        },

        data() {
            return {
                loading: false,
                error: null,

                showNewPasswordInput: false,
                email: '',
                token: '',
            };
        },

        methods: {
            showPasswordInput(data) {
                if (data) {
                    this.email = data.email;
                    this.token = data.token;
                    this.showNewPasswordInput = true;
                }
            },
            returnLogin() {
                this.$router.push('/login');
            },
            returnMainWebsite() {
                window.open('https://vanphuccare.vn/');
            },
            async newPassword(form) {
                try {
                    this.loading = true;
                    await this.$api.auth.newPassword({
                        ...form,
                        email: this.email,
                        token: this.token,
                        origin: 'vanphuccare.gensi.vn',
                    });
                    this.$message.success('Cập nhật mật khẩu thành công');
                    await this.$auth
                        .loginWith('local', {
                            data: {
                                username: this.email,
                                password: form.newPassword,
                                origin: 'vanphuccare.gensi.vn',
                            },
                        })
                        .then(async () => {
                            this.$auth.$storage.setLocalStorage('data', {
                                username: this.email,
                                password: form.newPassword,
                                origin: 'vanphuccare.gensi.vn',
                            });
                            this.$message.success('Đăng nhập thành công');
                            this.$router.push('/');
                        }).catch((error) => {
                            this.$handleError(error, (_error) => {
                                const errorData = _error?.response?.data;
                                this.error = 'Tên đăng nhập hoặc mật khẩu không chính xác';
                                if (errorData?.code === 401) {
                                    this.$router.push('/login');
                                }
                            });
                        })
                        .finally(async () => {
                            this.loading = false;
                        });
                    this.loading = false;
                } catch (e) {
                    this.loading = false;
                    this.$handleError(e);
                }
            },
        },

        head() {
            return {
                title: 'Lấy lại mật khẩu',
            };
        },
    };
</script>
