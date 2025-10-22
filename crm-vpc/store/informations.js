export const state = () => ({
    informations: {},
    scheduleVaccin: null,
    healthBook: null,
    temperature: [],
});

export const getters = {
};

export const mutations = {
    SET_INFORMATION(state, payload) {
        state.informations = payload;
    },
    SET_TEMPERATURE(state, payload) {
        state.temperature = payload;
    },
    SET_SCHEDULE_VACCIN(state, payload) {
        state.scheduleVaccin = payload;
    },
    SET_HEALTH_BOOK(state, payload) {
        state.healthBook = payload;
    },
};

export const actions = {
    async fetchHealthBook({ commit }, params) {
        const { data: { data } } = await this.$api.informations.geHealthBook(params);
        commit('SET_INFORMATION', data);
    },
    async fetchTemperature({ commit }, params) {
        const { data: { data } } = await this.$api.informations.getTemperature(params);
        commit('SET_TEMPERATURE', data || []);
    },
    async fetchScheduleVaccin({ commit }, params) {
        const { data: { scheduleVaccin } } = await this.$api.informations.getScheduleVaccin(params);
        commit('SET_SCHEDULE_VACCIN', scheduleVaccin);
    },
    async createHealthBook({ commit }, params) {
        const { data: { healthBook } } = await this.$api.informations.createHealthBook(params);
        commit('SET_HEALTH_BOOK', healthBook);
    },
};
