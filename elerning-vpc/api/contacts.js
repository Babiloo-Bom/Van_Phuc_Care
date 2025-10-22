export default (axios) => ({
    getAll: () => axios.get('/a/settings').then((_) => _.data),
    getDetail: (contactId) => axios.get(`/a/settings/${contactId}`).then((_) => _.data),
    create: (data) => axios.post('/a/settings', data).then((_) => _.data),
    update: (data) => axios.patch('/a/settings', data).then((_) => _.data),
});
