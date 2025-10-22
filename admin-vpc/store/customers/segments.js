export const state = () => ({
    segments: [],
    pagination: {},
    segment: {},
    segmentSelected: [],
    conditions: [],
});

export const getters = {
};

export const mutations = {
    SET_SEGMENTS(state, payload) {
        state.segments = payload;
    },
    SET_SEGMENT(state, payload) {
        state.segment = payload;
    },
    SET_CONDITIONS(state, payload) {
        state.conditions = payload;
    },
    SET_SEGMENT_SELECTED(state, payload) {
        state.segmentSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { segments, pagination } } = await this.$api.customerSegments.getAll(params);

        commit('SET_SEGMENTS', segments);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, segmentId) {
        const { data: { segment } } = await this.$api.customerSegments.getDetail(segmentId);
        commit('SET_SEGMENT', segment);
    },
    async update({ commit }, params) {
        const { data: { segment } } = await this.$api.customerSegments.update(params.id, params.data);
        commit('SET_SEGMENT', segment);
    },
    async create({ commit }, params) {
        const { data: { segment } } = await this.$api.customerSegments.create(params);
        commit('SET_SEGMENT', segment);
    },
    async setConditions({ commit }, params) {
        commit('SET_CONDITIONS', params);
    },
    async selectedSegment({ commit }, params) {
        commit('SET_SEGMENT_SELECTED', params);
    },
};
