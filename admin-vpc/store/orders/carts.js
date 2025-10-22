export const state = () => ({
    carts: null,
    cart: {},
    pagination: {},
    cartSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_CARTS(state, payload) {
        state.carts = payload;
    },
    SET_CART_SELECTED(state, payload) {
        state.cartSelected = payload;
    },
    SET_CART(state, payload) {
        state.cart = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { carts, pagination } } = await this.$api.carts.getAll(params);

        commit('SET_CARTS', carts);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, cartsId) {
        const { data: { cart } } = await this.$api.carts.getDetail(cartsId);
        commit('SET_CART', cart);
    },
    async update({ commit }, params) {
        const { data: { cart } } = await this.$api.carts.update(params._id, params.data);
        commit('SET_CART', cart);
    },
    async create({ commit }, params) {
        const { data: { cart } } = await this.$api.carts.create(params);
        commit('SET_CART', cart);
    },
    async selectedCart({ commit }, params) {
        commit('SET_CART_SELECTED', params);
    },
};
