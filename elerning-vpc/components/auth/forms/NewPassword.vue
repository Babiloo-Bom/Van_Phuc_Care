<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="space-y-4 w-full"
    >
        <a-form-model-item label="Mật khẩu mới" prop="newPassword">
            <a-input-password
                v-model="form.newPassword"
                size="large"
                placeholder="Nhập mật khẩu mới"
                @keyup.native.enter="handleSubmit"
            />
        </a-form-model-item>
        <a-form-model-item label="Xác nhận mật khẩu mới" prop="confirmPassword">
            <a-input-password
                v-model="form.confirmPassword"
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
            Cập nhật
        </a-button>
    </a-form-model>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';

    const defaultForm = {
        newPassword: '',
        confirmPassword: '',
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
                    newPassword: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu mới',
                            trigger: 'blur',
                        },
                    ],
                    confirmPassword: [
                        {
                            required: true,
                            message: 'Vui lòng nhập xác nhận mật khẩu',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        methods: {
            handleSubmit() {
                // validate and then emit new password to forgot-password.vue
                this.$refs.form.validate(async (valid) => {
                    if (
                        valid
                        && this.form.newPassword === this.form.confirmPassword
                    ) {
                        this.$emit('submit', this.form);
                    } else {
                        this.$message.error('Mật khẩu xác nhận không trùng khớp!');
                    }
                });
            },
        },
    };
</script>
