<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-4 w-full"
    >
        <a-form-model-item label="Tài khoản" prop="username">
            <a-input
                v-model="form.username"
                size="large"
                placeholder="Nhập tài khoản của bạn"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item label="Mật khẩu" prop="password">
            <a-input-password
                v-model="form.password"
                size="large"
                placeholder="Nhập mật khẩu"
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
            Đăng nhập
        </a-button>
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';

    const defaultForm = {
        username: '',
        password: '',
    };

    export default {
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                form: _cloneDeep(defaultForm),
                rules: {
                    username: [
                        {
                            required: true,
                            message: 'Vui lòng nhập tên đăng nhập',
                            trigger: 'blur',
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        methods: {
            handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', this.form);
                    }
                });
            },
        },
    };
</script>
