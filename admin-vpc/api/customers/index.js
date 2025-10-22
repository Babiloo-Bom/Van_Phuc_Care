export default (axios) => ({
    getAll: (params) => axios.get('/a/customers', { params }).then((_) => _.data),
    getDetail: (customerId) => axios.get(`/a/customers/${customerId}`).then((_) => _.data),
    create: (data) => axios.post('/a/customers', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/customers/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/customers/${id}`).then((_) => _.data),
    deleteMany: (data) => axios.post('/a/customers/deleteMany', data).then((_) => _.data),
    import: (data) => axios.post('/a/customers/import', data).then((_) => _.data),
    bulkUpdate: (data) => axios.post('/a/customers/bulkUpdate', data).then((_) => _.data),
});
