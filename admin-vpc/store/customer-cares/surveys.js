export const state = () => ({
    surveys: [],
});

export const getters = {
};

export const mutations = {
    SET_SURVEY(state, payload) {
        state.surveys = payload;
    },

    UPDATE_SURVEY(state, payload) {
        state.surveys.map((item) => {
            if (item.id === payload.id) {
                item.content = payload?.data?.content;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.surveys;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { surveys } } = await this.$api.surveys.getAll(params);
        commit('SET_SURVEY', surveys);
    },
    async update({ commit }, params) {
        await this.$api.surveys.update(params.id, params.data);
        commit('UPDATE_SURVEY', { id: params.id, data: params.data });
    },
};
