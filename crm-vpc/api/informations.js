export default (axios) => ({
    geHealthBook: (params) => axios.get('/a/health-book', { params }).then((_) => _.data),
    getTemperature: (params) => axios.get('/a/health-book/temperature', { params }).then((_) => _.data),
    getScheduleVaccin: (params) => axios.get('/a/schedule-vaccin', { params }).then((_) => _.data),
    getInjected: (email) => axios.get(`/a/customers/injected?email=${email}`).then((_) => _.data),
    createHealthBook: () => axios.post('/a/health-book').then((_) => _.data),
    updateHealthBook: (id, params) => axios.patch(`/a/health-book/${id}`, { ...params }).then((_) => _.data),

    createLogNotAuth: (params) => axios.post('/a/health-book/create-logs', { ...params }).then((_) => _.data),
});
