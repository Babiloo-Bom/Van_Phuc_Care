<!-- eslint-disable vue/no-unused-components -->
<template>
    <div class="flex flex-col items-center py-52">
        <h2 class="text-center mb-3">
            Để được cấp lại mật khẩu vui lòng liên hệ số điện thoại
        </h2>
        <a href="tel:0963395763">0963395763</a>
        <div class="flex justify-center w-full mt-5">
            <nuxt-link class="underline" to="/login">
                Đăng nhập
            </nuxt-link>
        </div>
    </div>
</template>

<script>
    // import GetOtpForm from '@/components/auth/forms/GetOtp.vue';
    // import NewPassword from '@/components/auth/forms/NewPassword.vue';

    export default {
        layout: 'auth',
        auth: 'guest',

        components: {
            // GetOtpForm,
            // NewPassword,
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
            async newPassword(form) {
                this.loading = true;

                try {
                    await this.$api.auth.newPassword(this.email, this.token, form);
                    this.$message.success('Đổi mật khẩu thành công');
                    this.loading = false;
                    this.$router.push('/login');
                } catch (e) {
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
