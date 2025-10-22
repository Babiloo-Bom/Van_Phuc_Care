export const state = () => ({
    breadcrumbs: [],
});

export const mutations = {
    SET_BREADCRUMBS(state, payload) {
        state.breadcrumbs = payload;
    },
};

export const actions = {
    fetchBreadcrumb({ commit }, payload) {
        commit('SET_BREADCRUMBS', payload);
    },
};
