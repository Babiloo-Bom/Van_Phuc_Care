export default (axios) => ({
    getAll: (params) => axios.get('/a/rules', { params }).then((_) => _.data),
    getDetail: (ruleId) => axios.get(`/a/rules/${ruleId}`).then((_) => _.data),
    create: (data) => axios.post('/a/rules', data).then((_) => _.data),
    update: (ruleId, data) => axios.patch(`/a/rules/${ruleId}`, data).then((_) => _.data),
    delete: (ruleId) => axios.delete(`/a/rules/${ruleId}`).then((_) => _.data),
});
