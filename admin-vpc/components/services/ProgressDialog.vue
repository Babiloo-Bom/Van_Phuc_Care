<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(progress) ? 'Thêm mới liệu trình' : 'Chỉnh sửa liệu trình'"
        width="1000px"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
        >
            <div class="flex gap-6">
                <div class="flex flex-col items-center gap-y-5 mb-2 w-full max-w-[300px]">
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
                <div class="grid grid-cols-1 gap-3">
                    <div>
                        <a-form-model-item
                            prop="title"
                            label="Tiêu đề liệu trình"
                        >
                            <a-input
                                v-model="form.title"
                                placeholder="Nhập tiêu đề liệu trình"
                            />
                        </a-form-model-item>
                    </div>
                    <Editor v-model="form.descriptions" title="Nội dung" />
                </div>
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
                @click="submit"
            >
                {{ _isEmpty(progress) ? "Thêm mới" : "Cập nhật" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import _isEmpty from 'lodash/isEmpty';
    import Editor from '@/components/shared/TinyEditor.vue';
    import { convertToFormData } from '@/utils/form';

    const defaultForm = {
        title: '',
        descriptions: '',
        thumbnail: '',
    };

    export default {
        components: {
            Editor,
        },

        props: {
        },

        data() {
            return {
                visible: false,
                loading: false,
                progress: null,
                thumbnailFile: null,
                form: this.progress ? _cloneDeep(this.progress) : _cloneDeep(defaultForm),
                index: null,
            };
        },

        computed: {
            ...mapState('services', ['service']),
        },

        watch: {
            progress() {
                this.form = this.progress ? _cloneDeep(this.progress) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,
            open(progress, index) {
                this.progress = progress;
                this.visible = true;
                this.index = index;
            },

            close() {
                this.visible = false;
            },

            getContent(content) {
                this.form.content = content;
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            async create(form) {
                try {
                    if (this.thumbnailFile) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                            files: this.thumbnailFile,
                        }));
                        this.form.thumbnail = fileAttributes[0]?.source;
                    }
                    await this.$api.services.update(this.service._id, {
                        progress: [
                            ...(this.service.progress || []),
                            form,
                        ],
                    });
                    this.$message.success('Thêm mới liệu trình thành công');
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async update(form) {
                try {
                    if (this.thumbnailFile) {
                        const { data: { fileAttributes } } = await this.$api.uploaders.uploadFile(convertToFormData({
                            files: this.thumbnailFile,
                        }));
                        this.form.thumbnail = fileAttributes[0]?.source;
                    }
                    const _data = _cloneDeep(this.service.progress);
                    _data[this.index] = {
                        ...form,
                    };
                    await this.$api.services.update(this.service._id, {
                        progress: [
                            ..._data,
                        ],
                    });
                    this.$message.success('Cập nhật liệu trình thành công');
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (_isEmpty(this.progress)) {
                                await this.create(this.form);
                            } else {
                                await this.update(this.form);
                            }
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            await this.$store.dispatch('services/fetchDetail', this.$route.params.id);
                            this.loading = false;
                            this.close();
                            this.form = {};
                        }
                    }
                });
            },
        },
    };
</script>
