export const state = () => ({
    collections: null,
    pagination: {},
    collection: {},
    collectionSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_COLLECTIONS(state, payload) {
        state.collections = payload;
    },
    SET_COLLECTION(state, payload) {
        state.collection = payload;
    },
    SET_COLLECTION_SELECTED(state, payload) {
        state.collectionSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { collections, pagination } } = await this.$api.productCollections.getAll(params);

        commit('SET_COLLECTIONS', collections);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, collectionId) {
        const { data: { collection } } = await this.$api.productCollections.getDetail(collectionId);
        commit('SET_COLLECTION', collection);
    },
    async update({ commit }, params) {
        const { data: { collection } } = await this.$api.productCollections.update(params.id, params.data);
        commit('SET_COLLECTION', collection);
    },
    async create({ commit }, params) {
        const { data: { collection } } = await this.$api.productCollections.create(params);
        commit('SET_COLLECTION', collection);
    },
    async selectedCollection({ commit }, params) {
        commit('SET_COLLECTION_SELECTED', params);
    },
};
