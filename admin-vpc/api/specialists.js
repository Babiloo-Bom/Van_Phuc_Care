export default (axios) => ({
    getAll: (params) => axios.get('/a/specialists', { params }).then((_) => _.data),
    getDetail: (specialistId) => axios.get(`/a/specialists/${specialistId}`).then((_) => _.data),
    create: (data) => axios.post('/a/specialists', data).then((_) => _.data),
    update: (specialistId, data) => axios.patch(`/a/specialists/${specialistId}`, data).then((_) => _.data),
    delete: (specialistId) => axios.delete(`/a/specialists/${specialistId}`).then((_) => _.data),
});
