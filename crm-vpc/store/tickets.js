export const state = () => ({
    tickets: [],
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
        const { data: { tickets } } = await this.$api.tickets.getAll(params);
        commit('SET_STATE', { prop: 'tickets', data: tickets || [] });
    },
    async fetchDetail({ commit }, id) {
        const { data: { tickets } } = await this.$api.tickets.getDetail(id);
        commit('SET_STATE', { prop: 'tickets', data: tickets || [] });
    },
};
