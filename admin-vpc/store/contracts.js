export const state = () => ({
    contracts: [],
    contract: {},
    pagination: {},
    contractSelected: [],
    chapterSelected: {},
    exercises: [],
});

export const getters = {
    chapters: (state) => state.contract.chapters || [],
};

export const mutations = {
    SET_CONTRACTS(state, payload) {
        state.contracts = payload;
    },

    SET_CONTRACT(state, payload) {
        state.contract = payload;
    },

    SET_CONTRACT_SELECTED(state, payload) {
        state.contractSelected = payload;
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
        const { data: { contracts, pagination } } = await this.$api.contracts.getAll(params);

        commit('SET_CONTRACTS', contracts);
        commit('SET_PAGINATION', pagination);
    },

    async fetchDetail({ commit }, contractId) {
        const { data: { contract } } = await this.$api.contracts.getDetail(contractId);
        commit('SET_CONTRACT', contract);
    },

    async update({ commit }, params) {
        const { data: { contract } } = await this.$api.contracts.update(params._id, params.data);
        commit('SET_CONTRACT', contract);
    },

    async selectedCourse({ commit }, params) {
        commit('SET_CONTRACT_SELECTED', params);
    },

    async selectedChapter({ commit }, params) {
        commit('SET_STATE', { prop: 'chapterSelected', data: params || {} });
    },

    resetState(context) {
        context.commit('SET_STATE', { prop: 'contract', data: {} });
    },

    resetExercise(context) {
        context.commit('SET_STATE', { prop: 'exercises', data: [] });
    },
};
