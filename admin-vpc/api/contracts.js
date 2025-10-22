export default (axios) => ({
    getAll: (params) => axios.get('/a/contracts', { params }).then((_) => _.data),
    getDetail: (contractId) => axios.get(`/a/contracts/${contractId}`).then((_) => _.data),
    create: (data) => axios.post('/a/contracts', data).then((_) => _.data),
    update: (contractId, data) => axios.patch(`/a/contracts/${contractId}`, data).then((_) => _.data),
    delete: (contractId) => axios.delete(`/a/contracts/${contractId}`).then((_) => _.data),
});
