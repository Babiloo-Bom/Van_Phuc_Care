export const state = () => ({
    workflows: [],
    workflow: [],
    pagination: {},
    workflowSelected: [],
    appSelected: null,
    exercises: [],
});

export const getters = {
};

export const mutations = {
    SET_WORKFLOWS(state, payload) {
        state.workflows = payload;
    },

    SET_WORKFLOW(state, payload) {
        state.workflow = payload;
    },

    SET_WORKFLOW_SELECTED(state, payload) {
        state.workflowSelected = payload;
    },

    SET_APP_SELECTED(state, payload) {
        state.appSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { workflows, pagination } } = await this.$api.workflows.getAll(params);

        commit('SET_WORKFLOWS', workflows);
        commit('SET_PAGINATION', pagination);
    },

    async fetchDetail({ commit }, workflowId) {
        const { data: { workflow } } = await this.$api.workflows.getDetail(workflowId);
        commit('SET_WORKFLOW', workflow);
    },

    async update({ commit }, params) {
        const { data: { workflow } } = await this.$api.workflows.update(params._id, params.data);
        commit('SET_WORKFLOW', workflow);
    },

    async selectedCourse({ commit }, params) {
        commit('SET_WORKFLOW_SELECTED', params);
    },

    async selectedApp({ commit }, params) {
        commit('SET_STATE', { prop: 'appSelected', data: params });
    },

    async updateWorkflow({ commit }, params) {
        commit('SET_WORKFLOW', params);
    },
};
