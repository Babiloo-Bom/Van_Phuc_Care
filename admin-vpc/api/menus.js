export default (axios) => ({
    getAll: (params) => axios.get('/a/menus', { params }).then((_) => _.data),
    getDetail: (menuId) => axios.get(`/a/menus/${menuId}`).then((_) => _.data),
    create: (data) => axios.post('/a/menus', data).then((_) => _.data),
    update: (menuId, data) => axios.patch(`/a/menus/${menuId}`, data).then((_) => _.data),
    updateBySlug: (menuSlug, data) => axios.patch(`/a/menus/slug/${menuSlug}`, data).then((_) => _.data),
    delete: (menuId) => axios.delete(`/a/menus/${menuId}`).then((_) => _.data),
    deleteBySlug: (menuSlug) => axios.delete(`/a/menus/slug/${menuSlug}`).then((_) => _.data),
});
