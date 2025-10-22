export default (axios) => ({
    getAll: (params) => axios.get('/a/settings', { params }).then((_) => _.data),
    getDetail: (params) => axios.get('/a/settings/detail', { params }).then((_) => _.data),
    create: (data) => axios.post('/a/settings', data).then((_) => _.data),
    update: (data) => axios.patch('/a/settings', data).then((_) => _.data),
});
