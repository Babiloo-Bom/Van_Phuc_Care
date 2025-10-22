export const state = () => ({
    tickets: [],
    ticket: {},
    pagination: {},
    ticketSelected: [],
});

export const getters = {
};

export const mutations = {
    SET_TICKETS(state, payload) {
        state.tickets = payload;
    },
    SET_COMMENTS(state, payload) {
        state.comments = payload;
    },
    SET_TICKET(state, payload) {
        state.ticket = payload;
    },
    SET_TICKET_SELECTED(state, payload) {
        state.ticketSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { tickets, pagination } } = await this.$api.tickets.getAll(params);

        commit('SET_TICKETS', tickets);
        commit('SET_PAGINATION', pagination);
    },

    async fetchDetail({ commit }, ticketId) {
        const { data: { data } } = await this.$api.tickets.getDetail(ticketId);
        commit('SET_TICKET', data);
    },
    async update({ commit }, params) {
        const { data: { ticket } } = await this.$api.tickets.update(params._id, params.data);
        commit('SET_TICKET', ticket);
    },
    async selectedHealthBook({ commit }, params) {
        commit('SET_TICKET_SELECTED', params);
    },
};
