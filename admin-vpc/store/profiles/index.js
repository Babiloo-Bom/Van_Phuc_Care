export const state = () => ({
    activeLogs: [],
    activePagi: {},
});

export const getters = {
};

export const mutations = {
    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchActiveLogs({ commit }, payload) {
        const { data: { activeLogs, pagination } } = await this.$api.auth.getActiveLogs(payload);
        commit('SET_STATE', { prop: 'activeLogs', data: activeLogs });
        commit('SET_STATE', { prop: 'activePagi', data: pagination });
    },
};
