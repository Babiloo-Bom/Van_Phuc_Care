export const state = () => ({
    accessPermissions: [],
    accessPermission: {},
    pagination: {},
    accessPermissionSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_ACCESS_PERMISSIONS(state, payload) {
        state.accessPermissions = payload;
    },
    SET_ACCESS_PERMISSION(state, payload) {
        state.accessPermission = payload;
    },
    SET_ACCESS_PERMISSION_SELECTED(state, payload) {
        state.accessPermissionSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { accessPermissions, pagination } } = await this.$api.accessPermissions.getAll(params);

        commit('SET_ACCESS_PERMISSIONS', accessPermissions);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, accessPermissionId) {
        const { data: { accessPermission } } = await this.$api.accessPermissions.getDetail(accessPermissionId);
        commit('SET_ACCESS_PERMISSION', accessPermission);
    },
    async update({ commit }, params) {
        const { data: { accessPermission } } = await this.$api.accessPermissions.update(params._id, params.data);
        commit('SET_ACCESS_PERMISSION', accessPermission);
    },
    async selectedTransaction({ commit }, params) {
        commit('SET_ACCESS_PERMISSION_SELECTED', params);
    },
};
