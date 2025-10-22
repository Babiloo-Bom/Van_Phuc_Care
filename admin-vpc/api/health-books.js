export default (axios) => ({
    getAll: (params) => axios.get('/a/health-book/all', { params }).then((_) => _.data),
    getComments: (params) => axios.get('/a/comments', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/health-book/${id}`).then((_) => _.data),
    getByDate: (id, params) => axios.get(`/a/health-book/byDate/${id}`, { params }).then((_) => _.data),
    create: (data) => axios.post('/a/health-book', data).then((_) => _.data),
    createComment: (data) => axios.post('/a/comments', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/health-book/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/health-book/${id}`).then((_) => _.data),
    deleteComment: (id) => axios.delete(`/a/comments/${id}`).then((_) => _.data),
});
