export default (axios) => ({
    getAll: (params) => axios.get('/a/accounts', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/accounts/${id}`).then((_) => _.data),
    create: (data) => axios.post('/a/settings/invite-member', data).then((_) => _.data),
});
