export default (axios) => ({
    getAll: (params) => axios.get('/a/comments', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/comments/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/comments', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/comments/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/comments/${id}`).then((_) => _.data),
});
