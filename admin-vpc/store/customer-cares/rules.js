export const state = () => ({
    rules: [],
});

export const getters = {
};

export const mutations = {
    SET_RULE(state, payload) {
        state.rules = payload;
    },

    UPDATE_RULE(state, payload) {
        state.rules.map((item) => {
            if (item.id === payload.id) {
                item.content = payload?.data?.content;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.rules;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { rules } } = await this.$api.rules.getAll(params);
        commit('SET_RULE', rules);
    },
    async update({ commit }, params) {
        await this.$api.rules.update(params.id, params.data);
        commit('UPDATE_RULE', { id: params.id, data: params.data });
    },
};
