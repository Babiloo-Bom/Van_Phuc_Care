export default (axios) => ({
    getAll: (params) => axios.get('/a/posts?status=draft', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/business_areas/${id}`).then((_) => _.data),
    reject: (id) => axios.post(`/a/post-confirms/${id}/reject`).then((_) => _.data),
    confirm: (id) => axios.post(`/a/post-confirms/${id}/confirm`).then((_) => _.data),
});
