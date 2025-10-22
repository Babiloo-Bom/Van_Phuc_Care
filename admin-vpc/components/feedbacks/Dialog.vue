<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(feedback) ? 'Thêm đánh giá' : 'Chỉnh sửa phản hồi'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-10 gap-y-4">
                <a-form-model-item label="Hình ảnh" prop="image" class="col-span-3">
                    <div class="flex flex-col items-center gap-y-8 mb-6 w-full">
                        <div class="relative group ">
                            <img
                                v-if="form.avatar"
                                :src="form.avatar"
                                onerror="this.src='/images/avatar-empty.webp'"
                                alt=""
                                class="w-[100px] h-[100px] rounded-md object-cover"
                            >
                            <a-upload
                                :show-upload-list="false"
                                action=""
                                :transform-file="(file) => handlerFile(file)"
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
                    </div>
                </a-form-model-item>
                <div class="w-full col-span-7 grid grid-cols-1 gap-y-4">
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
                    <a-form-model-item label="Đánh giá" prop="rate">
                        <a-rate class="mt-0" v-model="form.rate" />
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
                {{ _isEmpty(feedback) ? "Thêm đánh giá" : "Thay đổi" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';
    import _cloneDeep from 'lodash/cloneDeep';
    import { convertToFormData } from '@/utils/form';

    const defaultForm = {
        content: '',
        avatar: '',
        fullname: '',
        position: '',
        rate: 5,
    };

    export default {
        components: {
        },

        props: {
        },

        data() {
            return {
                visible: false,
                loading: false,
                form: this.feedback ? _cloneDeep(this.feedback) : _cloneDeep(defaultForm),
                feedback: null,
                avatarFile: null,
            };
        },
        computed: {
            ...mapState('services', ['service']),
            ...mapState('courses', ['course']),
        },

        watch: {
            feedback() {
                this.form = this.feedback ? _cloneDeep(this.feedback) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,
            open(feedback) {
                this.feedback = feedback;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerFile(file) {
                this.avatarFile = file;
                this.form.avatar = URL.createObjectURL(file);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.avatarFile) {
                                const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                                    files: this.avatarFile,
                                }));
                                this.form = { ...this.form, avatar: fileAttributes[0]?.source };
                            }
                            if (!this.form._id) {
                                await this.$api.feedbacks.create({ ...this.form, status: 'active', serviceId: this.service._id });
                                this.$message.success('Thêm phản hồi thành công');
                            } else {
                                await this.$api.feedbacks.update(this.form._id, _omit({ ...this.form, serviceId: this.service._id }, ['_id']));
                                this.$message.success('Sửa phản hồi thành công');
                            }
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.close();
                            this.form = {};
                            if (this.$route.path.includes('/khoa-hoc')) {
                                await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, courseId: this.course._id });
                            }
                            if (this.$route.path.includes('/dich-vu')) {
                                await this.$store.dispatch('feedbacks/fetchAll', { ...this.$route.query, serviceId: this.service._id });
                            }
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>
