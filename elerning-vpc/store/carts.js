export const state = () => ({
    carts: [],
    cart: {},
    items: ['658d89303319deeed02ee3ee'],
    pagination: {},
    cartSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_CARTS(state, payload) {
        state.carts = payload;
    },
    SET_ITEMS(state, payload) {
        state.items = payload;
    },
    SET_REVIEWS(state, payload) {
        state.reviews = payload;
    },
    SET_CART(state, payload) {
        state.cart = payload;
    },
    SET_CART_SELECTED(state, payload) {
        state.cartSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchCart({ commit }, params) {
        const { data: { carts, pagination } } = await this.$api.carts.getItems(params);

        commit('SET_CARTS', carts);
        commit('SET_PAGINATION', pagination);
    },
    async fetchReviews({ commit }, params) {
        const { data: { reviews } } = await this.$api.carts.getReviews(params);

        commit('SET_REVIEWS', reviews);
    },
    async fetchDetail({ commit }, cartId) {
        const { data: { cart } } = await this.$api.carts.getDetail(cartId);
        commit('SET_CART', cart);
    },
    async update({ commit }, params) {
        const { data: { cart } } = await this.$api.carts.update(params._id, params.data);
        commit('SET_CART', cart);
    },
    async setItems({ commit }, params) {
        commit('SET_ITEMS', params);
    },
    async setCarts({ commit }, params) {
        commit('SET_CARTS', params);
    },
    async setCart({ commit }, params) {
        commit('SET_CART', params);
    },
};
