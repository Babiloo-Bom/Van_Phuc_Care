<template>
    <div>
        <a :href="googleAuth" class="h-[40px] flex items-center justify-center gap-4 bg-[#1878f0]  !px-6 mx-auto cursor-pointer w-full !rounded-sm">
            <img class="w-4 h-4" src="/images/facebook.svg" alt="google">
            <span class="font-[500] text-[12px] text-white">Đăng nhập bằng Facebook</span>
        </a>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
            },
        },
        computed: {
            googleAuth() {
                return `${process.env.API_HOST}/a/sessions/google/login`;
            },
        },
        methods: {
            openGoogleLoginPopup() {
                this.$auth.loginWith('google')
                    .then(() => {
                        console.log(this.$auth.user);
                        alert(JSON.stringify(this.$auth));
                        // Handle successful login
                    })
                    .catch((error) => {
                        if (error.message === 'Popup window closed') {
                            // Handle popup closure
                        } else {
                            // Handle other errors
                        }
                    });
            },
            openLoginWindow(loginUrl) {
                // Your original openLoginWindow logic here
                const leftPosition = window.screen.width / 2 - (600 / 2 + 10);
                const topPosition = window.screen.height / 2 - (800 / 2 + 10);
                const windowScreenSize = `width=600,height=800,left=${leftPosition},top=${topPosition}`;
                const newWindow = window.open(`${loginUrl}`, '', windowScreenSize);

                // Handle window closed and data loading here
                const checkClosedInterval = setInterval(async () => {
                    if (newWindow && newWindow.closed) {
                        clearInterval(checkClosedInterval);
                        this.$store.dispatch('loading/setLoading', false); // Assuming you use Vuex for state management
                        const data = await this.getAuth();
                        if (data) {
                            this.$store.dispatch('auth/setAuth', data); // Set auth data using Vuex
                        }
                    }
                }, 1000);
            },
        },
    };
</script>
