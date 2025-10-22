export const state = () => ({
    feedbacks: [],
    pagination: {},
});

export const getters = {
};

export const mutations = {
    SET_FEEDBACK(state, payload) {
        state.feedbacks = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    UPDATE_FEEDBACK(state, payload) {
        state.feedbacks.map((item) => {
            if (item._id === payload._id) {
                item.title = payload?.data?.title;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.feedbacks;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { feedbacks, pagination } } = await this.$api.feedbacks.getAll(params);

        commit('SET_FEEDBACK', feedbacks);
        commit('SET_PAGINATION', pagination);
    },
    async update({ commit }, params) {
        await this.$api.feedbacks.update(params.id, params.data);
        commit('UPDATE_FEEDBACK', { id: params.id, data: params.data });
    },
};
