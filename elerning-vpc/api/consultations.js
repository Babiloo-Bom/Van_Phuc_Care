export default (axios) => ({
    getAll: (params) => axios.get('/a/consultations', { params }).then((_) => _.data),
    getDetail: (consultationId) => axios.get(`/a/consultations/${consultationId}`).then((_) => _.data),
    create: (data) => axios.post('/a/consultations', data).then((_) => _.data),
    update: (consultationId, data) => axios.patch(`/a/consultations/${consultationId}`, data).then((_) => _.data),
    delete: (consultationId) => axios.delete(`/a/consultations/${consultationId}`).then((_) => _.data),
});
