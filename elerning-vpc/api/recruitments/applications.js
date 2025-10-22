export default (axios) => ({
    getAll: (params) => axios.get('/a/applications', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/applications/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/applications', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/applications/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/applications/${id}`).then((_) => _.data),
});
