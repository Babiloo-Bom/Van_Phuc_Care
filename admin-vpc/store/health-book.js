export const state = () => ({
    healthBooks: [],
    healthBook: {},
    pagination: {},
    comments: [],
    healthBookSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_HEALTH_BOOKS(state, payload) {
        state.healthBooks = payload;
    },
    SET_COMMENTS(state, payload) {
        state.comments = payload;
    },
    SET_HEALTH_BOOK(state, payload) {
        state.healthBook = payload;
    },
    SET_HEALTH_BOOK_SELECTED(state, payload) {
        state.healthBookSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { healthBooks, pagination } } = await this.$api.healthBooks.getAll(params);

        commit('SET_HEALTH_BOOKS', healthBooks);
        commit('SET_PAGINATION', pagination);
    },

    async fetchComment({ commit }, params) {
        const { data: { comments, pagination } } = await this.$api.healthBooks.getComments(params);

        commit('SET_COMMENTS', comments);
        commit('SET_PAGINATION', pagination);
    },

    async fetchDetail({ commit }, healthBookId) {
        const { data: { data } } = await this.$api.healthBooks.getDetail(healthBookId);
        commit('SET_HEALTH_BOOK', data);
    },
    async update({ commit }, params) {
        const { data: { healthBook } } = await this.$api.healthBooks.update(params._id, {
            ...params.data,
            updatedAt: new Date(),
            isAcceptedHealthBook: false,
        });
        commit('SET_HEALTH_BOOK', healthBook);
    },
    async selectedHealthBook({ commit }, params) {
        commit('SET_HEALTH_BOOK_SELECTED', params);
    },
};
