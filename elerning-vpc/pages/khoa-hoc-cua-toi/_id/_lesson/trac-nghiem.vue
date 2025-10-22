<template>
    <div v-if="!loading" class="pt-5 py-20 text-[#798894] questions">
        <div class="container">
            <div class="flex items-center gap-3 justify-between">
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
                <h3 class="text-prim-100 font-semibold mb-0">
                    {{ chapter?.title }}
                </h3>
            </div>
            <div class="text-center mt-6">
                <h3 class="text-2xl text-prim-100 font-bold mb-0">
                    Trắc nghiệm
                </h3>
                <h2 class="text-[#798894] text-2xl font-bold mb-0 mt-2">
                    {{ lesson?.title }}
                </h2>
            </div>
            <div v-if="!result" class="max-w-[800px] mx-auto mt-6">
                <div v-if="!(loadingSubmit && loading)">
                    <div v-if="lesson?.exercisesId">
                        <div>
                            <h4 class="text-[#798894] text-2xl mb-0">
                                Câu {{ indexQuestion + 1 }}/{{ exercise.data?.length }}
                            </h4>
                            <p class="mb-0 mt-4 text-lg">
                                {{ data.question }}
                            </p>
                        </div>
                        <div class="mt-6">
                            <div class="flex flex-col gap-4">
                                <a-button
                                    v-for="(answer, index) in data.answers"
                                    :key="`answer_${index}`"
                                    class="!px-4 !py-6 !border-[1px] !border-solid border-gray-80 !rounded-md !flex !items-center !gap-2"
                                    @click="() => handleChoose(index)"
                                >
                                    <a-radio
                                        size="large"
                                        :value="index"
                                        :checked="answers[data.index]?.answer === index"
                                        @change="() => handleChoose(index)"
                                    />
                                    <span class="text-[#798894] text-lg">
                                        {{ answer.content }}
                                    </span>
                                </a-button>
                            </div>
                        </div>

                        <div :class="`flex items-center align-baseline justify-${indexQuestion > 0 ? 'between' : 'center'}`">
                            <a-button
                                v-if="indexQuestion > 0"
                                type="link"
                                class="!border-none !w-fit !flex items-center justify-center !text-prim-100 !gap-2 !py-3 cursor-pointer !mt-8"
                                @click="handleQuestion(-1)"
                            >
                                <svg
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    stroke="#1a75bb"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-miterlimit="10"
                                    stroke-width="2"
                                    d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"
                                /></svg>
                                <span class="text-prim-100 text-lg font-semibold">Quay lại</span>
                            </a-button>
                            <a-button :loading="loadingSubmit" class="!w-[160px] !flex items-center justify-center !h-[48px] !bg-prim-100 !gap-2 !py-3 !rounded-sm cursor-pointer !mt-8" @click="handleQuestion(1)">
                                <span class="text-white text-lg font-semibold">{{ exercise?.data?.length - 1 > indexQuestion ? 'Tiếp theo' : 'Hoàn thành' }}</span>
                            </a-button>
                        </div>
                    </div>
                    <div v-else class="h-[250px]">
                        <a-empty description="Nội dung đang hoàn thiện" />
                    </div>
                </div>
                <div v-else class="flex items-center justify-center h-full min-h-[60vh]">
                    <span class="genstech-loader" />
                </div>
            </div>
            <div v-else class="h-[500px]">
                <h4 class="text-[#798894] text-2xl mb-0">
                    Kết quả:
                </h4>
                <div class="flex flex-col gap-4 items-center justify-center mt-6">
                    <div :class="`mt-4 flex items-center justify-center w-[100px] h-[100px] rounded-full ${percentage === '100' ? 'bg-[#15CF74]' : 'bg-[#FF5353]'}`">
                        <span class="text-[#fff] font-[600] text-[24px]">{{ percentage }}%</span>
                    </div>
                    <span v-if="percentage === '100'" class="text-[#798894] text-[18px]">Chúc mừng bạn đã trả lời đúng tất cả câu hỏi</span>
                    <span v-else class="text-[#798894] text-[18px]">
                        Bạn trả lời đúng {{ trueObjects.length || 0 }}/{{ exercise?.data?.length }} câu hỏi
                    </span>
                    <div class="flex items-center justify-center gap-4">
                        <a-button>
                            Xem đáp án
                        </a-button>
                        <a-button
                            v-if="percentage === '100'"
                            type="primary"
                            class="!bg-prim-100 !text-white"
                            @click="nextCourse"
                        >
                            {{ isCompleted ? 'Nhận chứng chỉ' : (isLastExam ? 'Quay lại trang chủ' : 'Chủ đề tiếp theo') }}
                        </a-button>
                        <a-button
                            v-else
                            type="primary"
                            class="!bg-prim-100 !text-white"
                            @click="redo"
                        >
                            Làm lại
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full min-h-[60vh]">
        <span class="genstech-loader" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';

    export default {
        components: {
        },
        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                value: 1,
                loading: false,
                lessonIndex: 0,
                lesson: {},
                data: {},
                indexQuestion: 0,
                answers: [],
                loadingSubmit: false,
                percentage: 0,
                trueObjects: 0,
                backUrl: '',
                totalLessonCount: 0,
                isCompleted: false,
                isLastExam: false,
            };
        },

        computed: {
            ...mapState('exercises', ['exercise', 'result']),
            ...mapState('courses', ['course', 'chapter', 'reviews', 'processing']),
        },

        methods: {
            pushRouter(path) {
                this.$router.push(path);
            },
            calculateTruePercentage(data) {
                // Filter the objects with status true
                this.trueObjects = data.filter((item) => item.isTrueAnswer);

                // Calculate the percentage
                return (((this.trueObjects.length) / (data.length)) * 100).toFixed();
            },
            async fetchData() {
                try {
                    this.$store.dispatch('exercises/setResult', null);
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
                        await this.$store.dispatch('courses/fetchChapter', {
                            origin: 'vanphuccare.gensi.vn',
                            courseId: id,
                            chapter: this.$route.query.chapter,
                        });
                    }
                    this.lessonIndex = (this.chapter.lessons || []).findIndex((e) => e.index === Number(lesson));
                    this.lesson = this.chapter.lessons[this.lessonIndex];
                    if (this.lesson.exercisesId) {
                        await this.$store.dispatch('exercises/fetchDetail', this.lesson.exercisesId);
                        this.data = this.exercise?.data[this.indexQuestion];
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            handleChoose(e) {
                try {
                    this.answers = [...this.answers.filter((o) => o.question !== this.data.index), {
                        question: this.data.index,
                        answer: e,
                    }];
                } catch (error) {
                    console.log(error);
                }
            },

            handleQuestion(index) {
                const isLastQuestion = this.exercise?.data?.length - 1 === this.indexQuestion;

                if (isLastQuestion && index === 1) {
                    this.submitExercise();
                } else {
                    this.indexQuestion += index;
                    this.data = this.exercise?.data[this.indexQuestion];
                }
            },

            async submitExercise() {
                try {
                    this.loadingSubmit = true;
                    await this.$store.dispatch('exercises/submit', {
                        _id: this.exercise._id,
                        data: {
                            answers: this.answers,
                            courseId: this.course._id,
                            chapterIndex: this.chapter.index,
                            lessonIndex: this.lessonIndex,
                            updatedAt: new Date(),
                        },
                    });
                    this.percentage = this.calculateTruePercentage(this.result) || 0;
                    console.log(this.lessonIndex);
                    console.log(this.chapter.lessons.length);
                    await Promise.all([
                        this.$store.dispatch('courses/fetchDetail', this.$route.params.id),
                    ]);
                    this.totalLessons(this.course.chapters);
                    await this.$store.dispatch('courses/fetchProcessing', this.course._id);
                    if ((this.processing?.complete && this.processing?.complete.length) === this.totalLessonCount) {
                        this.isCompleted = true;
                    }
                    if (this.lessonIndex + 1 === this.chapter.lessons.length) {
                        this.isLastExam = true;
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingSubmit = false;
                }
            },
            totalLessons(chapters = []) {
                this.totalLessonCount = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
            },

            redo() {
                this.$store.dispatch('exercises/setResult', null);
                this.indexQuestion = 0;
                this.data = this.exercise?.data[this.indexQuestion];
                this.answers = [];
            },
            nextCourse() {
                if (this.isLastExam && !this.isCompleted) {
                    return this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}`);
                }
                if (this.lessonIndex + 1 < this.chapter.lessons.length) {
                    return this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}/${this.lessonIndex + 1}?chapter=0`);
                }
                return this.$router.push(`/khoa-hoc-cua-toi/${this.course.slug}/certificate`);
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
                title: 'Trắc nghiệm',
            };
        },
    };
</script>
<style lang="scss">
.questions .ant-radio-group {
    width: 100%;
}
</style>
