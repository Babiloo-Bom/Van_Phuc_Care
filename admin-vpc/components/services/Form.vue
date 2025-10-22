<template>
    <div class="px-3 xl:px-0 overflow-auto pb-4">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="grid grid-cols-10 gap-4">
                <div class="col-span-12 xl:col-span-7 p-3 rounded-md bg-white">
                    <h1 class="text-[16px] text-black">
                        1. Thông tin cơ bản
                    </h1>
                    <div class="grid gap-y-4">
                        <a-form-model-item
                            prop="title"
                            label="Tên dịch vụ"
                            class="!mb-5"
                        >
                            <a-input
                                v-model="form.title"
                                placeholder="Nhập tên dịch vụ"
                                @change="onChangeTitle"
                            />
                        </a-form-model-item>
                        <a-form-model-item
                            prop="slug"
                            label="Đường dẫn bài viết"
                            class="!mb-5"
                        >
                            <a-input
                                v-model="form.slug"
                                placeholder="Nhập đường dẫn"
                            />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="Mô tả ngắn" prop="shortDescriptions">
                            <a-textarea
                                v-model="form.shortDescriptions"
                                placeholder="Mô tả ngắn cho bài viết"
                                :auto-size="{ minRows: 6, maxRows: 8 }"
                            />
                        </a-form-model-item>
                        <Editor v-if="editorStatus" v-model="form.content" title="Nội dung" />
                    </div>
                </div>
                <div :class="`col-span-12 xl:col-span-3`">
                    <div class="bg-white p-3 mb-3  rounded-md">
                        <h1 class="text-[16px] text-black">
                            2. Hình ảnh đại diện
                        </h1>
                        <div class="flex flex-col items-center gap-y-5 mb-2 w-full mt-4">
                            <img
                                v-if="form.thumbnail"
                                :src="form.thumbnail"
                                alt=""
                                class="w-full h-[240px] rounded-md object-cover mx-auto"
                            >
                            <div v-else class="w-full h-[240px] rounded-md mx-auto border-dashed border border-gray-400 flex justify-center items-center">
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
                    </div>
                </div>
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import _cloneDeep from 'lodash/cloneDeep';
    import Editor from '@/components/shared/TinyEditor.vue';
    import _isEmpty from 'lodash/isEmpty';
    import { slugify } from '@/utils/data';

    const defaultForm = {
        title: '',
        shortDescription: '',
        slug: '',
        content: '',
        thumbnail: '',
        category: {
            slug: '',
            label: '',
        },
    };
    export default {
        components: {
            Editor,
        },

        props: {
            service: {
                type: Object,
                default: () => {},
            },
            categories: {
                type: Array,
                default: () => [],
            },
            editorStatus: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                thumbnailFile: null,
                form: this.service ? _cloneDeep(this.service) : _cloneDeep(defaultForm),
                rules: {
                    title: [
                        { required: true, message: 'Vui lòng nhập tên dịch vụ', trigger: 'blur' },
                    ],
                    slug: [
                        { required: true, message: 'Vui lòng nhập đường dẫn', trigger: 'blur' },
                    ],
                    content: [
                        { required: true, message: 'Vui lòng nhập nội dung', trigger: 'blur' },
                    ],
                },
            };
        },

        watch: {
            service() {
                this.form = this.service ? _cloneDeep(this.service) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            onChangeTitle(e) {
                this.form.slug = slugify(e.target.value);
            },

            selectCategory(category) {
                const data = this.categories.find((e) => e.slug === category);
                this.form.category = {
                    slug: data.slug,
                    title: data.title,
                };
            },

            getContent(content) {
                this.form.content = content;
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.$emit('submit', { ...this.form, thumbnailFile: this.thumbnailFile });
                    } else {
                        this.$message.error('Cần nhập đủ trường!');
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
    .ant-upload-list-picture-card {
        .ant-upload-list-item-actions {
            a:nth-child(1) {
                @apply hidden
            }
        }
    }
</style>
