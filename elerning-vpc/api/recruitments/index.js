export default (axios) => ({
    getAll: (params) => axios.get('/a/recruitments', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/recruitments/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/recruitments', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/recruitments/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/recruitments/${id}`).then((_) => _.data),
    active: (id) => axios.patch(`/a/recruitments/${id}/active`).then((_) => _.data),
    inActive: (id) => axios.patch(`/a/recruitments/${id}/inactive`).then((_) => _.data),
});
