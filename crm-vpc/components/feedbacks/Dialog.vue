<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(feedback) ? 'Tạo phản hồi' : 'Chỉnh sửa phản hồi'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-10 gap-y-4">
                <a-form-model-item label="Hình ảnh" prop="image" class="col-span-3">
                    <div class="flex flex-col items-center gap-y-8 mb-6 w-[100px]">
                        <div class="relative group ">
                            <img
                                v-if="form.avatar"
                                :src="form.avatar"
                                onerror="this.src='/images/default-avatar.png'"
                                alt=""
                                class="w-[100px] h-[100px] rounded-md object-cover"
                            >
                            <a-upload
                                :show-upload-list="false"
                                action=""
                                :transform-file="(file) => handlerFile(file, 'front')"
                            >
                                <div
                                    :class="[form.avatar ? 'absolute top-0 left-0 bg-white/70 group-hover:opacity-100 duration-300' : '']"
                                    class="w-[100px] h-[100px] rounded-sm border-dashed border border-gray-50 flex flex-col justify-center gap-y-2 items-center"
                                >
                                    <img src="/images/upload.svg" alt="avatar">
                                    <span>{{ 'Tải lên' }}</span>
                                </div>
                            </a-upload>
                        </div>
                        <!-- <div class="flex gap-x-2">
                            <div class="flex items-center w-fit px-2 py-1 rounded-lg border cursor-pointer border-[#0c4ea4] hover:bg-[#0c4ea4] hover:text-[#fff] transition duration-150 ease-out hover:ease-in border-[#d3d3d3]">
                                <p class="mb-0 px-3 text-sm ">
                                    {{ _isEmpty(feedback) ? 'Upload' : 'Thay đổi' }}
                                </p>
                            </div>
                        </div> -->
                    </div>
                </a-form-model-item>
                <div class="w-full col-span-7">
                    <a-form-model-item
                        prop="title"
                        label="Tên hiển thị"
                        class="!mb-5"
                    >
                        <a-input
                            v-model="form.fullname"
                            placeholder="Nhập tên hiển thị"
                        />
                    </a-form-model-item>
                    <!-- <a-form-model-item
                        prop="title"
                        label="Chức danh"
                        class="!mb-5"
                    >
                        <a-input
                            v-model="form.position"
                            placeholder="Nhập chức danh"
                        />
                    </a-form-model-item> -->
                    <a-form-model-item label="Nội dung phản hồi" prop="content">
                        <a-textarea
                            v-model="form.content"
                            placeholder="Nhập nội dung phản hồi"
                            :auto-size="{ minRows: 5, maxRows: 8 }"
                        />
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
                {{ _isEmpty(feedback) ? "Tạo phản hồi" : "Thay đổi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';
    import { convertToFormData } from '@/utils/form';

    export default {
        components: {
        },
        props: {
        },
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                fileList: [],
                visible: false,
                loading: false,
                room: null,
                form: {
                    content: '',
                    avatar: '',
                    fullname: '',
                    position: '',
                    _id: '',
                },
                fileName: null,
                feedback: null,
            };
        },
        methods: {
            _isEmpty,
            open(feedback) {
                this.feedback = feedback;
                this.previewImage = feedback ? feedback.avatar : '';
                this.form = {
                    content: feedback ? feedback.content : '',
                    avatar: feedback ? feedback.avatar : '',
                    fullname: feedback ? feedback.fullname : '',
                    position: feedback ? feedback.position : '',
                    _id: feedback ? feedback._id : null,
                };
                this.visible = true;
            },

            close() {
                this.visible = false;
            },
            openSelectFile() {
                document.querySelector('#thumbnailImage').click();
            },
            handlerFile(file) {
                this.previewImage = file;
                this.form.avatar = URL.createObjectURL(file);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.previewImage) {
                                const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                                    files: this.previewImage,
                                }));
                                this.form = { ...this.form, avatar: fileAttributes[0]?.source };
                            }
                            if (!this.form._id) {
                                await this.$api.feedbacks.create({ ...this.form, status: 'active' });
                                this.$message.success('Thêm Phản hồi thành công');
                            } else {
                                await this.$api.feedbacks.update(this.form._id, _omit(this.form, ['_id']));
                                this.$message.success('Sửa Danh mục thành công');
                            }
                            this.fileName = '';
                            this.close();
                            await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, createdBy: 'admin' });
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
