export default (axios) => ({
    getAll: (params) => axios.get('/a/blogs', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/blogs/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/blogs', data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/blogs/${id}`, data).then((_) => _.data),
    delete: (id) => axios.delete(`/a/blogs/${id}`).then((_) => _.data),
    active: (id) => axios.patch(`/a/blogs/${id}/active`).then((_) => _.data),
    inActive: (id) => axios.patch(`/a/blogs/${id}/inactive`).then((_) => _.data),
});
