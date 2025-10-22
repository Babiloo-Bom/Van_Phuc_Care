<template>
    <a-drawer
        placement="right"
        :visible="visible"
        width="600px"
        :mask-closable="false"
        @close="close"
    >
        <div v-if="lesson" class="mt-4 px-4">
            <h2 class="text-xl font-semibold">
                Câu hỏi trắc nghiệm bài giảng <br>"{{ lesson.title }}"
            </h2>
            <a-spin :spinning="loading">
                <div>
                    <template v-if="exercises.length > 0">
                        <div v-for="exercise, index in exercises" :key="index" class="mt-2">
                            <div class="flex justify-between bg-[#f8fcff] p-3 border-[1px] border-solid border-prim-20 rounded-sm">
                                <div>
                                    <h4 class="mb-0">
                                        {{ exercise.question }}
                                    </h4>
                                    <p class="mb-0 mt-1">
                                        {{ exercise.descriptions }}
                                    </p>
                                </div>
                                <div class="flex flex-col gap-2 items-center justify-center">
                                    <span class="cursor-pointer" @click="$refs.ExcerciseDialog.open(exercise, index)">
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
                                    <span class="cursor-pointer" @click="$refs.ConfirmDialog.open()">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="23"
                                            height="23"
                                            viewBox="0 0 24 24"
                                            class="fill-none stroke-danger-100 mx-auto"
                                        ><path
                                            d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        /></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-4">
                            <div class="inline-block cursor-pointer" @click="$refs.ExcerciseDialog.open()">
                                <div class="text-center flex items-center gap-2 group hover:text-white hover:bg-prim-100 transition-all duration-300 px-3 py-2 rounded-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        class="fill-none stroke-prim-100 group-hover:stroke-white transition-all duration-300"
                                    ><path
                                        d="M6 12h12M12 18V6"
                                        stroke-width="1.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    /></svg>
                                    <span class="font-semibold text-prim-100 group-hover:text-white transition-all duration-300">
                                        Thêm câu hỏi
                                    </span>
                                </div>
                            </div>
                            <a-button
                                v-if="!compareArr"
                                :loading="loading"
                                class="px-2"
                                type="primary"
                                @click="actionExcercise"
                            >
                                {{ action === 'create' ? "Tạo mới" : "Cập nhật" }}
                            </a-button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex-col gap-4 mt-6 flex items-center justify-center h-full">
                            <a-empty :description="false" />
                            <h4 class="font-bold text-center">
                                Hiện tại chưa có câu hỏi
                            </h4>
                            <a-button type="primary" @click="$refs.ExcerciseDialog.open()">
                                Thêm câu hỏi mới
                            </a-button>
                        </div>
                    </template>
                </div>
            </a-spin>
        </div>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa phản hồi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <ExcerciseDialog ref="ExcerciseDialog" />
    </a-drawer>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _isEqual from 'lodash/isEqual';
    import ExcerciseDialog from '@/components/courses/excerises/Dialog.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        components: {
            ExcerciseDialog,
            ConfirmDialog,
        },

        data() {
            return {
                visible: false,
                loading: false,
                lesson: null,
                action: null,
                initLength: null,
                lesssonIndex: null,
            };
        },

        computed: {
            ...mapState('courses', ['exercises']),
            compareArr() {
                return _isEqual(this.initLength, this.exercises);
            },
        },

        methods: {
            _isEmpty,

            async open(lesson, action = 'create', index) {
                this.lesson = lesson;
                this.action = action;
                this.lesssonIndex = index;
                this.visible = true;
                if (action === 'update') await this.fetchExercises();
                else this.$store.dispatch('courses/resetExercise');
            },

            close() {
                this.visible = false;
            },

            async fetchExercises() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('courses/fetchExercises', this.lesson.exercisesId);
                    this.initLength = this.exercises;
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async actionExcercise() {
                try {
                    this.loading = true;
                    if (this.action === 'create') {
                        const { data: { exercise } } = await this.$api.courses.createExercise({ data: this.exercises });
                        await this.$store.dispatch('courses/updateExerciseForLesson', { index: this.lesssonIndex, _id: exercise._id });
                        this.$message.success('Thêm bài trắc nghiệm thành công');
                    } else {
                        await this.$api.courses.updateExercise(this.lesson.exercisesId, { data: this.exercises });
                        this.$message.success('Cập nhật bài trắc nghiệm thành công');
                    }
                    this.close();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async confirmDelete() {
                try {
                    this.loading = true;
                    await this.$api.courses.updateExercise(this.lesson.exercisesId, { data: this.exercises });
                    this.close();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style>
    .ant-form-item-children, .ant-input-number {
        @apply block w-full
    }
</style>
