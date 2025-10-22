export default (axios) => ({
    getAll: (params) => axios.get('/a/categories?type=recruitment', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/categories/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/categories', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/categories/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/categories/${id}`).then((_) => _.data),
});
