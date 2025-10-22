export default (axios) => ({
    getAll: (params) => axios.get('/a/tickets', { params }).then((_) => _.data),
    getDetail: (ticketId) => axios.get(`/a/tickets/${ticketId}`).then((_) => _.data),
    create: (data) => axios.post('/a/tickets', data).then((_) => _.data),
    update: (ticketId, data) => axios.patch(`/a/tickets/${ticketId}`, data).then((_) => _.data),
    delete: (ticketId) => axios.delete(`/a/tickets/${ticketId}`).then((_) => _.data),
});
