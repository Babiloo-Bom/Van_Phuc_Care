<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        title="Cập nhật thông tin cá nhân"
        width="700px"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center flex-col gap-x-8 col-span-2 mb-5">
                    <a-upload
                        :show-upload-list="false"
                        action=""
                        :transform-file="handlerAvatar"
                        accept="image/png, image/jpeg"
                    >
                        <div class="py-3">
                            Tải ảnh lên
                        </div>
                    </a-upload>
                    <img
                        v-if="imageAvatar || form.avatar"
                        :src="form.avatar"
                        alt="/"
                        class="w-40 h-40 rounded-full object-cover"
                    >
                    <div v-else class="w-40 h-40 rounded-full border-dashed border border-gray-400 flex justify-center items-center">
                        <span>Chưa có ảnh</span>
                    </div>
                </div>
                <a-form-model-item label="Họ và tên" prop="fullName">
                    <a-input v-model="form.fullName" placeholder="Nhập nội dung" />
                </a-form-model-item>
                <a-form-model-item label="Giới tính">
                    <a-radio-group :options="genders" default-value="male" />
                </a-form-model-item>
                <a-form-model-item label="Email" prop="email">
                    <a-input v-model="form.email" placeholder="Nhập nội dung" />
                </a-form-model-item>
                <a-form-model-item label="Số điện thoại" prop="phoneNumber">
                    <a-input v-model="form.phoneNumber" placeholder="Nhập nội dung" />
                </a-form-model-item>
                <a-form-model-item label="Địa chỉ" prop="phoneNumber">
                    <a-input v-model="form.address" placeholder="Nhập nội dung" />
                </a-form-model-item>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="updateProfile"
            >
                Cập nhật
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { phoneValidator, convertToFormData } from '@/utils/form';

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                room: null,
                form: {
                    fullName: this.$auth.user.fullName,
                    email: this.$auth.user.email,
                    phoneNumber: this.$auth.user.phoneNumber,
                    address: this.$auth.user.address,
                    avatar: this.$auth.user.avatar,
                },
                rules: {
                    fullName: [{
                        required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur',
                    }],
                    phoneNumber: [{
                        validator: phoneValidator, trigger: 'blur',
                    }],
                    email: [{
                        type: 'email', message: 'Vui lòng nhập đúng định dạng email', trigger: 'blur',
                    }],
                    address: [{
                        required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur',
                    }],
                },
                genders: [
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Khác', value: 'other' },
                ],
                fileAvatar: null,
                imageAvatar: null,
            };
        },

        watch: {
            imageAvatar() {
                this.form.avatar = this.imageAvatar;
            },
        },

        methods: {
            async open() {
                this.form = {
                    fullName: this.$auth.user.fullName,
                    email: this.$auth.user.email,
                    phoneNumber: this.$auth.user.phoneNumber,
                    address: this.$auth.user.address,
                    avatar: this.$auth.user.avatar,
                };
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerAvatar(file) {
                this.fileAvatar = file;
                this.imageAvatar = URL.createObjectURL(file);
            },

            async updateProfile() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.fileAvatar) {
                                const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({
                                    files: this.fileAvatar,
                                }));
                                this.form.avatar = fileAttributes[0].source;
                            }
                            await this.$api.auth.updateProfile(this.form);
                            this.$message.success('Cập nhật thông tin cá nhân thành công');
                            this.close();
                            this.$nuxt.refresh();
                            await this.$auth.fetchUser();
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>
