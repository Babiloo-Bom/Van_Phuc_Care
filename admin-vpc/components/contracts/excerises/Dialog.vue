<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(exercise) ? 'Tạo câu hỏi' : 'Chỉnh sửa câu hỏi'"
        width="800px"
        class="exercise-dialog"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div class="grid grid-cols-1 gap-5">
                <a-form-model-item label="Câu hỏi" prop="question">
                    <a-input v-model="form.question" placeholder="Nhập câu hỏi" />
                </a-form-model-item>
                <a-form-model-item label="Mô tả" prop="descriptions">
                    <a-textarea v-model="form.descriptions" placeholder="Nhập mô tả của câu hỏi" :auto-size="{ minRows: 4, maxRows: 4 }" />
                </a-form-model-item>
                <a-form-model-item
                    v-if="form.answers.length > 0"
                    prop="trueAnser"
                    :rules="{
                        required: true,
                        message: 'Hãy chọn câu trả lời',
                        trigger: ['blur', 'change'],
                    }"
                >
                    <a-radio-group v-model="form.trueAnser">
                        <div class="grid grid-cols-1 gap-5">
                            <div v-for="(answer, index) in form.answers" :key="index">
                                <h2 class="text-sm">
                                    Câu trả lời {{ index+1 }}
                                </h2>
                                <a-radio :value="index">
                                    <a-form-model-item
                                        :prop="'answers.' + index + '.content'"
                                        :rules="{
                                            required: true,
                                            message: 'Trường này không được trống',
                                            trigger: 'blur',
                                        }"
                                    >
                                        <a-textarea v-model="answer.content" placeholder="Nhập câu trả lời" :auto-size="{ minRows: 2, maxRows: 2 }" />
                                    </a-form-model-item>
                                </a-radio>
                            </div>
                        </div>
                    </a-radio-group>
                </a-form-model-item>
                <div v-if="form.answers.length < 4">
                    <div class="inline-block cursor-pointer" @click="addAnswer">
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
                                Thêm câu trả lời
                            </span>
                        </div>
                    </div>
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
                {{ _isEmpty(exercise) ? "Tạo mới" : "Cập nhật" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import _cloneDeep from 'lodash/cloneDeep';

    const defaultForm = {
        question: '',
        answers: [],
        descriptions: '',
    };

    export default {
        data() {
            return {
                visible: false,
                loading: false,
                form: this.exercise ? _cloneDeep({ ...this.exercise }) : _cloneDeep({ ...defaultForm }),
                exercise: null,
                rules: {
                    question: [
                        { required: true, message: 'Không được để trống trường này', trigger: 'blur' },
                    ],
                    descriptions: [
                        { required: true, message: 'Không được để trống trường này', trigger: 'blur' },
                    ],
                },
                indexQuestion: null,
            };
        },

        computed: {
            ...mapState('courses', ['exercises']),
        },

        watch: {
            exercise() {
                const _trueAnser = this.exercise && this.exercise.answers.findIndex((item) => item.status === true);
                this.form = this.exercise ? _cloneDeep({ ...this.exercise, trueAnser: _trueAnser }) : _cloneDeep({ ...defaultForm, trueAnser: null });
            },
        },

        methods: {
            _isEmpty,

            open(exercise, index) {
                this.exercise = exercise;
                this.indexQuestion = index;
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            empty() {
                this.form = _cloneDeep(defaultForm);
            },

            addAnswer() {
                this.form.answers = [
                    ...this.form.answers,
                    { content: '', status: false },
                ];
            },

            async submit() {
                if (this.form.answers <= 0) {
                    this.$message.info('Hãy thêm câu trả lời !');
                    return;
                }
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            const _anwsers = this.form.answers;
                            _anwsers[this.form.trueAnser].status = true;
                            if (this.exercise) {
                                this.$store.dispatch('courses/updateQuestion', { ...this.form, answers: _anwsers, index: this.indexQuestion });
                            } else {
                                this.$store.dispatch('courses/createQuestion', { ...this.form, answers: _anwsers });
                            }
                            this.empty();
                            this.close();
                        } catch (e) {
                            this.$handleError(e);
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>

<style lang="scss">
    .exercise-dialog {
        .ant-radio-group {
            @apply w-full;
        }
        .ant-radio-wrapper {
            @apply w-full flex items-start;
        }
        .ant-radio-wrapper span.ant-radio + * {
            @apply flex-1
        }
        .ant-form-explain {
            @apply absolute -bottom-5
        }
    }
</style>
