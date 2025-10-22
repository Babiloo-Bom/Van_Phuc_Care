export const state = () => ({
    payments: [],
    payment: {},
});

export const getters = {
};

export const mutations = {
    SET_PAYMENTS(state, payload) {
        state.payments = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { payments } } = await this.$api.settingPayments.getAll(params);
        commit('SET_PAYMENTS', payments);
    },
    async update({ commit }, params) {
        const { data: { setting } } = await this.$api.settingPayments.update(params);
        commit('SET_PAYMENTS', setting);
    },
    async fetchDetail({ commit }, params) {
        const { data: { setting } } = await this.$api.settingContacts.getDetail(params);
        commit('SET_PAYMENTS', setting);
    },
};
