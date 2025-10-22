export default (axios) => ({
    getAll: (params) => axios.get('/a/emails', { params }).then((_) => _.data),
    getDetail: (emailId) => axios.get(`/a/emails/${emailId}`).then((_) => _.data),
    create: (data) => axios.post('/a/emails', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/emails/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/emails/${id}`).then((_) => _.data),
    deleteMany: (data) => axios.post('/a/emails/deleteMany', data).then((_) => _.data),
    import: (data) => axios.post('/a/emails/import', data).then((_) => _.data),
    bulkUpdate: (data) => axios.post('/a/emails/bulkUpdate', data).then((_) => _.data),
});
