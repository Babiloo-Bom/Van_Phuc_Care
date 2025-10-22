export default (axios) => ({
    uploadFile: (payload) => axios.post('/uploads', payload).then((_) => _.data),
});
