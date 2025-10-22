export const state = () => ({
    breadcrumbs: [],
});

export const mutations = {
    SET_BREADCRUMBS(state, payload) {
        if (window.innerWidth < 1200) {
            state.breadcrumbs = payload ? [payload[payload.length - 1]] : [];
        } else {
            state.breadcrumbs = payload;
        }
    },
};

export const actions = {
    fetchBreadcrumb({ commit }, payload) {
        commit('SET_BREADCRUMBS', payload);
    },
};
