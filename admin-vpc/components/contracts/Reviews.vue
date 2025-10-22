<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :colon="false"
    >
        <div v-if="course" class="bg-white">
            <div class="flex-col gap-4 flex items-center justify-center h-full">
                <a-empty :description="false" />
                <h4 class="font-bold text-center">
                    Hiện tại chưa có đánh giá nào
                </h4>
            </div>
        </div>
    </a-form-model>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import {
        urlValidtor,
        validEmail,
    } from '@/utils/form';

    const defaultForm = {
        thumbnail: '',
        title: '',
        descriptions: '',
        videos: 0,
        documents: 0,
        exam: 0,
        price: 1000,
        priceSale: 10000,
        rate: 5,
        slug: '',
        level: 'easy',
        certificate: true,
        shortDescriptions: '',
        lecturers: {
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
        },
    };

    export default {
        components: {
        },

        props: {
            course: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                form: this.course ? _cloneDeep(this.course) : _cloneDeep(defaultForm),
                thumbnailFile: null,
                avatarFile: null,
                typePrice: 'default',
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    descriptions: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    videos: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    documents: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    exam: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    price: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    priceSale: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    shortDescriptions: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'lecturers.fullname': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'lecturers.avatar': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'lecturers.specialize': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'lecturers.skills': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    'lecturers.contacts.facebook': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, { validator: urlValidtor }],
                    'lecturers.contacts.email': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, { validator: validEmail }],
                    'lecturers.contacts.website': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, { validator: urlValidtor }],
                    'lecturers.contacts.linkedin': [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }, { validator: urlValidtor }],
                },
            };
        },

        watch: {
            course() {
                this.form = this.course ? _cloneDeep(this.course) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            handlerAvatar(file) {
                this.avatarFile = file;
                this.form.lecturers.avatar = URL.createObjectURL(file);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', { form: this.form, avatarFile: this.avatarFile, thumbnailFile: this.thumbnailFile });
                    } else {
                        this.$message.info('Vui lòng nhập đầy đủ thông tin các trường');
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
