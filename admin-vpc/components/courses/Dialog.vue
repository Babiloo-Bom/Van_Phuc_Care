<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(course) ? 'Tạo khóa học' : 'Chỉnh sửa khóa học'"
        width="800px"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div class="flex flex-wrap gap-4">
                <div class="bg-white rounded-md w-[300px]">
                    <div class="flex flex-col items-center gap-y-5 mb-2 w-full">
                        <img
                            v-if="form.thumbnail"
                            :src="form.thumbnail"
                            onerror="this.src='/images/avatar-empty.webp'"
                            alt=""
                            class="w-full h-[200px] rounded-md object-cover"
                        >
                        <div v-else class="w-full h-[200px] rounded-md border-dashed border border-gray-400 flex justify-center items-center">
                            <span><i class="fas fa-plus" /></span>
                        </div>
                        <div class="flex gap-x-2">
                            <a-upload
                                :show-upload-list="false"
                                action=""
                                class="mx-auto block text-center"
                                :transform-file="handlerThumbnail"
                            >
                                <div class="flex gap-x-2">
                                    <img src="/images/upload.svg" alt="avatar">
                                    Upload
                                </div>
                            </a-upload>
                        </div>
                    </div>
                    <div>
                        <span class="font-semibold text-sm mr-2">Đánh giá:</span>
                        <a-rate v-model="form.rate" :default-value="5" />
                    </div>
                </div>
                <div class="flex-1 flex flex-col gap-4">
                    <a-form-model-item label="Tên khóa học" prop="title">
                        <a-input v-model="form.title" placeholder="Nhập tên khóa học" />
                    </a-form-model-item>
                    <div class="grid grid-cols-3 gap-2">
                        <a-form-model-item label="Video" prop="title">
                            <a-input v-model="form.title" placeholder="Nhập tên khóa học" />
                        </a-form-model-item>
                        <a-form-model-item label="Tài liệu" prop="title">
                            <a-input v-model="form.title" placeholder="Nhập tên khóa học" />
                        </a-form-model-item>
                        <a-form-model-item label="Bài tập" prop="title">
                            <a-input v-model="form.title" placeholder="Nhập tên khóa học" />
                        </a-form-model-item>
                    </div>
                    <a-form-model-item label="Giá tiền" prop="title">
                        <a-input v-model="form.title" placeholder="Nhập tên khóa học" />
                    </a-form-model-item>
                </div>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(course) ? "Tạo mới" : "Thay đổi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';
    import _cloneDeep from 'lodash/cloneDeep';
    import {
        convertToFormData,
    } from '@/utils/form';

    const defaultForm = {
        thumbnail: '',
        title: '',
    };

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                form: this.course ? _cloneDeep(this.course) : _cloneDeep(defaultForm),
                course: null,
                thumbnailFile: null,
                rules: {
                    title: [
                        { required: true, message: 'Không được để trống trường này', trigger: 'blur' },
                    ],
                },
            };
        },

        methods: {
            _isEmpty,

            open(course) {
                this.course = course;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            empty() {
                this.form = _cloneDeep(defaultForm);
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.thumbnailFile) {
                                const { data: { fileAttributes } } = await this.$api.uploader.uploadFile(convertToFormData({
                                    files: this.thumbnailFile,
                                }));
                                this.form.thumbnail = fileAttributes[0]?.source;
                            }
                            if (!this.course) {
                                await this.$api.courses.create({ ...this.form, status: 'active' });
                                this.$message.success('Thêm khóa học thành công');
                            } else {
                                await this.$api.courses.update(this.course._id, _omit(this.form, ['_id']));
                                this.$message.success('Chỉnh sửa khóa học thành công');
                            }
                            this.empty();
                            this.close();
                            await this.$store.dispatch('courses/fetchAll', this.$route.query);
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
