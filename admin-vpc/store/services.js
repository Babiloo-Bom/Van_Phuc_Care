export const state = () => ({
    services: [],
    service: {},
    pagination: {},
    serviceSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_SERVICES(state, payload) {
        state.services = payload;
    },
    SET_SERVICE(state, payload) {
        state.service = payload;
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
    async fetchDetail({ commit }, serviceId) {
        const { data: { service } } = await this.$api.services.getDetail(serviceId);
        commit('SET_SERVICE', service);
    },
    async update({ commit }, params) {
        const { data: { service } } = await this.$api.services.update(params._id, params.data);
        commit('SET_SERVICE', service);
    },
    async selectedService({ commit }, params) {
        commit('SET_SERVICE_SELECTED', params);
    },
};
