export default (axios) => ({
    getAll: (params) => axios.get('/a/faqs', { params }).then((_) => _.data),
    getDetail: (faqId) => axios.get(`/a/faqs/${faqId}`).then((_) => _.data),
    create: (data) => axios.post('/a/faqs', data).then((_) => _.data),
    update: (faqId, data) => axios.patch(`/a/faqs/${faqId}`, data).then((_) => _.data),
    delete: (faqId) => axios.delete(`/a/faqs/${faqId}`).then((_) => _.data),
});
