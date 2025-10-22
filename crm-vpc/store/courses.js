export const state = () => ({
    courses: null,
    recomentCourses: null,
    course: null,
    pagination: {},
    courseSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_COURSES(state, payload) {
        state.courses = payload;
    },
    SET_RECOMENT_COURSES(state, payload) {
        state.recomentCourses = payload;
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
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { courses, pagination } } = await this.$api.courses.getAll(params);

        commit('SET_COURSES', courses);
        commit('SET_PAGINATION', pagination);
    },

    async fetchRecoment({ commit }, params) {
        const { data: { courses } } = await this.$api.courses.getRecomnentCourses(params);
        commit('SET_RECOMENT_COURSES', courses);
    },

    async fetchDetail({ commit }, courseId) {
        const { data: { course } } = await this.$api.courses.getDetail(courseId);
        commit('SET_COURSE', course);
    },
};
