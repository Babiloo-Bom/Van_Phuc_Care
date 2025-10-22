export default (axios) => ({
    getAll: (params) => axios.get('/a/automations', { params }).then((_) => _.data),
    getDetail: (automationId) => axios.get(`/a/automations/${automationId}`).then((_) => _.data),
    create: (data) => axios.post('/a/automations', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/automations/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/automations/${id}`).then((_) => _.data),
    deleteMany: (data) => axios.post('/a/automations/deleteMany', data).then((_) => _.data),
    import: (data) => axios.post('/a/automations/import', data).then((_) => _.data),
    bulkUpdate: (data) => axios.post('/a/automations/bulkUpdate', data).then((_) => _.data),
});
