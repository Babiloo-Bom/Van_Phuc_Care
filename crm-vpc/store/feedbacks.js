export const state = () => ({
    feedbacks: [],
});

export const getters = {
};

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { feedbacks } } = await this.$api.feedbacks.getAll(params);
        commit('SET_STATE', { prop: 'feedbacks', data: feedbacks || [] });
    },
};
