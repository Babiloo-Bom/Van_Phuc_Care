export const state = () => ({
    contacts: {},
});

export const getters = {
};

export const mutations = {
    SET_CONTACT(state, payload) {
        state.contacts = payload;
    },

    UPDATE_CONTACT(state, payload) {
        state.contacts.map((item) => {
            if (item._id === payload._id) {
                item.title = payload?.data?.title;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.contacts;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { setting } } = await this.$api.contacts.getAll(params);

        commit('SET_CONTACT', setting);
    },
    async update({ commit }, params) {
        await this.$api.contacts.update(params.id, params.data);
        commit('UPDATE_CONTACT', { id: params.id, data: params.data });
    },
};
