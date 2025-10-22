export default (axios) => ({
    getAll: (params) => axios.get('/a/business_areas', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/business_areas/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/business_areas', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/business_areas/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/business_areas/${id}`).then((_) => _.data),
    active: (id) => axios.patch(`/a/business_areas/${id}/active`).then((_) => _.data),
    inActive: (id) => axios.patch(`/a/business_areas/${id}/inactive`).then((_) => _.data),
});
