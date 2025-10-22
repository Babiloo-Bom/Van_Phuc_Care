export default (axios) => ({
    getAll: (params) => axios.get('/a/transactions', { params }).then((_) => _.data),
    getDetail: (courseId) => axios.get(`/a/transactions/${courseId}`).then((_) => _.data),
});
