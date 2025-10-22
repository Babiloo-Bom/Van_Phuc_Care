export default (axios) => ({
    getAll: (params) => axios.get('/a/feedbacks', { params }).then((_) => _.data),
    getDetail: (feedbackId) => axios.get(`/a/feedbacks/${feedbackId}`).then((_) => _.data),
    create: (data) => axios.post('/a/feedbacks', data).then((_) => _.data),
    update: (feedbackId, data) => axios.patch(`/a/feedbacks/${feedbackId}`, data).then((_) => _.data),
    delete: (feedbackId) => axios.delete(`/a/feedbacks/${feedbackId}`).then((_) => _.data),
    setActive: (feedbackId) => axios.patch(`/a/feedbacks/${feedbackId}/active`).then((_) => _.data),
    setInactive: (feedbackId) => axios.patch(`/a/feedbacks/${feedbackId}/inactive`).then((_) => _.data),
});
