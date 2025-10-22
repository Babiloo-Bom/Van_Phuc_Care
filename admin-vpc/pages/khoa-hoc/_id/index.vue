<template>
    <div>
        <div v-show="!loading" class="pb-5">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/khoa-hoc')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-4">
                        <h4 class="m-0 text-[20px] font-bold">
                            {{ $route.params.id ==='tao-moi' ? 'Tạo khóa học mới' : 'Chỉnh sửa thông tin' }}
                        </h4>
                    </div>
                    <div class="flex items-center gap-3">
                        <nuxt-link to="/khoa-hoc">
                            <a-button>
                                Hủy bỏ
                            </a-button>
                        </nuxt-link>
                        <a-button
                            type="primary"
                            class="ml-3"
                            :loading="loading"
                            @click="submitForm"
                        >
                            {{ $route.params.id ==='tao-moi' ? 'Tạo mới' : 'Cập nhật' }}
                        </a-button>
                        <a-button type="text" class="!p-1 !w-[31px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="$refs.confirmDelete.open()">
                            <svg
                                viewBox="0 0 20 20"
                                class="!m-0 w-[23px] h-[23px]"
                                focusable="false"
                                aria-hidden="true"
                            ><path fill="#8e8e8e" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#8e8e8e" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#8e8e8e" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                        </a-button>
                    </div>
                </div>
            </div>

            <div class="mt-4 card-container">
                <a-tabs default-active-key="1" type="card" @change="changeTab">
                    <a-tab-pane key="1" tab="Thông tin khóa học" force-render>
                        <CourseForm
                            ref="CourseForm"
                            :is-edit="false"
                            :editor-status="editorStatus"
                            :course="$route.params.id === 'tao-moi' ? null : course"
                            @submit="(course) => courseEmit = course"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Giảng viên" force-render>
                        <LectureForm
                            ref="LectureForm"
                            :is-edit="false"
                            :lecture="$route.params.id === 'tao-moi' ? null : course.lecturers"
                            @submit="(lecture) => lectureEmit = lecture"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Danh sách bài giảng" force-render>
                        <ChapterForm
                            ref="ChapterForm"
                            :is-edit="false"
                            :editor-status="editorStatus"
                            :course="$route.params.id === 'tao-moi' ? null : course"
                            @submit="(chapter) => chapterEmit = chapter"
                        />
                    </a-tab-pane>
                    <a-tab-pane
                        v-if="$route.params.id !== 'tao-moi'"
                        key="4"
                        tab="Đánh giá"
                        force-render
                    >
                        <Feedbacks />
                    </a-tab-pane>
                </a-tabs>
            </div>

            <ConfirmDialog
                ref="confirmDelete"
                title="Xóa bản ghi"
                content="Bạn chắc chắn xóa bản ghi này?"
                @confirm="confirmDelete"
            />
        </div>
        <div v-show="loading" class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import {
        convertToFormData,
    } from '@/utils/form';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import _omit from 'lodash/omit';
    import CourseForm from '@/components/courses/Form.vue';
    import ChapterForm from '@/components/courses/Chapters.vue';
    import LectureForm from '@/components/courses/Lectures.vue';
    import Feedbacks from '@/components/courses/Feedbacks.vue';

    export default {
        layout: 'academy',
        components: {
            CourseForm,
            ConfirmDialog,
            ChapterForm,
            LectureForm,
            Feedbacks,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                editorStatus: true,
                loadingSubmit: false,

                courseEmit: null,
                lectureEmit: null,
                chapterEmit: null,
                reviewEmit: null,
            };
        },

        computed: {
            ...mapState('courses', ['course']),
            ...mapGetters('courses', ['chapters']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Khóa học',
                link: '/khoa-hoc',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.$route.params.id !== 'tao-moi') {
                        await this.$store.dispatch('courses/fetchDetail', this.$route.params.id);
                    } else {
                        this.$store.dispatch('courses/resetState');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async fetchFeedbacks() {
                try {
                    this.loadingFeedback = true;
                    await this.$store.dispatch('feedbacks/fetchAll', {
                        courseId: this.course._id,
                    });
                    this.loadingFeedback = false;
                } catch (error) {
                    this.loadingFeedback = false;
                    this.$handleError(error);
                }
            },
            async confirmDelete() {
                try {
                    this.loadingSubmit = true;
                    await this.$api.courses.delete([this.course._id]);
                    this.$message.success('Xóa khóa học thành công');
                    await this.$store.dispatch('courses/fetchAll', { ...this.$route.query });
                    this.$router.push('/khoa-hoc');
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingSubmit = false;
                }
            },

            async submitForm() {
                try {
                    this.$refs.CourseForm.submit();
                    this.$refs.LectureForm.submit();
                    await this.$refs.ChapterForm.submit();

                    const { form: courseForm } = this.courseEmit;
                    const { form: lecturesForm } = this.lectureEmit;

                    const { thumbnailFile } = this.courseEmit;
                    const { avatarFile } = this.lectureEmit;

                    this.loading = true;
                    const _data = { ...courseForm, lecturers: { ...lecturesForm }, chapters: [...this.chapters] };

                    const uploadThumbnailPromise = thumbnailFile
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: thumbnailFile }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const uploadAvatarPromise = avatarFile
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: avatarFile }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const [thumbnailResponse, avatarResponse] = await Promise.all([uploadThumbnailPromise, uploadAvatarPromise]);

                    if (thumbnailResponse.data.fileAttributes.length > 0) {
                        _data.thumbnail = thumbnailResponse.data.fileAttributes[0]?.source;
                    }

                    if (avatarResponse.data.fileAttributes.length > 0) {
                        _data.lecturers.avatar = avatarResponse.data.fileAttributes[0]?.source;
                    }

                    if (!this.course._id) {
                        const { data: { course } } = await this.$api.courses.create({ ..._data, status: 'active' });
                        this.$message.success('Thêm khóa học thành công');
                        this.$router.push(`/khoa-hoc/${course._id}`);
                    } else {
                        console.log('2');
                        await this.$api.courses.update(this.course._id, _omit(_data, ['_id', 'thumbnailFile']));
                        this.$message.success('Chỉnh sửa khóa học thành công');
                    }
                    await this.$store.dispatch('courses/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            changeTab(value) {
                if (value === '4') {
                    this.fetchFeedbacks();
                }
                this.editorStatus = false;
                setTimeout(() => {
                    this.editorStatus = true;
                }, 10);
            },
        },

        head() {
            return {
                title: this.$route.params.id === 'tao-moi' ? 'Tạo khóa học mới' : this.course.title,
            };
        },
    };
</script>

<style>
.card-container {
  overflow: hidden;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  min-height: 300px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
