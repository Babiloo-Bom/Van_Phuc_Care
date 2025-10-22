export default (axios) => ({
    getAll: (params) => axios.get('/a/pages', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/pages/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/pages', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/pages/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/pages/${id}`).then((_) => _.data),
    active: (id) => axios.patch(`/a/pages/${id}/active`).then((_) => _.data),
    inActive: (id) => axios.patch(`/a/pages/${id}/inactive`).then((_) => _.data),
});
