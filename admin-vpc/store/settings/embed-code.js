export const state = () => ({
    codeEmbeds: {},
});

export const getters = {
};

export const mutations = {
    SET_EMBED_CODE(state, payload) {
        state.codeEmbeds = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { codeEmbeds } } = await this.$api.settingEmbedCode.getAll(params);
        commit('SET_EMBED_CODE', codeEmbeds);
    },
    async update({ commit }, params) {
        const { data: { codeEmbeds } } = await this.$api.settingEmbedCode.update(params);
        commit('SET_EMBED_CODE', codeEmbeds);
    },
};
