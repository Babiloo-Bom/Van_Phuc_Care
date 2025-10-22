export const state = () => ({
    customers: [],
    customer: {},
    pagination: {},
    customerSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_CUSTOMERS(state, payload) {
        state.customers = payload;
    },
    SET_CUSTOMER(state, payload) {
        state.customer = payload;
    },
    SET_CUSTOMER_SELECTED(state, payload) {
        state.customerSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { customers, pagination } } = await this.$api.customers.getAll(params);

        commit('SET_CUSTOMERS', customers);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, customerId) {
        const { data: { customer } } = await this.$api.customers.getDetail(customerId);
        commit('SET_CUSTOMER', customer);
    },
    async update({ commit }, params) {
        const { data: { customer } } = await this.$api.customers.update(params._id, params.data);
        commit('SET_CUSTOMER', customer);
    },
    async selectedCustomer({ commit }, params) {
        commit('SET_CUSTOMER_SELECTED', params);
    },
    async uploadFileExcel(context, file) {
        const data = new FormData();
        data.append('files', file);
        data.append('files', file);
        data.append('files', file);
        data.append('files', file);
        await this.$axios.post('/api/a/customers/import', data);
    },
};
