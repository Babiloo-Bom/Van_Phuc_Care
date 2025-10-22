export const state = () => ({
    faqs: [],
});

export const getters = {
};

export const mutations = {
    SET_FAQ(state, payload) {
        state.faqs = payload;
    },

    UPDATE_FAQ(state, payload) {
        state.faqs.map((item) => {
            if (item.id === payload.id) {
                item.content = payload?.data?.content;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.faqs;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { faqs } } = await this.$api.faqs.getAll(params);
        commit('SET_FAQ', faqs);
    },
    async update({ commit }, params) {
        await this.$api.faqs.update(params.id, params.data);
        commit('UPDATE_FAQ', { id: params.id, data: params.data });
    },
};
