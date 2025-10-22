export const state = () => ({
    transactions: null,
    transaction: {},
    pagination: {},
    transactionSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_TRANSACTIONS(state, payload) {
        state.transactions = payload;
    },
    SET_TRANSACTION(state, payload) {
        state.transaction = payload;
    },
    SET_TRANSACTION_SELECTED(state, payload) {
        state.transactionSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { transactions, pagination } } = await this.$api.transactions.getAll(params);

        commit('SET_TRANSACTIONS', transactions);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, transactionId) {
        const { data: { transaction } } = await this.$api.transactions.getDetail(transactionId);
        commit('SET_TRANSACTION', transaction);
    },
};
