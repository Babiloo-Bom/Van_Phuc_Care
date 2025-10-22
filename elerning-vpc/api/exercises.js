export default (axios) => ({
    get: (id) => axios.get(`/u/exercises/${id}`).then((_) => _.data),
    submit: (id, data) => axios.post(`/a/exercises/${id}`, data).then((_) => _.data),
    update: (id, data) => axios.patch(`/a/exercises/${id}`, data).then((_) => _.data),
});
