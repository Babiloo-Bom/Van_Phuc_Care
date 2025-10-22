export default (axios) => ({
    getDetail: (id) => axios.get(`/a/blogs/${id}`).then((_) => _.data),
});
