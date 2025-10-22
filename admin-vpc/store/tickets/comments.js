export const state = () => ({
    comments: [],
    comment: {},
    pagination: {},
    commentSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_COMMENTS(state, payload) {
        state.comments = payload;
    },
    SET_COMMENT(state, payload) {
        state.comment = payload;
    },
    SET_COMMENT_SELECTED(state, payload) {
        state.commentSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { comments, pagination } } = await this.$api.comments.getAll(params);

        commit('SET_COMMENTS', comments);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, commentId) {
        const { data: { comments } } = await this.$api.comments.getDetail(commentId);
        commit('SET_COMMENT', comments);
    },
    async update({ commit }, params) {
        const { data: { comment } } = await this.$api.comments.update(params._id, params.data);
        commit('SET_COMMENT', comment);
    },
    async selectedCustomer({ commit }, params) {
        commit('SET_COMMENT_SELECTED', params);
    },
    async uploadFileExcel(context, file) {
        const data = new FormData();
        data.append('files', file);
        data.append('files', file);
        data.append('files', file);
        data.append('files', file);
        await this.$axios.post('/api/a/comments/import', data);
    },
};
