export const state = () => ({
    orders: null,
    order: {},
    pagination: {},
    orderSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_ORDERS(state, payload) {
        state.orders = payload;
    },
    SET_ORDER_SELECTED(state, payload) {
        state.orderSelected = payload;
    },
    SET_ORDER(state, payload) {
        state.order = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    UPDATE_ORDER(state, payload) {
        state.orders.map((item) => {
            if (item.id === payload.id) {
                item.content = payload?.data?.content;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.orders;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { orders, pagination } } = await this.$api.orders.getAll(params);

        commit('SET_ORDERS', orders);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, ordersId) {
        const { data: { order } } = await this.$api.orders.getDetail(ordersId);
        commit('SET_ORDER', order);
    },
    async update({ commit }, params) {
        const { data: { order } } = await this.$api.orders.update(params._id, params.data);
        commit('SET_ORDER', order);
    },
    async refund({ commit }, params) {
        const { data: { order } } = await this.$api.orders.refund(params);
        commit('SET_ORDER', order);
    },
    async create({ commit }, params) {
        const { data: { order } } = await this.$api.orders.create(params);
        commit('SET_ORDER', order);
    },
    async selectedOrder({ commit }, params) {
        commit('SET_ORDER_SELECTED', params);
    },
};
