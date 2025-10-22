import _cloneDeep from 'lodash/cloneDeep';

export const state = () => ({
    courses: [],
    course: {},
    pagination: {},
    courseSelected: [],
    chapterSelected: {},
    exercises: [],
});

export const getters = {
    chapters: (state) => state.course.chapters || [],
};

export const mutations = {
    SET_COURSES(state, payload) {
        state.courses = payload;
    },

    SET_COURSE(state, payload) {
        state.course = payload;
    },

    SET_COURSE_SELECTED(state, payload) {
        state.courseSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { courses, pagination } } = await this.$api.courses.getAll(params);

        commit('SET_COURSES', courses);
        commit('SET_PAGINATION', pagination);
    },

    async fetchDetail({ commit }, courseId) {
        const { data: { course } } = await this.$api.courses.getDetail(courseId);
        commit('SET_COURSE', course);
    },

    async update({ commit }, params) {
        const { data: { course } } = await this.$api.courses.update(params._id, params.data);
        commit('SET_COURSE', course);
    },

    async selectedCourse({ commit }, params) {
        commit('SET_COURSE_SELECTED', params);
    },

    async selectedChapter({ commit }, params) {
        commit('SET_STATE', { prop: 'chapterSelected', data: params || {} });
    },

    async createChapter(context, params) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters.push({
            ...params,
        });
        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
    },

    async updateCacheChapter(context, params) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters[context.state.chapterSelected.index] = {
            ...params,
        };
        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
    },

    async deleteChapter(context) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters.splice(context.state.chapterSelected.index, 1);

        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
        context.commit('SET_STATE', { prop: 'chapterSelected', data: { ...context.state.course.chapters[0], index: 0 } || {} });
    },

    async createLesson(context, params) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters[context.state.chapterSelected.index].lessons.push({
            title: '',
            descriptions: '',
            content: '',
            exerciseId: '',
            ...params,
        });
        context.commit('SET_STATE', { prop: 'chapterSelected', data: _chapters[context.state.chapterSelected.index] || {} });
        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
    },

    async updateLesson(context, params) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters[context.state.chapterSelected.index].lessons[params.index] = {
            ...params,
        };
        context.commit('SET_STATE', { prop: 'chapterSelected', data: _chapters[context.state.chapterSelected.index] || {} });
        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
    },

    async updateExerciseForLesson(context, params) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters[context.state.chapterSelected.index].lessons[params.index] = {
            ..._chapters[context.state.chapterSelected.index].lessons[params.index],
            exercisesId: params._id,
        };
        context.commit('SET_STATE', { prop: 'chapterSelected', data: _chapters[context.state.chapterSelected.index] || {} });
        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
        await this.$api.courses.update(context.state.course._id, context.state.course);
    },

    async deleteLesson(context, params) {
        const _chapters = _cloneDeep(context.state.course.chapters) || [];
        _chapters[context.state.chapterSelected.index].lessons.splice(params, 1);
        context.commit('SET_STATE', { prop: 'chapterSelected', data: _chapters[context.state.chapterSelected.index] || {} });
        context.commit('SET_STATE', { prop: 'course', data: { ...context.state.course, chapters: _chapters } });
    },

    async fetchExercises({ commit }, params) {
        const { data: { exercise } } = await this.$api.courses.getExercises(params);
        commit('SET_STATE', { prop: 'exercises', data: exercise.data || [] });
    },

    async createQuestion(context, params) {
        const _exercises = _cloneDeep(context.state.exercises) || [];
        _exercises.push(params);
        context.commit('SET_STATE', { prop: 'exercises', data: _exercises.map((e, index) => ({ ...e, index })) });
    },

    async updateQuestion(context, params) {
        const _exercises = _cloneDeep(context.state.exercises) || [];
        _exercises[params.index] = params;
        context.commit('SET_STATE', { prop: 'exercises', data: _exercises });
    },

    async deleteQuestion(context, params) {
        const _exercises = _cloneDeep(context.state.exercises) || [];
        _exercises.splice(params.index, 1);
        context.commit('SET_STATE', { prop: 'exercises', data: _exercises });
    },

    resetState(context) {
        context.commit('SET_STATE', { prop: 'course', data: {} });
    },

    resetExercise(context) {
        context.commit('SET_STATE', { prop: 'exercises', data: [] });
    },
};
