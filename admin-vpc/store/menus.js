export const state = () => ({
    menus: [],
});

export const getters = {
};

export const mutations = {
    SET_MENU(state, payload) {
        state.menus = payload;
    },

    UPDATE_MENU(state, payload) {
        state.menus.map((item) => {
            if (item.id === payload.id) {
                item.content = payload?.data?.content;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.menus;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { menus } } = await this.$api.menus.getAll(params);
        commit('SET_MENU', menus);
    },
    async update({ commit }, params) {
        await this.$api.menus.update(params.id, params.data);
        commit('UPDATE_MENU', { id: params.id, data: params.data });
    },
};
