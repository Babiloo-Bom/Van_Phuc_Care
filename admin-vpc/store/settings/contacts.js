export const state = () => ({
    contacts: null,
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
        const { data: { setting } } = await this.$api.settingContacts.getAll(params);

        commit('SET_CONTACT', setting);
    },
    async update({ commit }, params) {
        const { data: { setting } } = await this.$api.settingContacts.update(params);
        commit('SET_CONTACT', setting);
    },
    async fetchDetail({ commit }, params) {
        const { data: { setting } } = await this.$api.settingContacts.getDetail(params);
        commit('SET_CONTACT', setting);
    },
};
