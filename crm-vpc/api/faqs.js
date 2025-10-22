export default (axios) => ({
    getAll: (params) => axios.get('u/faqs', { params }).then((_) => _.data),
});
