export const state = () => ({
    registers: [],
    register: {},
    pagination: {},
    registerSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_REGISTERS(state, payload) {
        state.registers = payload;
    },
    SET_REGISTER(state, payload) {
        state.register = payload;
    },
    SET_REGISTER_SELECTED(state, payload) {
        state.registerSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { registers, pagination } } = await this.$api.registers.getAll(params);

        commit('SET_REGISTERS', registers);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, registerId) {
        const { data: { register } } = await this.$api.registers.getDetail(registerId);
        commit('SET_REGISTER', register);
    },
    async update({ commit }, params) {
        const { data: { register } } = await this.$api.registers.update(params._id, params.data);
        commit('SET_REGISTER', register);
    },
    async selectedService({ commit }, params) {
        commit('SET_REGISTER_SELECTED', params);
    },
};
