<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-4 w-full custom-form"
    >
        <div class="grid grid-cols-1 gap-2.5">
            <a-form-model-item label="" prop="username">
                <a-input
                    v-model="form.username"
                    size="large"
                    placeholder="Địa chỉ Email/ Số điện thoại"
                    @keyup.native.enter="handleSubmit"
                />
            </a-form-model-item>
            <a-form-model-item label="" prop="password">
                <a-input-password
                    v-model="form.password"
                    size="large"
                    placeholder="Mật khẩu"
                    @keyup.native.enter="handleSubmit"
                />
            </a-form-model-item>
        </div>
        <div class="grid grid-cols-2 gap-4 items-center justify-between mb-3">
            <div>
                <nuxt-link to="forgot-password" class="!text-[#F38284] text-[12px] underline">
                    Quên mật khẩu?
                </nuxt-link>

                <div class="flex items-center gap-1 mt-1">
                    <a-checkbox
                        :checked="form.remindAccount"
                        @change="onRemindAccountChange"
                    />
                    <p class="m-0 font-bold">
                        Nhớ tài khoản
                    </p>
                </div>
            </div>
            <a-button
                :loading="loading"
                type="primary"
                size="large"
                class="w-full"
                @click="handleSubmit"
            >
                Đăng nhập
            </a-button>
        </div>
        <GoogleButton />
        <!-- <FacebookButton /> -->
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import GoogleButton from '@/components/auth/buttons/GoogleButton.vue';
    // import FacebookButton from '@/components/auth/buttons/FacebookButton.vue';
    import { passwordValidtor } from '@/utils/form';

    const defaultForm = {
        username: '',
        password: '',
        remindAccount: true,
        origin: 'vanphuccare.gensi.vn',
    };

    export default {
        components: {
            GoogleButton,
            // FacebookButton,
        },
        props: {
        },

        data() {
            return {
                loading: false,
                form: _cloneDeep(defaultForm),
                rules: {
                    username: [
                        {
                            required: true,
                            message: 'Vui lòng nhập địa chỉ email hoặc số điện thoại',
                            trigger: ['blur', 'change'],
                            min: 3,
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
                },
            };
        },

        methods: {
            onRemindAccountChange({ target }) {
                this.form.remindAccount = target.checked;
            },
            handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.loading = true;
                        await this.$auth
                            .loginWith('local', {
                                data: this.form,
                            })
                            .then(async () => {
                                this.$auth.$storage.setLocalStorage('data', this.form);
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
                    }
                });
            },
        },
    };
</script>
<style lang="scss">
::placeholder {
  color: #999; /* Change the color as per your design */
  font-style: italic; /* You can also apply other styles, such as font-weight, font-size, etc. */
}

/* Styling for WebKit/Blink browsers like Chrome and Safari */
:-webkit-input-placeholder {
  color: #999;
  font-style: italic;
}

/* Styling for Mozilla Firefox */
::-moz-placeholder {
  color: #999;
  font-style: italic;
}

/* Styling for Microsoft Edge */
:-ms-input-placeholder {
  color: #999;
  font-style: italic;
}

.custom-form {
    .ant-form-explain {
        @apply absolute
    }
}
</style>
