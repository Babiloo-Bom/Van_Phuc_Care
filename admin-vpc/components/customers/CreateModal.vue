<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :centered="true"
        :title="form._id ? 'Chỉnh sửa' : 'Thêm khách hàng'"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-1 gap-y-2">
                <a-form-model-item label="Mã khách hàng" prop="account_code">
                    <a-input v-model="form.account_code" placeholder="VD: KH2306" @change="handleAccountCode" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="Tên khách hàng" prop="fullname">
                    <a-input v-model="form.fullname" placeholder="Nhập tên khách hàng" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="Email" prop="email">
                    <a-input v-model="form.email" placeholder="Nhập email khách hàng" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="Số điện thoại" prop="phone">
                    <a-input v-model="form.phone" placeholder="Nhập số điện thoại khách hàng" @keyup.native.enter="handleSubmit" />
                </a-form-model-item>
                <a-form-model-item label="Giới tính">
                    <a-radio-group
                        v-model="form.gender"
                        :options="genders"
                        default-value="male"
                        @keyup.native.enter="handleSubmit"
                    />
                </a-form-model-item>
                <a-form-model-item label="Địa chỉ" prop="address">
                    <a-input v-model="form.address" placeholder="Nhập địa chỉ khách hàng" />
                </a-form-model-item>
                <a-form-model-item label="Lưu ý" prop="notes">
                    <a-textarea
                        v-model="form.notes"
                        placeholder="Nội dung"
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="handleSubmit"
            >
                {{ form._id ? `Cập nhật` : `Tạo mới` }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';
    import { phoneValidator } from '@/utils/form';

    const defaultForm = {
        firstname: '',
        lastname: '',
        avatar: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        gender: 'male',
    };
    export default {
        data() {
            return {
                visible: false,
                loading: false,
                genders: [
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Khác', value: null },
                ],
                form: defaultForm,
                rules: {
                    fullname: [{
                        required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur',
                    }],
                    account_code: [{
                        required: true, message: 'Vui lòng mã khách hàng', trigger: 'blur',
                    }],
                    phone: [{
                        required: true, validator: phoneValidator, trigger: 'blur',
                    }],
                    address: [{
                        required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur',
                    }],
                },
            };
        },

        methods: {
            open(data = {}) {
                this.form = data ? _cloneDeep(data) : defaultForm;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerUpload(file) {
                this.file = file;
            },

            handleAccountCode({ target }) {
                this.form.account_code = target.value?.toUpperCase();
            },

            async handleSubmit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.form._id) {
                                await this.$store.dispatch('customers/update', {
                                    _id: this.form._id,
                                    data: _omit(this.form, ['_id', 'timeline']),
                                });
                                this.$message.success('Cập nhật thành công');
                                this.close();
                            } else {
                                if (!this.form.gender) {
                                    this.form.gender = 'male';
                                }
                                await this.$api.customers.create({ ...this.form });
                                this.$message.success('Tạo bản ghi thành công');
                                this.close();
                            }
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                            await this.$store.dispatch('customers/fetchAll', this.$route.query);
                        }
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
.inport-user {
    .ant-upload {
        @apply w-full;
    }
}
</style>
