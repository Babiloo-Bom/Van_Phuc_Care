export default (axios) => ({
    getAll: (params) => axios.get('/a/medias', { params }).then((_) => _.data),
    getDetail: (mediaId) => axios.get(`/a/medias/${mediaId}`).then((_) => _.data),
    create: (data) => axios.post('/a/medias', data).then((_) => _.data),
    update: (mediaId, data) => axios.patch(`/a/medias/${mediaId}`, data).then((_) => _.data),
    delete: (mediaId) => axios.delete(`/a/medias/${mediaId}`).then((_) => _.data),
});
