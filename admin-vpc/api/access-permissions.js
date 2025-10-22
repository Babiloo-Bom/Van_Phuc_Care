export default (axios) => ({
    getAll: (params) => axios.get('/a/access-permissions', { params }).then((_) => _.data),
    create: (data) => axios.post('/a/access-permissions', data).then((_) => _.data),
    update: (accessPermissionId, data) => axios.patch(`/a/access-permissions/${accessPermissionId}`, data).then((_) => _.data),
    delete: (accessPermissionId) => axios.delete(`/a/access-permissions/${accessPermissionId}`).then((_) => _.data),
});
