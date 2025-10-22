export const state = () => ({
    notifications: [],
    pagination: {},
});

export const getters = {
};

export const mutations = {
    SET_NOTIFICATION(state, payload) {
        state.notifications = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    UPDATE_NOTIFICATION(state, payload) {
        state.notifications.map((item) => {
            if (item._id === payload._id) {
                item.title = payload?.data?.title;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.notifications;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { notifications, pagination } } = await this.$api.notifications.getAll(params);

        commit('SET_NOTIFICATION', notifications);
        commit('SET_PAGINATION', pagination);
    },
    async update({ commit }, params) {
        await this.$api.notifications.update(params.id, params.data);
        commit('UPDATE_NOTIFICATION', { id: params.id, data: params.data });
    },
};
