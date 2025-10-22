export default (axios) => ({
    getAll: (params) => axios.get('/a/notifications', { params }).then((_) => _.data),
});
