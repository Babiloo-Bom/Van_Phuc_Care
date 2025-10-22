export default (axios) => ({
    getAll: (params) => axios.get('/a/transactions', { params }).then((_) => _.data),
    create: (data) => axios.post('/a/transactions', data).then((_) => _.data),
    update: (transactionId, data) => axios.patch(`/a/transactions/${transactionId}`, data).then((_) => _.data),
    delete: (transactionId) => axios.delete(`/a/transactions/${transactionId}`).then((_) => _.data),
});
