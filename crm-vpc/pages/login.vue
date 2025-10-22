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
            <div class="flex flex-col items-center justify-center w-full h-full gap-4">
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
            <div class="p-4">
                <div>
                    <a-tabs default-active-key="1">
                        <a-tab-pane key="1" tab="Đăng nhập">
                            <LoginForm
                                class="!mt-2 min-w-[200px] max-w-md w-full"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Đăng ký" force-render>
                            <SignUpForm
                                class="!mt-2"
                            />
                        </a-tab-pane>
                    </a-tabs>

                    <div class="mt-4">
                        <a-button type="link" class="float-right !p-0 !underline !mt-auto" @click="returnMainWebsite">
                            Về trang chủ >
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LoginForm from '@/components/auth/forms/Login.vue';
    import SignUpForm from '@/components/auth/forms/SignUp.vue';

    export default {
        layout: 'auth',
        components: {
            LoginForm,
            SignUpForm,
        },
        data() {
            return {
            };
        },
        computed: {
        },
        watch: {
            '$route.query': {
                handler(query) {
                    const { username, pwd } = query;
                    if (username && pwd) {
                        this.login(username, pwd);
                    }
                },
                deep: true,
                immediate: true,
            },
        },
        methods: {
            returnMainWebsite() {
                window.open('https://vanphuccare.vn/');
            },
            async login(username, password) {
                await this.$auth
                    .loginWith('local', {
                        data: {
                            username,
                            password,
                            remindAccount: false,
                            origin: 'vanphuccare.gensi.vn',
                        },
                    })
                    .then(async () => {
                        this.$auth.$storage.setLocalStorage('data', {
                            username,
                            password,
                            remindAccount: false,
                            origin: 'vanphuccare.gensi.vn',
                        });
                        this.$message.success('Đăng nhập thành công');
                        this.$router.push('/');
                    })
                    .catch((error) => {
                        this.$handleError(error, (_error) => {
                            const errorData = _error?.response?.data;
                            this.$message.error('Tên đăng nhập hoặc mật khẩu không chính xác');
                            if (errorData?.code === 401) {
                                this.$router.push('/login');
                            }
                        });
                    })
                    .finally(async () => {
                        this.loading = false;
                    });
            },
        },
    };
</script>
<style lang="scss">
.auth-layout {
    .ant-tabs-nav {
        width: 100%;
    }

    .ant-tabs-tab {
        text-align: center;
        width: 50% !important;
        margin: 0 !important;
        font-weight: 600;
    }

    .ant-tabs-nav > div:nth-of-type(1) {
        width: 100% !important;
    }
}
</style>
