export default (axios) => ({
    getAll: (params) => axios.get('/a/tickets', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/tickets/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/tickets', data).then((_) => _.data),
});
