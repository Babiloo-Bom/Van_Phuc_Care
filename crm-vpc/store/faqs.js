export const state = () => ({
    faqs: [],
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
        const { data: { faqs } } = await this.$api.faqs.getAll(params);
        commit('SET_STATE', { prop: 'faqs', data: faqs || [] });
    },
};
