export const state = () => ({
    pagesBySession: null,
    sourcesBySession: null,
    countryBySession: null,
    sessionsOvertime: null,
    sessionsOvertimeCompare: null,
    sessionsByDevice: null,
    avgSessionsDuration: {
        current: 0,
        compare: 0,
    },
    totalSessions: {
        current: 0,
        compare: 0,
    },
});

export const getters = {
};

export const mutations = {
    SET_PAGE_BY_SESSIONS(state, payload) {
        state.pagesBySession = payload;
    },
    SET_SOURCE_BY_SESSIONS(state, payload) {
        state.sourcesBySession = payload;
    },
    SET_COUNTRY_BY_SESSIONS(state, payload) {
        state.countryBySession = payload;
    },
    SET_SESSIONS_OVERTIME(state, payload) {
        state.sessionsOvertime = payload;
    },
    SET_SESSIONS_OVERTIME_COMPARE(state, payload) {
        state.sessionsOvertimeCompare = payload;
    },
    SET_SESSIONS_BY_DEVICE(state, payload) {
        state.sessionsByDevice = payload;
    },
    SET_TOTAL_SESSIONS(state, payload) {
        state.totalSessions = payload;
    },
    SET_AVG_SESSIONS_DURATION(state, payload) {
        state.avgSessionsDuration = payload;
    },
};

export const actions = {
    async setPageBySessions({ commit }, params) {
        commit('SET_PAGE_BY_SESSIONS', params);
    },
    async setCountryBySessions({ commit }, params) {
        commit('SET_COUNTRY_BY_SESSIONS', params);
    },
    async setSourceBySession({ commit }, params) {
        commit('SET_SOURCE_BY_SESSIONS', params);
    },
    async setSessionsOvertime({ commit }, params) {
        commit('SET_SESSIONS_OVERTIME', params);
    },
    async setSessionsByDevice({ commit }, params) {
        commit('SET_SESSIONS_BY_DEVICE', params);
    },
    async setTotalSessions({ commit }, params) {
        commit('SET_TOTAL_SESSIONS', params);
    },
    async setSessionsOvertimeCompare({ commit }, params) {
        commit('SET_SESSIONS_OVERTIME_COMPARE', params);
    },
    async setAvgSessionsDuration({ commit }, params) {
        commit('SET_AVG_SESSIONS_DURATION', params);
    },
};
