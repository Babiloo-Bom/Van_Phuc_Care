const origin = new URLSearchParams(window.location.search)?.get('origin') ? new URLSearchParams(window.location.search)?.get('origin') : window.origin.replace('https://', '').replace('http://', '');
export default (axios) => ({
    getAll: (params) => axios.get(`/a/settings?origin=${origin}`, { params }).then((_) => _.data),
    getDetail: (params) => axios.get('/a/settings/detail', { params }).then((_) => _.data),
    create: (data) => axios.post('/a/settings', data).then((_) => _.data),
    update: (data) => axios.patch('/a/settings', data).then((_) => _.data),
});
