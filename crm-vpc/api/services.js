export default (axios) => ({
    getAll: (params) => axios.get('/a/services', { params }).then((_) => _.data),
    getDetail: (id) => axios.get(`/a/services/${id}`).then((_) => _.data),
    register: (data) => axios.post('/a/registers', data).then((_) => _.data),
    getRegister: (params) => axios.get('/a/registers', { params }).then((_) => _.data),
    getRates: () => axios.post('/a/rates').then((_) => _.data),
});
