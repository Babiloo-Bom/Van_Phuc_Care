<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        class="user-form"
    >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
            <div class="md:col-span-2 mr-auto">
                <div class="rounded-md">
                    <div class="flex items-center gap-x-5 mb-2 w-full mt-4">
                        <img
                            v-if="form.avatar"
                            :src="form.avatar"
                            alt=""
                            class="w-[200px] h-[200px] rounded-full object-cover mx-auto shadow-md"
                        >
                        <div v-else class="w-[200px] h-[200px] rounded-full mx-auto border-dashed border border-gray-400 flex justify-center items-center">
                            <span><i class="fas fa-plus" /></span>
                        </div>
                        <div class="flex gap-x-2">
                            <a-upload
                                :show-upload-list="false"
                                action=""
                                :accept="IMAGE_TYPES.toString()"
                                class="mx-auto block text-center"
                                :transform-file="handlerAvatar"
                            >
                                <div class="flex gap-x-2">
                                    <img src="/images/upload.svg" alt="avatar">
                                    Upload
                                </div>
                            </a-upload>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="grid grid-cols-1 gap-6">
                    <div>
                        <h3 class="uppercase font-medium mb-1">
                            Tên hiển thị:
                        </h3>
                        <a-form-model-item prop="fullname" class="!mb-0">
                            <a-input v-model="form.fullname" placeholder="Họ và tên đầy đủ" />
                        </a-form-model-item>
                    </div>
                    <div>
                        <h3 class="uppercase font-medium mb-1">
                            Thông tin:
                        </h3>
                        <a-form-model-item prop="email" class="!mb-0">
                            <a-input v-model="form.email" placeholder="Email" />
                        </a-form-model-item>
                        <a-form-model-item prop="phone" class="!mb-0">
                            <a-input v-model="form.phone" placeholder="Số điện thoại" />
                        </a-form-model-item>
                    </div>
                    <div>
                        <a-form-model-item label="Địa chỉ" prop="address" class="!mb-0">
                            <a-textarea
                                v-model="form.address"
                                placeholder="Địa chỉ của bạn"
                                :auto-size="{ minRows: 4, maxRows: 4 }"
                            />
                        </a-form-model-item>
                    </div>
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-1 gap-6">
                    <div>
                        <h3 class="uppercase font-medium mb-1">
                            Mật khẩu hiện tại:
                        </h3>
                        <a-form-model-item prop="password" class="!mb-0">
                            <a-input v-model="form.password" placeholder="Mật khẩu hiện tại" />
                        </a-form-model-item>
                    </div>
                    <div>
                        <h3 class="uppercase font-medium mb-1">
                            Mật khẩu mới:
                        </h3>
                        <a-form-model-item :prop="form.password ? 'newPassword' : ''" class="!mb-0">
                            <a-input v-model="form.newPassword" placeholder="Mật khẩu mới" />
                        </a-form-model-item>
                        <a-form-model-item :prop="form.password ? 'reNewPassword' : ''" class="!mb-0">
                            <a-input v-model="form.reNewPassword" placeholder="Xác nhận mật khẩu mới" />
                        </a-form-model-item>
                    </div>
                </div>
                <div class="mt-4 md:mt-auto text-right flex items-center justify-end gap-4">
                    <a-button
                        type="primary"
                        class="!rounded-full !font-normal !h-10 !px-6 !py-1"
                        :loading="loading"
                        @click="submitForm"
                    >
                        Lưu thay đổi
                    </a-button>
                </div>
            </div>
        </div>
    </a-form-model>
</template>

<script>
    import {
        validEmail, passwordValidtor, phoneValidator, convertToFormData,
    } from '@/utils/form';
    import _cloneDeep from 'lodash/cloneDeep';
    import { IMAGE_TYPES } from '@/constants/fileTypes';

    const defaultForm = {
        avatar: '',
        fullname: '',
        email: '',
        phone: '',
        address: '',
    };

    export default {
        props: {},

        data() {
            return {
                IMAGE_TYPES,
                form: {},
                formChangeAccount: {},
                rules: {
                    fullname: [{ required: true, message: 'Không được để trống trường này', trigger: 'change' }],
                    email: [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: validEmail,
                        message: 'Vui lòng nhập đúng định dạng email',
                        trigger: ['change'],
                    }],
                    phone: [{
                        validator: phoneValidator,
                        message: 'Định dạng số điện thoại không phù hợp',
                        trigger: ['change'],
                    }],
                    newPassword: [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: passwordValidtor,
                        message: 'Vui lòng nhập đúng định dạng mật khẩu (bao gồm chữ cái và số, ký tự)',
                        trigger: ['change'],
                    }],
                    reNewPassword: [{
                        required: true,
                        message: 'Không được để trống trường này',
                        trigger: ['blur'],
                    }, {
                        validator: passwordValidtor,
                        message: 'Vui lòng nhập đúng định dạng mật khẩu (bao gồm chữ cái và số, ký tự)',
                        trigger: ['change'],
                    }, {
                        validator: (rule, value, callback) => {
                            if (value !== this.form.newPassword) {
                                callback(new Error('Mật khẩu mới không khớp!'));
                            } else {
                                callback();
                            }
                        },
                        message: 'Vui lòng nhập đúng định dạng mật khẩu (bao gồm chữ cái và số, ký tự)',
                        trigger: ['change'],
                    }],
                },
                loading: false,
                avatarFile: null,
            };
        },

        computed: {
            currentUser() {
                return this.$auth.user || {};
            },
        },

        watch: {
            '$auth.user': {
                handler() {
                    if (this.$auth.user) {
                        this.form = _cloneDeep({ ...this.currentUser, password: '' });
                    } else {
                        this.form = _cloneDeep(defaultForm);
                    }
                },
                immediate: true,
            },
        },

        methods: {
            handlerAvatar(file) {
                this.avatarFile = file;
                this.form.avatar = URL.createObjectURL(file);
                this.$forceUpdate();
            },

            async submitForm() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.avatarFile) {
                                const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({
                                    files: this.avatarFile,
                                }));
                                this.form.avatar = fileAttributes[0].source;
                            }
                            await this.$axios.patch('/a/sessions', {
                                ...this.form,
                            });
                            this.$message.success('Thay đổi thông tin thành công');
                            await this.$auth.fetchUser();
                            this.$router.push('/');
                        } catch (error) {
                            this.$message.error('Đã có lỗi xảy ra. Vui lòng thử lại sau');
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },

            resetForm() {
                this.$refs.form.resetFields();
                this.form = _cloneDeep({ ...this.currentUser, password: '' });
            },
        },
    };
</script>
<style lang="scss">
    .user-form {
        .ant-form .ant-form-item {
            @apply mb-0 #{!important}
        }
        .user-form .ant-form-item label::after {
            display: none !important;
        }
        .ant-form-item-control {
            @apply leading-[50px];
        }
        .ant-input {
            @apply h-[45px] px-4 border-none
        }
        .ant-form-item label {
            @apply uppercase font-medium
        }
    }
</style>
