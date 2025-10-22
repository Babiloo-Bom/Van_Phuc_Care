export const state = () => ({
    consultations: [],
    pagination: {},
});

export const getters = {
};

export const mutations = {
    SET_CONSULTATION(state, payload) {
        state.consultations = payload;
    },
    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    UPDATE_CONSULTATION(state, payload) {
        state.consultations.map((item) => {
            if (item.id === payload.id) {
                item.content = payload?.data?.content;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.consultations;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { consultations, pagination } } = await this.$api.consultations.getAll(params);
        commit('SET_CONSULTATION', consultations);
        commit('SET_PAGINATION', pagination);
    },
    async update({ commit }, params) {
        await this.$api.consultations.update(params.id, params.data);
        commit('UPDATE_CONSULTATION', { id: params.id, data: params.data });
    },
};
