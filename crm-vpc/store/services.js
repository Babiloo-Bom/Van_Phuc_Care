export const state = () => ({
    services: [],
    registeredService: [],
    service: null,
    rates: null,
    pagination: {},
    serviceSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_SERVICES(state, payload) {
        state.services = payload;
    },
    SET_SERVICES_USING(state, payload) {
        state.registeredService = payload;
    },
    SET_SERVICE(state, payload) {
        state.service = payload;
    },
    SET_RATES(state, payload) {
        state.rates = payload;
    },
    SET_SERVICE_SELECTED(state, payload) {
        state.serviceSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { services, pagination } } = await this.$api.services.getAll(params);

        commit('SET_SERVICES', services);
        commit('SET_PAGINATION', pagination);
    },
    async fetchServiceUsing({ commit }, params) {
        const { data: { registers, pagination } } = await this.$api.services.getRegister(params);

        commit('SET_SERVICES_USING', registers);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, serviceId) {
        const { data: { service } } = await this.$api.services.getDetail(serviceId);
        commit('SET_SERVICE', service);
    },
    async fetchRates({ commit }, serviceId) {
        const { data: { rates } } = await this.$api.services.getRates(serviceId);
        commit('SET_RATES', rates);
    },
};
