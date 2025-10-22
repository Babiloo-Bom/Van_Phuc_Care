export default (axios) => ({
    getAll: (params) => axios.get('/a/services', { params }).then((_) => _.data),
    getDetail: (serviceId) => axios.get(`/a/services/${serviceId}`).then((_) => _.data),
    create: (data) => axios.post('/a/services', data).then((_) => _.data),
    update: (serviceId, data) => axios.patch(`/a/services/${serviceId}`, data).then((_) => _.data),
    delete: (serviceIds) => axios.post('/a/services/bulk-delete', {
        ids: serviceIds,
    }).then((_) => _.data),
});
