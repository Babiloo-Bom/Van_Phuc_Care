<template>
    <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :colon="false"
    >
        <div>
            <div class="grid grid-cols-3 gap-6">
                <div class="col-span-2 flex flex-col gap-3">
                    <a-form-model-item label="Tên khóa học" prop="title">
                        <a-input v-model="form.title" placeholder="Nhập tên khóa học" @change="onChangeTitle" />
                    </a-form-model-item>
                    <a-form-model-item label="Đường dẫn" prop="title">
                        <a-input v-model="form.slug" placeholder="Nhập đường dẫn khóa học" />
                    </a-form-model-item>
                    <a-form-model-item label="Mô tả ngắn" prop="shortDescriptions">
                        <a-textarea v-model="form.shortDescriptions" placeholder="Nhập mô tả ngắn" :auto-size="{ minRows: 5, maxRows: 5 }" />
                    </a-form-model-item>
                    <a-form-model-item label="Iframe Video" prop="videoIframe">
                        <a-textarea v-model="form.videoIframe" placeholder="Nhập iframe youtube" :auto-size="{ minRows: 5, maxRows: 5 }" />
                    </a-form-model-item>
                    <div class="grid grid-cols-3 gap-3">
                        <a-form-model-item label="Cấp độ" prop="level">
                            <a-select v-model="form.level">
                                <a-select-option value="easy">
                                    Dễ
                                </a-select-option>
                                <a-select-option value="normal">
                                    Bình thường
                                </a-select-option>
                                <a-select-option value="hard">
                                    Khó
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="Số video" prop="videoCount">
                            <a-input v-model="form.videoCount" placeholder="Nhập số video trong khóa học" />
                        </a-form-model-item>
                        <a-form-model-item label="Số tài liệu" prop="documentCount">
                            <a-input v-model="form.documentCount" placeholder="Nhập số tài liệu trong khóa học" />
                        </a-form-model-item>
                        <a-form-model-item label="Số bài tập" prop="examCount">
                            <a-input v-model="form.examCount" placeholder="Nhập số bài tập trong khóa học" />
                        </a-form-model-item>
                        <a-form-model-item label="Thời lượng" prop="timeCount">
                            <a-input v-model="form.timeCount" placeholder="VD: 60 phút" />
                        </a-form-model-item>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <a-form-model-item label="Giá tiền" prop="price">
                            <a-input v-model="form.price" placeholder="Nhập giá tiền" />
                        </a-form-model-item>
                        <a-form-model-item label="Giá tiền đã giảm" prop="priceSale">
                            <a-input-number v-model="form.priceSale" placeholder="Nhập tên khóa học" />
                        </a-form-model-item>
                    </div>
                </div>
                <div class="bg-white rounded-md">
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
                    <div class="mb-2 mt-2">
                        <span class="font-semibold text-sm mr-2">Đánh giá:</span>
                        <a-rate v-model="form.rate" :default-value="5" />
                    </div>
                    <div>
                        <span class="font-semibold text-sm mr-2">Nhận được chứng chỉ:</span>
                        <a-switch :checked="form.certificate" @change="(check) => form.certificate = check" />
                    </div>
                </div>
                <div class="col-span-3">
                    <Editor
                        v-if="editorStatus"
                        :value="form.descriptions"
                        title="Mô tả nội dung khóa học"
                        @contentChange="(val) => { form.descriptions = val }"
                    />
                </div>
            </div>
        </div>
    </a-form-model>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import Editor from '@/components/shared/TinyEditor.vue';
    import { slugify } from '@/utils/data';

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
        videoCount: 0,
        documentCount: 0,
        examCount: 0,
        certificate: true,
        shortDescriptions: '',
    };

    export default {
        components: {
            Editor,
        },

        props: {
            course: {
                type: Object,
                default: () => {},
            },
            editorStatus: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                form: this.course ? _cloneDeep(this.course) : _cloneDeep(defaultForm),
                thumbnailFile: null,
                typePrice: 'default',
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    descriptions: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    videos: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    documents: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    exam: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    price: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    shortDescriptions: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
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

            onChangeTitle(e) {
                this.form.slug = slugify(e.target.value);
            },

            submit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$emit('submit', { form: this.form, thumbnailFile: this.thumbnailFile });
                    } else {
                        this.$message.info('Vui lòng nhập đầy đủ thông tin các trường của khóa học');
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
