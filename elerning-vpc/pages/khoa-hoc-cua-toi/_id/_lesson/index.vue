<template>
    <div v-if="!loading" class="pt-5 py-20">
        <div class="container">
            <div>
                <ul id="courseList" ref="courseList" class="text-prim-100 flex items-center gap-3 font-semibold w-full overflow-auto">
                    <li class="w-full sm:w-auto min-w-fit">
                        <nuxt-link to="/khoa-hoc-cua-toi">
                            Khóa học của tôi
                        </nuxt-link>
                    </li>
                    <li>
                        <span>|</span>
                    </li>
                    <li class="w-full sm:w-auto min-w-fit">
                        <nuxt-link :to="`/khoa-hoc-cua-toi/${course.slug}`">
                            {{ course?.title }}
                        </nuxt-link>
                    </li>
                    <li>
                        <span>|</span>
                    </li>
                    <li class="w-full sm:w-auto min-w-fit">
                        <span>{{ chapter?.title }}</span>
                    </li>
                </ul>
                <div class="flex items-center gap-3">
                    <a-button class="!w-8 !px-1" type="primary" @click="back">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            class="fill-none stroke-white"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="1.5"
                            d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
                        /></svg>
                    </a-button>
                    <span class="text-xl text-prim-100 font-semibold">Về bài học của tôi</span>
                </div>
            </div>
            <section class="mt-4">
                <div class="grid grid-cols-12 md:gap-12">
                    <div class="col-span-12 lg:col-span-8">
                        <div>
                            <h2 class="pl-0 sm:pl-4 text-[24px] font-bold text-prim-100 mb-1">
                                {{ chapter?.title }}
                            </h2>
                            <div class="pl-0 sm:pl-8">
                                <h3 class="text-[20px] font-[600] text-[#798894] mt-6 mb-3">
                                    {{ lesson?.title }}
                                </h3>
                                <div class="mt-4 mb-6">
                                    <div class="border-[1px] border-solid border-gray-80 p-4 rounded">
                                        <div class="flex justify-between items-center flex-wrap">
                                            <span class="text-prim-100 font-semibold">Tiến trình</span>
                                            <span class="font-semibold text-[#787d84]">{{ (((processing?.complete?.length || 0) / totalLessonCount) * 100).toFixed(0) }}% Hoàn thành</span>
                                            <div class="w-full flex h-2 rounded-full mt-1 overflow-hidden">
                                                <div class="bg-[#14cf76]" :style="`width: ${(((processing?.complete?.length || 0) / totalLessonCount) * 100).toFixed(0)}%`" />
                                                <div class="flex-1 bg-[#d9d9d9]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="lesson?.videoIframe" class="mb-4" v-html="lesson?.videoIframe" />
                                <div v-if="chapter?.documents?.length" class="flex items-center gap-1 align-bottom border-t-[1px] border-b-[1px] border-[#7C8A96] py-4">
                                    <a-button :loading="loadingDownload" class="!bg-prim-100 !text-white !flex items-center gap-2" @click="handlDownloadDocuments">
                                        <span class="text-[16px] font-[500]">Tài liệu</span>
                                        <svg
                                            class="transition-all duration-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        ><path
                                            d="M9 11v6l2-2M9 17l-2-2"
                                            stroke="#fff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /><path
                                            d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
                                            stroke="#fff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /><path
                                            d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
                                            stroke="#fff"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg>
                                    </a-button>
                                    <span class="text-[#798894]">(* Tải xuống)</span>
                                </div>
                                <div class="mt-6">
                                    <div v-if="lesson?.content" v-html="lesson?.content" />
                                    <div v-else class="h-[250px]">
                                        <a-empty description="Nội dung đang hoàn thiện" />
                                    </div>
                                </div>
                                <div v-if="lesson?.title">
                                    <a-divider />
                                    <div v-if="!isCompleted">
                                        <a-button class="!bg-prim-100 !text-white" @click="handleExam">
                                            Làm trắc nghiệm
                                        </a-button>
                                        <div v-if="lessonNext?.title">
                                            <p class="m-0 text-[#1A75BB] mt-2">
                                                Hoàn thành bài kiểm tra và chuyển qua chủ đề tiếp theo
                                            </p>
                                            <p class="font-[600] m-0 text-[#798894] flex items-center gap-2 ml-2 mt-1">
                                                <span><svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="9"
                                                    height="9"
                                                    viewBox="0 0 9 9"
                                                    fill="none"
                                                >
                                                    <path d="M1 1L4.5 4.5L1 8" stroke="#798894" />
                                                    <path d="M4.5 1L8 4.5L4.5 8" stroke="#798894" />
                                                </svg></span>
                                                {{ lessonNext?.title }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-else class="flex gap-1">
                                        <a-button class="mb-4 sm:mb-0 !bg-prim-100 !text-white !flex gap-1 items-center" @click="nextCourse">
                                            Tiếp theo:
                                            {{ lessonNext?.title }}
                                            <span><svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="9"
                                                height="9"
                                                viewBox="0 0 9 9"
                                                fill="none"
                                            >
                                                <path d="M1 1L4.5 4.5L1 8" stroke="#fff" />
                                                <path d="M4.5 1L8 4.5L4.5 8" stroke="#fff" />
                                            </svg></span>
                                        </a-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-4">
                        <NavCourse :chapters="course.chapters" />
                    </div>
                </div>
            </section>
        </div>
    </div>
    <div v-else ref="xxx" class="flex items-center justify-center h-full min-h-[60vh]">
        <span class="genstech-loader" />
    </div>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import { mapState } from 'vuex';
    import moment from 'moment';
    import NavCourse from '@/components/courses/NavCourse.vue';

    export default {
        components: {
            NavCourse,
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                lessonIndex: 0,
                lesson: {},
                lessonNext: {},
                loadingDownload: false,
                isCompleted: false,
                backUrl: '',
                totalLessonCount: 0,
            };
        },

        computed: {
            ...mapState('courses', ['course', 'chapter', 'processing']),
        },
        watch: {
            course: {
                handler() {
                },
                deep: true,
            },
        },
        mounted() {
        },
        updated() {
            const courseList = this.$el.querySelector('#courseList');
            this.$nextTick(() => {
                courseList.scrollLeft = courseList.scrollWidth;
            });
        },

        methods: {
            moment,
            pushRouter(path) {
                this.$router.push(path);
            },

            async fetchData() {
                try {
                    this.loading = true;
                    const { id, lesson } = this.$route.params;
                    if (_isEmpty(this.course)) {
                        await Promise.all([
                            this.$store.dispatch('courses/fetchDetail', this.$route.params.id),
                            this.$store.dispatch('courses/fetchChapter', {
                                origin: 'vanphuccare.gensi.vn',
                                courseId: id,
                                chapter: this.$route.query.chapter,
                            }),
                        ]);
                    } else {
                        await Promise.all([
                            this.$store.dispatch('courses/fetchChapter', {
                                origin: 'vanphuccare.gensi.vn',
                                courseId: id,
                                chapter: this.$route.query.chapter,
                            }),
                        ]);
                    }
                    await this.$store.dispatch('courses/fetchProcessing', this.course._id);
                    this.totalLessons(this.course.chapters);
                    this.lessonIndex = (this.chapter.lessons || []).findIndex((e) => e.index === Number(lesson));
                    this.lesson = this.chapter.lessons[this.lessonIndex];
                    this.lessonNext = this.chapter.lessons[this.lessonIndex + 1] || this.course.chapters[Number(this.$route.query.chapter) + 1];
                    this.isCompleted = this.handleCheckCompleted(Number(this.$route.query.chapter), this.lessonIndex);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            openCourse() {
                this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}/${this.course.chapters[0]?.lessons[0]?._id}?chapter=${this.chapter.index}`);
            },
            nextCourse() {
                if (this.lessonIndex + 1 === this.chapter.lessons.length && this.isCompleted) {
                    return this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}`);
                }
                if (this.lessonIndex + 1 < this.chapter.lessons.length) {
                    return this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}/${this.lessonIndex + 1}?chapter=${this.chapter.index}`);
                }
                return this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}/0?chapter=${Number(this.$route.query.chapter) + 1}`);
            },
            handleExam() {
                this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}/${this.lessonIndex}/trac-nghiem?chapter=${this.chapter.index}`);
            },
            handleCheckCompleted(chapterIndex, lessonIndex) {
                return this.processing.complete?.findIndex((lessonCompleted) => this.course._id === lessonCompleted.courseId && chapterIndex === lessonCompleted.chapterIndex && lessonCompleted.lessonIndex === lessonIndex) > -1;
            },

            async handlDownloadDocuments() {
                const documents = this.chapter.documents || [];
                if (documents.length) {
                    try {
                        this.loadingDownload = true;
                        this.errorMessage = ''; // Reset any previous error message
                        const response = await this.$axios.post('https://api.synck.io.vn/api/s/download', {
                            urls: documents.map((e) => e.source),
                        }, {
                            responseType: 'blob', // Set response type to blob for downloading
                        });

                        // Create a URL for the blob and trigger the download
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `Tài liệu ${this.course.title}.zip`); // Name of the file to download
                        document.body.appendChild(link);
                        link.click(); // Trigger the download
                        link.remove(); // Clean up
                    } catch (error) {
                        this.errorMessage = `Error downloading files: ${error.message}`;
                        console.error(error);
                    } finally {
                        this.loadingDownload = false;
                    }
                }
            },
            totalLessons(chapters = []) {
                this.totalLessonCount = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
            },
            back() {
                if (this.backUrl) {
                    this.$router.push(this.backUrl);
                } else {
                    this.$router.go(-1);
                }
            },
        },

        head() {
            return {
                title: this.course ? this.course?.title : 'Khóa học của tôi',
            };
        },
    };
</script>
<style lang="scss">
</style>
