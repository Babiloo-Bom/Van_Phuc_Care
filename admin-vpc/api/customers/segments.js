export default (axios) => ({
    getAll: (params) => axios.get('/api/a/customer-segments', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/api/a/customer-segments/${id}`).then((_) => _.data),
    create: (data) => axios.post('/api/a/customer-segments', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/customer-segments/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/customer-segments/${id}`).then((_) => _.data),
    deleteMany: (data) => axios.post('/api/a/customer-segments/deleteMany', data).then((_) => _.data),
});
