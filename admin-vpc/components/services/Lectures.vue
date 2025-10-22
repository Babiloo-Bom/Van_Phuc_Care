<template>
    <div class="pb-4">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div>
                <div class="grid grid-cols-3 gap-6">
                    <div class="bg-white rounded-md">
                        <div class="flex flex-col items-center gap-y-5 mb-2 w-full mt-4">
                            <img
                                v-if="form.avatar"
                                :src="form.avatar"
                                alt=""
                                class="w-[100px] h-[100px] rounded-full object-cover mx-auto"
                            >
                            <div v-else class="w-[100px] h-[100px] rounded-full mx-auto border-dashed border border-gray-400 flex justify-center items-center">
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
                    <div class="col-span-2 flex flex-col gap-3">
                        <a-form-model-item label="Tên người thực hiện" prop="fullname">
                            <a-input v-model="form.fullname" placeholder="Nhập tên nhân sự thực hiện" />
                        </a-form-model-item>
                        <a-form-model-item label="Chức danh" prop="specialize">
                            <a-input v-model="form.specialize" placeholder="Nhập chức danh" />
                        </a-form-model-item>
                    </div>
                </div>
                <a-form-model-item label="Mô tả" prop="descriptions">
                    <a-textarea v-model="form.descriptions" placeholder="Nhập nội dung" :auto-size="{ minRows: 5, maxRows: 5 }" />
                </a-form-model-item>
                <a-form-model-item label="Kỹ năng" prop="skills">
                    <a-textarea v-model="form.skills" placeholder="Nhập nội dung" :auto-size="{ minRows: 5, maxRows: 5 }" />
                </a-form-model-item>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import { IMAGE_TYPES } from '@/constants/fileTypes';

    const defaultForm = {
        fullname: '',
        avatar: '',
        specialize: '',
        skills: '',
        contacts: {
            facebook: '',
            email: '',
            website: '',
            linkedin: '',
        },
    };

    export default {
        components: {
        },

        props: {
            lecture: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                IMAGE_TYPES,
                visible: false,
                loading: false,
                form: this.lecture ? _cloneDeep({ ...defaultForm, ...this.lecture }) : _cloneDeep(defaultForm),
                avatarFile: null,
                rules: {
                    fullname: [{ required: true, message: 'Giá trị không hợp lệ', trigger: 'blur' }],
                    avatar: [{ required: true, message: 'Giá trị không hợp lệ', trigger: 'blur' }],
                    specialize: [{ required: true, message: 'Giá trị không hợp lệ', trigger: 'blur' }],
                    skills: [{ required: true, message: 'Giá trị không hợp lệ', trigger: 'blur' }],
                },
            };
        },

        watch: {
            lecture() {
                this.form = this.lecture ? _cloneDeep({ ...defaultForm, ...this.lecture }) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,

            handlerAvatar(file) {
                this.avatarFile = file;
                this.form.avatar = URL.createObjectURL(file);
            },

            submit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$emit('submit', { form: this.form, avatarFile: this.avatarFile });
                    } else {
                        this.$message.info('Vui lòng nhập đầy đủ thông tin các trường của giáo viên');
                    }
                });
            },
        },
    };
</script>

<style>
    .ant-form-item-children, .ant-input-number {
        @apply block w-full
    }
</style>
