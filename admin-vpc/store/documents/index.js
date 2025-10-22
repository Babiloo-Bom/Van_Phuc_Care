export const state = () => ({
    files: [],
    folders: [],
    file: {},
    folder: {},
    pagination: {},
    fileSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_FILES(state, payload) {
        state.files = payload;
    },
    SET_FOLDERS(state, payload) {
        state.folders = payload;
    },
    SET_FILE(state, payload) {
        state.file = payload;
    },
    SET_FILE_SELECTED(state, payload) {
        state.fileSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchFolders({ commit }, params) {
        const { data: { files, pagination } } = await this.$api.documents.getAll({ ...params, type: 'folder' });

        commit('SET_FOLDERS', files);
        commit('SET_PAGINATION', pagination);
    },
    async fetchFiles({ commit }, params) {
        const { data: { files, pagination } } = await this.$api.documents.getAll({ ...params, type: 'file' });

        commit('SET_FILES', files);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, fileId) {
        const { data: { file } } = await this.$api.documents.getDetail(fileId);
        commit('SET_FILE', file);
    },
    async update({ commit }, params) {
        const { data: { file } } = await this.$api.documents.update(params._id, params.data);
        commit('SET_FILE', file);
    },
    async selectedCustomer({ commit }, params) {
        commit('SET_FILE_SELECTED', params);
    },
    async uploadFileExcel(context, file) {
        const data = new FormData();
        data.append('files', file);
        data.append('files', file);
        data.append('files', file);
        data.append('files', file);
        await this.$axios.post('/api/a/files/import', data);
    },
};
