export const state = () => ({
    result: null,
    exercise: {},
    exerciseSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_RESULT(state, payload) {
        state.result = payload;
    },
    SET_EXERCISE(state, payload) {
        state.exercise = payload;
    },
    SET_EXERCISE_SELECTED(state, payload) {
        state.exerciseSelected = payload;
    },
};

export const actions = {
    async fetchDetail({ commit }, exerciseId) {
        const { data: { exercise } } = await this.$api.exercises.get(exerciseId);
        commit('SET_EXERCISE', exercise);
    },
    async submit({ commit }, params) {
        const { data: { result } } = await this.$api.exercises.submit(params._id, params.data);
        commit('SET_RESULT', result);
    },
    async setExercise({ commit }, params) {
        commit('SET_EXERCISE', params);
    },
    async setResult({ commit }, params) {
        commit('SET_RESULT', params);
    },
    async selectedCourse({ commit }, params) {
        commit('SET_EXERCISE_SELECTED', params);
    },
};
