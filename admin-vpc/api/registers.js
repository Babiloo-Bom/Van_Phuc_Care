export default (axios) => ({
    getAll: (params) => axios.get('/a/registers', { params }).then((_) => _.data),
    getDetail: (registerId) => axios.get(`/a/registers/${registerId}`).then((_) => _.data),
    create: (data) => axios.post('/a/registers', data).then((_) => _.data),
    update: (registerId, data) => axios.patch(`/a/registers/${registerId}`, data).then((_) => _.data),
    delete: (registerIds) => axios.post('/a/registers/bulk-delete', {
        ids: registerIds,
    }).then((_) => _.data),
});
