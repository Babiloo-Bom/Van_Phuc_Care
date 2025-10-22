export const state = () => ({
    members: [],
    member: {},
    pagination: {},
});

export const getters = {
};

export const mutations = {
    SET_MEMBERS(state, payload) {
        state.members = payload;
    },
    SET_MEMBER(state, payload) {
        state.member = payload;
    },
    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    UPDATE_MEMBER(state, payload) {
        state.members.map((item) => {
            if (item._id === payload._id) {
                item.title = payload?.data?.title;
                item.thumbnail = payload?.data?.thumbnail;
            }
            return state.members;
        });
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { accounts, pagination } } = await this.$api.settingMembers.getAll(params);

        commit('SET_MEMBERS', accounts);
        commit('SET_PAGINATION', pagination);
    },

    async fetchDetail({ commit }, accountId) {
        const { data: { account } } = await this.$api.settingMembers.getDetail(accountId);
        commit('SET_MEMBER', account);
    },

    async update({ commit }, params) {
        const { data: { setting: { members } } } = await this.$api.settingMembers.update(params);
        commit('SET_MEMBER', members);
    },
    async create({ commit }, params) {
        const { data: { setting: { members } } } = await this.$api.settingMembers.create(params);
        commit('SET_MEMBER', members);
    },
};
