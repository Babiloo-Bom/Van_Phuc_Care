export default (axios) => ({
    getAll: (params) => axios.get('u/feedbacks', { params }).then((_) => _.data),
    create: (params) => axios.post('u/feedbacks', { ...params }).then((_) => _.data),
});
