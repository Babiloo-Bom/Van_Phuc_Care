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
                                class="w-[240px] h-[240px] rounded-full object-cover mx-auto"
                            >
                            <div v-else class="w-[240px] h-[240px] rounded-full mx-auto border-dashed border border-gray-400 flex justify-center items-center">
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
                        <a-form-model-item label="Tên giáo viên" prop="fullname">
                            <a-input v-model="form.fullname" placeholder="Nhập tên giáo viên" />
                        </a-form-model-item>
                        <a-form-model-item label="Chức danh" prop="specialize">
                            <a-input v-model="form.specialize" placeholder="Nhập chức danh của giáo viên" />
                        </a-form-model-item>
                        <a-form-model-item label="Kỹ năng" prop="skills">
                            <a-textarea v-model="form.skills" placeholder="Nhập các kỹ năng của giáo viên" :auto-size="{ minRows: 5, maxRows: 5 }" />
                        </a-form-model-item>
                        <div v-if="form.contacts" class="grid grid-cols-3 gap-2">
                            <a-form-model-item label="Facebook">
                                <a-input v-model="form.contacts.facebook" placeholder="Nhập link facebook" />
                            </a-form-model-item>
                            <a-form-model-item label="Website">
                                <a-input v-model="form.contacts.website" placeholder="Nhập website của giáo viên" />
                            </a-form-model-item>
                            <a-form-model-item label="Linkedin">
                                <a-input v-model="form.contacts.linkedin" placeholder="Nhập linkedin của giáo viên" />
                            </a-form-model-item>
                            <a-form-model-item label="Email" class="col-span-2">
                                <a-input v-model="form.contacts.email" placeholder="Nhập email của giáo viên" />
                            </a-form-model-item>
                        </div>
                    </div>
                </div>
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
                        throw new Error();
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
