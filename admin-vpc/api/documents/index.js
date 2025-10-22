export default (axios) => ({
    getAll: (params) => axios.get('/a/files', { params }).then((_) => _.data),
    getDetail: (fileId) => axios.get(`/a/files/${fileId}`).then((_) => _.data),
    create: (data) => axios.post('/a/files', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/files/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/files/${id}`).then((_) => _.data),
    deleteMany: (data) => axios.post('/a/files/deleteMany', data).then((_) => _.data),
    import: (data) => axios.post('/a/files/import', data).then((_) => _.data),
    bulkUpdate: (data) => axios.post('/a/files/bulkUpdate', data).then((_) => _.data),
});
