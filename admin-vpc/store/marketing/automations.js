export const state = () => ({
    automations: [],
    automation: {},
    pagination: {},
    automationSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_AUTOMATIONS(state, payload) {
        state.automations = payload;
    },
    SET_AUTOMATION(state, payload) {
        state.automation = payload;
    },
    SET_AUTOMATION_SELECTED(state, payload) {
        state.automationSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { automations, pagination } } = await this.$api.automations.getAll(params);

        commit('SET_AUTOMATIONS', automations);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, automationId) {
        const { data: { automation } } = await this.$api.automations.getDetail(automationId);
        commit('SET_AUTOMATION', automation);
    },
    async update({ commit }, params) {
        const { data: { automation } } = await this.$api.automations.update(params._id, params.data);
        commit('SET_AUTOMATION', automation);
    },
    async selectedCustomer({ commit }, params) {
        commit('SET_AUTOMATION_SELECTED', params);
    },
};
