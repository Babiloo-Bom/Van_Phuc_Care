<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title=""
        :width="1000"
    >
        <div>
            <h4 class="text-[#317BC4] text-[28px] font-[600]">
                Đăng ký dịch vụ
            </h4>
            <a-form-model
                ref="form"
                :model="form"
                :rules="rules"
                class="space-y-4 w-full"
            >
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
            </a-form-model>
        </div>
        <div slot="footer" class="!p-0" />
    </a-modal>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'Xác nhận',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'Xác nhận',
            },
            confirmIcon: String,
            confirmBtnType: {
                type: String,
                default: 'primary',
            },
            cancelBtn: {
                type: String,
                default: 'Hủy',
            },
            footer: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                form: {},
                rules: [],
            };
        },

        methods: {
            open(roomType) {
                this.roomType = roomType;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                await this.$emit('confirm');
                this.close();
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },
            async handleSubmit() {
                this.loading = true;
            },
        },
    };
</script>
