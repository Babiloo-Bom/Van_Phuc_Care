export const state = () => ({
    reviews: null,
    pagination: {},
    review: {},
    reviewSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_REVIEWS(state, payload) {
        state.reviews = payload;
    },
    SET_REVIEW(state, payload) {
        state.review = payload;
    },
    SET_REVIEW_SELECTED(state, payload) {
        state.reviewSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { reviews, pagination } } = await this.$api.productReviews.getAll(params);

        commit('SET_REVIEWS', reviews);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, reviewId) {
        const { data: { review } } = await this.$api.productReviews.getDetail(reviewId);
        commit('SET_REVIEW', review);
    },
    async update({ commit }, params) {
        const { data: { review } } = await this.$api.productReviews.update(params.id, params.data);
        commit('SET_REVIEW', review);
    },
    async create({ commit }, params) {
        const { data: { review } } = await this.$api.productReviews.create(params);
        commit('SET_REVIEW', review);
    },
    async selectedReview({ commit }, params) {
        commit('SET_REVIEW_SELECTED', params);
    },
};
