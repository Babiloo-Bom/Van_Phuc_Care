<template>
    <div class="flex gap-6 pb-4 justify-center">
        <template v-if="chapters.length > 0">
            <NavChappters class="w-[300px]" />
            <div class="flex-1">
                <a-form-model
                    ref="form"
                    :model="form"
                    :rules="rules"
                    :colon="false"
                >
                    <div class="">
                        <div>
                            <div class="grid grid-cols-1 gap-4">
                                <div>
                                    <h3 class="text-md mb-0 font-bold">
                                        Tên bài giảng
                                    </h3>
                                    <div class="flex items-end gap-3">
                                        <a-form-model-item prop="title" class="flex-1">
                                            <a-input v-model="form.title" placeholder="Nhập tên bài giảng" @change="updateCacheChapter" />
                                        </a-form-model-item>
                                        <div class="w-[50px] text-center cursor-pointer relative -top-2.5" @click="deleteChapter">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                class="fill-none stroke-danger-100 mx-auto"
                                            ><path
                                                d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-md mb-2 font-bold">
                                            Tài liệu
                                        </h3>
                                    </div>
                                    <a-upload
                                        name="file"
                                        :multiple="true"
                                        :file-list="fileList"
                                        action="https://api.synck.io.vn/api/uploads"
                                        :remove="handleRemove"
                                        :before-upload="beforeUpload"
                                        @change="handleUpload"
                                    >
                                        <a-button>
                                            <div class="flex items-center gap-1 justify-center">
                                                <a-icon type="upload" /> Click to Upload
                                            </div>
                                        </a-button>
                                    </a-upload>
                                </div>
                                <div>
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-md mb-0 font-bold">
                                            Chủ đề
                                        </h3>
                                        <a-button
                                            v-if="form.lessons.length > 0"
                                            type="primary"
                                            @click="() => {
                                                lessonVisible = true,
                                                isCreateLesson = true
                                            }"
                                        >
                                            Thêm chủ đề
                                        </a-button>
                                    </div>
                                    <div>
                                        <template v-if="form.lessons.length > 0">
                                            <div v-for="lesson, index in form.lessons" :key="index" class="mt-2">
                                                <div class="flex justify-between bg-[#f8fcff] p-3 border-[1px] border-solid border-prim-20 rounded-sm">
                                                    <div>
                                                        <h4 class="mb-0">
                                                            {{ lesson.title }}
                                                        </h4>
                                                        <p class="mb-0 mt-1">
                                                            {{ lesson.descriptions }}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <a-dropdown placement="bottomRight" :trigger="['click']">
                                                            <span class="cursor-pointer">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
                                                                    viewBox="0 0 24 24"
                                                                    class="fill-none stroke-prim-100"
                                                                ><path
                                                                    d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
                                                                    stroke-width="1.5"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                /><path
                                                                    d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z"
                                                                    stroke-width="1.5"
                                                                    stroke-miterlimit="10"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                /><path
                                                                    d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94"
                                                                    stroke-width="1.5"
                                                                    stroke-miterlimit="10"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                /></svg>
                                                            </span>
                                                            <a-menu slot="overlay" class="!w-40">
                                                                <a-menu-item
                                                                    @click="() => {
                                                                        lessonVisible = true,
                                                                        lessonForm = {
                                                                            ...lesson,
                                                                            index: index,
                                                                        },
                                                                        isCreateLesson = false
                                                                    }"
                                                                >
                                                                    Chỉnh sửa chủ đề
                                                                </a-menu-item>
                                                                <a-menu-item
                                                                    v-if="$route.params.id !== 'tao-moi' && lesson.exercisesId"
                                                                    @click="() => $refs.ExcerciseDrawer.open(lesson, 'update', index)"
                                                                >
                                                                    Xem bài trắc nghiệm
                                                                </a-menu-item>
                                                                <a-menu-item
                                                                    v-if="$route.params.id !== 'tao-moi' && !lesson.exercisesId"
                                                                    @click="() => $refs.ExcerciseDrawer.open(lesson, 'create', index)"
                                                                >
                                                                    Thêm bài trắc nghiệm
                                                                </a-menu-item>
                                                                <a-menu-item class="!text-danger-100" @click="() => deleteLessons(index)">
                                                                    Xóa chủ đề
                                                                </a-menu-item>
                                                            </a-menu>
                                                        </a-dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="flex-col gap-4 mt-6 flex items-center justify-center h-full">
                                                <a-empty :description="false" />
                                                <h4 class="font-bold text-center">
                                                    Hiện tại chưa có chủ đề nào
                                                </h4>
                                                <a-button
                                                    type="primary"
                                                    @click="() => {
                                                        lessonVisible = true,
                                                        isCreateLesson = true
                                                    }"
                                                >
                                                    Thêm chủ đề
                                                </a-button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-form-model>
            </div>
        </template>
        <template v-else>
            <div class="flex-col gap-4 mt-6 flex items-center justify-center h-full">
                <a-empty :description="false" />
                <h4 class="font-bold text-center">
                    Hiện tại chưa có chương nào
                </h4>
                <a-button type="primary" @click="createChapter">
                    Thêm chương mới
                </a-button>
            </div>
        </template>
        <a-drawer
            placement="right"
            :visible="lessonVisible"
            width="600px"
            :mask-closable="true"
            :closable="false"
            @close="onClose"
        >
            <a-form-model
                ref="LessonForm"
                :model="lessonForm"
                :rules="lessonRules"
                :colon="false"
            >
                <div class="flex flex-col gap-3 p-2">
                    <a-form-model-item label="Tên chủ đề" prop="title">
                        <a-input v-model="lessonForm.title" placeholder="Nhập tên chủ đề" />
                    </a-form-model-item>
                    <a-form-model-item label="Mô tả ngắn" prop="descriptions">
                        <a-textarea v-model="lessonForm.descriptions" placeholder="Nhập mô tả ngắn" :auto-size="{ minRows: 5, maxRows: 5 }" />
                    </a-form-model-item>
                    <a-form-model-item label="Iframe Video" prop="videoIframe">
                        <a-textarea v-model="lessonForm.videoIframe" placeholder="Nhập iframe youtube" :auto-size="{ minRows: 5, maxRows: 5 }" />
                    </a-form-model-item>
                    <Editor
                        v-if="editorStatus && lessonVisible"
                        :value="lessonForm.content"
                        title="Nội dung"
                        @contentChange="(val) => { lessonForm.content = val }"
                    />
                    <div class="flex items-center justify-center gap-3 mt-4">
                        <a-button class="!w-[140px]" @click="onClose">
                            Đóng
                        </a-button>
                        <a-button type="primary" class="!w-[140px]" @click="updateLessons">
                            Đồng ý
                        </a-button>
                    </div>
                </div>
            </a-form-model>
        </a-drawer>
        <ExcerciseDrawer ref="ExcerciseDrawer" />
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';
    import Editor from '@/components/shared/TinyEditor.vue';
    import NavChappters from '@/components/courses/Nav.vue';
    import ExcerciseDrawer from '@/components/courses/excerises/Drawer.vue';

    const defaultForm = {
        title: '',
        lessons: [{
            title: '',
            descriptions: '',
            content: '',
            exerciseId: '',
        }],
    };

    export default {
        components: {
            Editor,
            NavChappters,
            ExcerciseDrawer,
        },

        props: {
            editorStatus: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                lessonVisible: false,
                loading: false,
                form: this.chapterSelected ? _cloneDeep(this.chapterSelected) : _cloneDeep(defaultForm),
                lessonForm: {},
                rules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
                lessonRules: {
                    title: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                    descriptions: [{ required: true, message: 'Không được để trống trường này', trigger: 'blur' }],
                },
                lessonFile: null,
                isCreateLesson: true,
                fileList: [],
                uploading: false,
            };
        },

        computed: {
            ...mapGetters('courses', ['chapters']),
            ...mapState('courses', ['chapterSelected']),
        },

        watch: {
            chapterSelected: {
                handler() {
                    this.form = this.chapterSelected ? _cloneDeep(this.chapterSelected) : _cloneDeep(defaultForm);
                    this.fileList = (this.form.documents || []).map((e, i) => ({
                        uid: i,
                        name: e.originalname,
                        status: 'done',
                        url: e.source,
                    }));
                },
                deep: true,
            },
        },

        methods: {
            _isEmpty,

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.thumbnail = URL.createObjectURL(file);
            },

            onClose() {
                this.lessonVisible = false;
            },

            createChapter() {
                this.$store.dispatch('courses/createChapter', {
                    title: 'Chương mới',
                    lessons: [],
                    index: 0,
                });
                this.$store.dispatch('courses/selectedChapter', { ...this.chapters[0], index: 0 });
            },

            updateCacheChapter(e) {
                this.$store.dispatch('courses/updateCacheChapter', { ...this.form, title: e.target.value });
            },

            deleteChapter() {
                this.$store.dispatch('courses/deleteChapter');
            },

            createLesson() {
                this.$store.dispatch('courses/createLesson', {
                    ...this.lessonForm,
                    index: 0,
                });
            },

            updateLessons() {
                if (this.isCreateLesson) {
                    this.$store.dispatch('courses/createLesson', {
                        ...this.lessonForm,
                        index: this.chapterSelected.lessons.length,
                    });
                } else {
                    this.$store.dispatch('courses/updateLesson', {
                        ...this.lessonForm,
                        index: this.lessonForm.index,
                    });
                }
                this.lessonForm = {};
                this.lessonVisible = false;
            },

            deleteLessons(index) {
                this.$store.dispatch('courses/deleteLesson', index);
            },

            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList;

                const documentsRemain = this.form.documents.filter((e) => this.fileList.map((record) => record.url).includes(e.source));
                this.$store.dispatch('courses/updateCacheChapter', {
                    ...this.form,
                    documents: documentsRemain,
                });
            },

            beforeUpload(file) {
                this.fileList = [...this.fileList, file];
                return false;
            },
            async handleUpload() {
                try {
                    const { fileList } = this;
                    // Filter out valid files (File or Blob instances)
                    const validFiles = fileList.filter((file) => file instanceof File || file instanceof Blob);
                    if (!validFiles.length) {
                        return;
                    }

                    // Prepare formData with the valid files
                    const formData = new FormData();
                    validFiles.forEach((file) => formData.append('files[]', file));

                    this.uploading = true;

                    // Axios request
                    const response = await this.$axios.post('https://api.synck.io.vn/api/uploads', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    // Handle response and update documents
                    const uploadedFiles = response.data.data.fileAttributes;
                    const documentsAfterUpload = [...this.form.documents, ...uploadedFiles];

                    // Update fileList for UI
                    this.fileList = documentsAfterUpload.map((file, index) => ({
                        uid: index,
                        name: file.originalname || `File ${index + 1}`, // Fallback if name not present
                        status: 'done',
                        url: file.source,
                    }));

                    // Update the store
                    await this.$store.dispatch('courses/updateCacheChapter', {
                        ...this.form,
                        documents: documentsAfterUpload,
                    });

                    // Success feedback
                    this.$message.success('Upload successful.');
                } catch (error) {
                    console.error('Upload error:', error);
                    this.$message.error('Upload failed.');
                } finally {
                    // Ensure loading state is reset
                    this.uploading = false;
                }
            },

            async submit() {
                if (this.chapters.length > 0) {
                    this.$refs.form.validate(async (valid) => {
                        if (valid) {
                            this.$emit('submit', { form: this.form });
                        } else {
                            this.$message.info('Vui lòng nhập đầy đủ thông tin các trường bài giảng');
                            throw new Error();
                        }
                    });
                }
            },
        },
    };
</script>

<style>
    .ant-form-item-children, .ant-input-number {
        @apply block w-full
    }
    .ant-upload-list-item-progress {
        margin-bottom: 4px !important;
    }
</style>
