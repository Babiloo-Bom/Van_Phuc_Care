export default (axios) => ({
    getAll: (params) => axios.get('/a/schedule-vaccin', { params }).then((_) => _.data),
    getDetail: (schemduleId) => axios.get(`/a/schedule-vaccin/${schemduleId}`).then((_) => _.data),
    create: (data) => axios.post('/a/schedule-vaccin', data).then((_) => _.data),
    update: (schemduleId, data) => axios.patch(`/a/schedule-vaccin/${schemduleId}`, data).then((_) => _.data),
    delete: (schemduleId) => axios.delete(`/a/schedule-vaccin/${schemduleId}`).then((_) => _.data),
});
