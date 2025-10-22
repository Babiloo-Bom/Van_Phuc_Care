export const state = () => ({
    schedules: [],
    schedule: {},
    pagination: {},
    scheduleSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_SCHEDULES(state, payload) {
        state.schedules = payload;
    },
    SET_SCHEDULE(state, payload) {
        state.schedule = payload;
    },
    SET_SCHEDULE_SELECTED(state, payload) {
        state.scheduleSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { scheduleVaccin, pagination } } = await this.$api.schedules.getAll(params);

        commit('SET_SCHEDULES', scheduleVaccin);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, scheduleId) {
        const { data: { schedule } } = await this.$api.schedules.getDetail(scheduleId);
        commit('SET_SCHEDULE', schedule);
    },
    async update({ commit }, params) {
        const { data: { schedule } } = await this.$api.schedules.update(params._id, params.data);
        commit('SET_SCHEDULE', schedule);
    },
    async selectedSchedule({ commit }, params) {
        commit('SET_SCHEDULE_SELECTED', params);
    },
};
