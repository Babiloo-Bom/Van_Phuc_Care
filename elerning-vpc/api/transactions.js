export default (axios) => ({
    create: (data) => axios.post('/u/transactions', data).then((_) => _.data),
});
